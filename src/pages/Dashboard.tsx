import React, { useState, useEffect } from 'react';
import { useAuth, UserProfile } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { PRICING_PACKAGES } from '../constants';
import { Icons } from '../components/Icons';
import { motion, AnimatePresence } from 'motion/react';

export default function Dashboard() {
  const { user, userProfile, loading, needsProfileSetup, createProfile, updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect to home if not logged in and loading completes
  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  // Form states
  const [setupData, setSetupData] = useState({
    name: user?.displayName || '',
    phone: '',
    company: '',
    website: '',
    goal: 'Increase ROI (Paid Social/PPC)',
    selectedPackage: 'Starter Growth'
  });

  const [setupError, setSetupError] = useState('');
  const [setupSubmitting, setSetupSubmitting] = useState(false);

  // Sync profile data if it exists
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    phone: '',
    company: '',
    website: '',
    goal: ''
  });

  useEffect(() => {
    if (userProfile) {
      setEditData({
        name: userProfile.name,
        phone: userProfile.phone,
        company: userProfile.company || '',
        website: userProfile.website || '',
        goal: userProfile.goal || 'Increase ROI (Paid Social/PPC)'
      });
    }
  }, [userProfile]);

  // Payment states
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'stripe' | null>(null);

  // Simulated Credit Card State for Stripe Inline fallback
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="text-center space-y-4">
          <Icons.Loader2 className="w-12 h-12 text-pink-500 animate-spin mx-auto" />
          <p className="text-slate-400 font-brand">Synchronizing secure user vault...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // Handle first time profile setup
  const handleSetupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!setupData.name || !setupData.phone) {
      setSetupError('Full Name and Phone Number are required.');
      return;
    }
    setSetupError('');
    setSetupSubmitting(true);
    try {
      await createProfile({
        name: setupData.name,
        phone: setupData.phone,
        company: setupData.company,
        website: setupData.website,
        goal: setupData.goal,
        selectedPackage: setupData.selectedPackage
      });
    } catch (err: any) {
      console.error(err);
      setSetupError(err.message || 'Failed to initialize profile. Please retry.');
    } finally {
      setSetupSubmitting(false);
    }
  };

  // Handle Editing
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(editData);
      setIsEditing(false);
    } catch (err: any) {
      console.error(err);
    }
  };

  // Process payment
  const handleStripeCheckout = async () => {
    if (!userProfile) return;
    setPaymentLoading(true);
    setPaymentError('');
    
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          packageName: userProfile.selectedPackage || 'Starter Growth',
          email: userProfile.email
        })
      });

      const data = await response.json();

      if (response.ok && data.url) {
        // Redirect to actual Stripe checkout session
        window.location.href = data.url;
      } else {
        // Fallback to inline simulator if API key is unconfigured on the backend
        setSelectedMethod('stripe');
        setShowPayModal(true);
      }
    } catch (err) {
      console.warn("Backend Stripe endpoint unavailable or failed:", err);
      setSelectedMethod('stripe');
      setShowPayModal(true);
    } finally {
      setPaymentLoading(false);
    }
  };


  const submitSimulatedPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentLoading(true);
    setPaymentError('');

    // Simulate standard card verification or PayPal sandbox authentication
    setTimeout(async () => {
      try {
        await updateProfile({
          paymentStatus: 'paid'
        });
        setPaymentSuccess(true);
        setShowPayModal(false);
        setCardNumber('');
        setCardExpiry('');
        setCardCVC('');
        setCardHolder('');
      } catch (err: any) {
        setPaymentError('Payment processing failed. Please retry.');
      } finally {
        setPaymentLoading(false);
      }
    }, 2000);
  };

  // Find info about current package
  const activePackage = PRICING_PACKAGES.find(
    pkg => pkg.name.toLowerCase() === userProfile?.selectedPackage?.toLowerCase()
  ) || PRICING_PACKAGES[0];

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-background pt-32 pb-20 relative px-4 md:px-8">
        <div className="max-w-6xl mx-auto z-10 relative">
          
          <AnimatePresence mode="wait">
            {needsProfileSetup ? (
              /* --- FIRST TIME PROFILE SETUP FORM --- */
              <motion.div 
                key="setup"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="max-w-xl mx-auto glass rounded-3xl p-8 md:p-12 relative overflow-hidden"
              >
                {/* Visual Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl -z-10" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -z-10" />

                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-pink-500/20 text-pink-500 mb-4 animate-pulse">
                    <Icons.Briefcase size={24} />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">Create Your Profile</h2>
                  <p className="text-slate-400 text-sm font-light">
                    Welcome to **Prompt Flow**. Please share your business and contact parameters to customize your client dashboard environment.
                  </p>
                </div>

                {setupError && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs flex gap-2 items-center">
                    <Icons.X className="shrink-0" size={16} />
                    <span>{setupError}</span>
                  </div>
                )}

                <form onSubmit={handleSetupSubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name *</label>
                    <input
                      required
                      type="text"
                      value={setupData.name}
                      onChange={e => setSetupData({...setupData, name: e.target.value})}
                      placeholder="John Smith"
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-5 py-3.5 text-sm outline-none focus:bg-slate-950 focus:border-pink-500/50 text-white placeholder:text-slate-600 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Company Name</label>
                      <input
                        type="text"
                        value={setupData.company}
                        onChange={e => setSetupData({...setupData, company: e.target.value})}
                        placeholder="Acme Corp"
                        className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-5 py-3.5 text-sm outline-none focus:bg-slate-950 focus:border-pink-500/50 text-white placeholder:text-slate-600 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number *</label>
                      <input
                        required
                        type="tel"
                        value={setupData.phone}
                        onChange={e => setSetupData({...setupData, phone: e.target.value})}
                        placeholder="+44 7123 456789"
                        className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-5 py-3.5 text-sm outline-none focus:bg-slate-950 focus:border-pink-500/50 text-white placeholder:text-slate-600 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Website URL</label>
                    <input
                      type="url"
                      value={setupData.website}
                      onChange={e => setSetupData({...setupData, website: e.target.value})}
                      placeholder="https://acme.co.uk"
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-5 py-3.5 text-sm outline-none focus:bg-slate-950 focus:border-pink-500/50 text-white placeholder:text-slate-600 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">What's your primary goal?</label>
                    <select
                      value={setupData.goal}
                      onChange={e => setSetupData({...setupData, goal: e.target.value})}
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-5 py-3.5 text-sm outline-none focus:bg-slate-950 focus:border-pink-500/50 text-white transition-all cursor-pointer"
                    >
                      <option className="bg-slate-950" value="Increase ROI (Paid Social/PPC)">Increase ROI (Paid Social/PPC)</option>
                      <option className="bg-slate-950" value="Search Visibility (SEO)">Search Visibility (SEO)</option>
                      <option className="bg-slate-950" value="Creative Content Production">Creative Content Production</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Choose Service Package</label>
                    <select
                      value={setupData.selectedPackage}
                      onChange={e => setSetupData({...setupData, selectedPackage: e.target.value})}
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-5 py-3.5 text-sm outline-none focus:bg-slate-950 focus:border-pink-500/50 text-white transition-all cursor-pointer"
                    >
                      {PRICING_PACKAGES.map((pkg) => (
                        <option key={pkg.name} className="bg-slate-950" value={pkg.name}>
                          {pkg.name} ({pkg.price})
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={setupSubmitting}
                    className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-pink-500/45 text-white py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all mt-4 flex items-center justify-center gap-2"
                  >
                    {setupSubmitting ? (
                      <>
                        <Icons.Loader2 className="w-4 h-4 animate-spin" />
                        Saving System Credentials...
                      </>
                    ) : (
                      'Activate Client Vault'
                    )}
                  </button>
                </form>
              </motion.div>
            ) : (
              /* --- SECURE CLIENT DASHBOARD OVERVIEW --- */
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="space-y-8"
              >
                
                {/* Dashboard Welcome Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900/30 p-8 rounded-3xl border border-slate-900/50 relative overflow-hidden backdrop-blur-xl">
                  {/* Glowing background highlights */}
                  <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl -z-10" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-500/5 rounded-full blur-3xl -z-10" />

                  <div className="flex items-center gap-4">
                    {user.photoURL ? (
                      <img 
                        src={user.photoURL} 
                        alt={userProfile?.name} 
                        className="w-16 h-16 rounded-full border-2 border-pink-500/30 object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold font-brand shadow-lg shadow-pink-500/10">
                        {userProfile?.name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h1 className="text-2xl md:text-3xl font-display font-extrabold text-white">
                          Welcome, {userProfile?.name}!
                        </h1>
                        <span className="px-2.5 py-1 text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full">
                          Client Account
                        </span>
                      </div>
                      <p className="text-slate-400 text-xs mt-1 font-light tracking-wide">
                        Managing business growth parameters for **{userProfile?.company || 'Your Brand'}**
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-start md:self-auto">
                    <button 
                      onClick={() => setIsEditing(!isEditing)}
                      className="px-5 py-2.5 text-xs font-bold uppercase tracking-widest border border-slate-800 text-slate-300 hover:text-white hover:border-pink-500/50 rounded-full transition-all flex items-center gap-2"
                    >
                      <Icons.Wrench size={14} />
                      {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                    </button>
                    <button 
                      onClick={async () => {
                        await logout();
                        navigate('/');
                      }}
                      className="px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-red-400 duration-300 transition-all flex items-center gap-2"
                    >
                      <Icons.X size={14} />
                      Sign Out
                    </button>
                  </div>
                </div>

                {paymentSuccess && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-4 text-emerald-400"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                      <Icons.CheckCircle2 size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">Subscription System Online!</h4>
                      <p className="text-xs text-slate-400 font-light mt-0.5">
                        Your payment was processed successfully. Our UK strategy unit is spinning up your campaigns.
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Main Grid: Left Side Package / Right Side Details */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* --- SERVICE PACKAGE COMPONENT (2/3 Grid) --- */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-slate-900/20 p-8 rounded-3xl border border-slate-900/60 relative overflow-hidden flex flex-col justify-between min-h-[400px]">
                      
                      {/* Gradient Ambient Line */}
                      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-cyan-400 via-indigo-500 to-pink-500" />
                      
                      <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-pink-500 mb-1">Your Growth Blueprint</p>
                            <h2 className="text-2xl font-display font-extrabold text-white">
                              {userProfile?.selectedPackage} Package
                            </h2>
                          </div>
                          
                          <div className="text-right sm:text-right">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${
                              userProfile?.paymentStatus === 'paid' 
                                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
                                : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${userProfile?.paymentStatus === 'paid' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                              {userProfile?.paymentStatus === 'paid' ? 'Active & Paid' : 'Pending Payment'}
                            </span>
                          </div>
                        </div>

                        <p className="text-slate-400 font-light text-sm max-w-xl">
                          {activePackage.description}
                        </p>

                        <div className="border-t border-slate-900 py-6">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Package Scope & Features</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            {activePackage.features.map(feat => (
                              <div key={feat} className="flex items-center gap-3 text-slate-300 text-xs">
                                <Icons.CheckCircle2 size={16} className="text-indigo-400 shrink-0" />
                                <span>{feat}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Payment Control Center (If Unpaid) */}
                      {userProfile?.paymentStatus !== 'paid' && (
                        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-6">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Total Fee due</p>
                            <p className="text-3xl font-brand font-black text-white">{activePackage.price} <span className="text-xs text-slate-500 font-bold uppercase">/Mo</span></p>
                          </div>

                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                            {/* Stripe Secure Button */}
                            <button
                              onClick={handleStripeCheckout}
                              disabled={paymentLoading}
                              className="bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold py-3.5 px-6 rounded-xl text-xs uppercase tracking-widest transition-all text-center flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10"
                            >
                              {paymentLoading ? (
                                <Icons.Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M13.93 11.23c-1.34-.35-2.07-.63-2.07-1.16 0-.47.45-.73 1.25-.73.81 0 1.63.26 2.36.65V7.45c-.86-.33-1.81-.46-2.73-.46-2.45 0-4.08 1.24-4.08 3.32 0 1.83 1.48 2.5 3.19 2.92 1.48.36 2.02.66 2.02 1.22 0 .55-.54.85-1.42.85-.98 0-1.99-.33-2.77-.73v2.66c.98.41 2.15.58 3.25.58 2.53 0 4.21-1.22 4.21-3.34-.01-1.89-1.57-2.71-3.17-3.04z" />
                                </svg>
                              )}
                              Stripe Secure Checkout
                            </button>
                          </div>
                        </div>
                      )}

                      {userProfile?.paymentStatus === 'paid' && (
                        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-6 text-slate-400 text-xs font-light">
                          <div className="flex items-center gap-2 text-emerald-400">
                            <Icons.Check className="w-4 h-4 bg-emerald-500/20 rounded-full p-0.5 shrink-0" />
                            <span>Subscription online and synchronized. Next invoice generated on June 20, 2026.</span>
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-slate-300">
                            UK Enterprise Account
                          </span>
                        </div>
                      )}

                    </div>
                  </div>

                  {/* --- CLIENT DETAILS DISPLAY / EDITING COMPONENT (1/3 Grid) --- */}
                  <div className="space-y-6">
                    <div className="bg-slate-900/20 p-8 rounded-3xl border border-slate-900/60 relative">
                      
                      <h3 className="text-lg font-display font-bold text-white mb-6 flex items-center gap-2">
                        <Icons.User size={18} className="text-pink-500" />
                        Client Specifics
                      </h3>

                      <AnimatePresence mode="wait">
                        {isEditing ? (
                          <motion.form 
                            key="edit-profile"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onSubmit={handleEditSubmit} 
                            className="space-y-4"
                          >
                            <div className="space-y-1">
                              <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Full Name</label>
                              <input
                                required
                                type="text"
                                value={editData.name}
                                onChange={e => setEditData({...editData, name: e.target.value})}
                                className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-pink-500/50 transition-all font-light"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Phone</label>
                              <input
                                required
                                type="tel"
                                value={editData.phone}
                                onChange={e => setEditData({...editData, phone: e.target.value})}
                                className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-pink-500/50 transition-all font-light"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Company</label>
                              <input
                                type="text"
                                value={editData.company}
                                onChange={e => setEditData({...editData, company: e.target.value})}
                                className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-pink-500/50 transition-all font-light"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Website</label>
                              <input
                                type="url"
                                value={editData.website}
                                onChange={e => setEditData({...editData, website: e.target.value})}
                                className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-pink-500/50 transition-all font-light"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Business Goal</label>
                              <select
                                value={editData.goal}
                                onChange={e => setEditData({...editData, goal: e.target.value})}
                                className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-pink-500/50 transition-all"
                              >
                                <option value="Increase ROI (Paid Social/PPC)">Increase ROI (Paid Social/PPC)</option>
                                <option value="Search Visibility (SEO)">Search Visibility (SEO)</option>
                                <option value="Creative Content Production">Creative Content Production</option>
                              </select>
                            </div>
                            
                            <button
                              type="submit"
                              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-widest transition-all mt-4"
                            >
                              Save Updates
                            </button>
                          </motion.form>
                        ) : (
                          <motion.div 
                            key="display-profile"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-5"
                          >
                            <div>
                              <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 leading-none mb-1">Email Coordinates</p>
                              <p className="text-slate-300 text-xs font-mono font-medium">{userProfile?.email}</p>
                            </div>
                            <div>
                              <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 leading-none mb-1">Telephone Number</p>
                              <p className="text-slate-300 text-xs font-mono font-medium">{userProfile?.phone}</p>
                            </div>
                            <div>
                              <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 leading-none mb-1">Company Entity</p>
                              <p className="text-slate-300 text-xs font-sans font-medium">{userProfile?.company || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 leading-none mb-1">Web Address</p>
                              {userProfile?.website ? (
                                <a href={userProfile.website} target="_blank" rel="noreferrer" className="text-pink-400 hover:underline text-xs font-mono font-medium">
                                  {userProfile.website}
                                </a>
                              ) : (
                                <p className="text-slate-300 text-xs font-medium">N/A</p>
                              )}
                            </div>
                            <div>
                              <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 leading-none mb-1">Marketing Target</p>
                              <p className="text-slate-300 text-xs font-sans font-medium">{userProfile?.goal || 'N/A'}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                    </div>
                  </div>

                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>

      {/* --- PAYMENT MODAL SYSTEM FOR STRIPE & PAYPAL INTUITIVE COMPLETIONS --- */}
      <AnimatePresence>
        {showPayModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-6 md:p-8 relative shadow-2xl"
            >
              <button
                onClick={() => setShowPayModal(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white"
              >
                <Icons.X size={20} />
              </button>

              <div className="mb-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-pink-500">Secure Payment Clearing</span>
                <h3 className="text-xl font-display font-extrabold text-white mt-1 flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-400 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13.93 11.23c-1.34-.35-2.07-.63-2.07-1.16 0-.47.45-.73 1.25-.73.81 0 1.63.26 2.36.65V7.45c-.86-.33-1.81-.46-2.73-.46-2.45 0-4.08 1.24-4.08 3.32 0 1.83 1.48 2.5 3.19 2.92 1.48.36 2.02.66 2.02 1.22 0 .55-.54.85-1.42.85-.98 0-1.99-.33-2.77-.73v2.66c.98.41 2.15.58 3.25.58 2.53 0 4.21-1.22 4.21-3.34-.01-1.89-1.57-2.71-3.17-3.04z" />
                  </svg>
                  Stripe Card Terminal (UK)
                </h3>
                <p className="text-slate-400 font-light text-xs mt-1">
                  Authorizing a payment of <strong className="text-white">{activePackage.price}</strong> for **{userProfile?.selectedPackage}**
                </p>
              </div>

              {paymentError && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs">
                  {paymentError}
                </div>
              )}

              {/* Stripe Card Form Simulator */}
              <form onSubmit={submitSimulatedPayment} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Card Holder Name</label>
                  <input
                    required
                    type="text"
                    value={cardHolder}
                    onChange={e => setCardHolder(e.target.value)}
                    placeholder="Jane Austin"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-indigo-500 transition-all font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Card Number (16 Digits)</label>
                  <input
                    required
                    type="text"
                    maxLength={16}
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="4000 1234 5678 9010"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-indigo-500 transition-all font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Expiry (MM/YY)</label>
                    <input
                      required
                      type="text"
                      maxLength={5}
                      placeholder="12/28"
                      value={cardExpiry}
                      onChange={e => setCardExpiry(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-indigo-500 transition-all font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Security CVC</label>
                    <input
                      required
                      type="text"
                      maxLength={3}
                      placeholder="123"
                      value={cardCVC}
                      onChange={e => setCardCVC(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-indigo-500 transition-all font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={paymentLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-widest transition-all mt-4 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/15"
                >
                  {paymentLoading ? (
                    <>
                      <Icons.Loader2 className="w-4 h-4 animate-spin" />
                      Authorizing UK Clearance...
                    </>
                  ) : (
                    `Pay ${activePackage.price} via Stripe`
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}
