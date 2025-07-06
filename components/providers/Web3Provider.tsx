'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { polygon, base, mainnet } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { BiconomyProvider } from './BiconomyProvider';
import { AggLayerProvider } from './AggLayerProvider';

// Create wagmi config
const config = createConfig(
  getDefaultConfig({
    appName: 'CryptoQuest',
    appDescription: 'Revolutionary blockchain MMORPG',
    appUrl: 'https://cryptoquest.app',
    appIcon: '/favicon.ico',
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
    chains: [polygon, base, mainnet],
    transports: {
      [polygon.id]: http(),
      [base.id]: http(),
      [mainnet.id]: http(),
    },
  })
);

// Create query client
const queryClient = new QueryClient();

interface Web3ContextType {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  isLoading: boolean;
}

const Web3Context = createContext<Web3ContextType>({
  isConnected: false,
  address: null,
  chainId: null,
  isLoading: false,
});

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

interface Web3ProviderProps {
  children: ReactNode;
}

export function Web3Provider({ children }: Web3ProviderProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize Web3 connection state
    const initializeWeb3 = async () => {
      try {
        // Check if wallet is connected
        if (typeof window !== 'undefined' && window.ethereum) {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setIsConnected(true);
            setAddress(accounts[0]);
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            setChainId(parseInt(chainId, 16));
          }
        }
      } catch (error) {
        console.error('Error initializing Web3:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeWeb3();
  }, []);

  const contextValue: Web3ContextType = {
    isConnected,
    address,
    chainId,
    isLoading,
  };

  return (
    <Web3Context.Provider value={contextValue}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <ConnectKitProvider theme="midnight">
            <OnchainKitProvider
              apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
              chain={base}
            >
              <BiconomyProvider>
                <AggLayerProvider>
                  {children}
                </AggLayerProvider>
              </BiconomyProvider>
            </OnchainKitProvider>
          </ConnectKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </Web3Context.Provider>
  );
}