import { useState } from 'react';
import { motion } from 'motion/react';
import { PRICING_PACKAGES } from '../constants';
import { Icons } from './Icons';
import { useSelection } from '../context/SelectionContext';
import { useAuth } from '../context/AuthContext';

export default function Pricing() {
  const { selectedPackage, setSelectedPackage } = useSelection();
  const { user, login } = useAuth();
  const [loadingPkg, setLoadingPkg] = useState<string | null>(null);

  const handleCheckout = async (pkgName: string) => {
    setLoadingPkg(pkgName);
    try {
      let currentUser = user;
      // If not logged in, trigger Google Sign-In pop-up
      if (!currentUser) {
        currentUser = await login();
      }
      
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.uid,
          packageName: pkgName,
          email: currentUser.email
        })
      });

      const data = await response.json();

      if (response.ok && data.url) {
        // Redirect to secure hosted Stripe checkout
        window.location.href = data.url;
      } else {
        // Fallback to client dashboard manual simulator if Stripe key isn't operational
        window.location.href = '/dashboard';
      }
    } catch (err) {
      console.warn("Stripe Checkout Session initialization failed, redirecting to fallback local dashboard:", err);
      window.location.href = '/dashboard';
    } finally {
      setLoadingPkg(null);
    }
  };

  return (
    <section id="pricing" className="py-12 md:py-16 lg:py-20 px-6 md:px-12 xl:px-20 bg-surface-container-low overflow-hidden">
      <div className="max-w-[1536px] mx-auto">
        <div className="text-center mb-20 lg:mb-28">
          <span className="text-pink-500 text-xs md:text-sm font-black uppercase tracking-[0.2em] mb-4 block">Invest in Growth</span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mb-8 leading-[1.15] md:leading-[1.12] tracking-normal uppercase font-black">
            Transparent <span className="text-gradient">ROI</span> Packages
          </h2>
          <p className="text-base md:text-lg text-slate-300 max-w-xl mx-auto leading-relaxed font-medium">
            No hidden fees. No complex contracts. Just high-performance systems built for conversion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
          {PRICING_PACKAGES.map((pkg, i) => {
            const isSelected = selectedPackage === pkg.name;
            const isAnySelected = selectedPackage !== '';
            
            return (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ y: 0, opacity: isAnySelected ? (isSelected ? 1 : 0.4) : 1 }}
                animate={{ 
                  scale: isSelected ? 1.05 : (isAnySelected ? 0.95 : 1),
                  zIndex: isSelected ? 20 : (pkg.popular && !isAnySelected ? 10 : 0)
                }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: isAnySelected ? 0 : i * 0.05 }}
                onClick={() => {
                  setSelectedPackage(pkg.name);
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
                whileHover={{ 
                  scale: isSelected ? 1.08 : 1.05, 
                  opacity: 1,
                  backgroundColor: pkg.popular ? "rgba(30, 41, 59, 1)" : "rgba(15, 23, 42, 1)",
                  borderColor: "rgba(236, 72, 153, 0.4)"
                }}
                className={`relative flex flex-col p-6 rounded-[32px] border transition-all duration-500 group cursor-pointer ${
                  isSelected 
                    ? 'bg-slate-800 border-pink-500 ring-4 ring-pink-500/20 shadow-[0_0_50px_-12px_rgba(236,72,153,0.5)]' 
                    : (pkg.popular 
                        ? 'bg-slate-800/50 border-slate-700 shadow-xl shadow-slate-900/50' 
                        : 'bg-slate-900 border-slate-800 opacity-60 grayscale-[0.5]')
                } ${!isAnySelected ? 'opacity-100 grayscale-0' : ''}`}
              >
              {isSelected && (
                <div className="absolute -top-4  left-1/2 -translate-x-1/2 bg-pink-500 text-white text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full whitespace-nowrap shadow-xl shadow-pink-500/40 z-30 animate-bounce-subtle">
                  Your Selection
                </div>
              )}
              
              {pkg.popular && !isSelected && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-700 text-slate-300 text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full whitespace-nowrap border border-slate-600">
                  Most Popular
                </div>
              )}

              <div className="mb-8 flex justify-between items-start">
                <div>
                  <h3 className={`text-lg font-black uppercase tracking-tight mb-2 transition-colors ${isSelected ? 'text-pink-500' : 'group-hover:text-pink-500'}`}>{pkg.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black">{pkg.price}</span>
                    <span className="text-slate-500 text-sm font-bold">/mo</span>
                  </div>
                </div>
                {isSelected && (
                  <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-pink-500/20">
                    <Icons.Check size={16} />
                  </div>
                )}
              </div>

              <p className="text-sm text-slate-400 mb-8 font-medium leading-relaxed">
                {pkg.description}
              </p>

              <ul className="space-y-4 mb-8 flex-1">
                {pkg.features.map((feature, fi) => (
                  <li key={fi} className="flex items-start gap-3 text-xs font-bold text-slate-300">
                    <Icons.Check className="text-cyan-400 shrink-0" size={14} />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="space-y-3 mt-auto">
                {/* Instant Stripe Checkout Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card selection click event
                    handleCheckout(pkg.name);
                  }}
                  disabled={loadingPkg === pkg.name}
                  className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-center transition-all bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white cursor-pointer shadow-lg shadow-indigo-600/10 flex items-center justify-center gap-1.5 disabled:bg-indigo-600/50"
                >
                  {loadingPkg === pkg.name ? (
                    <>
                      <Icons.Loader2 className="w-4 h-4 animate-spin" />
                      Initializing...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M13.93 11.23c-1.34-.35-2.07-.63-2.07-1.16 0-.47.45-.73 1.25-.73.81 0 1.63.26 2.36.65V7.45c-.86-.33-1.81-.46-2.73-.46-2.45 0-4.08 1.24-4.08 3.32 0 1.83 1.48 2.5 3.19 2.92 1.48.36 2.02.66 2.02 1.22 0 .55-.54.85-1.42.85-.98 0-1.99-.33-2.77-.73v2.66c.98.41 2.15.58 3.25.58 2.53 0 4.21-1.22 4.21-3.34-.01-1.89-1.57-2.71-3.17-3.04z" />
                      </svg>
                      Stripe Instant Pay
                    </>
                  )}
                </button>

                {/* Consult / Select Selector Button */}
                <div
                  className={`w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest text-center transition-all ${
                    isSelected
                      ? 'bg-white text-pink-500 shadow-xl border border-pink-500/10'
                      : (pkg.popular
                          ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/20 group-hover:bg-pink-600'
                          : 'bg-slate-800 text-slate-300 hover:text-white group-hover:bg-slate-700')
                  }`}
                >
                  {isSelected ? 'Selected' : pkg.cta}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);
}
