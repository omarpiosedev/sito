'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-black text-white pt-24">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div className="text-center mb-12">
            <h1
              className="text-4xl md:text-5xl font-bold text-white mb-4"
              style={{ fontFamily: 'Anton, sans-serif' }}
            >
              Privacy Policy
            </h1>
            <p className="text-gray-400 text-lg">
              Last updated:{' '}
              {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          <div className="prose prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4 border-b border-red-500/30 pb-2">
                1. Information We Collect
              </h2>
              <div className="text-gray-300 space-y-4">
                <h3 className="text-xl font-medium text-white">
                  Contact Information
                </h3>
                <p>
                  When you contact me through this website's contact forms or
                  email (omarpioselli.dev@gmail.com), I collect information you
                  voluntarily provide, including:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Your name and email address</li>
                  <li>Project details and requirements</li>
                  <li>Any other information you choose to share</li>
                </ul>

                <h3 className="text-xl font-medium text-white mt-6">
                  Analytics Data
                </h3>
                <p>
                  This website uses analytics tools to understand how visitors
                  interact with the site. This includes:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Pages visited and time spent on each page</li>
                  <li>Referral sources and search terms</li>
                  <li>Device type, browser, and general location data</li>
                  <li>User behavior patterns (anonymized)</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4 border-b border-red-500/30 pb-2">
                2. How We Use Your Information
              </h2>
              <div className="text-gray-300 space-y-4">
                <p>Your information is used for the following purposes:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Responding to your inquiries and project requests</li>
                  <li>Providing information about my development services</li>
                  <li>Improving website performance and user experience</li>
                  <li>Understanding visitor preferences and behavior</li>
                  <li>Complying with legal obligations</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4 border-b border-red-500/30 pb-2">
                3. Information Sharing
              </h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  I do not sell, trade, or rent your personal information to
                  third parties. Your information may be shared only in the
                  following circumstances:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>With your explicit consent</li>
                  <li>To comply with legal requirements or court orders</li>
                  <li>
                    With trusted service providers who assist in website
                    operations (bound by confidentiality agreements)
                  </li>
                  <li>
                    To protect my rights, property, or safety, or that of others
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4 border-b border-red-500/30 pb-2">
                4. Cookies and Tracking Technologies
              </h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  This website uses cookies and similar technologies to enhance
                  your browsing experience. For detailed information about
                  cookies used, please refer to our{' '}
                  <a
                    href="/cookies"
                    className="text-red-400 hover:text-red-300 underline"
                  >
                    Cookie Policy
                  </a>
                  .
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4 border-b border-red-500/30 pb-2">
                5. Data Security
              </h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  I implement appropriate technical and organizational measures
                  to protect your personal information against unauthorized
                  access, alteration, disclosure, or destruction. However, no
                  method of transmission over the internet is 100% secure.
                </p>
                <p>Security measures include:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>SSL/TLS encryption for data transmission</li>
                  <li>Regular security updates and monitoring</li>
                  <li>Access controls and authentication</li>
                  <li>Data backup and recovery procedures</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4 border-b border-red-500/30 pb-2">
                6. Your Rights (GDPR Compliance)
              </h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  If you are a resident of the European Union, you have the
                  following rights regarding your personal data:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>
                    <strong>Right of access:</strong> Request copies of your
                    personal data
                  </li>
                  <li>
                    <strong>Right to rectification:</strong> Request correction
                    of inaccurate data
                  </li>
                  <li>
                    <strong>Right to erasure:</strong> Request deletion of your
                    data
                  </li>
                  <li>
                    <strong>Right to restrict processing:</strong> Request
                    limitation of data processing
                  </li>
                  <li>
                    <strong>Right to data portability:</strong> Request transfer
                    of your data
                  </li>
                  <li>
                    <strong>Right to object:</strong> Object to processing of
                    your data
                  </li>
                  <li>
                    <strong>Right to withdraw consent:</strong> Withdraw consent
                    at any time
                  </li>
                </ul>
                <p className="mt-4">
                  To exercise these rights, please contact me at{' '}
                  <a
                    href="mailto:omarpioselli.dev@gmail.com"
                    className="text-red-400 hover:text-red-300"
                  >
                    omarpioselli.dev@gmail.com
                  </a>
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4 border-b border-red-500/30 pb-2">
                7. Data Retention
              </h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  I retain personal information for as long as necessary to
                  fulfill the purposes outlined in this Privacy Policy, unless a
                  longer retention period is required or permitted by law.
                  Specifically:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>
                    Contact information: Retained until you request deletion or
                    for 3 years of inactivity
                  </li>
                  <li>
                    Analytics data: Anonymized and aggregated data may be
                    retained indefinitely
                  </li>
                  <li>
                    Project communications: Retained for the duration of the
                    project plus 2 years for reference
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4 border-b border-red-500/30 pb-2">
                8. Changes to This Privacy Policy
              </h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  I may update this Privacy Policy from time to time. Any
                  changes will be posted on this page with an updated effective
                  date. I encourage you to review this Privacy Policy
                  periodically for any changes.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4 border-b border-red-500/30 pb-2">
                9. Contact Information
              </h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  If you have any questions about this Privacy Policy or your
                  personal data, please contact me:
                </p>
                <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
                  <p>
                    <strong>Omar Pioselli</strong>
                  </p>
                  <p>
                    Email:{' '}
                    <a
                      href="mailto:omarpioselli.dev@gmail.com"
                      className="text-red-400 hover:text-red-300"
                    >
                      omarpioselli.dev@gmail.com
                    </a>
                  </p>
                  <p>Location: Lambrugo (CO), Italia</p>
                  <p>
                    Website:{' '}
                    <a href="/" className="text-red-400 hover:text-red-300">
                      omarpioselli.dev
                    </a>
                  </p>
                </div>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
