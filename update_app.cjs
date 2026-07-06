const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetContent = `  const renderContent = () => {
    if (currentPath === '/onam-sarees') {
      return <OnamSarees />;
    }
    
    if (currentPath === '/journal') {
      return <Journal />;
    }
    
    if (currentPath.startsWith('/blogs/')) {
      return <BlogPost slug={currentPath} />;
    }

    // Default home page
    return (
      <>
        <Hero />
        <Collection />
        <About />
      </>
    );
  };`;

const replacementContent = `  const renderContent = () => {
    if (currentPath === '/onam-sarees' || currentPath === '/kasavu-sarees' || currentPath === '/tissue-sarees') {
      const titleMap: Record<string, string> = {
        '/onam-sarees': 'Onam Sarees – Handwoven Kerala Kasavu Sarees for Thiruvonam',
        '/kasavu-sarees': 'Kasavu Sarees – Traditional Off-White Cotton Sarees',
        '/tissue-sarees': 'Tissue Sarees – Fine Metallic Tissue Weaves'
      };
      
      // Update document title manually
      document.title = titleMap[currentPath] + " | Eliswa India";

      return (
        <div className="pt-24 pb-16">
          <h1 className="sr-only">{titleMap[currentPath]}</h1>
          <Collection />
        </div>
      );
    }
    
    if (currentPath === '/journal') {
      return <Journal />;
    }
    
    if (currentPath.startsWith('/blogs/')) {
      return <BlogPost slug={currentPath} />;
    }

    if (pageContents[currentPath]) {
      // Update document title manually
      document.title = pageContents[currentPath].title + " | Eliswa India";
      return <GenericPage title={pageContents[currentPath].title} content={pageContents[currentPath].content} />;
    }

    // Default home page
    return (
      <>
        <Hero />
        <Collection />
        <About />
      </>
    );
  };`;

const importTarget = `import { BlogPost } from './components/BlogPost';`;
const importReplacement = `import { BlogPost } from './components/BlogPost';\nimport { GenericPage } from './components/GenericPage';\nimport { pageContents } from './pages';`;

content = content.replace(targetContent, replacementContent);
content = content.replace(importTarget, importReplacement);

fs.writeFileSync('src/App.tsx', content);
console.log("App.tsx updated");
