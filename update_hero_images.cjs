const fs = require('fs');
let content = fs.readFileSync('src/components/Hero.tsx', 'utf8');

const target1 = `imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1600'`;
const target3 = `imageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=1600'`;

content = content.replace(target1, `imageUrl: '/portrait.png'`);
content = content.replace(target3, `imageUrl: '/hero_img_a.png'`);

fs.writeFileSync('src/components/Hero.tsx', content);
console.log("Hero images updated");
