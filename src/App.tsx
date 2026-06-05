/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StatsSection from './components/StatsSection';
import DetailedServices from './components/DetailedServices';
import AIAutomation from './components/AIAutomation';
import TargetClients from './components/TargetClients';
import Pricing from './components/Pricing';
import CaseStudies from './components/CaseStudies';
import CTASection from './components/CTASection';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import { SelectionProvider } from './context/SelectionContext';
import { AuthProvider } from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import BackToTopButton from './components/BackToTopButton';
import AuthModal from './components/AuthModal';
import AIChatbot from './components/AIChatbot';

// Legal Pages
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookiePolicy from './pages/CookiePolicy';

// Secure Dashboards
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';

function HomePage() {
  useEffect(() => {
    document.title = "UK Digital Marketing Agency for SEO, Ads & AI Automation | Prompt Flow";
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <StatsSection />
        <TargetClients />
        <DetailedServices />
        <div id="edge">
          <AIAutomation />
        </div>
        <Pricing />
        <CaseStudies />
        <CTASection />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SelectionProvider>
        <Router>
          <ScrollToTop />
          <BackToTopButton />
          <AuthModal />
          <AIChatbot />
          <div className="min-h-screen bg-background selection:bg-pink-500/30 selection:text-pink-500 relative overflow-x-hidden">
            {/* Decorative Background Glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pink-600/5 rounded-full blur-[80px] -z-10 -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[80px] -z-10 translate-y-1/2 -translate-x-1/2" />
            
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/cookies" element={<CookiePolicy />} />
            </Routes>
          </div>
        </Router>
      </SelectionProvider>
    </AuthProvider>
  );
}
