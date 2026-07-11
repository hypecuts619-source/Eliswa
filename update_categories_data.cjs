const fs = require('fs');
let hero = fs.readFileSync('src/components/Hero.tsx', 'utf8');

// Update data
hero = hero.replace(
  /name: 'Feather',(\s*)desc: 'Lightweight & Breathable',/,
  "name: 'Feather',$1desc: 'Lightweight & Breathable',$1imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=400',"
);

hero = hero.replace(
  /name: 'Bloom',(\s*)desc: 'Floral & Festive',/,
  "name: 'Bloom',$1desc: 'Floral & Festive',$1imageUrl: 'https://images.unsplash.com/photo-1583391733958-d25e07fac04f?auto=format&fit=crop&q=80&w=400',"
);

hero = hero.replace(
  /name: 'Glow',(\s*)desc: 'Metallic Sheen',/,
  "name: 'Glow',$1desc: 'Metallic Sheen',$1imageUrl: 'https://images.unsplash.com/photo-1605763240000-7e93b172d754?auto=format&fit=crop&q=80&w=400',"
);

hero = hero.replace(
  /name: 'Aura',(\s*)desc: 'Ethereal Bridal',/,
  "name: 'Aura',$1desc: 'Ethereal Bridal',$1imageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=400',"
);

fs.writeFileSync('src/components/Hero.tsx', hero);
console.log('Hero data updated');
