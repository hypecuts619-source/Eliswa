import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Markdown from 'react-markdown';

export function BlogPost({ slug }: { slug: string }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  
  // We extract the frontmatter manually for a simple blog
  const [meta, setMeta] = useState({ title: '', date: 'August 2026', image: '/kanchepuram_saree.png' });

  useEffect(() => {
    // Determine the raw path
    const rawPath = slug.endsWith('.md') ? slug : `${slug}.md`;
    
    fetch(rawPath)
      .then(res => res.text())
      .then(text => {
        // Very basic frontmatter parser
        if (text.startsWith('---')) {
          const endIdx = text.indexOf('---', 3);
          if (endIdx !== -1) {
            const frontmatter = text.substring(3, endIdx);
            const body = text.substring(endIdx + 3);
            
            const titleMatch = frontmatter.match(/title:\s*"(.*?)"/);
            
            setMeta(prev => ({
              ...prev,
              title: titleMatch ? titleMatch[1] : 'Editorial',
            }));
            
            setContent(body.trim());
          } else {
            setContent(text);
          }
        } else {
          setContent(text);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load blog post", err);
        setContent("# Post not found");
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-24 px-6 flex items-center justify-center bg-cream">
        <div className="w-8 h-8 border-2 border-[#cf958f] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 bg-cream">
      <div className="max-w-3xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <a href="/journal" className="text-xs tracking-[0.2em] text-[#cf958f] uppercase font-semibold hover:text-olive transition-colors mb-8 inline-block">
            ← Back to Editorial
          </a>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display text-olive mb-6 leading-tight">
            {meta.title || "The Editorial"}
          </h1>
          <span className="text-xs tracking-[0.2em] text-olive/50 uppercase">{meta.date}</span>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="prose prose-lg prose-olive max-w-none"
        >
          {/* Custom styling for markdown elements */}
          <div className="[&>h1]:hidden [&>h2]:font-display [&>h2]:text-2xl [&>h2]:text-olive [&>h2]:mt-12 [&>h2]:mb-6 [&>p]:text-olive/80 [&>p]:leading-relaxed [&>p]:mb-6 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ul>li]:text-olive/80 [&>ul>li]:mb-2 [&>strong]:text-olive [&>strong]:font-semibold">
            <Markdown>{content}</Markdown>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
