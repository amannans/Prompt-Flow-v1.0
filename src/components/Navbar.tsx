import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BRAND_NAME, NAV_LINKS } from '../constants';
import { Icons } from './Icons';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, login, logout, isAdmin } = useAuth();
  const isHome = location.pathname === '/';

  const formatHref = (href: string) => {
    if (href.startsWith('#') && !isHome) {
      return `/${href}`;
    }
    return href;
  };

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-[1536px] z-50">
      <div className="glass rounded-2xl flex justify-between items-center px-6 md:px-10 py-5 backdrop-blur-xl relative">
        <Link to="/">
          <Logo />
        </Link>

        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 space-x-8 items-center">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={formatHref(link.href)}
              className="text-sm font-semibold tracking-wide text-slate-300 hover:text-pink-500 transition-colors duration-300"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex space-x-4 items-center">
          {user ? (
            <div className="flex items-center gap-2.5">
              <Link 
                to={isAdmin ? "/admin" : "/dashboard"}
                className="bg-transparent border border-slate-800 text-slate-300 hover:border-pink-500 hover:text-white px-6 py-3 rounded-full font-semibold text-sm uppercase tracking-wide transition-all"
              >
                {isAdmin ? "Admin Suite" : "Dashboard"}
              </Link>
              <button 
                onClick={async () => {
                  await logout();
                  navigate("/");
                }}
                className="bg-transparent border border-slate-800 text-slate-400 hover:border-red-500/40 hover:text-red-400 px-6 py-3 rounded-full font-semibold text-sm uppercase cursor-pointer transition-all"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button 
              onClick={async () => {
                try {
                  const loggedInUser = await login();
                  if (loggedInUser.email === 'abdulmannansaqib@gmail.com') {
                    navigate('/admin');
                  } else {
                    navigate('/dashboard');
                  }
                } catch (err) {
                  console.error(err);
                }
              }}
              className="bg-transparent border border-slate-800 text-slate-300 hover:border-pink-500 hover:text-white px-6 py-3 rounded-full font-semibold text-sm uppercase tracking-wide transition-all cursor-pointer"
            >
              Sign Up / Sign In
            </button>
          )}

          <a 
            href={formatHref("#contact")}
            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-full font-semibold text-sm uppercase tracking-wide transition-all shadow-lg shadow-pink-500/20 active:scale-95 inline-block"
          >
            Book Call
          </a>
        </div>

        <button 
          className="md:hidden p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <Icons.X size={24} /> : <Icons.Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-0 w-full glass rounded-2xl p-6 md:hidden backdrop-blur-xl"
          >
            <div className="flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={formatHref(link.href)}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium text-slate-200 hover:text-pink-500 transition-colors"
                >
                  {link.label}
                </a>
              ))}

              {user ? (
                <div className="flex flex-col gap-3 pt-4 border-t border-slate-800/40 mt-2">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 px-1 mb-1">
                    System User: <span className="text-slate-300 lowercase font-bold select-all">{user.email}</span>
                  </div>
                  <Link
                    to={isAdmin ? "/admin" : "/dashboard"}
                    onClick={() => setIsOpen(false)}
                    className="bg-slate-900/60 hover:bg-pink-500/10 border border-slate-800 text-center hover:border-pink-500/30 text-pink-400 hover:text-pink-300 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
                  >
                    {isAdmin ? "Admin Suite" : "Dashboard"}
                  </Link>
                  <button
                    onClick={async () => {
                      setIsOpen(false);
                      await logout();
                      navigate('/');
                    }}
                    className="bg-slate-950/40 hover:bg-red-500/10 border border-slate-900/40 text-center hover:border-red-500/25 text-slate-400 hover:text-red-400 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={async () => {
                    setIsOpen(false);
                    try {
                      const loggedInUser = await login();
                      if (loggedInUser.email === 'abdulmannansaqib@gmail.com') {
                        navigate('/admin');
                      } else {
                        navigate('/dashboard');
                      }
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                  className="bg-slate-900/40 border border-slate-800 text-slate-200 hover:text-white hover:border-pink-500 py-3.5 rounded-xl font-semibold text-sm uppercase tracking-wide transition-all cursor-pointer text-center"
                >
                  Sign Up / Sign In
                </button>
              )}

              <a 
                href={formatHref("#contact")}
                onClick={() => setIsOpen(false)}
                className="bg-pink-500 text-white w-full py-3 rounded-full text-xs font-bold uppercase tracking-widest mt-4 text-center"
              >
                Book Call
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
