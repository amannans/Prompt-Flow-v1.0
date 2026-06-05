import { motion } from 'motion/react';
import { Icons } from './Icons';

export default function AIAutomation() {
  const steps = [
    {
      title: "Capture",
      description: "24/7 AI agents engage visitors across web, social, and WhatsApp instantly.",
      icon: "Target"
    },
    {
      title: "Qualify",
      description: "Our systems extract key data and qualify leads before they ever reach your inbox.",
      icon: "Cpu"
    },
    {
      title: "Nurture",
      description: "Automated multi-channel follow-ups ensure no lead goes cold, ever.",
      icon: "Zap"
    },
    {
      title: "Close",
      description: "Meetings appear on your calendar automatically with qualified, high-intent buyers.",
      icon: "BarChart"
    }
  ];

  return (
    <section className="pt-6 md:pt-8 lg:pt-10 pb-10 md:pb-14 lg:pb-20 px-6 md:px-12 xl:px-20 bg-slate-900 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1536px] mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center mb-16 lg:mb-20">
          <div className="lg:w-1/2">
            <span className="text-pink-500 text-xs md:text-sm font-bold uppercase tracking-[0.2em] mb-4 block">Our Secret Sauce</span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-3xl mb-6 leading-[1.1] tracking-tighter uppercase font-black lg:text-6xl">
              AI-Powered <br />
              <span className="text-gradient">Revenue</span> <br />
              Infrastructure.
            </h2>
            <p className="text-sm md:text-base text-slate-300 mb-8 leading-relaxed font-semibold">
              We don't just do marketing. We build "Sales Engines" that work while you sleep. Our AI systems handle the mundane so your team can focus on closing deals.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center text-pink-500">
                  <Icons.Zap size={24} />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight">Instant Response</h3>
                <p className="text-sm text-slate-400 font-semibold leading-relaxed">
                  Reduce lead response time from hours to seconds. Our AI agents reply to every inquiry 24/7.
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400">
                  <Icons.Cpu size={24} />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight">Lead Filtering</h3>
                <p className="text-sm text-slate-400 font-semibold leading-relaxed">
                  Stop wasting time on tyre-kickers. Our system qualifies every lead based on your criteria.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 w-full">
            <div className="relative p-8 md:p-12 lg:p-16 glass rounded-[48px] border-slate-700/50 shadow-2xl overflow-hidden group">
              {/* Visual "Engine" or Diagram Placeholder */}
              <div className="relative aspect-square max-w-md mx-auto">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-2 border-dashed border-slate-700 rounded-full"
                />
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-8 border border-dashed border-pink-500/20 rounded-full"
                />
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 bg-gradient-to-tr from-pink-500 to-violet-500 rounded-[32px] flex flex-col items-center justify-center text-center p-6 shadow-2xl shadow-pink-500/50 group-hover:scale-110 transition-transform duration-700">
                    <Icons.Cpu className="text-white mb-4" size={48} />
                    <span className="text-white font-bold uppercase tracking-wider text-xs">Pulse Core AI</span>
                  </div>
                </div>

                {/* Satellite Icons */}
                {[Icons.Mail, Icons.Share2, Icons.Target, Icons.Globe].map((Icon, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-12 h-12 bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center text-slate-400"
                    style={{
                      top: `${50 + 40 * Math.sin((i * Math.PI) / 2)}%`,
                      left: `${50 + 40 * Math.cos((i * Math.PI) / 2)}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, delay: i * 0.5, repeat: Infinity }}
                  >
                    <Icon size={20} />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => {
            const Icon = Icons[step.icon as keyof typeof Icons];
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                className="relative bg-slate-800/40 border border-slate-700/50 p-8 rounded-[32px] group hover:bg-slate-800 transition-colors"
              >
                <div className="text-5xl font-black text-slate-700 mb-6 group-hover:text-pink-500 transition-colors">0{i + 1}</div>
                <h4 className="text-xl font-black uppercase tracking-tight mb-4">{step.title}</h4>
                <p className="text-sm text-slate-300 font-semibold leading-relaxed">{step.description}</p>
                {i < steps.length - 1 && (
                  <Icons.ArrowRight className="hidden lg:block absolute -right-6 top-1/2 -translate-y-1/2 text-slate-700 z-10" size={24} />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
