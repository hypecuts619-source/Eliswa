import { motion } from 'framer-motion';

export const blogPosts = [
  {
    slug: '/blogs/kerala-kasavu-saree-guide',
    title: 'The Complete Guide to Kerala Kasavu Sarees',
    excerpt: 'Everything you need to know about Kerala Kasavu sarees — history, weaving, fabric types, and how to spot authentic handloom.',
    date: 'June 15, 2026',
    author: 'Team Eliswa India',
    readTime: '3 min read',
    image: 'https://upload.wikimedia.org/wikipedia/commons/8/80/Saree_Weaving_by_Handloom.jpg'
  },
  {
    slug: '/blogs/how-to-drape-style-kasavu-saree',
    title: 'How to Drape and Style a Kasavu Saree',
    excerpt: 'A step-by-step guide to draping a Kasavu saree the traditional way, plus styling tips for jewelry, blouses, and hair.',
    date: 'June 22, 2026',
    author: 'Team Eliswa India',
    readTime: '4 min read',
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Malayali_women_wearing_Kerala_saree.jpg'
  },
  {
    slug: '/blogs/kasavu-saree-care-guide',
    title: 'Kasavu Saree Care Guide: Washing & Storing',
    excerpt: 'Learn how to wash, store, and preserve your Kasavu saree so the gold zari border and fabric stay beautiful for years.',
    date: 'June 28, 2026',
    author: 'Team Eliswa India',
    readTime: '3 min read',
    image: 'https://upload.wikimedia.org/wikipedia/commons/0/03/Set_saree.jpg'
  },
  {
    slug: '/blogs/onam-sarees-2026-guide',
    title: 'Onam Sarees 2026: The Ultimate Guide',
    excerpt: 'Choosing an Onam saree for 2026? Here is a complete guide to Kasavu, tissue, and set sarees for Thiruvonam.',
    date: 'July 4, 2026',
    author: 'Team Eliswa India',
    readTime: '5 min read',
    image: 'https://upload.wikimedia.org/wikipedia/commons/d/d6/Onam_Thriuvathira_Dance.jpg'
  },
  {
    slug: '/blogs/onam-saree-styling-ideas',
    title: 'What to Wear for Onam: Styling Ideas',
    excerpt: 'From Athapookkalam mornings to Thiruvonam evenings, here is how to style your Kasavu saree for every event.',
    date: 'July 10, 2026',
    author: 'Team Eliswa India',
    readTime: '4 min read',
    image: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Onam.saree.model.jpg'
  },
  {
    slug: '/blogs/onam-kasavu-saree-white-gold-meaning',
    title: 'Why Kerala Wears White and Gold for Onam',
    excerpt: 'The story behind Onam and the Kasavu saree — the legend of Mahabali, and the symbolism of white and gold.',
    date: 'July 15, 2026',
    author: 'Team Eliswa India',
    readTime: '4 min read',
    image: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Onam_Pookalam_with_Nirapara.jpg'
  }
];

export function Journal() {
  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 bg-cream">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="text-[#cf958f] text-xs md:text-sm tracking-[0.3em] uppercase mb-4 block font-semibold">The Editorial</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display text-olive mb-6">Journal & Musings</h1>
          <p className="text-olive/70 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Stories of heritage, craftsmanship, and the timeless elegance of Kerala's handloom traditions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
          {blogPosts.map((post, index) => (
            <motion.a
              key={post.slug}
              href={post.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group block"
            >
              <div className="aspect-[4/5] overflow-hidden mb-6 relative bg-vintage">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-olive/10 group-hover:bg-transparent transition-colors duration-500" />
              </div>
              <div className="space-y-4">
                <span className="text-xs tracking-[0.2em] text-[#cf958f] uppercase font-semibold">{post.date}</span>
                <h2 className="text-2xl font-display text-olive group-hover:text-[#cf958f] transition-colors">{post.title}</h2>
                <p className="text-olive/70 text-sm leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="inline-flex items-center text-xs tracking-widest text-olive uppercase border-b border-olive/30 pb-1 group-hover:border-[#cf958f] group-hover:text-[#cf958f] transition-colors">
                  Read Article
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
}
