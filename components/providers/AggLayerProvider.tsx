'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAccount, useChainId } from 'wagmi';

interface AggLayerContextType {
  isConnected: boolean;
  supportedChains: number[];
  currentChain: number | null;
  bridgeAssets: (fromChain: number, toChain: number, amount: string, asset: string) => Promise<any>;
  getUnifiedBalance: (asset: string) => Promise<string>;
  getCrossChainLiquidity: () => Promise<any>;
  isInitialized: boolean;
}

const AggLayerContext = createContext<AggLayerContextType>({
  isConnected: false,
  supportedChains: [],
  currentChain: null,
  bridgeAssets: async () => null,
  getUnifiedBalance: async () => '0',
  getCrossChainLiquidity: async () => null,
  isInitialized: false,
});

export const useAggLayer = () => {
  const context = useContext(AggLayerContext);
  if (!context) {
    throw new Error('useAggLayer must be used within an AggLayerProvider');
  }
  return context;
};

interface AggLayerProviderProps {
  children: ReactNode;
}

export function AggLayerProvider({ children }: AggLayerProviderProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [supportedChains] = useState([137, 8453, 1, 324, 1101]); // Polygon, Base, Ethereum, zkSync, Polygon zkEVM
  
  const { address, isConnected: walletConnected } = useAccount();
  const chainId = useChainId();

  useEffect(() => {
    const initializeAggLayer = async () => {
      if (!walletConnected || !address) return;

      try {
        // Initialize AggLayer SDK
        setIsConnected(true);
        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing AggLayer:', error);
      }
    };

    initializeAggLayer();
  }, [walletConnected, address]);

  const bridgeAssets = async (fromChain: number, toChain: number, amount: string, asset: string) => {
    if (!isInitialized || !address) {
      throw new Error('AggLayer not initialized or wallet not connected');
    }

    try {
      // Simulate bridge transaction
      const bridgeData = {
        fromChain,
        toChain,
        amount,
        asset,
        recipient: address,
        timestamp: Date.now(),
      };

      // In a real implementation, this would call the AggLayer SDK
      console.log('Bridging assets:', bridgeData);
      
      return {
        success: true,
        transactionHash: `0x${Math.random().toString(16).slice(2)}`,
        bridgeData,
      };
    } catch (error) {
      console.error('Bridge transaction failed:', error);
      throw error;
    }
  };

  const getUnifiedBalance = async (asset: string) => {
    if (!isInitialized || !address) return '0';

    try {
      // Simulate unified balance across chains
      const balances = {
        'MATIC': '1000.5',
        'ETH': '2.5',
        'USDC': '5000.0',
        'CQT': '10000.0',
      };

      return balances[asset as keyof typeof balances] || '0';
    } catch (error) {
      console.error('Failed to get unified balance:', error);
      return '0';
    }
  };

  const getCrossChainLiquidity = async () => {
    if (!isInitialized) return null;

    try {
      // Simulate cross-chain liquidity data
      return {
        totalLiquidity: '4250000000', // $4.25B
        chains: [
          { id: 137, name: 'Polygon', liquidity: '1500000000' },
          { id: 8453, name: 'Base', liquidity: '1200000000' },
          { id: 1, name: 'Ethereum', liquidity: '1000000000' },
          { id: 324, name: 'zkSync', liquidity: '350000000' },
          { id: 1101, name: 'Polygon zkEVM', liquidity: '200000000' },
        ],
        apr: {
          'MATIC/CQT': '125.4%',
          'WETH/CQT': '89.7%',
          'USDC/CQT': '67.3%',
        },
      };
    } catch (error) {
      console.error('Failed to get cross-chain liquidity:', error);
      return null;
    }
  };

  const contextValue: AggLayerContextType = {
    isConnected,
    supportedChains,
    currentChain: chainId,
    bridgeAssets,
    getUnifiedBalance,
    getCrossChainLiquidity,
    isInitialized,
  };

  return (
    <AggLayerContext.Provider value={contextValue}>
      {children}
    </AggLayerContext.Provider>
  );
}