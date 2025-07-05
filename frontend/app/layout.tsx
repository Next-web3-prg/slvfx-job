import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SLVFX Job Board - Find Your Next Remote Job',
  description: 'Aggregated job listings from top remote job boards including RemoteOK, WeWorkRemotely, and more. Find your next remote opportunity.',
  keywords: 'remote jobs, job board, work from home, telecommute, remote work, job search',
  authors: [{ name: 'SLVFX Team' }],
  openGraph: {
    title: 'SLVFX Job Board - Find Your Next Remote Job',
    description: 'Aggregated job listings from top remote job boards including RemoteOK, WeWorkRemotely, and more.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SLVFX Job Board - Find Your Next Remote Job',
    description: 'Aggregated job listings from top remote job boards.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
} 