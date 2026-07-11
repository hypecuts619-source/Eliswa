const fs = require('fs');
let content = fs.readFileSync('src/components/Hero.tsx', 'utf8');

const oldCategories = `const CRAFT_CATEGORIES = [
  {
    name: 'Kasavu Cotton',
    desc: 'Traditional Ivory',
    material: 'Cotton',
    occasion: null,
    baseColor: '#FDFBF7',
    borderColor: '#D4AF37',
    accentColor: '#B8860B',
    crest: '⚜'
  },
  {
    name: 'Metallic Tissue',
    desc: 'Liquid Gold Weave',
    material: 'Tissue',
    occasion: null,
    baseColor: '#F8F0E3',
    borderColor: '#E5C158',
    accentColor: '#DAA520',
    crest: '✧'
  },
  {
    name: 'Mulberry Silk',
    desc: 'Fine Royal Brocade',
    material: 'Silk',
    occasion: null,
    baseColor: '#FDFBF7',
    borderColor: '#D4AF37',
    accentColor: '#008080',
    crest: '✿'
  },
  {
    name: 'Bridal drapes',
    desc: 'Sacred Wedding Weaves',
    material: null,
    occasion: 'Wedding',
    baseColor: '#FAF0E6',
    borderColor: '#B76E79',
    accentColor: '#C07C88',
    crest: '❦'
  },
  {
    name: 'Festive Wear',
    desc: 'Celebratory Classics',
    material: null,
    occasion: 'Festive',
    baseColor: '#FDFBF7',
    borderColor: '#8B0000',
    accentColor: '#D4AF37',
    crest: '✦'
  }
];`;

const newCategories = `const CRAFT_CATEGORIES = [
  {
    name: 'Feather',
    desc: 'Lightweight & Breathable',
    material: 'Cotton',
    occasion: null,
    baseColor: '#FDFBF7',
    borderColor: '#D4AF37',
    accentColor: '#B8860B',
    crest: '⚜'
  },
  {
    name: 'Bloom',
    desc: 'Floral & Festive',
    material: null,
    occasion: 'Festive',
    baseColor: '#FDFBF7',
    borderColor: '#8B0000',
    accentColor: '#D4AF37',
    crest: '✿'
  },
  {
    name: 'Glow',
    desc: 'Metallic Sheen',
    material: 'Tissue',
    occasion: null,
    baseColor: '#F8F0E3',
    borderColor: '#E5C158',
    accentColor: '#DAA520',
    crest: '✧'
  },
  {
    name: 'Aura',
    desc: 'Ethereal Bridal',
    material: null,
    occasion: 'Wedding',
    baseColor: '#FAF0E6',
    borderColor: '#B76E79',
    accentColor: '#C07C88',
    crest: '❦'
  }
];`;

content = content.replace(oldCategories, newCategories);

const oldGrid = `className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 gap-4 md:gap-6 lg:gap-8 justify-items-center"`;
const newGrid = `className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 lg:gap-8 justify-items-center"`;

content = content.replace(oldGrid, newGrid);

fs.writeFileSync('src/components/Hero.tsx', content);
console.log("Updated categories in Hero.tsx");
