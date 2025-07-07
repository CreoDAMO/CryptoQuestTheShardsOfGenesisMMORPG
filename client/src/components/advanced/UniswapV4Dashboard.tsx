import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  Zap, TrendingUp, DollarSign, Activity, Settings,
  BarChart3, ArrowUpDown, Layers, Target, Clock,
  Shield, Sparkles, RefreshCw, AlertCircle, CheckCircle
} from 'lucide-react';

interface PoolV4 {
  id: string;
  token0: string;
  token1: string;
  fee: number;
  tvl: number;
  volume24h: number;
  apr: number;
  hooks: string[];
  liquidity: string;
  sqrtPriceX96: string;
  isActive: boolean;
}

interface PositionV4 {
  id: string;
  poolId: string;
  tickLower: number;
  tickUpper: number;
  liquidity: string;
  feeGrowthInside0LastX128: string;
  feeGrowthInside1LastX128: string;
  tokensOwed0: string;
  tokensOwed1: string;
  uncollectedFees: number;
  inRange: boolean;
}

interface HookInfo {
  name: string;
  address: string;
  description: string;
  active: boolean;
  gasUsage: number;
}

const mockPoolsV4: PoolV4[] = [
  {
    id: '0x1234...pool1',
    token0: 'CQT',
    token1: 'WETH',
    fee: 3000,
    tvl: 2847329,
    volume24h: 458932,
    apr: 127.4,
    hooks: ['beforeSwap', 'afterSwap', 'dynamicFee'],
    liquidity: '847329847329847329',
    sqrtPriceX96: '1234567890123456789012345678',
    isActive: true
  },
  {
    id: '0x5678...pool2',
    token0: 'CQT',
    token1: 'USDC',
    fee: 500,
    tvl: 1239847,
    volume24h: 234871,
    apr: 89.7,
    hooks: ['beforeModifyLiquidity', 'afterModifyLiquidity'],
    liquidity: '1239847239847239847',
    sqrtPriceX96: '9876543210987654321098765432',
    isActive: true
  }
];

const mockPositions: PositionV4[] = [
  {
    id: '1',
    poolId: '0x1234...pool1',
    tickLower: -887220,
    tickUpper: 887220,
    liquidity: '123456789012345678',
    feeGrowthInside0LastX128: '12345678901234567890',
    feeGrowthInside1LastX128: '98765432109876543210',
    tokensOwed0: '1234567890',
    tokensOwed1: '9876543210',
    uncollectedFees: 247.83,
    inRange: true
  }
];

const mockHooks: HookInfo[] = [
  {
    name: 'Dynamic Fee Hook',
    address: '0xDynamicFee123...',
    description: 'Adjusts fees based on volatility and volume',
    active: true,
    gasUsage: 15000
  },
  {
    name: 'Time-Weighted Average Price',
    address: '0xTWAP456...',
    description: 'Provides on-chain TWAP oracle functionality',
    active: true,
    gasUsage: 12000
  },
  {
    name: 'Limit Order Hook',
    address: '0xLimitOrder789...',
    description: 'Enables limit orders within the pool',
    active: false,
    gasUsage: 18000
  }
];

