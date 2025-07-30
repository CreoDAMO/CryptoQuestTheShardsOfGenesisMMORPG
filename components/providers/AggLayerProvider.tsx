'use client';

import React, { createContext, useContext, ReactNode } from 'react';

interface AggLayerContextType {
  isConnected: boolean;
  chainId: number | null;
  unifiedLiquidity: number;
  crossChainPositions: any[];
  bridgeTokens: (fromChain: number, toChain: number, amount: number) => Promise<any>;
  getAggregatedBalance: () => Promise<number>;
}

const AggLayerContext = createContext<AggLayerContextType>({
  isConnected: false,
  chainId: null,
  unifiedLiquidity: 0,
  crossChainPositions: [],
  bridgeTokens: async () => ({ hash: '0x...' }),
  getAggregatedBalance: async () => 0,
});

export const useAggLayer = () => useContext(AggLayerContext);

interface AggLayerProviderProps {
  children: ReactNode;
}

export function AggLayerProvider({ children }: AggLayerProviderProps) {
  const contextValue: AggLayerContextType = {
    isConnected: true,
    chainId: 137,
    unifiedLiquidity: 2500000,
    crossChainPositions: [],
    bridgeTokens: async (fromChain: number, toChain: number, amount: number) => {
      console.log('AggLayer bridgeTokens placeholder:', { fromChain, toChain, amount });
      return { hash: '0x...' };
    },
    getAggregatedBalance: async () => {
      console.log('AggLayer getAggregatedBalance placeholder');
      return 100000;
    },
  };

  return (
    <AggLayerContext.Provider value={contextValue}>
      {children}
    </AggLayerContext.Provider>
  );
}
