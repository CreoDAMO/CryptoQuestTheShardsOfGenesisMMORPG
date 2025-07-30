'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Progress } from "../ui/progress";
import { Alert, AlertDescription } from "../ui/alert";
import { Switch } from "../ui/switch";
import { Slider } from "../ui/slider";
import { 
  Activity, 
  TrendingUp, 
  DollarSign, 
  Zap, 
  Settings, 
  AlertTriangle,
  CheckCircle,
  Timer,
  BarChart3,
  Brain,
  Shield,
  Globe,
  Target,
  Cpu,
  Wallet,
  ArrowUpDown,
  PlayCircle,
  PauseCircle,
  Square,
  Rocket,
  Eye,
  Crosshair,
  Layers,
  Network,
  Sparkles,
  Lock,
  Gauge,
  RefreshCw,
  Maximize2,
  TrendingDown,
  Users,
  Clock,
  Banknote,
  LineChart,
  PieChart,
  BarChart,
  Coins,
  Flame,
  Star,
  Wrench,
  Database,
  Server,
  Wifi,
  WifiOff,
  Bot,
  Gem,
  Zap as Lightning,
  Layers3,
  CircuitBoard,
  Radio,
  Monitor,
  HardDrive,
  MemoryStick,
  Thermometer,
  BatteryCharging,
  Waves,
  GitBranch,
  Code,
  Terminal,
  FileCode,
  Braces
} from 'lucide-react';

// Import enhanced types from the complete arbitrage system
import { 
  ArbitrageOpportunity, 
  EnhancedOpportunity, 
  SystemMetrics,
  AIDecisionResult,
  MLPrediction,
  SecurityConfig,
  BotStatus,
  LiquidityPosition,
  StakingReward,
  MinerMetrics,
  LiquidityMetrics,
  OptimizationStrategy,
  LiquidityStrategy,
  PoolAnalysis
} from '../../lib/arbitrage-types';

interface EnhancedArbitrageDashboardProps {
  className?: string;
}

// Advanced dashboard sections
type DashboardSection = 
  | 'overview' 
  | 'arbitrage' 
  | 'ai-miner' 
  | 'liquidity' 
  | 'cross-chain' 
  | 'analytics' 
  | 'agent-kit' 
  | 'security'
  | 'ml-predictions'
  | 'rust-core'
  | 'zk-proofs'
  | 'post-quantum';

