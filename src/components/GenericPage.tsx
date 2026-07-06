import { motion } from 'framer-motion';
import Markdown from 'react-markdown';

export function GenericPage({ title, content }: { title: string, content: string }) {
  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 bg-cream">
      <div className="max-w-3xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display text-olive mb-6 leading-tight">
            {title}
          </h1>
          <div className="w-16 h-px bg-[#cf958f] mx-auto"></div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="prose prose-lg prose-olive max-w-none"
        >
          <div className="
            [&>h2]:font-display [&>h2]:text-2xl [&>h2]:text-olive [&>h2]:mt-12 [&>h2]:mb-6 
            [&>h3]:font-display [&>h3]:text-xl [&>h3]:text-olive [&>h3]:mt-8 [&>h3]:mb-4 
            [&>p]:text-olive/80 [&>p]:leading-relaxed [&>p]:mb-6 
            [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 
            [&>ul>li]:text-olive/80 [&>ul>li]:mb-2 
            [&>strong]:text-olive [&>strong]:font-semibold
          ">
            <Markdown>{content}</Markdown>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
