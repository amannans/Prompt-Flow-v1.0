import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { motion } from 'motion/react';
import { Icons } from './Icons';
import { useSelection } from '../context/SelectionContext';

export default function CTASection() {
  const { selectedPackage } = useSelection();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    website: '',
    message: '',
    goal: 'Increase ROI (Paid Social/PPC)',
    budget: '£5k-£15k',
    package: ''
  });

  useEffect(() => {
    if (selectedPackage) {
      setFormData(prev => ({ ...prev, package: selectedPackage }));
    }
  }, [selectedPackage]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      setIsSuccess(true);
      setFormData({ 
        name: '', 
        email: '', 
        phone: '',
        company: '', 
        website: '', 
        message: '', 
        goal: 'Increase ROI (Paid Social/PPC)', 
        budget: '£5k-£15k',
        package: selectedPackage || ''
      });
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error('Submission error:', error);
      setError(error instanceof Error ? error.message : 'Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const budgets = ["£1k-£5k", "£5k-£15k", "£15k+"];

  return (
    <section id="contact" className="pt-6 md:pt-8 lg:pt-10 pb-10 md:pb-14 lg:pb-20 px-6 md:px-12 xl:px-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 -z-10" />
      <div className="max-w-[1536px] mx-auto">
        
        {/* Top Section: Header + Strategy Session */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-12 lg:mb-20">
          <div className="text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mb-6 tracking-tighter leading-[0.95] uppercase font-black">
                Ready to <br className="md:hidden" />
                Stop <span className="text-gradient">Guessing?</span>
              </h2>
              <p className="text-base md:text-lg text-slate-400 leading-relaxed font-medium max-w-lg">
                We only take on brands we know we can scale. <br className="hidden md:block" />
                If you're ready to scale, we're ready to talk.
              </p>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full max-w-lg lg:ml-auto"
          >
            <div className="bg-slate-800/80 border border-slate-700 p-6 md:p-8 rounded-[24px] flex flex-col gap-6 w-full shadow-2xl shadow-pink-500/5 hover:border-pink-500/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center shadow-xl shadow-pink-500/20 shrink-0">
                  <Icons.Target className="text-white" size={20} />
                </div>
                <h4 className="font-display text-lg font-black uppercase tracking-tight text-white leading-tight">Free Strategy <br />Session</h4>
              </div>
              
              <div className="flex flex-col gap-3.5">
                {[
                  { text: "30 Mins Deep Dive", icon: "Clock" },
                  { text: "Data-driven Insights", icon: "BarChart3" },
                  { text: "Zero Sales Pressure", icon: "ShieldCheck" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 group/item">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 group-hover/item:scale-150 transition-transform duration-300" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-200 leading-none">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-700">
                <p className="text-slate-350 text-xs leading-relaxed font-medium italic">
                  "The most valuable 30 minutes you'll spend on your marketing this year."
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section: The Form */}
        <div className="max-w-3xl mx-auto w-full">
          <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-2xl shadow-purple-500/10 text-slate-900 border border-slate-200 relative flex flex-col">
            <div className="mb-8">
              <h3 className="text-3xl font-black tracking-tight mb-2">Ready to grow?</h3>
              <p className="text-slate-500 font-medium text-base">Sit tight—our team will reach out within 24 hours.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {formData.package && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 bg-pink-50 border border-pink-100 rounded-2xl flex items-center justify-between group shadow-sm shadow-pink-500/5"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-pink-500/20">
                      <Icons.Zap size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-pink-500 mb-1.5">Selected Package</p>
                      <p className="text-base font-black text-slate-900 leading-none">{formData.package}</p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, package: '' }))}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-pink-500 hover:bg-white transition-all focus:outline-none"
                  >
                    <Icons.X size={18} />
                  </button>
                </motion.div>
              )}

              {/* Group: Essential Info */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label htmlFor="contact-name" className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Full Name</label>
                    <input
                      id="contact-name"
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 text-sm outline-none focus:bg-white focus:border-pink-500/30 focus:shadow-xl focus:shadow-pink-500/5 transition-all text-slate-900 placeholder:text-slate-300"
                      placeholder="John Smith"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="contact-email" className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Work Email</label>
                    <input
                      id="contact-email"
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 text-sm outline-none focus:bg-white focus:border-pink-500/30 focus:shadow-xl focus:shadow-pink-500/5 transition-all text-slate-900 placeholder:text-slate-300"
                      placeholder="john@company.co.uk"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label htmlFor="contact-company" className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Company Name</label>
                    <input
                      id="contact-company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 text-sm outline-none focus:bg-white focus:border-pink-500/30 focus:shadow-xl focus:shadow-pink-500/5 transition-all text-slate-900 placeholder:text-slate-300"
                      placeholder="Acme Corp"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="contact-phone" className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Phone Number</label>
                    <input
                      id="contact-phone"
                      required
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 text-sm outline-none focus:bg-white focus:border-pink-500/30 focus:shadow-xl focus:shadow-pink-500/5 transition-all text-slate-900 placeholder:text-slate-300"
                      placeholder="+44 7000 000000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="contact-website" className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Website URL</label>
                  <input
                    id="contact-website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 text-sm outline-none focus:bg-white focus:border-pink-500/30 focus:shadow-xl focus:shadow-pink-500/5 transition-all text-slate-900 placeholder:text-slate-300"
                    placeholder="https://acme.com"
                  />
                </div>
              </div>

              {/* Group: Project Details */}
              <div className="space-y-6 pt-2">
                <div className="space-y-2">
                  <label htmlFor="contact-goal" className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">What's your primary goal?</label>
                  <div className="relative">
                    <select 
                      id="contact-goal"
                      name="goal"
                      value={formData.goal}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 text-sm outline-none appearance-none text-slate-900 focus:bg-white focus:border-pink-500/30 transition-all cursor-pointer"
                    >
                      <option value="Increase ROI (Paid Social/PPC)">Increase ROI (Paid Social/PPC)</option>
                      <option value="Search Visibility (SEO)">Search Visibility (SEO)</option>
                      <option value="Creative Content Production">Creative Content Production</option>
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                      <Icons.ChevronDown size={18} />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="contact-message" className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Message (Optional)</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={3}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 text-sm outline-none focus:bg-white focus:border-pink-500/30 focus:shadow-xl focus:shadow-pink-500/5 transition-all text-slate-900 placeholder:text-slate-300 resize-none"
                    placeholder="Briefly describe your current blockers..."
                  />
                </div>
              </div>

              {/* Group: Budget */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Monthly Ad Spend Budget</label>
                <div className="grid grid-cols-3 gap-3">
                  {budgets.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, budget: b }))}
                      className={`py-3.5 rounded-xl text-xs font-bold uppercase transition-all duration-300 ${
                        formData.budget === b 
                          ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/25 -translate-y-0.5' 
                          : 'bg-slate-50 border border-slate-100 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                {error && (
                  <p className="text-red-500 text-xs font-bold mb-4 text-center">{error}</p>
                )}
                <button
                  disabled={isSubmitting}
                  className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest active:scale-[0.98] transition-all flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed ${
                    selectedPackage 
                      ? 'bg-pink-500 text-white shadow-xl shadow-pink-500/30' 
                      : 'bg-slate-900 text-white hover:bg-black hover:shadow-xl hover:shadow-black/10'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Icons.Loader2 className="animate-spin" size={18} />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>{selectedPackage ? `Claim ${selectedPackage} Package` : 'Send Proposal Request'}</span>
                      <motion.div
                        animate={selectedPackage ? { scale: [1, 1.2, 1] } : { x: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: selectedPackage ? 0.6 : 1.5 }}
                      >
                        <Icons.ArrowRight size={18} />
                      </motion.div>
                    </>
                  )}
                </button>
              </div>
            </form>

            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 bg-surface/90 backdrop-blur-md rounded-[40px] z-20"
              >
                <div className="bg-primary/20 p-4 rounded-full mb-6">
                  <Icons.CheckCircle2 className="text-primary" size={48} />
                </div>
                <h3 className="font-display text-3xl font-bold mb-4">Request Received!</h3>
                <p className="text-on-surface-variant mb-4">
                  We'll review your website and reach out within 24 hours.
                </p>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="text-primary font-bold text-sm underline underline-offset-4"
                >
                  Send another request
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
