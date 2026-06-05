import { motion } from 'motion/react';
import { LOGOS } from '../constants';

export default function Hero() {
  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center pt-32 pb-16 md:pt-40 md:pb-24 px-6 hero-glow overflow-hidden">
      {/* Background Decorative Elements - Optimised with GPU-accelerated float cycles */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[5%] will-change-transform">
          <motion.div 
            animate={{ 
              y: [0, -25, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-[300px] h-[300px] bg-pink-500/5 rounded-full blur-[40px]"
          />
        </div>

        <div className="absolute bottom-[20%] right-[10%] will-change-transform">
          <motion.div 
            animate={{ 
              y: [0, 30, 0],
              scale: [1, 1.08, 1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[50px]"
          />
        </div>

        <div className="absolute top-[40%] left-[60%] will-change-transform">
          <motion.div 
            animate={{ 
              x: [0, 20, 0],
              y: [0, -15, 0],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-[250px] h-[250px] bg-purple-500/5 rounded-full blur-[30px]"
          />
        </div>
        
        {/* Subtle CSS Noise overlay using an ultra-light gradient representation to avoid repaint lag */}
        <div className="absolute inset-0 opacity-[0.015] bg-radial from-slate-950 via-slate-900 to-transparent pointer-events-none" />
      </div>

      <div className="max-w-5xl text-center z-10 px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center space-x-2.5 bg-slate-800/60 border border-slate-700 rounded-full px-5 py-2 mb-8"
        >
          <span className="flex h-2.5 w-2.5 rounded-full bg-green-400"></span>
          <span className="text-xs font-semibold text-slate-200 uppercase tracking-wide">
            AWARD WINNING AGENCY
          </span>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-4xl md:text-6xl lg:text-7xl mb-10 leading-[1.15] md:leading-[1.12] tracking-tight uppercase font-black"
        >
          Turn Clicks <br className="hidden md:inline" />
          Into <span className="text-gradient">Clients</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-12 leading-loose md:leading-relaxed font-medium"
        >
          We help UK businesses generate leads, automate sales, and scale faster with AI-powered marketing that actually converts.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-5 md:gap-6 justify-center"
        >
          <a 
            href="#contact"
            className="bg-pink-500 hover:bg-pink-600 text-white px-10 py-4 rounded-full font-bold text-base uppercase tracking-wider transition-all shadow-lg shadow-pink-500/20 active:scale-95 text-center flex items-center justify-center cursor-pointer"
          >
            Get Free Strategy Call
          </a>
          <a 
            href="#services"
            className="glass text-slate-200 px-10 py-4 rounded-full font-bold text-base uppercase tracking-wider hover:bg-slate-800 transition-all active:scale-95 text-center flex items-center justify-center cursor-pointer"
          >
            See How It Works
          </a>
        </motion.div>
      </div>

      {/* Marquee */}
      <div className="w-full mt-20 overflow-hidden relative">
        <div className="flex gap-16 md:gap-24 py-8 items-center whitespace-nowrap animate-marquee">
          <div className="flex items-center gap-16 md:gap-24 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
            {LOGOS.map((logo, i) => (
              <span key={i} className="font-display text-2xl md:text-3xl font-bold tracking-tighter">
                {logo}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-16 md:gap-24 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
            {LOGOS.map((logo, i) => (
              <span key={`dup-${i}`} className="font-display text-2xl md:text-3xl font-bold tracking-tighter">
                {logo}
              </span>
            ))}
          </div>
        </div>
        
        {/* Gradient overlays for marquee */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
      </div>
    </section>
  );
}
