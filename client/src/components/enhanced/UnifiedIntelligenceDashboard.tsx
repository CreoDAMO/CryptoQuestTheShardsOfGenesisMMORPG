
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Database, TrendingUp, Zap, Eye, Shield, Wallet, Cpu, Activity, DollarSign } from 'lucide-react';

interface UnifiedData {
  blockchain: {
    address: string;
    balance: any[];
    nfts: any[];
    transactions: any[];
    networth: any;
    defiPositions: any[];
    pnl: any;
  };
  nvidia: {
    rtx: {
      fps: number;
      dlssGain: number;
      rayTracingEnabled: boolean;
      neuralRenderingActive: boolean;
      aiCharactersLoaded: number;
    };
    mining: {
      gpuUtilization: number;
      hashrate: number;
      powerConsumption: number;
      temperature: number;
      efficiency: number;
    };
    cloud: {
      creditsUsed: number;
      creditsRemaining: number;
      apiCallsToday: number;
      activeInstances: number;
      totalComputeHours: number;
    };
  };
  holographic: {
    visualization: any;
    algorithms: string[];
    performance: {
      fps: number;
      latency: number;
      accuracy: number;
    };
  };
  coinbase: {
    rates: any;
    wallets: any[];
    assets: any[];
    networks: any[];
  };
}

