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
}
