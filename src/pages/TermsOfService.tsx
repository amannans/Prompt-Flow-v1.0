import { useEffect } from 'react';
import LegalPageLayout from '../components/LegalPageLayout';

export default function TermsOfService() {
  useEffect(() => {
    document.title = "Terms of Service | Prompt Flow";
  }, []);

  return (
    <LegalPageLayout 
      title="Terms of Service"
      lastUpdated="May 2026"
      content={
        <>
          <section className="mb-12">
            <h2 className="text-2xl mb-4 text-white">1. Agreement to Terms</h2>
            <p>By accessing our website at Prompt Flow, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.</p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl mb-4 text-white">2. Use License</h2>
            <p>Permission is granted to temporarily download one copy of the materials (information or software) on Prompt Flow's website for personal, non-commercial transitory viewing only.</p>
            <p className="mt-4">This is the grant of a license, not a transfer of title, and under this license you may not:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2 text-slate-400">
              <li>modify or copy the materials;</li>
              <li>use the materials for any commercial purpose, or for any public display;</li>
              <li>attempt to decompile or reverse engineer any software contained on the website;</li>
              <li>remove any copyright or other proprietary notations from the materials.</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl mb-4 text-white">3. Disclaimer</h2>
            <p>The materials on Prompt Flow's website are provided on an 'as is' basis. Prompt Flow makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl mb-4 text-white">4. Limitations</h2>
            <p>In no event shall Prompt Flow or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Prompt Flow's website.</p>
          </section>
        </>
      }
    />
  );
}
