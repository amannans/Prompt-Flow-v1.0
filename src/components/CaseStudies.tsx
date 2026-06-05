import { motion } from 'motion/react';
import { CASE_STUDIES } from '../constants';

export default function CaseStudies() {
  return (
    <section id="case-studies" className="pt-10 md:pt-14 lg:pt-18 pb-6 md:pb-8 lg:pb-10 px-6 md:px-12 xl:px-20 max-w-[1536px] mx-auto overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div className="max-w-2xl">
          <span className="text-pink-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4 block">Proven Results</span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tighter uppercase font-black">The Proof is in <br /> the <span className="text-gradient">Profit.</span></h2>
        </div>
        <a 
          href="#contact"
          className="bg-slate-800 border border-slate-700 px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-white transition-colors active:scale-95"
        >
          View All Studies
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
        {CASE_STUDIES.map((study, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
            className="flex flex-col gap-6 group"
          >
            <div className="aspect-[16/10] overflow-hidden rounded-[32px] bg-slate-800 border border-slate-700 relative">
              <img 
                src={study.image} 
                alt={study.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80" 
              />
              <div className="absolute inset-0 bg-background/40 group-hover:bg-background/20 transition-colors" />
            </div>

            <div className="flex gap-10">
              {study.metrics.map((metric, mi) => (
                <div key={mi}>
                  <span className={`font-display text-3xl md:text-4xl font-black block mb-1 ${metric.color}`}>
                    {metric.value}
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                    {metric.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-2xl md:text-3xl font-black leading-tight uppercase tracking-tight">
                {study.title}
              </h3>
              <p className="text-slate-400 text-base md:text-lg leading-relaxed font-medium">
                {study.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
