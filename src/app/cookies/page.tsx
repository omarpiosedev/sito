'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function CookiePolicy() {
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
              Cookie Policy
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
                What Are Cookies?
              </h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  Cookies are small text files that are placed on your computer
                  or mobile device when you visit a website. They are widely
                  used to make websites work more efficiently and provide
                  information to the site owners.
                </p>
                <p>
                  This Cookie Policy explains how Omar Pioselli ("I", "me", or
                  "my") uses cookies and similar technologies on this website
                  (omarpioselli.dev) to recognize you when you visit. It
                  explains what these technologies are, why I use them, and your
                  rights to control their use.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4 border-b border-red-500/30 pb-2">
                Types of Cookies I Use
              </h2>
              <div className="text-gray-300 space-y-6">
                <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
                  <h3 className="text-xl font-medium text-white mb-3 flex items-center">
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                    Essential Cookies
                  </h3>
                  <p className="mb-3">
                    <strong>Purpose:</strong> These cookies are necessary for
                    the website to function properly. They enable core
                    functionality such as security, network management, and
                    accessibility.
                  </p>
                  <p className="mb-3">
                    <strong>Examples:</strong> Session management, security
                    tokens, preference settings
                  </p>
                  <p>
                    <strong>Can be disabled:</strong> No - these are required
                    for the website to work
                  </p>
                </div>

                <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
                  <h3 className="text-xl font-medium text-white mb-3 flex items-center">
                    <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
                    Performance Cookies
                  </h3>
                  <p className="mb-3">
                    <strong>Purpose:</strong> These cookies collect information
                    about how visitors use the website, such as which pages are
                    visited most often and if users get error messages.
                  </p>
                  <p className="mb-3">
                    <strong>Examples:</strong> Google Analytics, page load
                    times, site performance metrics
                  </p>
                  <p>
                    <strong>Can be disabled:</strong> Yes - through browser
                    settings or opt-out mechanisms
                  </p>
                </div>

                <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
                  <h3 className="text-xl font-medium text-white mb-3 flex items-center">
                    <span className="w-3 h-3 bg-purple-500 rounded-full mr-3"></span>
                    Functionality Cookies
                  </h3>
                  <p className="mb-3">
                    <strong>Purpose:</strong> These cookies allow the website to
                    remember choices you make and provide enhanced, more
                    personal features.
                  </p>
                  <p className="mb-3">
                    <strong>Examples:</strong> Theme preferences, language
                    settings, contact form data
                  </p>
                  <p>
                    <strong>Can be disabled:</strong> Yes - but may affect
                    website functionality
                  </p>
                </div>

                <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
                  <h3 className="text-xl font-medium text-white mb-3 flex items-center">
                    <span className="w-3 h-3 bg-orange-500 rounded-full mr-3"></span>
                    Analytics Cookies
                  </h3>
                  <p className="mb-3">
                    <strong>Purpose:</strong> These cookies help me understand
                    how visitors interact with the website by collecting and
                    reporting information anonymously.
                  </p>
                  <p className="mb-3">
                    <strong>Examples:</strong> Google Analytics, visitor
                    statistics, user behavior patterns
                  </p>
                  <p>
                    <strong>Can be disabled:</strong> Yes - through browser
                    settings or Google Analytics Opt-out
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4 border-b border-red-500/30 pb-2">
                Specific Cookies Used
              </h2>
              <div className="text-gray-300">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-700 text-sm">
                    <thead>
                      <tr className="bg-gray-800">
                        <th className="border border-gray-700 px-4 py-3 text-left">
                          Cookie Name
                        </th>
                        <th className="border border-gray-700 px-4 py-3 text-left">
                          Purpose
                        </th>
                        <th className="border border-gray-700 px-4 py-3 text-left">
                          Duration
                        </th>
                        <th className="border border-gray-700 px-4 py-3 text-left">
                          Type
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-700 px-4 py-3 font-mono">
                          _ga
                        </td>
                        <td className="border border-gray-700 px-4 py-3">
                          Google Analytics - distinguishes users
                        </td>
                        <td className="border border-gray-700 px-4 py-3">
                          2 years
                        </td>
                        <td className="border border-gray-700 px-4 py-3">
                          Analytics
                        </td>
                      </tr>
                      <tr className="bg-gray-900/30">
                        <td className="border border-gray-700 px-4 py-3 font-mono">
                          _ga_*
                        </td>
                        <td className="border border-gray-700 px-4 py-3">
                          Google Analytics - session persistence
                        </td>
                        <td className="border border-gray-700 px-4 py-3">
                          2 years
                        </td>
                        <td className="border border-gray-700 px-4 py-3">
                          Analytics
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-gray-700 px-4 py-3 font-mono">
                          _gid
                        </td>
                        <td className="border border-gray-700 px-4 py-3">
                          Google Analytics - distinguishes users
                        </td>
                        <td className="border border-gray-700 px-4 py-3">
                          24 hours
                        </td>
                        <td className="border border-gray-700 px-4 py-3">
                          Analytics
                        </td>
                      </tr>
                      <tr className="bg-gray-900/30">
                        <td className="border border-gray-700 px-4 py-3 font-mono">
                          next-session
                        </td>
                        <td className="border border-gray-700 px-4 py-3">
                          Next.js session management
                        </td>
                        <td className="border border-gray-700 px-4 py-3">
                          Session
                        </td>
                        <td className="border border-gray-700 px-4 py-3">
                          Essential
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-gray-700 px-4 py-3 font-mono">
                          theme-preference
                        </td>
                        <td className="border border-gray-700 px-4 py-3">
                          Remember user's theme choice
                        </td>
                        <td className="border border-gray-700 px-4 py-3">
                          1 year
                        </td>
                        <td className="border border-gray-700 px-4 py-3">
                          Functionality
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4 border-b border-red-500/30 pb-2">
                Third-Party Cookies
              </h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  Some cookies are placed by third-party services that appear on
                  my pages. I use the following third-party services:
                </p>

                <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
                  <h3 className="text-xl font-medium text-white mb-3">
                    Google Analytics
                  </h3>
                  <p className="mb-2">
                    <strong>Purpose:</strong> Website analytics and performance
                    monitoring
                  </p>
                  <p className="mb-2">
                    <strong>Data collected:</strong> Anonymous usage statistics,
                    page views, session duration
                  </p>
                  <p className="mb-2">
                    <strong>Privacy Policy:</strong>{' '}
                    <a
                      href="https://policies.google.com/privacy"
                      className="text-red-400 hover:text-red-300 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Google Privacy Policy
                    </a>
                  </p>
                  <p>
                    <strong>Opt-out:</strong>{' '}
                    <a
                      href="https://tools.google.com/dlpage/gaoptout"
                      className="text-red-400 hover:text-red-300 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Google Analytics Opt-out Browser Add-on
                    </a>
                  </p>
                </div>

                <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
                  <h3 className="text-xl font-medium text-white mb-3">
                    Social Media Platforms
                  </h3>
                  <p className="mb-2">
                    <strong>Purpose:</strong> Social media integration and
                    sharing capabilities
                  </p>
                  <p className="mb-2">
                    <strong>Platforms:</strong> LinkedIn, Instagram, Freelancer
                  </p>
                  <p>
                    <strong>Note:</strong> These services may set their own
                    cookies when you interact with social media buttons or
                    embedded content.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4 border-b border-red-500/30 pb-2">
                How to Control Cookies
              </h2>
              <div className="text-gray-300 space-y-4">
                <h3 className="text-xl font-medium text-white">
                  Browser Settings
                </h3>
                <p>
                  Most web browsers allow you to control cookies through their
                  settings preferences. You can set your browser to:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Accept all cookies</li>
                  <li>Reject all cookies</li>
                  <li>Notify you when a cookie is set</li>
                  <li>Delete cookies after your browsing session</li>
                </ul>

                <h3 className="text-xl font-medium text-white mt-6">
                  Browser-Specific Instructions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-gray-900/30 p-4 rounded-lg">
                    <p>
                      <strong>Chrome:</strong> Settings → Privacy and Security →
                      Cookies
                    </p>
                  </div>
                  <div className="bg-gray-900/30 p-4 rounded-lg">
                    <p>
                      <strong>Firefox:</strong> Preferences → Privacy & Security
                      → Cookies
                    </p>
                  </div>
                  <div className="bg-gray-900/30 p-4 rounded-lg">
                    <p>
                      <strong>Safari:</strong> Preferences → Privacy → Cookies
                    </p>
                  </div>
                  <div className="bg-gray-900/30 p-4 rounded-lg">
                    <p>
                      <strong>Edge:</strong> Settings → Cookies and Site
                      Permissions
                    </p>
                  </div>
                </div>

                <div className="bg-yellow-900/20 border border-yellow-500/30 p-4 rounded-lg mt-6">
                  <p className="text-yellow-300">
                    <strong>⚠️ Important:</strong> Disabling certain cookies may
                    affect the functionality of this website. Essential cookies
                    cannot be disabled if you want to use the website.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4 border-b border-red-500/30 pb-2">
                Cookie Consent
              </h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  By continuing to use this website, you consent to my use of
                  cookies as described in this policy. The cookie notice
                  displayed on your first visit to the website provides
                  information about the main cookies I use and gives you the
                  option to accept or reject non-essential cookies.
                </p>
                <p>You can withdraw your consent at any time by:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>
                    Changing your browser settings to block or delete cookies
                  </li>
                  <li>
                    Using the opt-out mechanisms provided by third-party
                    services
                  </li>
                  <li>Contacting me directly at omarpioselli.dev@gmail.com</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4 border-b border-red-500/30 pb-2">
                Updates to This Cookie Policy
              </h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  I may update this Cookie Policy from time to time to reflect
                  changes in the cookies I use or for other operational, legal,
                  or regulatory reasons. I encourage you to review this Cookie
                  Policy regularly to stay informed about my use of cookies.
                </p>
                <p>
                  The date at the top of this Cookie Policy indicates when it
                  was last updated. Any changes will be effective immediately
                  upon posting the updated Cookie Policy on the website.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4 border-b border-red-500/30 pb-2">
                Contact Information
              </h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  If you have any questions about this Cookie Policy or my use
                  of cookies, please contact me:
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

            <section className="mb-8">
              <div className="bg-blue-900/20 border border-blue-500/30 p-6 rounded-lg">
                <h3 className="text-xl font-medium text-white mb-3">
                  Related Policies
                </h3>
                <p className="text-gray-300 mb-3">
                  This Cookie Policy should be read in conjunction with my other
                  policies:
                </p>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="/privacy"
                      className="text-red-400 hover:text-red-300 underline"
                    >
                      Privacy Policy
                    </a>{' '}
                    - How I collect, use, and protect your personal information
                  </li>
                  <li>
                    <a
                      href="/terms"
                      className="text-red-400 hover:text-red-300 underline"
                    >
                      Terms of Service
                    </a>{' '}
                    - The terms governing your use of this website
                  </li>
                </ul>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
