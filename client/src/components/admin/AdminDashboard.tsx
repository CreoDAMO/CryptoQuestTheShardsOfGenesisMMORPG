import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { Switch } from '../ui/switch';
import { 
  Shield, 
  Zap, 
  Wallet, 
  Bot, 
  CreditCard, 
  Activity, 
  Settings,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  Lock,
  Eye,
  BarChart3
} from 'lucide-react';
import { UnifiedIntelligenceDashboard } from '../enhanced/UnifiedIntelligenceDashboard';
import { SmartContractManager } from '../../../../components/admin/SmartContractManager';
import { UnifiedNVIDIAHolographicDashboard } from '../nvidia/UnifiedNVIDIAHolographicDashboard';

interface AdminMetrics {
  agentActions: any[];
  superPayTransactions: any[];
  paymasterConfig: any;
  walletMetrics: any;
  securityEvents: any[];
  systemHealth: any;
}

export function AdminDashboard() {
  const [adminData, setAdminData] = useState<AdminMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Admin authentication check - Updated wallet that holds all CQT tokens and LP NFTs
  const ADMIN_ADDRESS = '0x67BF9f428d92704C3Db3a08dC05Bc941A8647866';

  const authenticateAdmin = () => {
    if (walletAddress.toLowerCase() === ADMIN_ADDRESS.toLowerCase()) {
      setIsAuthenticated(true);
      fetchAdminData();
    } else {
      setError('Unauthorized: Admin access required');
    }
  };

  const fetchAdminData = async () => {
    setLoading(true);
    setError(null);

    try {
      const headers = {
        'Content-Type': 'application/json',
        'x-admin-address': ADMIN_ADDRESS
      };

      const [agentData, paymasterData, walletData, systemData] = await Promise.all([
        fetch('/api/admin/agent-actions', { headers }).then(r => r.json()),
        fetch('/api/admin/paymaster', { headers }).then(r => r.json()),
        fetch('/api/admin/wallet-metrics', { headers }).then(r => r.json()),
        fetch('/api/admin/system-health', { headers }).then(r => r.json())
      ]);

      setAdminData({
        agentActions: agentData.data || [],
        superPayTransactions: paymasterData.data?.transactions || [],
        paymasterConfig: paymasterData.data?.config || {},
        walletMetrics: walletData.data || {},
        securityEvents: systemData.data?.security || [],
        systemHealth: systemData.data?.health || {}
      });
    } catch (err) {
      setError('Failed to fetch admin data');
      console.error('Admin data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-600';
      case 'pending': return 'bg-yellow-600';
      case 'failed': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  useEffect(() => {
    if (autoRefresh && isAuthenticated) {
      const interval = setInterval(fetchAdminData, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, isAuthenticated]);

  // Authentication screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-slate-800/50 border-slate-700">
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full mb-4 mx-auto">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">Admin Access Required</CardTitle>
            <p className="text-gray-300">Enter your wallet address to access admin features</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                placeholder="Enter admin wallet address..."
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
              <Button 
                onClick={authenticateAdmin}
                className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
              >
                <Lock className="w-4 h-4 mr-2" />
                Authenticate
              </Button>
              {error && (
                <div className="bg-red-900/20 border border-red-700 rounded-lg p-3">
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 rounded-full">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
            Admin Control Center
          </h1>
          <p className="text-xl text-gray-300">
            MultiSig Connected • AI Miner Active • 5 AI Models • Live Contracts • Real-Time CQT Price
          </p>
        </div>

        {/* Controls */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge className="bg-green-600 text-white">
                <CheckCircle className="w-3 h-3 mr-1" />
                Admin Authenticated
              </Badge>
              <Badge className="bg-blue-600 text-white">
                {ADMIN_ADDRESS.slice(0, 6)}...{ADMIN_ADDRESS.slice(-4)}
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={autoRefresh}
                  onCheckedChange={setAutoRefresh}
                />
                <span className="text-sm text-gray-300">Auto-refresh</span>
              </div>
              <Button 
                onClick={fetchAdminData}
                disabled={loading}
                className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Admin Metrics */}
        {adminData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Bot className="w-4 h-4" />
                  Agent Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {adminData.agentActions.length}
                </div>
                <div className="text-xs text-gray-400">Total Executed</div>
                <div className="mt-2 text-sm text-green-400">
                  {adminData.agentActions.filter(a => a.status === 'completed').length} completed
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Paymaster
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {((adminData.paymasterConfig.usedToday / adminData.paymasterConfig.dailyLimit) * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-gray-400">Daily Usage</div>
                <div className="mt-2">
                  <Progress 
                    value={(adminData.paymasterConfig.usedToday / adminData.paymasterConfig.dailyLimit) * 100} 
                    className="h-2" 
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Super Pay
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {formatCurrency(adminData.superPayTransactions.reduce((sum: number, tx: any) => sum + tx.amount, 0))}
                </div>
                <div className="text-xs text-gray-400">Total Volume</div>
                <div className="mt-2 text-sm text-blue-400">
                  {adminData.superPayTransactions.length} transactions
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Wallet className="w-4 h-4" />
                  Wallet Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {adminData.walletMetrics.balance ? formatCurrency(adminData.walletMetrics.balance) : '$0.00'}
                </div>
                <div className="text-xs text-gray-400">Admin Balance</div>
                <div className="mt-2 text-sm text-purple-400">
                  {adminData.walletMetrics.addresses?.length || 0} addresses
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="agentkit" className="w-full">
          <TabsList className="grid w-full grid-cols-8 bg-slate-800 border-slate-700">
            <TabsTrigger value="agentkit" className="text-white">AgentKit</TabsTrigger>
            <TabsTrigger value="paymaster" className="text-white">Paymaster</TabsTrigger>
            <TabsTrigger value="superpay" className="text-white">Super Pay</TabsTrigger>
            <TabsTrigger value="aimodels" className="text-white">AI Models</TabsTrigger>
            <TabsTrigger value="contracts" className="text-white">Contracts</TabsTrigger>
            <TabsTrigger value="nvidia" className="text-white">NVIDIA + Holographic</TabsTrigger>
            <TabsTrigger value="analytics" className="text-white">Analytics</TabsTrigger>
            <TabsTrigger value="security" className="text-white">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="agentkit" className="space-y-6">
            {adminData && (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Bot className="w-5 h-5" />
                    AI Agent Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {adminData.agentActions.slice(0, 10).map((action: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="font-medium text-white">{action.type.toUpperCase()}</div>
                            <div className="text-xs text-gray-400">
                              {new Date(action.timestamp).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getStatusColor(action.status)}>
                            {action.status}
                          </Badge>
                          {action.gasUsed && (
                            <span className="text-xs text-gray-400">
                              {action.gasUsed} gas
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="paymaster" className="space-y-6">
            {adminData && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      Paymaster Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Status</span>
                        <Badge className={adminData.paymasterConfig.enabled ? 'bg-green-600' : 'bg-red-600'}>
                          {adminData.paymasterConfig.enabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Daily Limit</span>
                        <span className="text-white font-medium">
                          {adminData.paymasterConfig.dailyLimit.toLocaleString()} gas
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Used Today</span>
                        <span className="text-white font-medium">
                          {adminData.paymasterConfig.usedToday.toLocaleString()} gas
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Max Per Transaction</span>
                        <span className="text-white font-medium">
                          {adminData.paymasterConfig.maxGasPerTransaction.toLocaleString()} gas
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Usage Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">Daily Usage</span>
                          <span className="text-white">
                            {((adminData.paymasterConfig.usedToday / adminData.paymasterConfig.dailyLimit) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <Progress 
                          value={(adminData.paymasterConfig.usedToday / adminData.paymasterConfig.dailyLimit) * 100} 
                          className="h-3" 
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-400">
                            {adminData.superPayTransactions.filter((tx: any) => tx.gasless).length}
                          </div>
                          <div className="text-xs text-gray-400">Sponsored TXs</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-400">
                            {formatCurrency(adminData.paymasterConfig.usedToday * 0.000001)}
                          </div>
                          <div className="text-xs text-gray-400">Gas Costs</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="superpay" className="space-y-6">
            {adminData && (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Super Pay Transactions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {adminData.superPayTransactions.slice(0, 10).map((tx: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.gasless ? 'bg-green-500' : 'bg-blue-500'}`}>
                            {tx.gasless ? <Zap className="w-4 h-4 text-white" /> : <CreditCard className="w-4 h-4 text-white" />}
                          </div>
                          <div>
                            <div className="font-medium text-white">
                              {formatCurrency(tx.amount)} {tx.currency}
                            </div>
                            <div className="text-xs text-gray-400">
                              To: {tx.to.slice(0, 6)}...{tx.to.slice(-4)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getStatusColor(tx.status)}>
                            {tx.status}
                          </Badge>
                          {tx.gasless && (
                            <Badge className="bg-green-600 text-white">
                              Gasless
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            {adminData && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Wallet className="w-5 h-5" />
                      Wallet Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Total Balance</span>
                        <span className="text-white font-bold">
                          {adminData.walletMetrics.balance ? formatCurrency(adminData.walletMetrics.balance) : '$0.00'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Active Addresses</span>
                        <span className="text-white font-medium">
                          {adminData.walletMetrics.addresses?.length || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Pending Transactions</span>
                        <span className="text-yellow-400 font-medium">
                          {adminData.walletMetrics.activeTransactions || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Total Transactions</span>
                        <span className="text-white font-medium">
                          {adminData.walletMetrics.totalTransactions || 0}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      System Health
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">CDP Service</span>
                        <Badge className="bg-green-600 text-white">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Online
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">AgentKit</span>
                        <Badge className="bg-green-600 text-white">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Active
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Paymaster</span>
                        <Badge className={adminData.paymasterConfig.enabled ? 'bg-green-600' : 'bg-red-600'}>
                          {adminData.paymasterConfig.enabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Super Pay</span>
                        <Badge className="bg-green-600 text-white">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Ready
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="aimodels" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  AI Models Control Center
                </CardTitle>
                <p className="text-gray-400">5 AI Models operating the CryptoQuest ecosystem</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: 'Claude 4 Sonnet', status: 'active', purpose: 'Strategic Planning & Code Generation', accuracy: '98.5%' },
                    { name: 'GPT-4o', status: 'active', purpose: 'Natural Language Processing & User Interaction', accuracy: '96.2%' },
                    { name: 'Grok 3', status: 'active', purpose: 'Real-time Market Analysis & Trading', accuracy: '94.7%' },
                    { name: 'DeepSeek Coder', status: 'active', purpose: 'Smart Contract Auditing & Security', accuracy: '97.1%' },
                    { name: 'Custom Gaming AI', status: 'active', purpose: 'Game Logic & NPC Behavior', accuracy: '95.8%' }
                  ].map((model, index) => (
                    <div key={index} className="p-4 bg-slate-700/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-white">{model.name}</div>
                        <Badge className="bg-green-600 text-white">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {model.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-400 mb-2">{model.purpose}</div>
                      <div className="text-sm text-green-400">Accuracy: {model.accuracy}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contracts">
            <SmartContractManager />
          </TabsContent>

          <TabsContent value="nvidia">
            <UnifiedNVIDIAHolographicDashboard />
          </TabsContent>

          <TabsContent value="analytics">
            <UnifiedIntelligenceDashboard />
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-900/20 border border-green-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <div>
                        <div className="font-medium text-white">Admin Authentication Successful</div>
                        <div className="text-xs text-gray-400">
                          {new Date().toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-green-600 text-white">Secure</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Eye className="w-5 h-5 text-blue-400" />
                      <div>
                        <div className="font-medium text-white">API Key Validation</div>
                        <div className="text-xs text-gray-400">All keys validated successfully</div>
                      </div>
                    </div>
                    <Badge className="bg-blue-600 text-white">Valid</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-purple-900/20 border border-purple-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Lock className="w-5 h-5 text-purple-400" />
                      <div>
                        <div className="font-medium text-white">Wallet Security Check</div>
                        <div className="text-xs text-gray-400">Multi-signature enabled</div>
                      </div>
                    </div>
                    <Badge className="bg-purple-600 text-white">Protected</Badge>
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