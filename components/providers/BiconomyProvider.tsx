'use client';

import React, { createContext, useContext, ReactNode } from 'react';

interface BiconomyContextType {
  smartAccount: any | null;
  bundler: any | null;
  paymaster: any | null;
  isInitialized: boolean;
  executeTransaction: (tx: any) => Promise<any>;
  executeGaslessTransaction: (tx: any) => Promise<any>;
}

const BiconomyContext = createContext<BiconomyContextType>({
  smartAccount: null,
  bundler: null,
  paymaster: null,
  isInitialized: false,
  executeTransaction: async () => ({ hash: '0x...' }),
  executeGaslessTransaction: async () => ({ hash: '0x...' }),
});

export const useBiconomy = () => useContext(BiconomyContext);

interface BiconomyProviderProps {
  children: ReactNode;
}

export function BiconomyProvider({ children }: BiconomyProviderProps) {
  const contextValue: BiconomyContextType = {
    smartAccount: null,
    bundler: null,
    paymaster: null,
    isInitialized: false,
    executeTransaction: async (tx: any) => {
      console.log('Biconomy executeTransaction placeholder:', tx);
      return { hash: '0x...' };
    },
    executeGaslessTransaction: async (tx: any) => {
      console.log('Biconomy executeGaslessTransaction placeholder:', tx);
      return { hash: '0x...' };
    },
  };

  return (
    <BiconomyContext.Provider value={contextValue}>
      {children}
    </BiconomyContext.Provider>
  );
}
