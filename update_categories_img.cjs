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

const renderTarget = `                  <div \n                    className="w-full h-full rounded-full flex flex-col items-center justify-center relative overflow-hidden"\n                    style={{\n                      background: \`linear-gradient(135deg, \${category.baseColor} 0%, #FAF6EB 100%)\`\n                    }}\n                  >\n                    {/* Fine handloom thread mesh overlay */}\n                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{\n                      backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, #4A1521 2px, #4A1521 4px)',\n                      backgroundSize: '8px 8px'\n                    }} />\n                    {/* Inner gold circular lace */}\n                    <div className="absolute inset-1 rounded-full border border-dashed border-vintage/15 group-hover:border-vintage/35 transition-colors duration-300" />\n                    \n                    {/* Centered Golden Crest */}\n                    <span className="text-base font-serif group-hover:scale-125 transition-transform duration-500 z-10 select-none" style={{ color: category.accentColor }}>\n                      {category.crest}\n                    </span>\n                    {/* Golden luster swipe animation on hover */}\n                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/45 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />\n                  </div>`;

const replaceRender = `                  <div \n                    className="w-full h-full rounded-full flex flex-col items-center justify-center relative overflow-hidden"\n                  >\n                    <img \n                      src={category.imageUrl} \n                      alt={category.name}\n                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"\n                      referrerPolicy="no-referrer"\n                    />\n                    {/* Inner gold circular lace */}\n                    <div className="absolute inset-1 rounded-full border border-dashed border-white/40 group-hover:border-white/70 transition-colors duration-300 pointer-events-none z-20" />\n                    \n                    {/* Golden luster swipe animation on hover */}\n                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 z-20 pointer-events-none" />\n                  </div>`;

if (hero.includes(renderTarget)) {
  hero = hero.replace(renderTarget, replaceRender);
  fs.writeFileSync('src/components/Hero.tsx', hero);
  console.log('Hero updated');
} else {
  console.log('Target render string not found');
}
