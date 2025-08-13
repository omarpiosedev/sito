'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function TermsOfService() {
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
              Terms of Service
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
                1. Agreement to Terms
              </h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  By accessing and using this website (omarpioselli.dev), you
                  accept and agree to be bound by the terms and provision of
                  this agreement. These Terms of Service (&quot;Terms&quot;)
                  govern your use of this website operated by Omar Pioselli.
                </p>
                <p>
                  If you do not agree to abide by the above, please do not use
                  this service. Your continued use of the website following the
                  posting of changes to these terms constitutes acceptance of
                  those changes.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4 border-b border-red-500/30 pb-2">
                2. Description of Service
              </h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  This website serves as a professional portfolio and business
                  presence for Omar Pioselli, a Full Stack Developer. The
                  services offered through this website include:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Full-stack web application development</li>
                  <li>Frontend development (React, Vue, Angular)</li>
                  <li>Backend development and API creation</li>
                  <li>Database design and optimization</li>
                  <li>Technical consulting and code review</li>
                  <li>Project portfolio showcase</li>
                  <li>Professional contact and inquiry services</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4 border-b border-red-500/30 pb-2">
                3. Acceptable Use Policy
              </h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  You agree to use this website only for lawful purposes and in
                  accordance with these Terms. You agree NOT to:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>
                    Use the website in any way that violates applicable laws or
                    regulations
                  </li>
                  <li>
                    Transmit or procure the sending of any advertising or
                    promotional material without consent
                  </li>
                  <li>
                    Impersonate or attempt to impersonate the website owner,
                    employees, or other users
                  </li>
                  <li>
                    Engage in any conduct that restricts or inhibits
                    anyone&apos;s use of the website
                  </li>
                  <li>
                    Use any robot, spider, or other automatic device to access
                    the website
                  </li>
                  <li>
                    Introduce viruses, trojans, worms, or other malicious code
                  </li>
                  <li>
                    Attempt to gain unauthorized access to any part of the
                    website
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4 border-b border-red-500/30 pb-2">
                4. Professional Services
              </h2>
              <div className="text-gray-300 space-y-4">
                <h3 className="text-xl font-medium text-white">
                  Project Engagement
                </h3>
                <p>When engaging my professional development services:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>
                    All project terms will be defined in separate written
                    agreements
                  </li>
                  <li>
                    Pricing, timelines, and deliverables will be agreed upon
                    before work begins
                  </li>
                  <li>
                    Changes to project scope require written approval and may
                    affect pricing
                  </li>
                  <li>Payment terms will be specified in project contracts</li>
                </ul>

                <h3 className="text-xl font-medium text-white mt-6">
                  Professional Standards
                </h3>
                <p>I commit to:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>
                    Delivering high-quality code following industry best
                    practices
                  </li>
                  <li>
                    Maintaining confidentiality of client information and
                    projects
                  </li>
                  <li>
                    Communicating project progress and any issues promptly
                  </li>
                  <li>Providing reasonable support during project delivery</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4 border-b border-red-500/30 pb-2">
                5. Intellectual Property Rights
              </h2>
              <div className="text-gray-300 space-y-4">
                <h3 className="text-xl font-medium text-white">
                  Website Content
                </h3>
                <p>
                  The content, organization, graphics, design, compilation, and
                  other matters related to this website are protected under
                  applicable copyrights and other intellectual property rights.
                </p>

                <h3 className="text-xl font-medium text-white mt-6">
                  Project Work
                </h3>
                <p>For development projects:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>
                    Client retains rights to their business logic and
                    proprietary content
                  </li>
                  <li>
                    Custom code developed for specific client needs belongs to
                    the client upon full payment
                  </li>
                  <li>
                    I retain rights to general methodologies, techniques, and
                    reusable components
                  </li>
                  <li>
                    Portfolio rights will be negotiated separately for each
                    project
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4 border-b border-red-500/30 pb-2">
                6. Privacy and Data Protection
              </h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  Your privacy is important to me. Please review the{' '}
                  <a
                    href="/privacy"
                    className="text-red-400 hover:text-red-300 underline"
                  >
                    Privacy Policy
                  </a>
                  , which also governs your use of this website, to understand
                  my practices.
                </p>
                <p>
                  For development projects, data protection terms will be
                  specified in separate agreements as required by applicable
                  laws (GDPR, CCPA, etc.).
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4 border-b border-red-500/30 pb-2">
                7. Disclaimers and Limitation of Liability
              </h2>
              <div className="text-gray-300 space-y-4">
                <h3 className="text-xl font-medium text-white">
                  Website Disclaimer
                </h3>
                <p>
                  This website is provided &quot;as is&quot; without any
                  representations or warranties, express or implied. I make no
                  representations or warranties in relation to this website or
                  the information and materials provided.
                </p>

                <h3 className="text-xl font-medium text-white mt-6">
                  Professional Services Disclaimer
                </h3>
                <p>
                  While I strive to deliver high-quality development services:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>
                    I cannot guarantee specific business outcomes or results
                  </li>
                  <li>
                    Software development involves inherent technical risks
                  </li>
                  <li>
                    Client testing and validation of delivered work is essential
                  </li>
                  <li>Ongoing maintenance and updates may be required</li>
                </ul>

                <h3 className="text-xl font-medium text-white mt-6">
                  Limitation of Liability
                </h3>
                <p>
                  In no event shall Omar Pioselli be liable for any special,
                  indirect, or consequential damages or any damages whatsoever
                  arising from loss of use, data, or profits, whether in an
                  action of contract, negligence, or other tort, arising out of
                  or in connection with the use of this website or services.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4 border-b border-red-500/30 pb-2">
                8. Indemnification
              </h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  You agree to indemnify and hold harmless Omar Pioselli from
                  any claim or demand, including reasonable attorneys&apos;
                  fees, made by any third party due to or arising out of your
                  breach of these Terms, your violation of any law, or your
                  violation of the rights of a third party.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4 border-b border-red-500/30 pb-2">
                9. Governing Law
              </h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  These Terms shall be interpreted and governed by the laws of
                  Italy. Any disputes relating to these terms and conditions
                  will be subject to the jurisdiction of the courts of Como,
                  Italy.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibent text-white mb-4 border-b border-red-500/30 pb-2">
                10. Changes to Terms
              </h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  I reserve the right to modify these terms at any time. Changes
                  will be posted on this page with an updated effective date.
                  Your continued use of the website after changes are posted
                  constitutes acceptance of the modified terms.
                </p>
                <p>
                  For significant changes, I will make reasonable efforts to
                  notify users through appropriate channels.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4 border-b border-red-500/30 pb-2">
                11. Termination
              </h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  I may terminate or suspend access to this website immediately,
                  without prior notice or liability, for any reason whatsoever,
                  including without limitation if you breach the Terms of
                  Service.
                </p>
                <p>
                  For professional service engagements, termination terms will
                  be specified in individual project agreements.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4 border-b border-red-500/30 pb-2">
                12. Contact Information
              </h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  If you have any questions about these Terms of Service, please
                  contact me:
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
                    <Link href="/" className="text-red-400 hover:text-red-300">
                      omarpioselli.dev
                    </Link>
                  </p>
                  <p>
                    LinkedIn:{' '}
                    <a
                      href="https://linkedin.com/in/omarpioselli"
                      className="text-red-400 hover:text-red-300"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      linkedin.com/in/omarpioselli
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
