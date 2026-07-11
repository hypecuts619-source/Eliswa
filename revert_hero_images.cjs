const fs = require('fs');
let content = fs.readFileSync('src/components/Hero.tsx', 'utf8');

content = content.replace(
  "imageUrl: '/portrait.png'",
  "imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1600'"
);
content = content.replace(
  "imageUrl: '/hero_img_a.png'",
  "imageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=1600'"
);

fs.writeFileSync('src/components/Hero.tsx', content);
console.log("Hero images reverted");
