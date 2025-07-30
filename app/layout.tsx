import React from 'react';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CryptoQuest - Advanced DeFi & Gaming Platform',
  description: 'Comprehensive DeFi dashboard with multi-chain support, arbitrage tools, and advanced trading features',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}