export function EnhancedArbitrageDashboard({ className }: EnhancedArbitrageDashboardProps) {
  const [currentSection, setCurrentSection] = useState<DashboardSection>('overview');
  const [botStatus, setBotStatus] = useState<BotStatus>('monitoring');
  const [autoExecute, setAutoExecute] = useState(false);
  const [securityMode, setSecurityMode] = useState<'standard' | 'high' | 'maximum'>('high');
  const [isConnected, setIsConnected] = useState(true);
  
  // Enhanced state for comprehensive system
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    totalArbitrages: 1247,
    successfulArbitrages: 1180,
    totalProfit: 24750.85,
    gasSpent: 125.34,
    uptime: '72h 15m',
    uptimeStart: new Date(Date.now() - 260100000),
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

  const [opportunities, setOpportunities] = useState<EnhancedOpportunity[]>([
    {
      id: 'arb_1735689234_abc123',
      sourcePool: {
        address: '0xb1E0B26c31a2e8c3eeBd6d5ff0E386A9c073d24F',
        network: 'polygon',
        token0: 'CQT',
        token1: 'WETH',
        token0Address: '0x94ef57abfbff1ad70bd00a921e1d2437f31c1665',
        token1Address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
        feeTier: 3000,
        price: 10.67,
        liquidity: '1500000000000000000000000',
        lastUpdate: new Date()
      },
      targetPool: {
        address: '0xd874aeaef376229c8d41d392c9ce272bd41e57d6',
        network: 'base',
        token0: 'CQT',
        token1: 'USDC',
        token0Address: '0x9d1075b41cd80ab08179f36bc17a7ff8708748ba',
        token1Address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
        feeTier: 3000,
        price: 0.096,
        liquidity: '800000000000000000000000',
        lastUpdate: new Date()
      },
      profitPotential: 12.8,
      requiredAmount: 50000,
      executionCost: 0.15,
      netProfit: 6240.0,
      confidence: 0.94,
      timestamp: new Date(),
      status: 'pending',
      mlPrediction: {
        confidence: 0.92,
        predictedPrice: 10.85,
        timeHorizon: 8,
        factors: {
          liquidity: 0.89,
          volatility: 0.23,
          momentum: 0.67,
          volume: 0.81
        },
        timestamp: new Date(),
        modelType: 'lstm',
        accuracyScore: 0.91
      },
      riskScore: 0.18,
      executionProbability: 0.96,
      timeWindow: 180,
      competitorAnalysis: {
        competitorCount: 3,
        averageExecutionTime: 45,
        successRate: 0.88
      },
      crossChainRoute: {
        bridgeProvider: 'agglayer',
        estimatedTime: 180,
        bridgeFee: 0.05
      }
    }
  ]);

  const [minerMetrics, setMinerMetrics] = useState<MinerMetrics>({
    totalStaked: 125000,
    totalRewards: 8750.45,
    stakingAPR: 12.4,
    optimizationScore: 89.5,
    activeMines: 12,
    hashRate: 2450.5,
    powerConsumption: 85.2,
    efficiency: 94.7,
    activeValidators: 8,
    networkParticipation: 85.2,
    liquidStakingRewards: 3420.15,
    compoundingEfficiency: 94.7
  });

  const [liquidityMetrics, setLiquidityMetrics] = useState<LiquidityMetrics>({
    totalProvided: 2650000,
    totalFees: 12450.75,
    poolCount: 8,
    averageAPR: 125.8,
    impermanentLoss: -2.3,
    activePositions: 8,
    totalVolume: 8450000,
    impermanentLossTotal: -2.3,
    rebalanceCount: 45,
    efficiency: 91.2
  });

  // Real-time updates simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // Update metrics with realistic variations
      setSystemMetrics(prev => ({
        ...prev,
        totalProfit: prev.totalProfit + (Math.random() * 50),
        successRate: 94.5 + Math.random() * 0.4,
        aiMinerMetrics: {
          ...prev.aiMinerMetrics,
          totalRewards: prev.aiMinerMetrics.totalRewards + (Math.random() * 2),
          optimizationScore: 88 + Math.random() * 4
        },
        liquidityMetrics: {
          ...prev.liquidityMetrics,
          totalFees: prev.liquidityMetrics.totalFees + (Math.random() * 10),
          averageAPR: 120 + Math.random() * 10
        }
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleExecuteArbitrage = async (opportunityId: string) => {
    console.log('Executing arbitrage:', opportunityId);
    // Implementation for arbitrage execution
  };

  const handleBotControl = (action: 'start' | 'pause' | 'stop') => {
    console.log('Bot control:', action);
    setBotStatus(action === 'start' ? 'monitoring' : action === 'pause' ? 'idle' : 'idle');
  };

  const handleEmergencyStop = () => {
    console.log('Emergency stop activated');
    setBotStatus('idle');
    setAutoExecute(false);
  };

  const renderOverviewSection = () => (
    <div className="space-y-6">
      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            {isConnected ? <Wifi className="h-4 w-4 text-green-500" /> : <WifiOff className="h-4 w-4 text-red-500" />}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{botStatus.toUpperCase()}</div>
            <p className="text-xs text-muted-foreground">
              Uptime: {systemMetrics.uptime}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${systemMetrics.totalProfit.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12.5% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.successRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {systemMetrics.successfulArbitrages}/{systemMetrics.totalArbitrages} executions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Opportunities</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{opportunities.length}</div>
            <p className="text-xs text-muted-foreground">
              Avg profit: ${opportunities.reduce((sum, opp) => sum + opp.netProfit, 0) / opportunities.length || 0}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              AI Miner Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Total Staked</span>
              <span className="font-mono">{minerMetrics.totalStaked.toLocaleString()} CQT</span>
            </div>
            <div className="flex justify-between">
              <span>Staking APR</span>
              <span className="font-mono text-green-600">{minerMetrics.stakingAPR}%</span>
            </div>
            <div className="flex justify-between">
              <span>Optimization Score</span>
              <div className="flex items-center gap-2">
                <Progress value={minerMetrics.optimizationScore} className="w-16" />
                <span className="text-sm">{minerMetrics.optimizationScore.toFixed(1)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Waves className="h-5 w-5" />
              Liquidity Provider
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Total Provided</span>
              <span className="font-mono">${liquidityMetrics.totalProvided.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Average APR</span>
              <span className="font-mono text-green-600">{liquidityMetrics.averageAPR.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Pool Count</span>
              <span className="font-mono">{liquidityMetrics.poolCount}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Security Mode</span>
              <Badge variant={securityMode === 'maximum' ? 'default' : 'secondary'}>
                {securityMode.toUpperCase()}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>ZK Proofs</span>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
            <div className="flex justify-between">
              <span>Rust Security</span>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Control Panel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button onClick={() => handleBotControl('start')} className="flex items-center gap-2">
              <PlayCircle className="h-4 w-4" />
              Start Bot
            </Button>
            <Button onClick={() => handleBotControl('pause')} variant="outline" className="flex items-center gap-2">
              <PauseCircle className="h-4 w-4" />
              Pause Bot
            </Button>
            <Button onClick={handleEmergencyStop} variant="destructive" className="flex items-center gap-2">
              <Square className="h-4 w-4" />
              Emergency Stop
            </Button>
            
            <div className="flex items-center space-x-2 ml-4">
              <Switch checked={autoExecute} onCheckedChange={setAutoExecute} />
              <span>Auto Execute</span>
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
              <span>Security:</span>
              <select 
                value={securityMode} 
                onChange={(e) => setSecurityMode(e.target.value as any)}
                className="px-2 py-1 border rounded"
              >
                <option value="standard">Standard</option>
                <option value="high">High</option>
                <option value="maximum">Maximum</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderArbitrageSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Live Arbitrage Opportunities</h3>
        <Button size="sm" variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4">
        {opportunities.map((opportunity) => (
          <Card key={opportunity.id} className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{opportunity.sourcePool.network}</Badge>
                    <ArrowUpDown className="h-4 w-4" />
                    <Badge variant="outline">{opportunity.targetPool.network}</Badge>
                    <Badge variant={opportunity.confidence > 0.9 ? 'default' : 'secondary'}>
                      {(opportunity.confidence * 100).toFixed(0)}% confidence
                    </Badge>
                  </div>
                  
                  <div className="text-lg font-semibold">
                    {opportunity.sourcePool.token0}/{opportunity.sourcePool.token1} → {opportunity.targetPool.token0}/{opportunity.targetPool.token1}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Profit: </span>
                      <span className="font-mono text-green-600">${opportunity.netProfit.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Amount: </span>
                      <span className="font-mono">{opportunity.requiredAmount.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Risk: </span>
                      <span className="font-mono">{(opportunity.riskScore * 100).toFixed(1)}%</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Time: </span>
                      <span className="font-mono">{opportunity.timeWindow}s</span>
                    </div>
                  </div>

                  {/* ML Prediction Display */}
                  <div className="bg-muted p-2 rounded text-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <Brain className="h-4 w-4" />
                      <span className="font-medium">AI Prediction</span>
                    </div>
                    <div className="text-xs space-y-1">
                      <div>Model: {opportunity.mlPrediction.modelType.toUpperCase()} (Accuracy: {(opportunity.mlPrediction.accuracyScore * 100).toFixed(1)}%)</div>
                      <div>Predicted Price: ${opportunity.mlPrediction.predictedPrice.toFixed(4)}</div>
                      <div>Factors: Liquidity {(opportunity.mlPrediction.factors.liquidity * 100).toFixed(0)}%, Volume {(opportunity.mlPrediction.factors.volume * 100).toFixed(0)}%</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Button 
                    onClick={() => handleExecuteArbitrage(opportunity.id)}
                    disabled={!autoExecute && opportunity.riskScore > 0.3}
                    className="flex items-center gap-2"
                  >
                    <Rocket className="h-4 w-4" />
                    Execute
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderAIMinerSection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Staked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{minerMetrics.totalStaked.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">CQT across 8 validators</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Rewards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{minerMetrics.totalRewards.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">+5.2% this week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Staking APR</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{minerMetrics.stakingAPR}%</div>
            <p className="text-xs text-muted-foreground">Above market average</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Optimization Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{minerMetrics.optimizationScore.toFixed(1)}</div>
            <Progress value={minerMetrics.optimizationScore} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Network Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Network Distribution & Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Ethereum</span>
                <span className="font-mono">45,000 CQT (4.2% APR)</span>
              </div>
              <Progress value={36} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Polygon</span>
                <span className="font-mono">55,000 CQT (8.5% APR)</span>
              </div>
              <Progress value={44} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Base</span>
                <span className="font-mono">25,000 CQT (3.8% APR)</span>
              </div>
              <Progress value={20} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Optimization Strategies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Optimization Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <Sparkles className="h-4 w-4" />
              <AlertDescription>
                <strong>Compound Strategy Available:</strong> Auto-compound 2,150 CQT rewards to increase yield by 5.2%
              </AlertDescription>
            </Alert>
            <Alert>
              <TrendingUp className="h-4 w-4" />
              <AlertDescription>
                <strong>Rebalancing Opportunity:</strong> Move 15,000 CQT from Base to Polygon for +4.7% APR improvement
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderLiquiditySection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Provided</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${liquidityMetrics.totalProvided.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across {liquidityMetrics.poolCount} pools</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Fees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${liquidityMetrics.totalFees.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">24h: +$1,245</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Average APR</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{liquidityMetrics.averageAPR.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Weighted average</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{liquidityMetrics.efficiency.toFixed(1)}%</div>
            <Progress value={liquidityMetrics.efficiency} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Pool Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Pool Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-6 gap-4 text-sm font-medium border-b pb-2">
              <span>Pool</span>
              <span>Liquidity</span>
              <span>APR</span>
              <span>24h Fees</span>
              <span>IL</span>
              <span>Status</span>
            </div>
            
            <div className="grid grid-cols-6 gap-4 text-sm items-center">
              <span className="font-mono">CQT/WETH</span>
              <span>$125K</span>
              <span className="text-green-600">125.4%</span>
              <span>$2,550</span>
              <span className="text-red-500">-2.3%</span>
              <Badge variant="default" className="text-xs">In Range</Badge>
            </div>
            
            <div className="grid grid-cols-6 gap-4 text-sm items-center">
              <span className="font-mono">CQT/WMATIC</span>
              <span>$95K</span>
              <span className="text-green-600">89.7%</span>
              <span>$1,860</span>
              <span className="text-red-500">-1.8%</span>
              <Badge variant="default" className="text-xs">In Range</Badge>
            </div>
            
            <div className="grid grid-cols-6 gap-4 text-sm items-center">
              <span className="font-mono">CQT/USDC</span>
              <span>$42K</span>
              <span className="text-green-600">68.2%</span>
              <span>$840</span>
              <span className="text-red-500">-0.9%</span>
              <Badge variant="default" className="text-xs">In Range</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSecuritySection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              ZK Proofs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Status</span>
                <Badge variant="default">Active</Badge>
              </div>
              <div className="flex justify-between">
                <span>Proofs Generated</span>
                <span className="font-mono">1,247</span>
              </div>
              <div className="flex justify-between">
                <span>Verification Rate</span>
                <span className="font-mono text-green-600">99.8%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CircuitBoard className="h-5 w-5" />
              Rust Security Layer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Core Module</span>
                <Badge variant="default">Online</Badge>
              </div>
              <div className="flex justify-between">
                <span>Validations</span>
                <span className="font-mono">45,231</span>
              </div>
              <div className="flex justify-between">
                <span>Security Score</span>
                <span className="font-mono text-green-600">98.5/100</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gem className="h-5 w-5" />
              Post-Quantum
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Algorithm</span>
                <span className="font-mono">Dilithium</span>
              </div>
              <div className="flex justify-between">
                <span>Key Size</span>
                <span className="font-mono">2048-bit</span>
              </div>
              <div className="flex justify-between">
                <span>Signatures</span>
                <span className="font-mono">8,945</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Security Metrics & Monitoring</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">100%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">0</div>
              <div className="text-sm text-muted-foreground">Security Incidents</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">A+</div>
              <div className="text-sm text-muted-foreground">Security Grade</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-sm text-muted-foreground">Monitoring</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (currentSection) {
      case 'overview':
        return renderOverviewSection();
      case 'arbitrage':
        return renderArbitrageSection();
      case 'ai-miner':
        return renderAIMinerSection();
      case 'liquidity':
        return renderLiquiditySection();
      case 'security':
        return renderSecuritySection();
      default:
        return renderOverviewSection();
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">CryptoQuest Arbitrage Bot</h1>
          <p className="text-muted-foreground">Advanced cross-chain arbitrage with AI optimization</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant={isConnected ? 'default' : 'destructive'} className="gap-2">
            {isConnected ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
            {isConnected ? 'Connected' : 'Offline'}
          </Badge>
          <Badge variant="outline" className="gap-2">
            <Bot className="h-4 w-4" />
            {botStatus.toUpperCase()}
          </Badge>
        </div>
      </div>

      {/* Navigation Tabs */}
      <Tabs value={currentSection} onValueChange={(value) => setCurrentSection(value as DashboardSection)}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="arbitrage" className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4" />
            Arbitrage
          </TabsTrigger>
          <TabsTrigger value="ai-miner" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            AI Miner
          </TabsTrigger>
          <TabsTrigger value="liquidity" className="flex items-center gap-2">
            <Waves className="h-4 w-4" />
            Liquidity
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value={currentSection} className="mt-6">
          {renderContent()}
        </TabsContent>
      </Tabs>
    </div>
  );
}