import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { ToastProvider } from '@/components/ui/toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CryptoQuest: The Shards of Genesis',
  description: 'Revolutionary blockchain MMORPG with cross-platform gaming, NFTs, and AI-powered gameplay',
  keywords: 'blockchain, MMORPG, gaming, NFT, cryptocurrency, Web3, gaming hub, AI, cross-platform',
  authors: [{ name: 'CryptoQuest Team' }],
  openGraph: {
    title: 'CryptoQuest: The Shards of Genesis',
    description: 'Revolutionary blockchain MMORPG with cross-platform gaming, NFTs, and AI-powered gameplay',
    type: 'website',
    siteName: 'CryptoQuest',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CryptoQuest: The Shards of Genesis',
    description: 'Revolutionary blockchain MMORPG with cross-platform gaming, NFTs, and AI-powered gameplay',
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider>
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}