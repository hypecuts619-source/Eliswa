const fs = require('fs');
const file = '/app/applet/src/components/Journal.tsx';
let content = fs.readFileSync(file, 'utf8');

const dateReplacements = [
  "June 15, 2026",
  "June 22, 2026",
  "June 28, 2026",
  "July 4, 2026",
  "July 10, 2026",
  "July 15, 2026"
];

let idx = 0;
content = content.replace(/date: '[^']+'/g, (match) => {
  return `date: '${dateReplacements[idx++]}',
    author: 'Team Eliswa India',
    readTime: '${Math.floor(Math.random() * 3 + 3)} min read'`;
});

fs.writeFileSync(file, content);
console.log("Journal.tsx dates and authors updated.");
