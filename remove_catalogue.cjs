const fs = require('fs');
let content = fs.readFileSync('src/components/Collection.tsx', 'utf8');

const targetStrStart = `<div className="mt-32 pt-20 border-t border-vintage/15">`;
const targetStrEnd = `      {currentSaree && (`;

const startIndex = content.indexOf(targetStrStart);
const endIndex = content.indexOf(targetStrEnd);

if (startIndex !== -1 && endIndex !== -1) {
  const toRemove = content.substring(startIndex, endIndex);
  content = content.replace(toRemove, '');
  fs.writeFileSync('src/components/Collection.tsx', content);
  console.log("Catalogue removed");
} else {
  console.log("Could not find start or end index", startIndex, endIndex);
}
