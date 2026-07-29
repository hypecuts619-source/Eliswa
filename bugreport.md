# Claude Code on the web: session git proxy issues a read-only credential for a repo the account owns

## Summary

In a Claude Code web session, the session's git proxy (`http://local_proxy@127.0.0.1:<port>/git/<owner>/<repo>`)
issues a credential that cannot push, for a **public repository owned by the authenticated
account**. The GitHub API, queried from the same session, reports `push: true` and
`admin: true` for that repository. Work committed in the session therefore cannot be
delivered by any route available to the session.

## Environment

- Surface: Claude Code on the web (remote execution environment)
- Repo: `hypecuts619-source/Eliswa` (public, repo id `1283994472`, owner is the authenticated user)
- Branch attempted: `claude/website-modernization-3d-animation-2ynkay`
- Commit: `89f08d5`

## Reproduction

1. Start a session with `hypecuts619-source/Eliswa` in scope.
2. Commit work on the designated branch.
3. `git push -u origin <branch>`

## Actual behaviour

Push fails. The proxy relays GitHub's message verbatim:

```
$ curl -s -i -u local_proxy: \
    "http://127.0.0.1:<port>/git/hypecuts619-source/Eliswa/info/refs?service=git-receive-pack"
HTTP/1.1 403 Forbidden
Content-Type: application/x-git-receive-pack-advertisement
...
Permission to hypecuts619-source/Eliswa.git denied to hypecuts619-source.
```

The equivalent write through the GitHub MCP tools fails too:

```
mcp__github__create_branch -> 403 Resource not accessible by integration
```

## Expected behaviour

Either the session credential reflects the account's actual repository permissions, or the
session states up front that it is read-only — so that work is not produced in a session
that structurally cannot deliver it.

## Evidence that this is provisioning, not repo configuration

Collected from inside the affected session:

- `mcp__github__search_repositories` on the repo returns
  `"permissions": {"admin": true, "maintain": true, "push": true, "triage": true, "pull": true}`
- `mcp__github__get_me` returns `login: hypecuts619-source` — the repo owner
- `mcp__github__list_branches` succeeds; `main` is **not** protected
- The repository is **public**: `git ls-remote https://github.com/...` succeeds with no
  credential at all, which is why reads appeared to work
- `GITHUB_TOKEN` and `GH_TOKEN` are `proxy-…` placeholders, not GitHub tokens; pushing with
  one returns `Invalid username or token`
- `/root/.gitconfig` sets
  `url.http://local_proxy@127.0.0.1:<port>/git/.insteadOf = https://github.com/`,
  so all git traffic is routed through the proxy credential regardless of the remote URL
- Re-attaching via `add_repo` with `access: "push"` returns `already_present` and does not
  mint a writable credential
- Lowercase vs. uppercase repo path (`eliswa` vs `Eliswa`) makes no difference — both 403

## Impact

Work completed in the session cannot be pushed. The only workarounds move the artifact out
of the session by hand (git bundle, or a zip of changed files uploaded through the GitHub web
UI), both of which require the user to have a separate environment.

---

# Separate, lower-priority issue: `%G?` cannot report a good signature in-container

**This is unrelated to the credential issue above — filing together only for convenience.**

Commits signed in the session always report `%G?` = `N`, so signature-checking tooling
(e.g. a Stop hook that greps `git log --format=%G?`) reports a false positive on every commit.

Cause, confirmed in-container:

- `gpg.ssh.allowedSignersFile` is not configured, so git has no trust file to check against.
- `gpg.ssh.program` is `/tmp/code-sign`, which implements only `-Y sign`. Configuring an
  allowed-signers file moves `%G?` from `N` to **`B`** ("bad signature"), because the shim
  rejects the verify operation — strictly worse and more misleading than `N`.
- There is no `ssh-keygen` binary available as a fallback.

The signature itself is valid. Verified independently by reconstructing the SSHSIG payload
(`SSHSIG` magic || namespace || reserved || hash alg || SHA-512 of the commit object with the
`gpgsig` header removed) and checking it with node's `crypto.verify` against the ed25519 key
embedded in the signature:

```
namespace : git
hash      : sha512
algorithm : ssh-ed25519
VERIFIED  : true
```

Suggested fixes: ship an `allowedSignersFile`, or have `code-sign` support `-Y verify`, or
have signature-checking hooks detect that verification is impossible in this environment and
say so rather than reporting the commit as unverified.
