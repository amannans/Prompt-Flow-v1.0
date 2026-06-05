import { Link, useLocation } from 'react-router-dom';
import { BRAND_NAME } from '../constants';
import { Icons } from './Icons';
import Logo from './Logo';

export default function Footer() {
  const years = new Date().getFullYear();
  const location = useLocation();
  const isHome = location.pathname === '/';

  const formatHref = (href: string) => {
    if (href.startsWith('#') && !isHome) {
      return `/${href}`;
    }
    return href;
  };

  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-[1536px] mx-auto px-6 md:px-12 xl:px-20 py-24 flex flex-col lg:flex-row justify-between gap-16 lg:gap-32">
        <div className="max-w-sm">
          <Link to="/" className="mb-8 block">
            <Logo />
          </Link>
          <p className="text-slate-400 text-lg mb-8 leading-relaxed font-medium">
            AI-Powered Lead Generation and automation systems for UK businesses. We don't just do marketing — we build systems that generate leads and automate sales.
          </p>
          <div className="flex gap-4">
            {[Icons.Globe, Icons.Share2, Icons.Mail].map((Icon, i) => (
              <a key={i} href={formatHref("#contact")} className="p-3 bg-slate-800 border border-slate-700 rounded-full text-slate-300 hover:text-pink-500 transition-colors hover:scale-110 active:scale-95">
                <Icon size={20} />
              </a>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-12 flex-1">
          <div className="space-y-6">
            <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Solutions</h5>
            <ul className="space-y-4 text-slate-300 text-sm font-bold">
              {[
                { name: 'Lead Generation', href: '#services' },
                { name: 'AI Automation', href: '#edge' },
                { name: 'Social Growth', href: '#services' },
                { name: 'SEO Dominance', href: '#services' }
              ].map((item) => (
                <li key={item.name}><a href={formatHref(item.href)} className="hover:text-pink-500 transition-colors tracking-wide uppercase text-[11px]">{item.name}</a></li>
              ))}
            </ul>
          </div>
          <div className="space-y-6">
            <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Links</h5>
            <ul className="space-y-4 text-slate-300 text-sm font-bold">
              {[
                { name: 'Packages', href: '#pricing' },
                { name: 'Our Edge', href: '#edge' },
                { name: 'Contact', href: '#contact' }
              ].map((item) => (
                <li key={item.name}><a href={formatHref(item.href)} className="hover:text-pink-500 transition-colors tracking-wide uppercase text-[11px]">{item.name}</a></li>
              ))}
            </ul>
          </div>
          <div className="space-y-6">
            <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Trust</h5>
            <ul className="space-y-4 text-slate-300 text-sm font-bold">
              {[
                { name: 'Privacy Policy', path: '/privacy' },
                { name: 'Terms of Service', path: '/terms' },
                { name: 'Cookie Policy', path: '/cookies' }
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="hover:text-pink-500 transition-colors tracking-wide uppercase text-[11px]">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-[1536px] mx-auto px-6 md:px-12 xl:px-20 py-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex space-x-6 text-[10px] font-black uppercase tracking-wider text-slate-500">
          <span>Meta Business Partner</span>
          <span>Google Premier Partner</span>
          <span>Shopify Plus Experts</span>
        </div>
        <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">
          &copy; {years} PROMPT FLOW DIGITAL LTD. ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
}
