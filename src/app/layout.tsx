import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/sections/navbar';
import NavigationProvider from '@/components/navigation-provider';
import { SpeedInsights } from '@vercel/speed-insights/next';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Omar Pioselli - Full Stack Developer',
  description:
    'Professional Full Stack Developer specializing in modern web applications with React, Next.js, Node.js, and cutting-edge technologies. Based in Lambrugo, Italy.',
  keywords: [
    'Full Stack Developer',
    'React',
    'Next.js',
    'Node.js',
    'JavaScript',
    'TypeScript',
    'Web Development',
    'Italy',
  ],
  authors: [{ name: 'Omar Pioselli', url: 'https://omarpioselli.dev' }],
  creator: 'Omar Pioselli',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://omarpioselli.dev',
    title: 'Omar Pioselli - Full Stack Developer',
    description:
      'Professional Full Stack Developer specializing in modern web applications with React, Next.js, Node.js, and cutting-edge technologies.',
    siteName: 'Omar Pioselli Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Omar Pioselli - Full Stack Developer',
    description:
      'Professional Full Stack Developer specializing in modern web applications with React, Next.js, Node.js, and cutting-edge technologies.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
      >
        <NavigationProvider>
          <Navbar />
          {children}
        </NavigationProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
