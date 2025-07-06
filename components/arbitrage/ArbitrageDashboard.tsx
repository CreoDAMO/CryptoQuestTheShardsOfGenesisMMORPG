'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Zap, 
  Bot, 
  Shield, 
  DollarSign, 
  Activity, 
  Cpu, 
  Network,
  BarChart3,
  ArrowUpDown,
  Coins,
  Database
} from 'lucide-react';

interface ArbitrageData {
  totalProfit: number;
  activeOpportunities: number;
  successRate: number;
  liquidityProvided: number;
  miningRewards: number;
  gasOptimization: number;
}

interface NetworkStats {
  name: string;
  balance: number;
  price: number;
  volume: number;
  liquidityPool: string;
}

interface NvidiaCloudStats {
  gpuUtilization: number;
  miningHashrate: number;
  aiModelAccuracy: number;
  cloudCredits: number;
}

export function ArbitrageDashboard() {
  const [arbitrageData, setArbitrageData] = useState<ArbitrageData>({
    totalProfit: 15420.85,
    activeOpportunities: 12,
    successRate: 94.7,
    liquidityProvided: 7500000000000, // 7.5T CQT
    miningRewards: 3.45,
    gasOptimization: 87.3
  });

  const [networkStats, setNetworkStats] = useState<NetworkStats[]>([
    {
      name: 'Polygon',
      balance: 39.23,
      price: 0.2325,
      volume: 125000,
      liquidityPool: '0xb1e0b26f550203FAb31A0D9C1Eb4FFE330bfE4d0'
    },
    {
      name: 'Base',
      balance: 15.67,
      price: 0.10,
      volume: 89000,
      liquidityPool: '0xd874aeaef376229c8d41d392c9ce272bd41e57d6'
    }
  ]);

  const [nvidiaStats, setNvidiaStats] = useState<NvidiaCloudStats>({
    gpuUtilization: 78.5,
    miningHashrate: 245.7,
    aiModelAccuracy: 96.2,
    cloudCredits: 1250
  });

  const [isArbitrageActive, setIsArbitrageActive] = useState(true);
  const [isMiningActive, setIsMiningActive] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-slate-900 to-purple-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-purple-500 rounded-full">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-purple-400 bg-clip-text text-transparent">
            CQT Arbitrage Bot
          </h1>
          <p className="text-xl text-gray-300">Cross-chain arbitrage with AI mining & Nvidia Cloud</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="text-center p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
            <div className="text-2xl font-bold text-emerald-400">${arbitrageData.totalProfit.toLocaleString()}</div>
            <div className="text-sm text-gray-300">Total Profit</div>
          </div>
          <div className="text-center p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
            <div className="text-2xl font-bold text-blue-400">{arbitrageData.activeOpportunities}</div>
            <div className="text-sm text-gray-300">Active Opportunities</div>
          </div>
          <div className="text-center p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
            <div className="text-2xl font-bold text-green-400">{arbitrageData.successRate}%</div>
            <div className="text-sm text-gray-300">Success Rate</div>
          </div>
          <div className="text-center p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
            <div className="text-2xl font-bold text-purple-400">{(arbitrageData.liquidityProvided / 1e12).toFixed(1)}T</div>
            <div className="text-sm text-gray-300">CQT Liquidity</div>
          </div>
          <div className="text-center p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
            <div className="text-2xl font-bold text-yellow-400">{arbitrageData.miningRewards} ETH</div>
            <div className="text-sm text-gray-300">Mining Rewards</div>
          </div>
          <div className="text-center p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
            <div className="text-2xl font-bold text-cyan-400">{arbitrageData.gasOptimization}%</div>
            <div className="text-sm text-gray-300">Gas Optimization</div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Bot className="w-5 h-5" />
              Arbitrage Control
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Auto Arbitrage</span>
                <button
                  onClick={() => setIsArbitrageActive(!isArbitrageActive)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    isArbitrageActive ? 'bg-emerald-500' : 'bg-slate-600'
                  } relative`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                    isArbitrageActive ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Status</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  isArbitrageActive ? 'bg-emerald-900 text-emerald-300' : 'bg-red-900 text-red-300'
                }`}>
                  {isArbitrageActive ? 'Active' : 'Paused'}
                </span>
              </div>
              <button className="w-full p-3 bg-gradient-to-r from-emerald-500 to-purple-500 rounded text-white font-medium hover:from-emerald-600 hover:to-purple-600 transition-colors">
                Manual Arbitrage Scan
              </button>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Cpu className="w-5 h-5" />
              Nvidia Cloud Mining
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">AI Mining</span>
                <button
                  onClick={() => setIsMiningActive(!isMiningActive)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    isMiningActive ? 'bg-green-500' : 'bg-slate-600'
                  } relative`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                    isMiningActive ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">GPU Utilization</span>
                  <span className="text-white">{nvidiaStats.gpuUtilization}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full" 
                    style={{ width: `${nvidiaStats.gpuUtilization}%` }}
                  />
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Hashrate</span>
                <span className="text-green-400">{nvidiaStats.miningHashrate} MH/s</span>
              </div>
            </div>
          </div>
        </div>

        {/* Network Statistics */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Network className="w-5 h-5" />
            Cross-Chain Network Stats
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {networkStats.map((network, index) => (
              <div key={index} className="bg-slate-700/50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-3">{network.name}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">CQT Balance</span>
                    <span className="text-white">{network.balance}T CQT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Price</span>
                    <span className="text-green-400">${network.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">24h Volume</span>
                    <span className="text-blue-400">${network.volume.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">LP Address</span>
                    <span className="text-purple-400 text-xs font-mono">
                      {network.liquidityPool.slice(0, 8)}...{network.liquidityPool.slice(-6)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Arbitrage Opportunities */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <ArrowUpDown className="w-5 h-5" />
            Live Arbitrage Opportunities
          </h3>
          <div className="space-y-3">
            {[
              { pair: 'CQT/WETH', from: 'Polygon', to: 'Base', profit: 8.7, volume: 150000 },
              { pair: 'CQT/USDC', from: 'Base', to: 'Polygon', profit: 12.3, volume: 89000 },
              { pair: 'CQT/WMATIC', from: 'Polygon', to: 'Base', profit: 5.4, volume: 234000 }
            ].map((opportunity, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <div>
                    <div className="font-medium text-white">{opportunity.pair}</div>
                    <div className="text-sm text-gray-300">{opportunity.from} → {opportunity.to}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-green-400">+{opportunity.profit}%</div>
                  <div className="text-sm text-gray-300">${opportunity.volume.toLocaleString()}</div>
                </div>
                <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors">
                  Execute
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Nvidia Cloud AI Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              AI Security & Analytics
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-300">Model Accuracy</span>
                <span className="text-green-400">{nvidiaStats.aiModelAccuracy}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">ZK Proof Verification</span>
                <span className="text-blue-400">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Quantum Resistance</span>
                <span className="text-purple-400">Enabled</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Rust Wrapper</span>
                <span className="text-orange-400">Secured</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Database className="w-5 h-5" />
              Cloud Resources
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-300">Cloud Credits</span>
                <span className="text-yellow-400">{nvidiaStats.cloudCredits.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">GPU Instances</span>
                <span className="text-cyan-400">4x A100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">API Calls/Hour</span>
                <span className="text-green-400">15,240</span>
              </div>
              <button className="w-full p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded text-white font-medium hover:from-blue-600 hover:to-purple-600 transition-colors">
                Scale GPU Resources
              </button>
            </div>
          </div>
        </div>

        {/* Performance Chart Placeholder */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Performance Analytics
          </h3>
          <div className="h-64 bg-slate-700/30 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-400">Real-time arbitrage performance chart</p>
              <p className="text-sm text-gray-500">Powered by Nvidia Cloud AI analytics</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}