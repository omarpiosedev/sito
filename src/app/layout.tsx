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

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('gesturestart', function (e) {
                e.preventDefault();
              });
              document.addEventListener('gesturechange', function (e) {
                e.preventDefault();
              });
              document.addEventListener('gestureend', function (e) {
                e.preventDefault();
              });
              
              let lastTouchEnd = 0;
              document.addEventListener('touchend', function (event) {
                const now = (new Date()).getTime();
                if (now - lastTouchEnd <= 300) {
                  event.preventDefault();
                }
                lastTouchEnd = now;
              }, false);
            `,
          }}
        />
      </head>
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
