import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';

const PrivacyPage = () => {
  return (
    <MainLayout>
      <div className="container py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          
          <div className="prose prose-green max-w-none">
            <p className="text-muted-foreground mb-6">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
              <p>
                Welcome to Mushroom SafeGuard. We respect your privacy and are committed to protecting your personal data. 
                This privacy policy will inform you about how we look after your personal data when you visit our website 
                and tell you about your privacy rights and how the law protects you.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">2. The Data We Collect</h2>
              <p className="mb-4">
                We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Identity Data</strong> includes name, username or similar identifier.</li>
                <li><strong>Contact Data</strong> includes email address.</li>
                <li><strong>Technical Data</strong> includes internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform.</li>
                <li><strong>Usage Data</strong> includes information about how you use our website and services.</li>
                <li><strong>Image Data</strong> includes photos of mushrooms that you upload for identification.</li>
              </ul>
              <p>
                We do not collect any Special Categories of Personal Data about you (this includes details about your race, ethnicity, religious or philosophical beliefs, etc.).
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">3. How We Use Your Data</h2>
              <p className="mb-4">We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>To provide our mushroom identification services.</li>
                <li>To manage your account and profile.</li>
                <li>To improve our website and services.</li>
                <li>To respond to your inquiries and provide customer support.</li>
                <li>To send you information about features, updates, and changes to our terms and policies.</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">4. Data Security</h2>
              <p>
                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, 
                or accessed in an unauthorized way. We limit access to your personal data to those employees and third parties who 
                have a business need to know.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">5. Your Legal Rights</h2>
              <p className="mb-4">
                Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Request access to your personal data.</li>
                <li>Request correction of your personal data.</li>
                <li>Request erasure of your personal data.</li>
                <li>Object to processing of your personal data.</li>
                <li>Request restriction of processing your personal data.</li>
                <li>Request transfer of your personal data.</li>
                <li>Right to withdraw consent.</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">6. Contact Us</h2>
              <p>
                If you have any questions about this privacy policy or our privacy practices, please contact us through 
                our <a href="/contact" className="text-mushroom-primary hover:underline">Contact Page</a>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PrivacyPage;