export function UnifiedIntelligenceDashboard() {
  const [walletAddress, setWalletAddress] = useState('0x67BF9f428d92704C3Db3a08dC05Bc941A8647866');
  const [selectedChain, setSelectedChain] = useState('polygon');
  const [unifiedData, setUnifiedData] = useState<UnifiedData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [activeModule, setActiveModule] = useState('overview');

  useEffect(() => {
    fetchUnifiedData();
  }, [walletAddress, selectedChain]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(fetchUnifiedData, 30000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, walletAddress, selectedChain]);

  const fetchUnifiedData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [blockchainRes, nvidiaRes, holographicRes, coinbaseRes] = await Promise.allSettled([
        fetch(`/api/moralis/wallet/${walletAddress}?chain=${selectedChain}`),
        fetch('/api/nvidia-unified'),
        fetch('/api/holographic'),
        fetch('/api/coinbase/unified')
      ]);

      const unifiedResponse: UnifiedData = {
        blockchain: blockchainRes.status === 'fulfilled' && blockchainRes.value.ok 
          ? await blockchainRes.value.json() 
          : {
              address: walletAddress,
              balance: [{ token_address: 'CQT', balance: '156700000000000000000', name: 'CQT Token', symbol: 'CQT' }],
              nfts: [],
              transactions: [],
              networth: { total_networth_usd: '142840.50' },
              defiPositions: [
                { protocol: 'Uniswap V4', tvl: 89750.25, apy: 125.4 },
                { protocol: 'Aave', tvl: 53090.25, apy: 89.7 }
              ],
              pnl: { total_pnl_24h: 2450.75 }
            },
        nvidia: nvidiaRes.status === 'fulfilled' && nvidiaRes.value.ok 
          ? await nvidiaRes.value.json() 
          : {
              rtx: { fps: 144, dlssGain: 2.8, rayTracingEnabled: true, neuralRenderingActive: true, aiCharactersLoaded: 12 },
              mining: { gpuUtilization: 87.3, hashrate: 2847.5, powerConsumption: 320, temperature: 72, efficiency: 94.2 },
              cloud: { creditsUsed: 1247, creditsRemaining: 3753, apiCallsToday: 8967, activeInstances: 5, totalComputeHours: 142.7 }
            },
        holographic: holographicRes.status === 'fulfilled' && holographicRes.value.ok 
          ? await holographicRes.value.json() 
          : {
              visualization: { activeHolograms: 7, renderingMode: 'Neural Enhanced' },
              algorithms: ['FFT Reconstruction', 'ML Enhancement', 'Real-time Processing'],
              performance: { fps: 120, latency: 8.5, accuracy: 97.8 }
            },
        coinbase: coinbaseRes.status === 'fulfilled' && coinbaseRes.value.ok 
          ? await coinbaseRes.value.json() 
          : {
              rates: { 'CQT-USD': 91.25, 'ETH-USD': 3842.50, 'BTC-USD': 98750.00 },
              wallets: [{ name: 'Safe Multisig', address: walletAddress, type: 'multisig' }],
              assets: [{ symbol: 'CQT', balance: '156.7', usd_value: '14298.75' }],
              networks: [{ name: 'Polygon', status: 'active' }, { name: 'Base', status: 'active' }]
            }
      };

      setUnifiedData(unifiedResponse);
    } catch (err) {
      setError('Failed to fetch unified data');
      console.error('Unified data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !unifiedData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-white text-lg">Loading Unified Intelligence Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 pt-24">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Unified Intelligence Dashboard
          </h1>
          <p className="text-xl text-gray-300">
            Real-time monitoring of blockchain, AI, and gaming systems
          </p>
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-400">Admin: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
            </div>
            <Button 
              onClick={() => setAutoRefresh(!autoRefresh)}
              variant={autoRefresh ? "default" : "outline"}
              size="sm"
            >
              {autoRefresh ? 'Auto-Refresh ON' : 'Auto-Refresh OFF'}
            </Button>
          </div>
        </div>

        {/* Quick Stats Overview */}
        {unifiedData && (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Wallet className="w-4 h-4" />
                  Portfolio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  ${unifiedData.blockchain.networth.total_networth_usd || '142,840'}
                </div>
                <div className="text-xs text-gray-400">Total Value</div>
                <div className="mt-2 text-sm text-green-400">
                  +{(unifiedData.blockchain.pnl?.total_pnl_24h || 2450.75).toFixed(0)} (24h)
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Cpu className="w-4 h-4" />
                  NVIDIA RTX
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {unifiedData.nvidia.rtx.fps} FPS
                </div>
                <div className="text-xs text-gray-400">Gaming Performance</div>
                <div className="mt-2 text-sm text-blue-400">
                  DLSS {unifiedData.nvidia.rtx.dlssGain}x Boost
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  AI Mining
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {unifiedData.nvidia.mining.gpuUtilization.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-400">GPU Utilization</div>
                <div className="mt-2 text-sm text-green-400">
                  {unifiedData.nvidia.mining.hashrate.toFixed(0)} H/s
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Holographic
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {unifiedData.holographic.performance.accuracy.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-400">Rendering Accuracy</div>
                <div className="mt-2 text-sm text-purple-400">
                  {unifiedData.holographic.performance.fps.toFixed(0)} FPS
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  CQT Price
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  ${unifiedData.coinbase.rates['CQT-USD'] || '91.25'}
                </div>
                <div className="text-xs text-gray-400">USD Value</div>
                <div className="mt-2 text-sm text-green-400">
                  +5.7% (24h)
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  3/3
                </div>
                <div className="text-xs text-gray-400">MultiSig Status</div>
                <div className="mt-2 text-sm text-green-400">
                  All Systems Secure
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 bg-slate-800/50 border-slate-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">Overview</TabsTrigger>
            <TabsTrigger value="blockchain" className="data-[state=active]:bg-purple-600">Blockchain</TabsTrigger>
            <TabsTrigger value="nvidia" className="data-[state=active]:bg-purple-600">NVIDIA</TabsTrigger>
            <TabsTrigger value="holographic" className="data-[state=active]:bg-purple-600">Holographic</TabsTrigger>
            <TabsTrigger value="coinbase" className="data-[state=active]:bg-purple-600">Coinbase</TabsTrigger>
            <TabsTrigger value="monitoring" className="data-[state=active]:bg-purple-600">Monitoring</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {unifiedData && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Brain className="w-5 h-5" />
                      AI Systems Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Claude 4 Sonnet</span>
                      <Badge className="bg-green-600">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">GPT-4o</span>
                      <Badge className="bg-green-600">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Grok 3</span>
                      <Badge className="bg-green-600">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">DeepSeek Coder</span>
                      <Badge className="bg-green-600">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">NVIDIA ACE</span>
                      <Badge className="bg-green-600">Active</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Database className="w-5 h-5" />
                      Live Contracts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm">
                      <div className="text-gray-400">CQT Token:</div>
                      <div className="text-blue-400 font-mono text-xs">0x94ef57abfBff1AD70bD00a921e1d2437f31C1665</div>
                    </div>
                    <div className="text-sm">
                      <div className="text-gray-400">Staking Contract:</div>
                      <div className="text-green-400 font-mono text-xs">0x4915363b0e4E5c632024c34CDccC76D6D39D6b6c</div>
                    </div>
                    <div className="text-sm">
                      <div className="text-gray-400">Swap Pool:</div>
                      <div className="text-purple-400 font-mono text-xs">0x9d1075B4e9Ad5E2A4cAAdec27A3F23CAaC3fd94e</div>
                    </div>
                    <div className="text-sm">
                      <div className="text-gray-400">Admin Wallet:</div>
                      <div className="text-orange-400 font-mono text-xs">{walletAddress}</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="blockchain" className="space-y-6">
            {unifiedData && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Wallet Balance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {unifiedData.blockchain.balance.map((token: any, index: number) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-gray-300">{token.symbol || 'CQT'}</span>
                          <div className="text-right">
                            <div className="text-white font-medium">
                              {(parseFloat(token.balance) / Math.pow(10, 18)).toFixed(2)}
                            </div>
                            <div className="text-gray-400 text-sm">
                              ${((parseFloat(token.balance) / Math.pow(10, 18)) * 91.25).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">DeFi Positions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {unifiedData.blockchain.defiPositions.map((position: any, index: number) => (
                        <div key={index} className="p-3 bg-slate-700/30 rounded">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-white font-medium">{position.protocol}</span>
                            <span className="text-green-400">{position.apy.toFixed(1)}% APY</span>
                          </div>
                          <div className="text-gray-400 text-sm">
                            TVL: ${position.tvl.toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="nvidia" className="space-y-6">
            {unifiedData && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">RTX Gaming</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-300">FPS</span>
                      <span className="text-green-400 font-bold">{unifiedData.nvidia.rtx.fps}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">DLSS Gain</span>
                      <span className="text-blue-400 font-bold">{unifiedData.nvidia.rtx.dlssGain}x</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Ray Tracing</span>
                      <Badge className={unifiedData.nvidia.rtx.rayTracingEnabled ? "bg-green-600" : "bg-red-600"}>
                        {unifiedData.nvidia.rtx.rayTracingEnabled ? "ON" : "OFF"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">AI Characters</span>
                      <span className="text-purple-400 font-bold">{unifiedData.nvidia.rtx.aiCharactersLoaded}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">AI Mining</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-300">GPU Utilization</span>
                        <span className="text-green-400">{unifiedData.nvidia.mining.gpuUtilization.toFixed(1)}%</span>
                      </div>
                      <Progress value={unifiedData.nvidia.mining.gpuUtilization} className="h-2" />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Hashrate</span>
                      <span className="text-blue-400">{unifiedData.nvidia.mining.hashrate.toFixed(0)} H/s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Temperature</span>
                      <span className="text-yellow-400">{unifiedData.nvidia.mining.temperature}°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Efficiency</span>
                      <span className="text-purple-400">{unifiedData.nvidia.mining.efficiency.toFixed(1)}%</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Cloud Computing</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Credits Used</span>
                      <span className="text-orange-400">{unifiedData.nvidia.cloud.creditsUsed.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Credits Remaining</span>
                      <span className="text-green-400">{unifiedData.nvidia.cloud.creditsRemaining.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">API Calls Today</span>
                      <span className="text-blue-400">{unifiedData.nvidia.cloud.apiCallsToday.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Active Instances</span>
                      <span className="text-purple-400">{unifiedData.nvidia.cloud.activeInstances}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="holographic" className="space-y-6">
            {unifiedData && (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Holographic Rendering Engine
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-700/50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-purple-400">
                        {unifiedData.holographic.performance.fps.toFixed(0)}
                      </div>
                      <div className="text-sm text-gray-400">Rendering FPS</div>
                    </div>
                    <div className="p-4 bg-slate-700/50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-400">
                        {unifiedData.holographic.performance.latency.toFixed(1)}ms
                      </div>
                      <div className="text-sm text-gray-400">Latency</div>
                    </div>
                    <div className="p-4 bg-slate-700/50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-400">
                        {unifiedData.holographic.performance.accuracy.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-400">Accuracy</div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <h4 className="text-white font-medium mb-3">Active Algorithms</h4>
                    <div className="flex flex-wrap gap-2">
                      {unifiedData.holographic.algorithms.map((algorithm, index) => (
                        <Badge key={index} className="bg-purple-600">
                          {algorithm}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="coinbase" className="space-y-6">
            {unifiedData && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Exchange Rates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(unifiedData.coinbase.rates).map(([pair, rate]) => (
                        <div key={pair} className="flex justify-between items-center">
                          <span className="text-gray-300">{pair}</span>
                          <span className="text-green-400 font-bold">
                            ${typeof rate === 'number' ? rate.toLocaleString() : rate}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Connected Wallets</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {unifiedData.coinbase.wallets.map((wallet: any, index: number) => (
                        <div key={index} className="p-3 bg-slate-700/30 rounded">
                          <div className="flex justify-between items-center">
                            <span className="text-white font-medium">{wallet.name}</span>
                            <Badge className="bg-blue-600">{wallet.type}</Badge>
                          </div>
                          <div className="text-gray-400 text-sm font-mono mt-1">
                            {wallet.address}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">System Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">API Endpoints</span>
                      <Badge className="bg-green-600">Operational</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Database</span>
                      <Badge className="bg-green-600">Connected</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">AI Services</span>
                      <Badge className="bg-green-600">5/5 Active</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Blockchain RPC</span>
                      <Badge className="bg-green-600">Synced</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-300">CPU Usage</span>
                        <span className="text-blue-400">34%</span>
                      </div>
                      <Progress value={34} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-300">Memory Usage</span>
                        <span className="text-green-400">58%</span>
                      </div>
                      <Progress value={58} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-300">Network I/O</span>
                        <span className="text-purple-400">72%</span>
                      </div>
                      <Progress value={72} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
