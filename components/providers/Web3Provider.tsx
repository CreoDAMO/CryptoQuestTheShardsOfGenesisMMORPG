'use client';

import React, { ReactNode } from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { polygon, base, mainnet } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BiconomyProvider } from './BiconomyProvider';
import { AggLayerProvider } from './AggLayerProvider';

// Create wagmi config
const config = createConfig({
  chains: [polygon, base, mainnet],
  transports: {
    [polygon.id]: http(),
    [base.id]: http(),
    [mainnet.id]: http(),
  },
});

// Create query client
const queryClient = new QueryClient();

interface Web3ProviderProps {
  children: ReactNode;
}

export function Web3Provider({ children }: Web3ProviderProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <BiconomyProvider>
          <AggLayerProvider>
            {children}
          </AggLayerProvider>
        </BiconomyProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
