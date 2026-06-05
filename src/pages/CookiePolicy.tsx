import { useEffect } from 'react';
import LegalPageLayout from '../components/LegalPageLayout';

export default function CookiePolicy() {
  useEffect(() => {
    document.title = "Cookie Policy | Prompt Flow";
  }, []);

  return (
    <LegalPageLayout 
      title="Cookie Policy"
      lastUpdated="May 2026"
      content={
        <>
          <section className="mb-12">
            <h2 className="text-2xl mb-4 text-white">1. What Are Cookies</h2>
            <p>As is common practice with almost all professional websites, this site uses cookies, which are tiny files that are downloaded to your computer, to improve your experience. This page describes what information they gather, how we use it and why we sometimes need to store these cookies.</p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl mb-4 text-white">2. How We Use Cookies</h2>
            <p>We use cookies for a variety of reasons detailed below. Unfortunately, in most cases there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site.</p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl mb-4 text-white">3. The Cookies We Set</h2>
            <ul className="list-disc pl-6 space-y-4 text-slate-400">
              <li>
                <strong>Forms related cookies:</strong> When you submit data to through a form such as those found on contact pages or comment forms cookies may be set to remember your user details for future correspondence.
              </li>
              <li>
                <strong>Site preferences cookies:</strong> In order to provide you with a great experience on this site we provide the functionality to set your preferences for how this site runs when you use it.
              </li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl mb-4 text-white">4. Third Party Cookies</h2>
            <p>In some special cases we also use cookies provided by trusted third parties. The following section details which third party cookies you might encounter through this site.</p>
            <p className="mt-4">This site uses Google Analytics which is one of the most widespread and trusted analytics solution on the web for helping us to understand how you use the site and ways that we can improve your experience.</p>
          </section>
        </>
      }
    />
  );
}
