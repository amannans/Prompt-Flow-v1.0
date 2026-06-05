import { useEffect } from 'react';
import LegalPageLayout from '../components/LegalPageLayout';

export default function PrivacyPolicy() {
  useEffect(() => {
    document.title = "Privacy Policy | Prompt Flow";
  }, []);

  return (
    <LegalPageLayout 
      title="Privacy Policy"
      lastUpdated="May 2026"
      content={
        <>
          <section className="mb-12">
            <h2 className="text-2xl mb-4 text-white">1. Introduction</h2>
            <p>At Prompt Flow, we respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.</p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl mb-4 text-white">2. Data We Collect</h2>
            <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4 text-slate-400">
              <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
              <li><strong>Contact Data:</strong> includes email address and telephone numbers.</li>
              <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location.</li>
              <li><strong>Usage Data:</strong> includes information about how you use our website, products and services.</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl mb-4 text-white">3. How We Use Your Data</h2>
            <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4 text-slate-400">
              <li>To register you as a new client.</li>
              <li>To provide you with information, products or services that you request from us.</li>
              <li>To notify you about changes to our service.</li>
              <li>To improve our website, products/services, marketing or customer relationships.</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl mb-4 text-white">4. Data Security</h2>
            <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed.</p>
          </section>
        </>
      }
    />
  );
}
