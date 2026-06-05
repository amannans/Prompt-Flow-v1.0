import { motion } from 'motion/react';
import { STATS } from '../constants';
import { Icons } from './Icons';

export default function StatsSection() {
  const highlights = [
    "No 12-month lock-in contracts",
    "No junior account handlers",
    "Direct correlation between spend and profit"
  ];

  return (
    <section className="pt-6 md:pt-8 lg:pt-10 pb-10 md:pb-14 lg:pb-20 px-6 md:px-12 xl:px-20 max-w-[1536px] mx-auto">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
        <div className="lg:w-1/2">
          <span className="text-pink-500 text-xs md:text-sm font-bold uppercase tracking-[0.2em] mb-4 block">The Prompt Flow Advantage</span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-3xl mb-6 leading-tight tracking-tighter uppercase font-black lg:text-6xl">
            The Agency Model is <span className="text-gradient">Broken.</span>
          </h2>
          <p className="text-sm md:text-base text-slate-300 mb-8 leading-relaxed font-semibold">
            You're paying for fancy offices and junior account managers. We've stripped the bloat. You get direct access to senior talent and data pipelines that actually drive sales.
          </p>
          <ul className="space-y-4">
            {highlights.map((item, i) => (
              <li key={i} className="flex items-center gap-4 text-sm font-semibold text-slate-200 tracking-wide">
                <div className="w-6 h-6 rounded-full bg-pink-500/10 flex items-center justify-center">
                  <Icons.CheckCircle2 className="text-pink-500" size={14} />
                </div>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:w-1/2 grid grid-cols-2 gap-4 md:gap-6">
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="bg-slate-800/80 border border-slate-700 p-6 md:p-8 rounded-[24px] flex flex-col justify-center text-center"
            >
              <span className={`font-display text-3xl md:text-4xl lg:text-5xl font-black mb-2 ${stat.color}`}>
                {stat.value}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
