const fs = require('fs');
let appContent = fs.readFileSync('src/App.tsx', 'utf8');

appContent = appContent.replace(
  '<Collection />',
  '<Collection defaultCategory={currentPath === "/tissue-sarees" ? "Tissue" : currentPath === "/kasavu-sarees" ? "Cotton" : null} />'
);
fs.writeFileSync('src/App.tsx', appContent);

let colContent = fs.readFileSync('src/components/Collection.tsx', 'utf8');
colContent = colContent.replace(
  'export function Collection() {',
  'export function Collection({ defaultCategory = null }: { defaultCategory?: string | null }) {'
);
colContent = colContent.replace(
  'const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);',
  'const [selectedMaterial, setSelectedMaterial] = useState<string | null>(defaultCategory);'
);
colContent = colContent.replace(
  'const filteredSarees = useMemo(() => {',
  `useEffect(() => {
    if (defaultCategory !== undefined) {
      setSelectedMaterial(defaultCategory);
    }
  }, [defaultCategory]);
  
  const filteredSarees = useMemo(() => {`
);

fs.writeFileSync('src/components/Collection.tsx', colContent);
console.log("Collection updated for categories.");
