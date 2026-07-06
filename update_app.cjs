const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf-8');

content = content.replace(
  "import { CartDrawer } from './components/CartDrawer';",
  "import { CartDrawer } from './components/CartDrawer';\nimport { OnamSarees } from './components/OnamSarees';"
);

content = content.replace(
  "import { useState } from 'react';",
  "import { useState, useEffect } from 'react';"
);

content = content.replace(
  "export default function App() {\n  return (",
  "export default function App() {\n  const [currentPath, setCurrentPath] = useState(window.location.pathname);\n\n  useEffect(() => {\n    const handleLocationChange = () => setCurrentPath(window.location.pathname);\n    window.addEventListener('popstate', handleLocationChange);\n    return () => window.removeEventListener('popstate', handleLocationChange);\n  }, []);\n\n  return ("
);

content = content.replace(
  '<h1 className="sr-only">Bespoke Kerala Kasavu & Onam Sarees, Handwoven for You</h1>',
  '{currentPath !== \'/onam-sarees\' && <h1 className="sr-only">Bespoke Kerala Kasavu & Onam Sarees, Handwoven for You</h1>}'
);

content = content.replace(
  "          <Hero />\n          <Collection />\n          <About />",
  "          {currentPath === '/onam-sarees' ? (\n            <OnamSarees />\n          ) : (\n            <>\n              <Hero />\n              <Collection />\n              <About />\n            </>\n          )}"
);

fs.writeFileSync('src/App.tsx', content);
