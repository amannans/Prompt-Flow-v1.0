import { motion } from 'motion/react';
import { TARGET_INDUSTRIES } from '../constants';
import { Icons } from './Icons';

export default function TargetClients() {
  return (
    <section className="py-10 md:py-14 lg:py-20 px-6 md:px-12 xl:px-20 bg-surface overflow-hidden">
      <div className="max-w-[1536px] mx-auto">
        <div className="text-center mb-16 lg:mb-20">
          <span className="text-pink-500 text-xs md:text-sm font-black uppercase tracking-[0.2em] mb-4 block">Who We Help</span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mb-6 tracking-tighter uppercase font-black">
            Niche <span className="text-gradient">Authority</span> Scaling
          </h2>
          <p className="text-sm md:text-base text-slate-400 max-w-lg mx-auto leading-relaxed font-semibold">
            We don't work with everyone. We specialize in industries where AI systems and lead gen can provide an unfair advantage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 xl:gap-12">
          {TARGET_INDUSTRIES.map((industry, i) => {
            const Icon = Icons[industry.icon as keyof typeof Icons];
            return (
              <motion.div
                key={industry.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group flex flex-col items-center text-center space-y-6"
              >
                <div className="w-20 h-20 bg-slate-800 border border-slate-700 rounded-3xl flex items-center justify-center text-slate-400 group-hover:text-pink-500 group-hover:border-pink-500 transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-pink-500/10">
                  {Icon && <Icon size={32} />}
                </div>
                <div>
                  <h4 className="text-xl font-black uppercase tracking-tight mb-2">{industry.name}</h4>
                  <p className="text-sm text-slate-400 font-medium leading-relaxed px-4">
                    {industry.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
