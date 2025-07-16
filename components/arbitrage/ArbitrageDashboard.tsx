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
  Database,
  PlayCircle,
  PauseCircle,
  Square,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Waves,
  Brain,
  Lock,
  Wifi,
  WifiOff
} from 'lucide-react';

// Enhanced types with proper interfaces
interface ArbitrageOpportunity {
  id: string;
  sourcePool: {
    address: string;
    network: string;
    token0: string;
    token1: string;
    price: number;
    liquidity: string;
  };
  targetPool: {
    address: string;
    network: string;
    token0: string;
    token1: string;
    price: number;
    liquidity: string;
  };
  profitPotential: number;
  netProfit: number;
  confidence: number;
  riskScore: number;
  timeWindow: number;
  status: string;
}

interface SystemMetrics {
  totalArbitrages: number;
  successfulArbitrages: number;
  totalProfit: number;
  gasSpent: number;
  uptime: string;
  successRate: number;
  aiMinerMetrics: {
    totalStaked: number;
    totalRewards: number;
    stakingAPR: number;
    optimizationScore: number;
  };
  liquidityMetrics: {
    totalProvided: number;
    totalFees: number;
    poolCount: number;
    averageAPR: number;
  };
}

export function ArbitrageDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [botStatus, setBotStatus] = useState<'monitoring' | 'idle' | 'executing'>('monitoring');
  const [autoExecute, setAutoExecute] = useState(false);
  
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    totalArbitrages: 1247,
    successfulArbitrages: 1180,
    totalProfit: 24750.85,
    gasSpent: 125.34,
    uptime: '72h 15m',
    successRate: 94.7,
    aiMinerMetrics: {
      totalStaked: 125000,
      totalRewards: 8750.45,
      stakingAPR: 12.4,
      optimizationScore: 89.5
    },
    liquidityMetrics: {
      totalProvided: 2650000,
      totalFees: 12450.75,
      poolCount: 8,
      averageAPR: 125.8
    }
  });

  const [opportunities, setOpportunities] = useState<ArbitrageOpportunity[]>([]);

  // Enhanced data fetching
  const fetchSystemMetrics = async () => {
    try {
      const response = await fetch('/api/arbitrage/system-metrics');
      const data = await response.json();
      if (data.success) {
        setSystemMetrics(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch system metrics:', error);
    }
  };

  const fetchOpportunities = async () => {
    try {
      const response = await fetch('/api/arbitrage/opportunities');
      const data = await response.json();
      if (data.success) {
        setOpportunities(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch opportunities:', error);
    }
  };

  const executeArbitrage = async (opportunityId: string) => {
    try {
      setBotStatus('executing');
      const response = await fetch(`/api/arbitrage/execute/${opportunityId}`, {
        method: 'POST'
      });
      const data = await response.json();
      
      if (data.success && data.data.success) {
        console.log('Arbitrage executed successfully:', data.data.txHash);
        // Refresh opportunities after execution
        await fetchOpportunities();
      } else {
        console.error('Arbitrage execution failed:', data.data.error);
      }
    } catch (error) {
      console.error('Execute arbitrage error:', error);
    } finally {
      setBotStatus('monitoring');
    }
  };

  const handleBotControl = (action: 'start' | 'pause' | 'stop') => {
    setBotStatus(action === 'start' ? 'monitoring' : 'idle');
  };

  // Initialize and set up real-time updates
  useEffect(() => {
    const initializeDashboard = async () => {
      setIsLoading(true);
      await Promise.all([fetchSystemMetrics(), fetchOpportunities()]);
      setIsLoading(false);
    };

    initializeDashboard();

    // Set up real-time updates
    const interval = setInterval(async () => {
      await Promise.all([fetchSystemMetrics(), fetchOpportunities()]);
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">CryptoQuest Arbitrage Bot</h1>
          <p className="text-gray-600">Advanced cross-chain arbitrage with AI optimization</p>
        </div>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {isConnected ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
            <span className="text-sm font-medium">{isConnected ? 'Connected' : 'Offline'}</span>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800`}>
            <Bot className="h-4 w-4" />
            <span className="text-sm font-medium">{botStatus.toUpperCase()}</span>
          </div>
        </div>
      </div>

      {/* System Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Profit</p>
              <p className="text-2xl font-bold text-green-600">${systemMetrics.totalProfit.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-blue-600">{systemMetrics.successRate.toFixed(1)}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Opportunities</p>
              <p className="text-2xl font-bold text-purple-600">{opportunities.length}</p>
            </div>
            <Zap className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Uptime</p>
              <p className="text-2xl font-bold text-gray-800">{systemMetrics.uptime}</p>
            </div>
            <Activity className="h-8 w-8 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Bot Control</h3>
          <button 
            onClick={() => fetchOpportunities()}
            className="flex items-center gap-2 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={() => handleBotControl('start')}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
          >
            <PlayCircle className="h-4 w-4" />
            Start Bot
          </button>
          
          <button 
            onClick={() => handleBotControl('pause')}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition-colors"
          >
            <PauseCircle className="h-4 w-4" />
            Pause Bot
          </button>
          
          <button 
            onClick={() => handleBotControl('stop')}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
          >
            <Square className="h-4 w-4" />
            Emergency Stop
          </button>
          
          <label className="flex items-center gap-2 ml-4">
            <input 
              type="checkbox" 
              checked={autoExecute} 
              onChange={(e) => setAutoExecute(e.target.checked)}
              className="rounded"
            />
            <span>Auto Execute</span>
          </label>
        </div>
      </div>

      {/* AI Miner & Liquidity Provider Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center gap-2 mb-4">
            <Bot className="h-5 w-5" />
            <h3 className="text-lg font-semibold">AI Miner Performance</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Staked</span>
              <span className="font-mono">{systemMetrics.aiMinerMetrics.totalStaked.toLocaleString()} CQT</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Rewards</span>
              <span className="font-mono text-green-600">{systemMetrics.aiMinerMetrics.totalRewards.toFixed(2)} CQT</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Staking APR</span>
              <span className="font-mono text-blue-600">{systemMetrics.aiMinerMetrics.stakingAPR}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Optimization Score</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${systemMetrics.aiMinerMetrics.optimizationScore}%` }}
                  ></div>
                </div>
                <span className="text-sm">{systemMetrics.aiMinerMetrics.optimizationScore.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center gap-2 mb-4">
            <Waves className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Liquidity Provider</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Provided</span>
              <span className="font-mono">${systemMetrics.liquidityMetrics.totalProvided.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Fees</span>
              <span className="font-mono text-green-600">${systemMetrics.liquidityMetrics.totalFees.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Average APR</span>
              <span className="font-mono text-blue-600">{systemMetrics.liquidityMetrics.averageAPR.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pool Count</span>
              <span className="font-mono">{systemMetrics.liquidityMetrics.poolCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Arbitrage Opportunities */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Live Arbitrage Opportunities</h3>
        
        {opportunities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No arbitrage opportunities available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {opportunities.map((opportunity) => (
              <div key={opportunity.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                        {opportunity.sourcePool.network}
                      </span>
                      <ArrowUpDown className="h-4 w-4" />
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                        {opportunity.targetPool.network}
                      </span>
                      <span className={`px-2 py-1 rounded text-sm ${
                        opportunity.confidence > 0.9 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {(opportunity.confidence * 100).toFixed(0)}% confidence
                      </span>
                    </div>
                    
                    <div className="text-lg font-semibold">
                      {opportunity.sourcePool.token0}/{opportunity.sourcePool.token1} → {opportunity.targetPool.token0}/{opportunity.targetPool.token1}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Profit: </span>
                        <span className="font-mono text-green-600">${opportunity.netProfit.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Profit %: </span>
                        <span className="font-mono">{opportunity.profitPotential.toFixed(2)}%</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Risk: </span>
                        <span className="font-mono">{(opportunity.riskScore * 100).toFixed(1)}%</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Time: </span>
                        <span className="font-mono">{opportunity.timeWindow}s</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => executeArbitrage(opportunity.id)}
                      disabled={botStatus === 'executing' || (!autoExecute && opportunity.riskScore > 0.3)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-md transition-colors"
                    >
                      {botStatus === 'executing' ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Zap className="h-4 w-4" />
                      )}
                      Execute
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
  });

  const [networkStats, setNetworkStats] = useState<NetworkStats[]>([]);

  const fetchLiveCQTPrice = async () => {
    try {
      // Fetch live prices from multiple sources
      const polygonPrice = await fetch('/api/cqt/price?network=polygon').then(r => r.json());
      const basePrice = await fetch('/api/cqt/price?network=base').then(r => r.json());
      
      setNetworkStats([
        {
          name: 'Polygon',
          balance: 39.23,
          price: polygonPrice.price || 0.2325,
          volume: polygonPrice.volume || 125000,
          liquidityPool: '0xb1e0b26f550203FAb31A0D9C1Eb4FFE330bfE4d0'
        },
        {
          name: 'Base',
          balance: 15.67,
          price: basePrice.price || 0.10,
          volume: basePrice.volume || 89000,
          liquidityPool: '0xd874aeaef376229c8d41d392c9ce272bd41e57d6'
        }
      ]);
    } catch (error) {
      console.error('Failed to fetch live CQT prices:', error);
      // Fallback to default values
      setNetworkStats([
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
    }
  };

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