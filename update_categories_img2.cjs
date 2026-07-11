const fs = require('fs');
let hero = fs.readFileSync('src/components/Hero.tsx', 'utf8');

const renderTargetStart = `className="w-full h-full rounded-full flex flex-col items-center justify-center relative overflow-hidden"`;
const renderTargetEnd = `<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/45 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />\n                  </div>`;

const startIndex = hero.indexOf(renderTargetStart);
const endIndex = hero.indexOf(renderTargetEnd);

if (startIndex !== -1 && endIndex !== -1) {
  const targetStr = hero.substring(startIndex, endIndex + renderTargetEnd.length);
  const replaceRender = `className="w-full h-full rounded-full flex flex-col items-center justify-center relative overflow-hidden"\n                  >\n                    {category.imageUrl ? (\n                      <img \n                        src={category.imageUrl} \n                        alt={category.name}\n                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"\n                        referrerPolicy="no-referrer"\n                      />\n                    ) : (\n                      <>\n                        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, #4A1521 2px, #4A1521 4px)', backgroundSize: '8px 8px' }} />\n                        <span className="text-base font-serif group-hover:scale-125 transition-transform duration-500 z-10 select-none" style={{ color: category.accentColor }}>\n                          {category.crest}\n                        </span>\n                      </>\n                    )}\n                    \n                    {/* Inner gold circular lace */}\n                    <div className="absolute inset-1 rounded-full border border-dashed border-white/40 group-hover:border-white/70 transition-colors duration-300 pointer-events-none z-20" />\n                    \n                    {/* Golden luster swipe animation on hover */}\n                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 z-20 pointer-events-none" />\n                  </div>`;
  hero = hero.replace(targetStr, replaceRender);
  fs.writeFileSync('src/components/Hero.tsx', hero);
  console.log('Hero updated');
} else {
  console.log('Target render string not found', startIndex, endIndex);
}
