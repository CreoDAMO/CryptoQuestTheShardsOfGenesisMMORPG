import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  TrendingUp, Zap, Shield, Bot, Cpu, Activity,
  DollarSign, Timer, Target, AlertTriangle,
  CheckCircle, XCircle, Play, Pause, BarChart3,
  RefreshCw, Settings, Wallet, Network, Sparkles
} from 'lucide-react';
import { 
  StreamlitHeader, 
  StreamlitControls, 
  StreamlitMetricCard, 
  StreamlitChartContainer,
  StreamlitStatus,
  StreamlitProgress,
  StreamlitDataTable,
  useStreamlit
} from '@/components/shared/StreamlitCore';

interface ArbitrageOpportunity {
  id: string;
  tokenPair: string;
  fromChain: 'Polygon' | 'Base';
  toChain: 'Polygon' | 'Base';
  priceDifference: number;
  profitPercentage: number;
  volume: number;
  gasEstimate: number;
  executionTime: number;
  confidence: number;
  status: 'active' | 'executing' | 'completed' | 'failed';
}

interface SystemMetrics {
  totalArbitrages: number;
  successfulArbitrages: number;
  totalProfit: number;
  gasSpent: number;
  uptime: string;
  successRate: number;
  aiAccuracy: number;
  rustSecurity: number;
}

const mockOpportunities: ArbitrageOpportunity[] = [
  {
    id: 'ARB001',
    tokenPair: 'CQT/USDC',
    fromChain: 'Base',
    toChain: 'Polygon',
    priceDifference: 0.135,
    profitPercentage: 12.3,
    volume: 45000,
    gasEstimate: 0.015,
    executionTime: 45,
    confidence: 94,
    status: 'active'
  },
  {
    id: 'ARB002',
    tokenPair: 'CQT/WETH',
    fromChain: 'Polygon',
    toChain: 'Base',
    priceDifference: 0.089,
    profitPercentage: 8.7,
    volume: 32000,
    gasEstimate: 0.012,
    executionTime: 38,
    confidence: 89,
    status: 'executing'
  },
  {
    id: 'ARB003',
    tokenPair: 'CQT/WMATIC',
    fromChain: 'Polygon',
    toChain: 'Base',
    priceDifference: 0.067,
    profitPercentage: 6.2,
    volume: 28000,
    gasEstimate: 0.008,
    executionTime: 42,
    confidence: 76,
    status: 'active'
  }
];

const mockMetrics: SystemMetrics = {
  totalArbitrages: 1247,
  successfulArbitrages: 1181,
  totalProfit: 2847.32,
  gasSpent: 47.8,
  uptime: "99.7%",
  successRate: 94.7,
  aiAccuracy: 96.2,
  rustSecurity: 99.8
};

