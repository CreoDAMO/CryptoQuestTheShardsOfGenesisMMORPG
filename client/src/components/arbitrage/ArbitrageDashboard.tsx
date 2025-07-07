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
      balance: 125000,
      price: 0.82,
      volume: 2500000,
      liquidityPool: '0x0b3CD8a843DEFDF01564a0342a89ba06c4fC9394'
    },
    {
      name: 'Base',
      balance: 87500,
      price: 0.85,
      volume: 1800000,
      liquidityPool: '0xd874aeaef376229c8d41d392c9ce272bd41e57d6'
    },
    {
      name: 'Ethereum',
      balance: 45000,
      price: 0.89,
      volume: 950000,
      liquidityPool: '0xb1E0B26f550203FAb31A0D9C1Eb4FFE330bfE4d0'
    }
  ]);

  const [nvidiaStats, setNvidiaStats] = useState<NvidiaCloudStats>({
    gpuUtilization: 78.5,
    miningHashrate: 245.7,
    aiModelAccuracy: 96.2,
    cloudCredits: 1250
  });

  const [isLoading, setIsLoading] = useState(false);

  const fetchArbitrageData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/arbitrage?action=status');
      const data = await response.json();
      if (data.success) {
        setArbitrageData(data.data.arbitrage);
      }
    } catch (error) {
      console.error('Failed to fetch arbitrage data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArbitrageData();
    const interval = setInterval(fetchArbitrageData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number, decimals = 2) => {
    if (num >= 1e12) return (num / 1e12).toFixed(decimals) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(decimals) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(decimals) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(decimals) + 'K';
    return num.toFixed(decimals);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            CQT Arbitrage Bot
          </h1>
          <p className="text-xl text-gray-300">Advanced cross-chain arbitrage with Nvidia Cloud AI</p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Total Profit */}
          <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-500/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Total Profit</h3>
              <DollarSign className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-green-400 mb-2">
              ${arbitrageData.totalProfit.toLocaleString()}
            </div>
            <div className="text-sm text-gray-300">
              <span className="text-green-400">+12.3%</span> vs last week
            </div>
          </div>

          {/* Active Opportunities */}
          <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-500/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Active Opportunities</h3>
              <Activity className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {arbitrageData.activeOpportunities}
            </div>
            <div className="text-sm text-gray-300">
              Scanning 5 networks
            </div>
          </div>

          {/* Success Rate */}
          <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Success Rate</h3>
              <Shield className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-purple-400 mb-2">
              {arbitrageData.successRate}%
            </div>
            <div className="text-sm text-gray-300">
              <span className="text-purple-400">+2.1%</span> this month
            </div>
          </div>
        </div>

        {/* Network Stats */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Network Overview</h2>
            <Network className="w-6 h-6 text-blue-400" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {networkStats.map((network, index) => (
              <div key={index} className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-white">{network.name}</h3>
                  <span className="text-xs text-gray-400">CQT</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Balance:</span>
                    <span className="text-white">{formatNumber(network.balance)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Price:</span>
                    <span className="text-green-400">${network.price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">24h Volume:</span>
                    <span className="text-blue-400">{formatNumber(network.volume)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nvidia Cloud Integration */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Nvidia Cloud AI Mining</h2>
            <Cpu className="w-6 h-6 text-green-400" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-slate-700/50 rounded-lg">
              <div className="text-2xl font-bold text-green-400 mb-1">
                {nvidiaStats.gpuUtilization}%
              </div>
              <div className="text-sm text-gray-300">GPU Utilization</div>
            </div>
            <div className="text-center p-4 bg-slate-700/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {nvidiaStats.miningHashrate} MH/s
              </div>
              <div className="text-sm text-gray-300">Mining Hashrate</div>
            </div>
            <div className="text-center p-4 bg-slate-700/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-400 mb-1">
                {nvidiaStats.aiModelAccuracy}%
              </div>
              <div className="text-sm text-gray-300">AI Model Accuracy</div>
            </div>
            <div className="text-center p-4 bg-slate-700/50 rounded-lg">
              <div className="text-2xl font-bold text-orange-400 mb-1">
                {nvidiaStats.cloudCredits}
              </div>
              <div className="text-sm text-gray-300">Cloud Credits</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <button 
            onClick={fetchArbitrageData}
            disabled={isLoading}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white font-medium hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Refreshing...' : 'Refresh Data'}
          </button>
          <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg text-white font-medium hover:from-green-600 hover:to-emerald-600 transition-colors">
            Execute Arbitrage
          </button>
          <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-colors">
            AI Optimize
          </button>
        </div>

        {/* Live Stats Ticker */}
        <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center justify-center space-x-8 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-gray-300">Live</span>
            </div>
            <div className="text-gray-300">
              Liquidity: <span className="text-blue-400">{formatNumber(arbitrageData.liquidityProvided)} CQT</span>
            </div>
            <div className="text-gray-300">
              Gas Optimization: <span className="text-green-400">{arbitrageData.gasOptimization}%</span>
            </div>
            <div className="text-gray-300">
              Mining Rewards: <span className="text-purple-400">{arbitrageData.miningRewards} ETH</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}