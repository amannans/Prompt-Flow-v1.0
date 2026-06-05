import React, { useState, useEffect } from 'react';
import { useAuth, UserProfile } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Icons } from '../components/Icons';
import { 
  collection, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminDashboard() {
  const { user, isAdmin, loading, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect to home if not admin
  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/');
    }
  }, [user, isAdmin, loading, navigate]);

  const [clients, setClients] = useState<UserProfile[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPackage, setFilterPackage] = useState('All');
  const [filterPayment, setFilterPayment] = useState('All');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'leads' | 'directory'>('leads');

  // Selected client for deep view/modal
  const [activeClient, setActiveClient] = useState<UserProfile | null>(null);

  // Date formatting helper for Leads
  const formatLeadDate = (createdAt: any) => {
    if (!createdAt) return 'Recent';
    try {
      const date = typeof createdAt.toDate === 'function' ? createdAt.toDate() : new Date(createdAt);
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return 'Recent';
    }
  };

  // Fetch client profiles in real-time
  useEffect(() => {
    if (!user || !isAdmin) return;

    setLoadingClients(true);
    const clientsRef = collection(db, 'users');
    const q = query(clientsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const clientList: UserProfile[] = [];
      snapshot.forEach((doc) => {
        clientList.push(doc.data() as UserProfile);
      });
      setClients(clientList);
      setLoadingClients(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'users');
      setLoadingClients(false);
    });

    return () => unsubscribe();
  }, [user, isAdmin]);

  if (loading || (!loading && (!user || !isAdmin))) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="text-center space-y-4">
          <Icons.Loader2 className="w-12 h-12 text-pink-500 animate-spin mx-auto" />
          <p className="text-slate-400 font-brand">Verifying system access keys...</p>
        </div>
      </div>
    );
  }

  // Update payment status for a user
  const togglePaymentStatus = async (uid: string, currentStatus: 'unpaid' | 'paid') => {
    setActionLoading(uid);
    try {
      const nextStatus = currentStatus === 'paid' ? 'unpaid' : 'paid';
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        paymentStatus: nextStatus,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${uid}`);
    } finally {
      setActionLoading(null);
    }
  };

  // Delete profile
  const handleDeleteClient = async (uid: string) => {
    if (!window.confirm("Are you sure you want to hard delete this client profile from your systems?")) return;
    setActionLoading(uid);
    try {
      await deleteDoc(doc(db, 'users', uid));
      if (activeClient?.uid === uid) setActiveClient(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `users/${uid}`);
    } finally {
      setActionLoading(null);
    }
  };

  // Filter clients
  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.company && client.company.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesPackage = filterPackage === 'All' || client.selectedPackage === filterPackage;
    const matchesPayment = filterPayment === 'All' || client.paymentStatus === filterPayment;

    return matchesSearch && matchesPackage && matchesPayment;
  });

  // Calculate metrics
  const totalClients = clients.length;
  const paidClientsCount = clients.filter(c => c.paymentStatus === 'paid').length;
  const unpaidClientsCount = totalClients - paidClientsCount;

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-background pt-32 pb-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="bg-slate-900/30 border border-slate-900/50 rounded-3xl p-8 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl -z-10" />

            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-display font-extrabold text-white">
                  System Command Console
                </h1>
                <span className="px-3 py-1 text-[9px] font-black uppercase tracking-widest bg-pink-500/10 border border-pink-500/30 text-pink-400 rounded-full">
                  Admin Active
                </span>
              </div>
              <p className="text-slate-400 text-xs mt-1.5 font-light">
                Monitoring client states, active growth plans, and financial clearance securely.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block leading-none mb-1">Signed In Administrator</span>
                <span className="text-xs font-mono font-medium text-slate-300">{user.email}</span>
              </div>
              <button 
                onClick={async () => {
                  await logout();
                  navigate('/');
                }}
                className="bg-slate-900 hover:bg-slate-950 border border-slate-800 text-slate-300 hover:text-red-400 duration-300 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-slate-900/20 border border-slate-900/50 p-6 rounded-2xl relative overflow-hidden">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 leading-none mb-2">Total Managed Accounts</p>
              <p className="text-4xl font-brand font-black text-white">{totalClients}</p>
            </div>
            <div className="bg-slate-900/20 border border-slate-900/50 p-6 rounded-2xl relative overflow-hidden">
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500/75 leading-none mb-2">Active & Paid Systems</p>
              <p className="text-4xl font-brand font-black text-emerald-400">{paidClientsCount}</p>
            </div>
            <div className="bg-slate-900/20 border border-slate-900/50 p-6 rounded-2xl relative overflow-hidden">
              <p className="text-[10px] font-black uppercase tracking-widest text-rose-500/75 leading-none mb-2">Awaiting Bank Settlement</p>
              <p className="text-4xl font-brand font-black text-rose-400">{unpaidClientsCount}</p>
            </div>
          </div>

          {/* Table Control Station */}
          <div className="bg-slate-900/20 border border-slate-900/50 rounded-3xl p-6 md:p-8 backdrop-blur-xl space-y-6">
            
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 border-b border-slate-800/60 pb-6">
              <div className="space-y-1">
                <h2 className="text-lg font-display font-bold text-white flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-pink-500/10 text-pink-500 border border-pink-500/20">
                    <Icons.Briefcase size={16} />
                  </span>
                  Command Operation Database
                </h2>
                <p className="text-xs text-slate-500 font-light">
                  Analyze complete lead acquisition funnels or manage system clearance.
                </p>
              </div>

              {/* Filters panel */}
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="text"
                  placeholder="Filter by name, email, company..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-600 outline-none w-full sm:w-60 focus:border-pink-500/50 transition-all font-light"
                />
                
                <select
                  value={filterPackage}
                  onChange={e => setFilterPackage(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-300 outline-none cursor-pointer focus:border-pink-500/50 transition-all"
                >
                  <option value="All">All Packages</option>
                  <option value="Starter Growth">Starter Growth</option>
                  <option value="Growth Pro">Growth Pro</option>
                  <option value="Lead Generation">Lead Generation</option>
                  <option value="Scale & Automate">Scale & Automate</option>
                  <option value="Enterprise">Enterprise</option>
                </select>

                <select
                  value={filterPayment}
                  onChange={e => setFilterPayment(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-300 outline-none cursor-pointer focus:border-pink-500/50 transition-all"
                >
                  <option value="All">All Payments</option>
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
                </select>
              </div>
            </div>

            {/* TAB SELECTOR BUTTONS */}
            <div className="flex border-b border-slate-800/60 pb-[2px] mb-4 gap-2">
              <button
                onClick={() => setActiveTab('leads')}
                className={`flex items-center gap-2 px-5 py-3 border-b-2 font-display text-xs font-bold uppercase tracking-wider transition-all relative ${
                  activeTab === 'leads'
                    ? 'border-pink-500 text-pink-400 font-black'
                    : 'border-transparent text-slate-500 hover:text-slate-300'
                }`}
              >
                <Icons.Target size={14} className={activeTab === 'leads' ? 'text-pink-400' : ''} />
                Admin Leads Table ({filteredClients.length})
              </button>
              <button
                onClick={() => setActiveTab('directory')}
                className={`flex items-center gap-2 px-5 py-3 border-b-2 font-display text-xs font-bold uppercase tracking-wider transition-all relative ${
                  activeTab === 'directory'
                    ? 'border-pink-500 text-pink-400 font-black'
                    : 'border-transparent text-slate-500 hover:text-slate-300'
                }`}
              >
                <Icons.Briefcase size={14} />
                System Directory ({filteredClients.length})
              </button>
            </div>

            {/* Clients List / Table */}
            {loadingClients ? (
              <div className="py-20 text-center space-y-3">
                <Icons.Loader2 className="w-8 h-8 text-pink-500 animate-spin mx-auto" />
                <p className="text-slate-500 text-xs">Awaiting client registries sync...</p>
              </div>
            ) : filteredClients.length === 0 ? (
              <div className="py-20 text-center text-slate-500 font-light text-xs">
                No matching client profiles identified.
              </div>
            ) : activeTab === 'leads' ? (
              /* --- ADMIN LEADS TABLE --- */
              <div className="overflow-x-auto rounded-xl border border-slate-900 bg-slate-950/25">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-900 bg-slate-950/45 text-[10px] font-black uppercase tracking-widest text-slate-500">
                      <th className="px-6 py-4">Lead / Signup Date</th>
                      <th className="px-6 py-4">Company Details</th>
                      <th className="px-6 py-4">Contact Info</th>
                      <th className="px-6 py-4">Growth Goal & Package</th>
                      <th className="px-6 py-4 text-center">Controls</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900 text-xs font-light text-slate-300">
                    {filteredClients.map((client) => (
                      <tr key={client.uid} className="hover:bg-slate-950/20 transition-all">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-white text-sm flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" />
                            {client.name}
                          </div>
                          <div className="text-[10px] text-slate-500 mt-1 font-mono">
                            {formatLeadDate(client.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-200">{client.company || 'Private Entity'}</div>
                          {client.website ? (
                            <a
                              href={client.website.startsWith('http') ? client.website : `https://${client.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-pink-400 hover:text-pink-300 font-mono text-[10px] flex items-center gap-1 mt-1 inline-flex"
                            >
                              <Icons.Globe size={11} />
                              {client.website.replace(/https?:\/\//, '')}
                            </a>
                          ) : (
                            <span className="text-slate-600 text-[10px] italic mt-1 block">No website provided</span>
                          )}
                        </td>
                        <td className="px-6 py-4 font-mono select-all space-y-1">
                          <div className="flex items-center gap-1.5 text-slate-300">
                            <Icons.Mail size={12} className="text-slate-500" />
                            {client.email}
                          </div>
                          {client.phone && (
                            <div className="text-slate-500 text-[10.5px] flow-root">
                              <span className="mr-1">📞</span>
                              {client.phone}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <span className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide bg-pink-500/10 border border-pink-500/20 text-pink-400 rounded-md">
                              {client.selectedPackage || 'Starter Growth'}
                            </span>
                          </div>
                          {client.goal ? (
                            <div className="text-slate-400 text-[11px] mt-1.5 font-light italic line-clamp-1 max-w-xs" title={client.goal}>
                              "{client.goal}"
                            </div>
                          ) : (
                            <span className="text-slate-600 text-[10px] italic mt-1 block">No goal specified</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <button
                              onClick={() => setActiveClient(client)}
                              className="p-1 px-3 text-[10px] font-black uppercase bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-md transition-all active:scale-95 text-slate-200"
                            >
                              Inspect Lead
                            </button>
                            <button
                              onClick={() => handleDeleteClient(client.uid)}
                              disabled={actionLoading === client.uid}
                              className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/5 rounded-md transition-all"
                              title="Delete Lead registration"
                            >
                              <Icons.X size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              /* --- SYSTEM DIRECTORY TABLE --- */
              <div className="overflow-x-auto rounded-xl border border-slate-900 bg-slate-950/25">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-900 bg-slate-950/45 text-[10px] font-black uppercase tracking-widest text-slate-500">
                      <th className="px-6 py-4">Client / Brand</th>
                      <th className="px-6 py-4">Contact</th>
                      <th className="px-6 py-4">Service Plan</th>
                      <th className="px-6 py-4">Financial Clearance</th>
                      <th className="px-6 py-4 text-center">Controls</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900 text-xs font-light text-slate-300">
                    {filteredClients.map((client) => (
                      <tr key={client.uid} className="hover:bg-slate-950/20 transition-all">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-white text-sm">{client.name}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">{client.company || 'Private Entity'}</div>
                        </td>
                        <td className="px-6 py-4 font-mono select-all">
                          <div>{client.email}</div>
                          <div className="text-slate-500 text-[10px] mt-0.5">{client.phone}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-md">
                            {client.selectedPackage || 'Starter Growth'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => togglePaymentStatus(client.uid, client.paymentStatus)}
                            disabled={actionLoading === client.uid}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-full transition-all active:scale-95 ${
                              client.paymentStatus === 'paid'
                                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                                : 'bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
                            }`}
                          >
                            <span className={`w-1 h-1 rounded-full ${client.paymentStatus === 'paid' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                            {client.paymentStatus === 'paid' ? 'Paid (System Live)' : 'Unpaid (Lockout)'}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <button
                              onClick={() => setActiveClient(client)}
                              className="p-1 px-3 text-[10px] font-black uppercase bg-slate-950 hover:bg-slate-900 text-slate-300 border border-slate-800 rounded-md transition-all active:scale-95"
                            >
                              Inspect Details
                            </button>
                            <button
                              onClick={() => handleDeleteClient(client.uid)}
                              disabled={actionLoading === client.uid}
                              className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/5 rounded-md transition-all"
                              title="Delete Client Data"
                            >
                              <Icons.X size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* --- DETAIL INSPECTOR MODAL --- */}
      <AnimatePresence>
        {activeClient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl p-6 md:p-8 relative shadow-2xl space-y-6 text-slate-300"
            >
              <button
                onClick={() => setActiveClient(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white"
              >
                <Icons.X size={20} />
              </button>

              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-pink-500">Client Deep Scan</span>
                <h3 className="text-xl font-display font-extrabold text-white mt-1">
                  {activeClient.name}
                </h3>
                <p className="text-xs text-slate-400 font-light mt-0.5">
                  Registration ID: <code className="text-pink-400 font-mono text-[10px] select-all">{activeClient.uid}</code>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-6">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 leading-none mb-1">Company</p>
                  <p className="text-white text-xs font-semibold">{activeClient.company || 'Private Entity'}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 leading-none mb-1">Goal Parameter</p>
                  <p className="text-white text-xs font-semibold">{activeClient.goal || 'N/A'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 leading-none mb-1">Email</p>
                  <p className="text-white text-xs font-mono select-all">{activeClient.email}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 leading-none mb-1">Telephone</p>
                  <p className="text-white text-xs font-mono select-all">{activeClient.phone}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 leading-none mb-1">Brand URL</p>
                  {activeClient.website ? (
                    <a href={activeClient.website} target="_blank" rel="noreferrer" className="text-pink-400 hover:underline text-xs font-mono select-all">
                      {activeClient.website}
                    </a>
                  ) : (
                    <p className="text-white text-xs">N/A</p>
                  )}
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 leading-none mb-1">Subscribed Package</p>
                  <p className="text-white text-xs font-bold">{activeClient.selectedPackage || 'Starter Growth'}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 leading-none mb-1">Financial Status</p>
                  <span className={`inline-block px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-full ${
                    activeClient.paymentStatus === 'paid' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                  }`}>
                    {activeClient.paymentStatus === 'paid' ? 'Clear & Settled' : 'Awaiting Payment'}
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-6 flex justify-end gap-3">
                <button
                  onClick={() => togglePaymentStatus(activeClient.uid, activeClient.paymentStatus)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-4 rounded-xl text-[10px] uppercase tracking-widest transition-all"
                >
                  Override Payment Clearance
                </button>
                <button
                  onClick={() => setActiveClient(null)}
                  className="bg-slate-950 border border-slate-800 text-slate-300 font-bold py-2.5 px-4 rounded-xl text-[10px] uppercase tracking-widest transition-all"
                >
                  Close Scan
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}