export function EnhancedArbitrageDashboard() {
  const [isRunning, setIsRunning] = useState(true);
  const [autoExecute, setAutoExecute] = useState(true);
  const [opportunities, setOpportunities] = useState(mockOpportunities);
  const [metrics, setMetrics] = useState(mockMetrics);
  const [selectedTab, setSelectedTab] = useState('opportunities');
  
  const { config, setConfig, fragments, metrics: streamlitMetrics, addFragment, toggleFragment } = useStreamlit({
    realTimeEnabled: true,
    autoRefresh: true,
    refreshInterval: 2000
  });

  // Initialize Streamlit fragments
  useEffect(() => {
    addFragment({
      id: 'opportunities',
      title: 'Opportunities',
      component: <></>,
      dependencies: ['arbitrage'],
      updateFrequency: 2000,
      priority: 'high',
      status: 'active'
    });
    
    addFragment({
      id: 'metrics',
      title: 'Metrics',
      component: <></>,
      dependencies: ['performance'],
      updateFrequency: 5000,
      priority: 'high',
      status: 'active'
    });
    
    addFragment({
      id: 'security',
      title: 'Security',
      component: <></>,
      dependencies: ['rust-core'],
      updateFrequency: 10000,
      priority: 'medium',
      status: 'active'
    });
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    if (!config.realTimeEnabled) return;
    
    const interval = setInterval(() => {
      setOpportunities(prev => prev.map(opp => ({
        ...opp,
        profitPercentage: opp.profitPercentage + (Math.random() - 0.5) * 0.5,
        confidence: Math.max(70, Math.min(99, opp.confidence + (Math.random() - 0.5) * 5))
      })));
      
      setMetrics(prev => ({
        ...prev,
        totalArbitrages: prev.totalArbitrages + Math.floor(Math.random() * 2),
        totalProfit: prev.totalProfit + (Math.random() * 10)
      }));
    }, config.refreshInterval);

    return () => clearInterval(interval);
  }, [config.realTimeEnabled, config.refreshInterval]);

  const executeArbitrage = (opportunityId: string) => {
    setOpportunities(prev => prev.map(opp => 
      opp.id === opportunityId 
        ? { ...opp, status: 'executing' as const }
        : opp
    ));

    // Simulate execution completion
    setTimeout(() => {
      setOpportunities(prev => prev.map(opp => 
        opp.id === opportunityId 
          ? { ...opp, status: 'completed' as const }
          : opp
      ));
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <StreamlitHeader
          title="CQT Arbitrage Bot Dashboard"
          subtitle="Advanced cross-chain arbitrage system with AI-powered decision making, Rust security wrapper, and automated liquidity provision"
          icon={<TrendingUp className="w-8 h-8 text-green-500" />}
          status={isRunning ? 'active' : 'paused'}
          metrics={streamlitMetrics}
        />

        <StreamlitControls
          config={config}
          onConfigChange={setConfig}
          fragments={fragments}
          onFragmentToggle={toggleFragment}
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StreamlitMetricCard
            title="Total Profit"
            value={`$${metrics.totalProfit.toFixed(2)}`}
            change={`+${(Math.random() * 10).toFixed(1)}%`}
            icon={<DollarSign className="w-5 h-5" />}
            trend="up"
          />
          <StreamlitMetricCard
            title="Success Rate"
            value={`${metrics.successRate}%`}
            change="↑ 2.3%"
            icon={<Target className="w-5 h-5" />}
            trend="up"
          />
          <StreamlitMetricCard
            title="AI Accuracy"
            value={`${metrics.aiAccuracy}%`}
            change="↑ 0.8%"
            icon={<Bot className="w-5 h-5" />}
            trend="up"
          />
          <StreamlitMetricCard
            title="Rust Security"
            value={`${metrics.rustSecurity}%`}
            change="Optimal"
            icon={<Shield className="w-5 h-5" />}
            trend="neutral"
          />
        </div>

        <StreamlitStatus
          status={isRunning ? 'success' : 'warning'}
          message={isRunning ? 'Arbitrage Bot Active' : 'Arbitrage Bot Paused'}
          details={`Running on ${opportunities.length} opportunities across Polygon and Base networks`}
        />

        {/* Control Panel */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-green-400" />
                  <span className="text-white">Bot Status</span>
                </div>
                <Switch checked={isRunning} onCheckedChange={setIsRunning} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <span className="text-white">Auto Execute</span>
                </div>
                <Switch checked={autoExecute} onCheckedChange={setAutoExecute} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{metrics.successRate}%</div>
              <div className="text-sm text-gray-400">Success Rate</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">${metrics.totalProfit.toFixed(2)}</div>
              <div className="text-sm text-gray-400">Total Profit</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800/50">
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="mining">AI Mining</TabsTrigger>
            <TabsTrigger value="liquidity">Liquidity</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="opportunities" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Active Arbitrage Opportunities</h2>
              <Button variant="outline" className="border-blue-400 text-blue-400">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>

            <div className="grid gap-4">
              {opportunities.map((opportunity) => (
                <Card key={opportunity.id} className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                          <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{opportunity.tokenPair}</h3>
                          <p className="text-sm text-gray-400">
                            {opportunity.fromChain} → {opportunity.toChain}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`${
                          opportunity.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-400' :
                          opportunity.status === 'executing' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-400' :
                          opportunity.status === 'completed' ? 'bg-blue-500/20 text-blue-400 border-blue-400' :
                          'bg-red-500/20 text-red-400 border-red-400'
                        }`}>
                          {opportunity.status}
                        </Badge>
                        {opportunity.status === 'active' && (
                          <Button 
                            size="sm" 
                            onClick={() => executeArbitrage(opportunity.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Execute
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-400">
                          +{opportunity.profitPercentage.toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-400">Profit</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-white">
                          ${opportunity.volume.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-400">Volume</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-yellow-400">
                          {opportunity.gasEstimate.toFixed(3)} ETH
                        </div>
                        <div className="text-sm text-gray-400">Gas Est.</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-400">
                          {opportunity.confidence}%
                        </div>
                        <div className="text-sm text-gray-400">Confidence</div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-400">Execution Confidence</span>
                        <span className="text-sm text-white">{opportunity.confidence}%</span>
                      </div>
                      <Progress value={opportunity.confidence} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm text-gray-400">
                    <BarChart3 className="w-4 h-4" />
                    Total Arbitrages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">{metrics.totalArbitrages}</div>
                  <div className="text-sm text-green-400">+47 today</div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm text-gray-400">
                    <DollarSign className="w-4 h-4" />
                    Total Profit
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-400">${metrics.totalProfit}</div>
                  <div className="text-sm text-gray-400">Net profit (USD)</div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm text-gray-400">
                    <Activity className="w-4 h-4" />
                    Uptime
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-400">{metrics.uptime}</div>
                  <div className="text-sm text-gray-400">System availability</div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm text-gray-400">
                    <Target className="w-4 h-4" />
                    Success Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-400">{metrics.successRate}%</div>
                  <div className="text-sm text-gray-400">Execution success</div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Performance Analytics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">AI Accuracy</span>
                      <span className="text-green-400">{metrics.aiAccuracy}%</span>
                    </div>
                    <Progress value={metrics.aiAccuracy} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Rust Security</span>
                      <span className="text-blue-400">{metrics.rustSecurity}%</span>
                    </div>
                    <Progress value={metrics.rustSecurity} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Gas Efficiency</span>
                      <span className="text-purple-400">87.3%</span>
                    </div>
                    <Progress value={87.3} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mining" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Cpu className="w-5 h-5 text-yellow-400" />
                    GPU Mining Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400">245.7 MH/s</div>
                      <div className="text-sm text-gray-400">Hashrate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">78.5%</div>
                      <div className="text-sm text-gray-400">Utilization</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Temperature:</span>
                      <span className="text-white">67°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Power Draw:</span>
                      <span className="text-white">285W</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Efficiency:</span>
                      <span className="text-green-400">94.2%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Bot className="w-5 h-5 text-purple-400" />
                    AI Model Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">96.2%</div>
                      <div className="text-sm text-gray-400">Accuracy</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">23ms</div>
                      <div className="text-sm text-gray-400">Response Time</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Model Type:</span>
                      <span className="text-white">LSTM Ensemble</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Training Data:</span>
                      <span className="text-white">2.4M samples</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Last Update:</span>
                      <span className="text-green-400">2 hours ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="liquidity" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Polygon Pools</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">CQT/WETH:</span>
                    <span className="text-white">7.5T CQT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">CQT/WMATIC:</span>
                    <span className="text-white">7.5T CQT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total TVL:</span>
                    <span className="text-green-400">$4.25M</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Base Pools</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">CQT/USDC:</span>
                    <span className="text-white">2.1T CQT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className="text-yellow-400">Seeding</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Target TVL:</span>
                    <span className="text-blue-400">$1.5M</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Liquidity Provider</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Auto-injection:</span>
                    <span className="text-green-400">Enabled</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Profit Allocation:</span>
                    <span className="text-white">20%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Next Injection:</span>
                    <span className="text-blue-400">2.3 hours</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Shield className="w-5 h-5 text-green-400" />
                    Security Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Rust Wrapper</span>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-green-400">Active</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">ZK Proofs</span>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-green-400">Verified</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Post-Quantum</span>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-green-400">Enabled</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Multi-Sig</span>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-green-400">3/5 Active</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Wallet className="w-5 h-5 text-blue-400" />
                    Wallet Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Deployment Wallet:</span>
                      <span className="text-white font-mono text-sm">0xCc38...AE79</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">CQT Balance:</span>
                      <span className="text-green-400">39.23T CQT</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">MATIC Balance:</span>
                      <span className="text-white">1.0 MATIC</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Base ETH:</span>
                      <span className="text-white">0.85 ETH</span>
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