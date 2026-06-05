import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, X, Loader2, KeyRound, ArrowLeft, Shield, CheckCircle2, User as UserIcon, Building, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { z } from 'zod';

// Zod Validation Schema for Registration
const registerSchema = z.object({
  fullName: z.string().trim().min(2, 'Full Name must be at least 2 characters'),
  companyName: z.string().trim().min(1, 'Company Name is required'),
  email: z
    .string()
    .trim()
    .email('Invalid email address')
    .refine((val) => {
      // Robust corporate domain verification
      const genericDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'live.com', 'msn.com', 'aol.com', 'icloud.com', 'mail.ru', 'yandex.ru', 'zoho.com', 'protonmail.com', 'proton.me'];
      const domain = val.split('@')[1]?.toLowerCase();
      return domain ? !genericDomains.includes(domain) : true;
    }, {
      message: 'Please use a valid company email address (no generic @gmail, @yahoo, etc.).',
    }),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  phone: z.string().optional()
});

export default function AuthModal() {
  const { 
    isAuthModalOpen, 
    setAuthModalOpen, 
    triggerGoogleLogin, 
    triggerEmailLogin, 
    triggerEmailRegister,
    createProfile
  } = useAuth();

  const [mode, setMode] = useState<'select' | 'signin' | 'register'>('select');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    setAuthModalOpen(false);
    // Reset state
    setMode('select');
    setEmail('');
    setPassword('');
    setFullName('');
    setCompanyName('');
    setPhone('');
    setError('');
    setLoading(false);
  };

  const executeGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await triggerGoogleLogin();
      handleClose();
    } catch (err: any) {
      setError(err?.message || 'Failed log in via Google Account');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'signin') {
      if (!email || !password) {
        setError('Please fill in both email and password.');
        return;
      }
    } else {
      // Validate with Zod
      const validationResult = registerSchema.safeParse({
        fullName,
        companyName,
        email,
        password,
        phone: phone || undefined
      });

      if (!validationResult.success) {
        // Find the first error message to display
        const firstMessage = validationResult.error.issues[0]?.message || 'Invalid registration details';
        setError(firstMessage);
        return;
      }
    }

    setLoading(true);

    try {
      if (mode === 'signin') {
        await triggerEmailLogin(email, password);
      } else {
        // Register in Firebase Auth first
        await triggerEmailRegister(email, password);
        // Create matching UserProfile instantly to lock in details
        await createProfile({
          name: fullName,
          company: companyName,
          phone: phone || '',
          website: '',
          goal: 'Increase ROI (Paid Social/PPC)',
          selectedPackage: 'Starter Growth'
        });
      }
      handleClose();
    } catch (err: any) {
      setError(err?.message || 'Authentication error. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-slate-900 border border-slate-800/80 w-full max-w-md rounded-3xl p-8 relative shadow-2xl overflow-hidden"
        >
          {/* Ambient Purple/Pink glow at the top of the modal */}
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-cyan-400 via-indigo-500 to-pink-500" />
          
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800/50 rounded-full"
          >
            <X size={20} />
          </button>

          {/* Heading */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2.5">
              <Shield size={16} className="text-pink-500" />
              <span className="text-xs font-bold uppercase tracking-widest text-pink-500">Secure Access Portal</span>
            </div>
            
            {mode === 'select' ? (
              <>
                <h3 className="text-2xl font-display font-extrabold text-white leading-tight">Access Prompt Flow</h3>
                <p className="text-slate-400 mt-2 text-sm leading-relaxed">
                  Authenticate securely to configure your corporate systems and view live leads.
                </p>
              </>
            ) : mode === 'signin' ? (
              <>
                <h3 className="text-2xl font-display font-extrabold text-white flex items-center gap-2.5 leading-tight">
                  <button onClick={() => setMode('select')} className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-800/50 rounded-lg">
                    <ArrowLeft size={20} />
                  </button>
                  Sign In to Account
                </h3>
                <p className="text-slate-400 mt-2 text-sm leading-relaxed">
                  Connect using your custom corporate email and password.
                </p>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-display font-extrabold text-white flex items-center gap-2.5 leading-tight">
                  <button onClick={() => setMode('select')} className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-800/50 rounded-lg">
                    <ArrowLeft size={20} />
                  </button>
                  First-Time Sign Up
                </h3>
                <p className="text-slate-400 mt-2 text-sm leading-relaxed">
                  Setup your customized secure credentials and workspace metadata in seconds.
                </p>
              </>
            )}
          </div>

          {/* Error Banner with helpful troubleshooting */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-medium leading-relaxed">
              <p>{error}</p>
            </div>
          )}

          {/* Render Active View */}
          {mode === 'select' ? (
            /* SELECTOR VIEW */
            <div className="space-y-4">
              {/* Option 1: Gmail / Google */}
              <button
                onClick={executeGoogleLogin}
                disabled={loading}
                className="w-full bg-slate-950/60 hover:bg-slate-950 border border-slate-800 hover:border-slate-700/80 p-5 rounded-2xl text-left flex items-center justify-between group transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center font-black text-sm group-hover:scale-105 transition-all">G</span>
                  <div>
                    <p className="text-slate-200 capitalize font-bold text-sm">Gmail / Google Account</p>
                  </div>
                </div>
                {loading ? <Loader2 className="w-5 h-5 animate-spin text-slate-500" /> : <span className="text-pink-500/50 group-hover:text-pink-400 group-hover:translate-x-1 transition-all">→</span>}
              </button>

              {/* Option 2: First Time Registering (Sign Up / Register) */}
              <button
                onClick={() => { setMode('register'); setError(''); }}
                disabled={loading}
                className="w-full bg-slate-950/60 hover:bg-slate-950 border border-slate-800 hover:border-slate-700/80 p-5 rounded-2xl text-left flex items-center justify-between group transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center group-hover:scale-105 transition-all">
                    <UserIcon size={16} />
                  </span>
                  <div>
                    <p className="text-slate-200 capitalize font-bold text-sm">First Time? (Create Account)</p>
                  </div>
                </div>
                <span className="text-pink-500/50 group-hover:text-pink-400 group-hover:translate-x-1 transition-all">→</span>
              </button>

              {/* Option 3: Already Registered (Sign In) */}
              <button
                onClick={() => { setMode('signin'); setError(''); }}
                disabled={loading}
                className="w-full bg-slate-950/60 hover:bg-slate-950 border border-slate-800 hover:border-slate-700/80 p-5 rounded-2xl text-left flex items-center justify-between group transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-all">
                    <Mail size={16} />
                  </span>
                  <div>
                    <p className="text-slate-200 capitalize font-bold text-sm">Already Registered? (Sign In)</p>
                  </div>
                </div>
                <span className="text-pink-500/50 group-hover:text-pink-400 group-hover:translate-x-1 transition-all">→</span>
              </button>
            </div>
          ) : (
            /* EMAIL FORM VIEW (SIGN IN / REGISTER) */
            <form onSubmit={handleEmailSubmit} className="space-y-5">
              {mode === 'register' && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Full Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-4 top-3.5 h-4 text-slate-600" size={16} />
                      <input
                        required
                        disabled={loading}
                        type="text"
                        placeholder="John Doe"
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white outline-none focus:border-pink-500 transition-all font-sans"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Company Name</label>
                    <div className="relative">
                      <Building className="absolute left-4 top-3.5 h-4 text-slate-600" size={16} />
                      <input
                        required
                        disabled={loading}
                        type="text"
                        placeholder="Acme Corporation"
                        value={companyName}
                        onChange={e => setCompanyName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white outline-none focus:border-pink-500 transition-all font-sans"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Phone Number (Optional)</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-3.5 h-4 text-slate-600" size={16} />
                      <input
                        disabled={loading}
                        type="tel"
                        placeholder="+44 7123 456789"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white outline-none focus:border-pink-500 transition-all font-sans"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Work Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 h-4 text-slate-600" size={16} />
                  <input
                    required
                    disabled={loading}
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white outline-none focus:border-pink-500 transition-all font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Secure Password</label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-3.5 h-4 text-slate-600" size={16} />
                  <input
                    required
                    disabled={loading}
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white outline-none focus:border-pink-500 transition-all font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 rounded-xl text-sm uppercase tracking-wide transition-all mt-6 flex items-center justify-center gap-2 shadow-lg shadow-pink-500/15 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Executing Secure Sync...
                  </>
                ) : mode === 'signin' ? (
                  'Sign In with Company Email'
                ) : (
                  'Confirm & Register Credentials'
                )}
              </button>

              <div className="pt-4 text-center border-t border-slate-800/40 mt-4">
                {mode === 'signin' ? (
                  <p className="text-slate-400 text-sm">
                    Don't have a customized corporate account yet?{' '}
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => { setMode('register'); setError(''); }}
                      className="text-pink-400 hover:underline font-bold"
                    >
                      Register Now
                    </button>
                  </p>
                ) : (
                  <p className="text-slate-400 text-sm">
                    Already configured your custom enterprise login?{' '}
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => { setMode('signin'); setError(''); }}
                      className="text-pink-400 hover:underline font-bold"
                    >
                      Sign In
                    </button>
                  </p>
                )}
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
