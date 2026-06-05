import { ReactNode } from 'react';
import { motion } from 'motion/react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface LegalPageProps {
  title: string;
  lastUpdated: string;
  content: ReactNode;
}

export default function LegalPage({ title, lastUpdated, content }: LegalPageProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-pink-500/30">
      <Navbar />
      <div className="pt-32 pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-pink-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4 block">Legal Documentation</span>
            <h1 className="font-display text-4xl md:text-6xl mb-4 tracking-tighter uppercase font-black">
              {title}
            </h1>
            <p className="text-slate-500 text-sm font-bold mb-12">Last Updated: {lastUpdated}</p>
            
            <div className="prose prose-invert prose-slate max-w-none 
              prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight
              prose-p:text-slate-400 prose-p:leading-relaxed prose-p:font-medium
              prose-li:text-slate-400 prose-li:font-medium
              prose-strong:text-white prose-strong:font-black
            ">
              {content}
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
