import { motion } from 'motion/react';
import { SERVICES } from '../constants';
import { Icons } from './Icons';

const ServiceGraphic = ({ id, Icon }: { id: string, Icon: any }) => {
  if (id === 'lead-gen') {
    return (
      <div className="relative w-full h-full flex items-center justify-center bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-pink-500/5 blur-[100px] rounded-full" />
        <div className="relative w-64 h-64">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-2 border-dashed border-pink-500/20 rounded-full"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute inset-8 border border-dashed border-cyan-500/20 rounded-full"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-gradient-to-tr from-pink-500 to-violet-500 rounded-3xl flex flex-col items-center justify-center shadow-2xl shadow-pink-500/30">
              <Icon size={48} className="text-white" />
            </div>
          </div>
          {/* Pulsing Target Rings */}
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 3, delay: i * 1, repeat: Infinity, ease: "easeOut" }}
              className="absolute inset-0 border border-pink-500 rounded-full"
            />
          ))}
        </div>
      </div>
    );
  }

  if (id === 'ai-automation') {
    return (
      <div className="relative w-full h-full flex items-center justify-center bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-cyan-500/5 blur-[100px] rounded-full" />
        <div className="relative w-64 h-64">
          {/* Neural Network Style Connections */}
          <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100">
            <motion.path 
              d="M10,50 Q50,10 90,50 T10,50" 
              fill="none" 
              stroke="white" 
              strokeWidth="0.5"
              animate={{ strokeDasharray: ["0,100", "100,0"] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.path 
              d="M50,10 Q90,50 50,90 T50,10" 
              fill="none" 
              stroke="white" 
              strokeWidth="0.5"
              animate={{ strokeDasharray: ["0,100", "100,0"] }}
              transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            />
          </svg>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
              className="w-32 h-32 bg-slate-800/40 rounded-[2rem] flex items-center justify-center"
            >
              <Icon size={48} className="text-cyan-400" />
            </motion.div>
          </div>

          {/* Floating Data Nodes */}
          {[0, 90, 180, 270].map((angle, i) => (
            <motion.div
              key={i}
              animate={{ 
                y: [0, -10, 0],
                x: [0, i % 2 === 0 ? 5 : -5, 0]
              }}
              transition={{ duration: 3, delay: i * 0.7, repeat: Infinity }}
              className="absolute w-6 h-6 bg-slate-800/40 rounded-lg flex items-center justify-center text-cyan-400"
              style={{
                top: `${50 + 40 * Math.sin((angle * Math.PI) / 180)}%`,
                left: `${50 + 40 * Math.cos((angle * Math.PI) / 180)}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (id === 'social-growth') {
    return (
      <div className="relative w-full h-full flex items-center justify-center bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-violet-500/5 blur-[100px] rounded-full" />
        <div className="relative w-64 h-64 flex items-center justify-center">
          {/* Viral Growth Bars */}
          <div className="flex items-end gap-3 h-32">
            {[40, 70, 50, 90, 65].map((height, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                whileInView={{ height: `${height}%` }}
                transition={{ duration: 1, delay: i * 0.1, repeat: Infinity, repeatType: "reverse", repeatDelay: 0.5 }}
                className="w-4 bg-gradient-to-t from-violet-600 to-pink-500 rounded-t-full shadow-lg shadow-pink-500/20"
              />
            ))}
          </div>
          
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -top-4 w-20 h-20 bg-slate-800/40 rounded-3xl flex items-center justify-center"
          >
            <Icon size={32} className="text-pink-500" />
          </motion.div>

          {/* Floating Emoji/Like Particles */}
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20, x: i * 20 - 40 }}
              animate={{ opacity: [0, 1, 0], y: -60 }}
              transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
              className="absolute bottom-16 text-pink-500"
            >
              <Icons.CheckCircle2 size={16} />
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (id === 'seo-dominance') {
    return (
      <div className="relative w-full h-full flex items-center justify-center bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-emerald-500/5 blur-[100px] rounded-full" />
        <div className="relative w-64 h-64">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            {/* Mountain/Peak Range for SEO Ranking */}
            <motion.path
              d="M10,80 L30,40 L50,60 L75,20 L90,80 Z"
              fill="url(#seo-grad)"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.2 }}
              transition={{ duration: 2 }}
            />
            <defs>
              <linearGradient id="seo-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="flex flex-col items-center"
            >
              <div className="w-24 h-24 bg-emerald-500/5 rounded-full flex items-center justify-center mb-4">
                <Icon size={40} className="text-emerald-400" />
              </div>
              <div className="flex gap-1">
                {[1, 2, 3].map(i => (
                  <motion.div 
                    key={i} 
                    animate={{ height: [8, 16, 8] }}
                    transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
                    className="w-1 bg-emerald-400 rounded-full" 
                  />
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            animate={{ x: [0, 100], opacity: [0, 1, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-0 w-8 h-[1px] bg-emerald-400/50"
          />
        </div>
      </div>
    );
  }

  return null;
};

export default function DetailedServices() {
  return (
    <section id="services" className="py-12 md:py-16 lg:py-20 px-6 md:px-12 xl:px-20 bg-slate-900 overflow-hidden">
      <div className="max-w-[1536px] mx-auto">
        <div className="text-center mb-20 lg:mb-28">
          <span className="text-pink-500 text-xs md:text-sm font-black uppercase tracking-[0.2em] mb-4 block">Our Expertise</span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mb-8 leading-[1.15] md:leading-[1.12] tracking-normal uppercase font-black">
            Full-Spectrum <br /> <span className="text-gradient">Growth Engines</span>
          </h2>
          <p className="text-base md:text-lg text-slate-300 max-w-xl mx-auto leading-relaxed font-medium">
            We don't do 'fluff'. We build high-performance digital infrastructure designed for one thing: Revenue.
          </p>
        </div>

        <div className="space-y-28 lg:space-y-36">
          {SERVICES.map((service, index) => {
            const Icon = Icons[service.icon as keyof typeof Icons];
            const isEven = index % 2 === 0;

            return (
              <div 
                key={service.id} 
                className={`flex flex-col lg:flex-row gap-12 lg:gap-24 items-center ${
                  isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}
              >
                {/* Content Side */}
                <motion.div 
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="flex-1 space-y-6 md:space-y-8"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 flex items-center justify-center text-pink-500">
                      {Icon && <Icon size={24} />}
                    </div>
                    <h3 className="font-display text-2xl md:text-4xl font-black uppercase tracking-tight">
                      {service.title}
                    </h3>
                  </div>

                  <p className="text-base md:text-lg text-slate-300 leading-relaxed md:leading-loose font-medium">
                    {service.description}
                  </p>

                  <div className="space-y-4 pt-4">
                    <h4 className="text-xs md:text-sm font-black uppercase tracking-widest text-pink-500">Key Benefits</h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                      {service.benefits?.map((benefit, bi) => (
                        <li key={bi} className="flex items-center gap-3 text-sm font-bold text-slate-300">
                          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-8">
                    <a 
                      href="#contact"
                      className="bg-slate-800 hover:bg-slate-700 border border-slate-700 px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest text-white transition-all active:scale-95 flex items-center gap-2 group w-fit"
                    >
                      Learn More <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </a>
                  </div>
                </motion.div>

                {/* Visual Side */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, rotate: isEven ? 2 : -2 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                  className="flex-1 w-full"
                >
                  <div className="relative aspect-video lg:aspect-square rounded-[48px] overflow-hidden bg-transparent group">
                    <ServiceGraphic id={service.id} Icon={Icon} />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none" />
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
