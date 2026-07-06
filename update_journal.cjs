const fs = require('fs');

const file = '/app/applet/src/components/Journal.tsx';
let content = fs.readFileSync(file, 'utf8');

const newImages = [
  "https://upload.wikimedia.org/wikipedia/commons/8/80/Saree_Weaving_by_Handloom.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/1/1b/Malayali_women_wearing_Kerala_saree.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/0/03/Set_saree.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/d/d6/Onam_Thriuvathira_Dance.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/d/d5/Onam.saree.model.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/6/6c/Kerala_saris.jpg"
];

// We know the current Unsplash URLs. Let's just find all "image: '...'" and replace them sequentially.
let imageIndex = 0;
content = content.replace(/image:\s*'[^']+'/g, (match) => {
  const replacement = `image: '${newImages[imageIndex]}'`;
  imageIndex++;
  return replacement;
});

fs.writeFileSync(file, content);
console.log("Journal updated with Wikimedia images.");
