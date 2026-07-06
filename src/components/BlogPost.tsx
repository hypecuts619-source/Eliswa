import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Markdown from 'react-markdown';
import { blogPosts } from './Journal';
import { Share2, Facebook, Twitter, Linkedin } from 'lucide-react';

export function BlogPost({ slug }: { slug: string }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Find the post from our metadata
  const postMeta = blogPosts.find(p => p.slug === slug) || { 
    title: 'The Editorial', 
    date: 'June 2026', 
    image: '', 
    author: 'Team Eliswa India',
    readTime: '4 min read'
  };

  const [meta, setMeta] = useState(postMeta);

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
            
            if (titleMatch && !postMeta.title) {
              setMeta(prev => ({
                ...prev,
                title: titleMatch[1]
              }));
            }
            
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
  }, [slug, postMeta.title]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-24 px-6 flex items-center justify-center bg-cream">
        <div className="w-8 h-8 border-2 border-[#cf958f] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const relatedPosts = blogPosts.filter(p => p.slug !== slug).slice(0, 2);

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 bg-cream">
      <div className="max-w-4xl mx-auto">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <a href="/journal" className="text-xs tracking-[0.2em] text-[#cf958f] uppercase font-semibold hover:text-olive transition-colors mb-8 inline-block">
            ← Back to Editorial
          </a>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display text-olive mb-8 leading-tight max-w-3xl mx-auto">
            {meta.title}
          </h1>
          
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs tracking-widest text-olive/60 uppercase">
            <span className="font-semibold text-olive/80">{meta.author}</span>
            <span>•</span>
            <span>{meta.date}</span>
            <span>•</span>
            <span>{meta.readTime}</span>
          </div>
        </motion.div>

        {meta.image && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="aspect-[16/9] w-full overflow-hidden mb-16 relative bg-vintage"
          >
            <img 
              src={meta.image} 
              alt={meta.title}
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-12 lg:gap-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="prose prose-lg prose-olive max-w-none"
          >
            <div className="
              [&>h1]:hidden 
              [&>h2]:font-display [&>h2]:text-3xl [&>h2]:text-olive [&>h2]:mt-16 [&>h2]:mb-8 
              [&>p]:text-olive/80 [&>p]:leading-relaxed [&>p]:mb-8 [&>p]:text-lg
              [&>p:first-of-type]:first-letter:float-left [&>p:first-of-type]:first-letter:text-6xl [&>p:first-of-type]:first-letter:pr-3 [&>p:first-of-type]:first-letter:font-display [&>p:first-of-type]:first-letter:text-[#cf958f] [&>p:first-of-type]:first-letter:mt-1
              [&>ul]:list-none [&>ul]:pl-0 [&>ul]:mb-8 
              [&>ul>li]:text-olive/80 [&>ul>li]:mb-4 [&>ul>li]:relative [&>ul>li]:pl-6
              [&>ul>li::before]:content-[''] [&>ul>li::before]:absolute [&>ul>li::before]:w-1.5 [&>ul>li::before]:h-1.5 [&>ul>li::before]:bg-[#cf958f] [&>ul>li::before]:left-0 [&>ul>li::before]:top-2.5 [&>ul>li::before]:rounded-full
              [&>strong]:text-olive [&>strong]:font-semibold
              [&>blockquote]:border-l-2 [&>blockquote]:border-[#cf958f] [&>blockquote]:pl-6 [&>blockquote]:italic [&>blockquote]:text-xl [&>blockquote]:text-olive [&>blockquote]:my-10
            ">
              <Markdown>{content}</Markdown>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="hidden lg:block space-y-8 sticky top-32 h-fit"
          >
            <div>
              <span className="text-xs tracking-[0.2em] text-olive/50 uppercase block mb-4">Share</span>
              <div className="flex flex-col gap-4 text-olive/60">
                <button className="flex items-center gap-3 hover:text-[#cf958f] transition-colors group">
                  <Facebook className="w-4 h-4" />
                  <span className="text-sm">Facebook</span>
                </button>
                <button className="flex items-center gap-3 hover:text-[#cf958f] transition-colors group">
                  <Twitter className="w-4 h-4" />
                  <span className="text-sm">Twitter</span>
                </button>
                <button className="flex items-center gap-3 hover:text-[#cf958f] transition-colors group">
                  <Linkedin className="w-4 h-4" />
                  <span className="text-sm">LinkedIn</span>
                </button>
                <button className="flex items-center gap-3 hover:text-[#cf958f] transition-colors group mt-2 pt-2 border-t border-olive/10">
                  <Share2 className="w-4 h-4" />
                  <span className="text-sm">Copy Link</span>
                </button>
              </div>
            </div>
            
            <div className="pt-8 border-t border-olive/10">
              <span className="text-xs tracking-[0.2em] text-olive/50 uppercase block mb-4">Subscribe</span>
              <p className="text-sm text-olive/70 mb-4">Get our latest stories on heritage fashion delivered to your inbox.</p>
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full bg-transparent border-b border-olive/30 pb-2 text-sm focus:outline-none focus:border-olive mb-4 placeholder:text-olive/40"
              />
              <button className="text-xs tracking-widest text-[#cf958f] uppercase font-semibold hover:text-olive transition-colors">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-24 pt-16 border-t border-olive/20"
        >
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-2xl md:text-3xl font-display text-olive">Related Reading</h2>
            <a href="/journal" className="text-xs tracking-widest text-olive uppercase hover:text-[#cf958f] transition-colors hidden sm:block">
              View All Posts
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {relatedPosts.map((post, index) => (
              <a
                key={post.slug}
                href={post.slug}
                className="group block"
              >
                <div className="aspect-[4/3] overflow-hidden mb-6 relative bg-vintage">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-olive/10 group-hover:bg-transparent transition-colors duration-500" />
                </div>
                <div className="space-y-3">
                  <span className="text-xs tracking-[0.2em] text-[#cf958f] uppercase font-semibold">{post.date}</span>
                  <h3 className="text-xl font-display text-olive group-hover:text-[#cf958f] transition-colors">{post.title}</h3>
                  <div className="inline-flex items-center text-xs tracking-widest text-olive uppercase border-b border-olive/30 pb-1 group-hover:border-[#cf958f] group-hover:text-[#cf958f] transition-colors mt-2">
                    Read Article
                  </div>
                </div>
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
