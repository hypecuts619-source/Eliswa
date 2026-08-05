# Hero slideshow images

The campaign slideshow in `src/components/Hero.tsx` reads five files from this
folder, in this order:

| File | Photo |
|---|---|
| `hero-01.jpg` | Seated, gathering flower petals into a brass urli |
| `hero-02.jpg` | Two sarees from behind on the wooden swing |
| `hero-03.jpg` | Two women facing each other in the corridor |
| `hero-04.jpg` | Two women in the pillared verandah |
| `hero-05.jpg` | Single portrait on the verandah, violet border |

Names and extensions must match exactly. A slide whose file is missing is
dropped from the rotation rather than shown blank, so a typo costs you that
slide but does not break the hero.

Landscape crops read best — the banner is much wider than it is tall, and
`object-cover` will centre-crop a portrait photo, which can cut off heads.
Aim for roughly 2000px wide and keep each file under about 400 KB.
