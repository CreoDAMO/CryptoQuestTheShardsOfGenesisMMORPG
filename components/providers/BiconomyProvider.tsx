'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BiconomySmartAccountV2, DEFAULT_ENTRYPOINT_ADDRESS } from '@biconomy/account';
import { Bundler } from '@biconomy/bundler';
import { BiconomyPaymaster } from '@biconomy/paymaster';
import { ChainId } from '@biconomy/core-types';
import { useAccount, useWalletClient } from 'wagmi';

interface BiconomyContextType {
  smartAccount: BiconomySmartAccountV2 | null;
  bundler: Bundler | null;
  paymaster: BiconomyPaymaster | null;
  isInitialized: boolean;
  executeTransaction: (tx: any) => Promise<any>;
  executeGaslessTransaction: (tx: any) => Promise<any>;
}

const BiconomyContext = createContext<BiconomyContextType>({
  smartAccount: null,
  bundler: null,
  paymaster: null,
  isInitialized: false,
  executeTransaction: async () => null,
  executeGaslessTransaction: async () => null,
});

export const useBiconomy = () => {
  const context = useContext(BiconomyContext);
  if (!context) {
    throw new Error('useBiconomy must be used within a BiconomyProvider');
  }
  return context;
};

interface BiconomyProviderProps {
  children: ReactNode;
}

export function BiconomyProvider({ children }: BiconomyProviderProps) {
  const [smartAccount, setSmartAccount] = useState<BiconomySmartAccountV2 | null>(null);
  const [bundler, setBundler] = useState<Bundler | null>(null);
  const [paymaster, setPaymaster] = useState<BiconomyPaymaster | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  useEffect(() => {
    const initializeBiconomy = async () => {
      if (!isConnected || !walletClient || !address) return;

      try {
        // Initialize Bundler
        const bundlerInstance = new Bundler({
          bundlerUrl: process.env.NEXT_PUBLIC_BICONOMY_BUNDLER_URL || '',
          chainId: ChainId.POLYGON_MAINNET,
          entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
        });

        // Initialize Paymaster
        const paymasterInstance = new BiconomyPaymaster({
          paymasterUrl: process.env.NEXT_PUBLIC_BICONOMY_PAYMASTER_URL || '',
        });

        // Initialize Smart Account
        const smartAccountInstance = await BiconomySmartAccountV2.create({
          chainId: ChainId.POLYGON_MAINNET,
          bundler: bundlerInstance,
          paymaster: paymasterInstance,
          entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
          defaultValidationModule: undefined,
          activeValidationModule: undefined,
        });

        setSmartAccount(smartAccountInstance);
        setBundler(bundlerInstance);
        setPaymaster(paymasterInstance);
        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing Biconomy:', error);
      }
    };

    initializeBiconomy();
  }, [isConnected, walletClient, address]);

  const executeTransaction = async (tx: any) => {
    if (!smartAccount) throw new Error('Smart account not initialized');
    
    try {
      const userOpResponse = await smartAccount.sendTransaction(tx);
      const transactionDetail = await userOpResponse.wait();
      return transactionDetail;
    } catch (error) {
      console.error('Transaction execution failed:', error);
      throw error;
    }
  };

  const executeGaslessTransaction = async (tx: any) => {
    if (!smartAccount || !paymaster) throw new Error('Smart account or paymaster not initialized');
    
    try {
      const userOpResponse = await smartAccount.sendTransaction(tx, {
        paymasterServiceData: { mode: 'SPONSORED' },
      });
      const transactionDetail = await userOpResponse.wait();
      return transactionDetail;
    } catch (error) {
      console.error('Gasless transaction execution failed:', error);
      throw error;
    }
  };

  const contextValue: BiconomyContextType = {
    smartAccount,
    bundler,
    paymaster,
    isInitialized,
    executeTransaction,
    executeGaslessTransaction,
  };

  return (
    <BiconomyContext.Provider value={contextValue}>
      {children}
    </BiconomyContext.Provider>
  );
}