export function UniswapV4Dashboard() {
  const [pools, setPools] = useState<PoolV4[]>(mockPoolsV4);
  const [positions, setPositions] = useState<PositionV4[]>(mockPositions);
  const [hooks, setHooks] = useState<HookInfo[]>(mockHooks);
  const [autoCompound, setAutoCompound] = useState(true);
  const [selectedPool, setSelectedPool] = useState<string | null>(null);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPools(prev => prev.map(pool => ({
        ...pool,
        tvl: pool.tvl + (Math.random() - 0.5) * 10000,
        volume24h: pool.volume24h + (Math.random() - 0.5) * 5000,
        apr: Math.max(0, pool.apr + (Math.random() - 0.5) * 5)
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const collectFees = (positionId: string) => {
    setPositions(prev => prev.map(pos => 
      pos.id === positionId 
        ? { ...pos, uncollectedFees: 0, tokensOwed0: '0', tokensOwed1: '0' }
        : pos
    ));
  };

  const addLiquidity = (poolId: string, amount0: number, amount1: number) => {
    // Simulate adding liquidity
    setPools(prev => prev.map(pool => 
      pool.id === poolId 
        ? { ...pool, tvl: pool.tvl + amount0 + amount1 }
        : pool
    ));
  };

  const enableHook = (hookName: string) => {
    setHooks(prev => prev.map(hook => 
      hook.name === hookName 
        ? { ...hook, active: !hook.active }
        : hook
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-500 rounded-full mb-4">
            <Layers className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
            Uniswap V4 Advanced DeFi
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Revolutionary V4 features: Hooks, custom pools, enhanced capital efficiency,
            automated fee collection, and advanced liquidity management
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <Badge variant="outline" className="bg-violet-500/20 text-violet-400 border-violet-400">
              <Zap className="w-4 h-4 mr-2" />
              V4 Universal Router
            </Badge>
            <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border-purple-400">
              <Layers className="w-4 h-4 mr-2" />
              Custom Hooks Active
            </Badge>
            <Badge variant="outline" className="bg-pink-500/20 text-pink-400 border-pink-400">
              <Sparkles className="w-4 h-4 mr-2" />
              Auto-Compounding
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4 text-center">
              <DollarSign className="w-6 h-6 mx-auto mb-2 text-green-400" />
              <div className="text-2xl font-bold text-white">
                ${pools.reduce((acc, pool) => acc + pool.tvl, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">Total TVL</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-blue-400" />
              <div className="text-2xl font-bold text-white">
                ${pools.reduce((acc, pool) => acc + pool.volume24h, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">24h Volume</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4 text-center">
              <Target className="w-6 h-6 mx-auto mb-2 text-purple-400" />
              <div className="text-2xl font-bold text-white">
                {(pools.reduce((acc, pool) => acc + pool.apr, 0) / pools.length).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-400">Avg APR</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4 text-center">
              <Activity className="w-6 h-6 mx-auto mb-2 text-cyan-400" />
              <div className="text-2xl font-bold text-white">{pools.length}</div>
              <div className="text-sm text-gray-400">Active Pools</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Interface */}
        <Tabs defaultValue="pools" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
            <TabsTrigger value="pools">V4 Pools</TabsTrigger>
            <TabsTrigger value="positions">Positions</TabsTrigger>
            <TabsTrigger value="hooks">Hooks</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="pools" className="space-y-6">
            <div className="grid gap-4">
              {pools.map((pool) => (
                <Card 
                  key={pool.id} 
                  className={`bg-slate-800/50 border-slate-700 cursor-pointer transition-all ${
                    selectedPool === pool.id ? 'ring-2 ring-violet-400' : ''
                  }`}
                  onClick={() => setSelectedPool(pool.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <ArrowUpDown className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{pool.token0}/{pool.token1}</h3>
                          <p className="text-sm text-gray-400">Fee: {pool.fee / 10000}%</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`${
                          pool.isActive ? 'bg-green-500/20 text-green-400 border-green-400' : 'bg-red-500/20 text-red-400 border-red-400'
                        }`}>
                          {pool.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Badge variant="outline" className="bg-violet-500/20 text-violet-400 border-violet-400">
                          {pool.hooks.length} Hooks
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-400">
                          ${pool.tvl.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-400">TVL</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-400">
                          ${pool.volume24h.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-400">24h Volume</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-400">
                          {pool.apr.toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-400">APR</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-cyan-400">
                          {(pool.volume24h / pool.tvl * 365 * 100).toFixed(2)}%
                        </div>
                        <div className="text-sm text-gray-400">Fee APR</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {pool.hooks.map((hook) => (
                        <Badge key={hook} variant="outline" className="bg-purple-500/20 text-purple-400 border-purple-400">
                          {hook}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        size="sm"
                        className="bg-violet-600 hover:bg-violet-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          addLiquidity(pool.id, 1000, 1000);
                        }}
                      >
                        Add Liquidity
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-blue-400 text-blue-400"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Swap
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-purple-400 text-purple-400"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Configure Hooks
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="positions" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Your Liquidity Positions</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-white">Auto-Compound</span>
                  <Switch checked={autoCompound} onCheckedChange={setAutoCompound} />
                </div>
                <Button className="bg-violet-600 hover:bg-violet-700">
                  <Zap className="w-4 h-4 mr-2" />
                  New Position
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {positions.map((position) => {
                const pool = pools.find(p => p.id === position.poolId);
                if (!pool) return null;

                return (
                  <Card key={position.id} className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                            <Layers className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">{pool.token0}/{pool.token1}</h3>
                            <p className="text-sm text-gray-400">
                              Range: {position.tickLower} to {position.tickUpper}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={`${
                            position.inRange ? 'bg-green-500/20 text-green-400 border-green-400' : 'bg-yellow-500/20 text-yellow-400 border-yellow-400'
                          }`}>
                            {position.inRange ? 'In Range' : 'Out of Range'}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-white">
                            {(parseFloat(position.liquidity) / 1e18).toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-400">Liquidity</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-400">
                            ${position.uncollectedFees.toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-400">Uncollected Fees</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-400">
                            {(parseFloat(position.tokensOwed0) / 1e18).toFixed(4)}
                          </div>
                          <div className="text-sm text-gray-400">{pool.token0} Owed</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-400">
                            {(parseFloat(position.tokensOwed1) / 1e18).toFixed(4)}
                          </div>
                          <div className="text-sm text-gray-400">{pool.token1} Owed</div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => collectFees(position.id)}
                          disabled={position.uncollectedFees === 0}
                        >
                          <DollarSign className="w-4 h-4 mr-2" />
                          Collect Fees
                        </Button>
                        <Button size="sm" variant="outline" className="border-blue-400 text-blue-400">
                          Increase Liquidity
                        </Button>
                        <Button size="sm" variant="outline" className="border-red-400 text-red-400">
                          Remove Liquidity
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="hooks" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Pool Hooks Management</h2>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Sparkles className="w-4 h-4 mr-2" />
                Deploy Custom Hook
              </Button>
            </div>

            <div className="grid gap-4">
              {hooks.map((hook) => (
                <Card key={hook.name} className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${
                          hook.active ? 'from-green-500 to-blue-500' : 'from-gray-500 to-gray-600'
                        } rounded-lg flex items-center justify-center`}>
                          <Settings className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{hook.name}</h3>
                          <p className="text-sm text-gray-400 font-mono">{hook.address}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`${
                          hook.active ? 'bg-green-500/20 text-green-400 border-green-400' : 'bg-gray-500/20 text-gray-400 border-gray-400'
                        }`}>
                          {hook.active ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                          {hook.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-gray-300 mb-4">{hook.description}</p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="text-sm">
                          <span className="text-gray-400">Gas Usage: </span>
                          <span className="text-white">{hook.gasUsage.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        size="sm"
                        className={hook.active ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
                        onClick={() => enableHook(hook.name)}
                      >
                        {hook.active ? 'Disable' : 'Enable'}
                      </Button>
                      <Button size="sm" variant="outline" className="border-blue-400 text-blue-400">
                        Configure
                      </Button>
                      <Button size="sm" variant="outline" className="border-purple-400 text-purple-400">
                        View Code
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <BarChart3 className="w-5 h-5 text-green-400" />
                    Pool Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {pools.map((pool, index) => (
                    <div key={pool.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">{pool.token0}/{pool.token1}</span>
                        <span className="text-green-400">{pool.apr.toFixed(1)}% APR</span>
                      </div>
                      <Progress value={pool.apr} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Clock className="w-5 h-5 text-blue-400" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded">
                      <div>
                        <div className="text-white font-semibold">Fees Collected</div>
                        <div className="text-sm text-gray-400">CQT/WETH Pool</div>
                      </div>
                      <div className="text-green-400">+$247.83</div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded">
                      <div>
                        <div className="text-white font-semibold">Liquidity Added</div>
                        <div className="text-sm text-gray-400">CQT/USDC Pool</div>
                      </div>
                      <div className="text-blue-400">+$5,000</div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded">
                      <div>
                        <div className="text-white font-semibold">Hook Activated</div>
                        <div className="text-sm text-gray-400">Dynamic Fee Hook</div>
                      </div>
                      <div className="text-purple-400">Enabled</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Target className="w-5 h-5 text-purple-400" />
                  V4 Feature Utilization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Hook Usage</span>
                      <span className="text-purple-400">87%</span>
                    </div>
                    <Progress value={87} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Capital Efficiency</span>
                      <span className="text-green-400">94%</span>
                    </div>
                    <Progress value={94} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Gas Optimization</span>
                      <span className="text-blue-400">91%</span>
                    </div>
                    <Progress value={91} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}