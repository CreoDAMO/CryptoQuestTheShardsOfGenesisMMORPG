import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { 
  Network, ArrowLeftRight, Zap, Shield, Users, Coins, 
  TrendingUp, Globe, Lock, CheckCircle, Activity, Timer
} from "lucide-react";

// Supported chains in AggLayer ecosystem
const AGGLAYER_CHAINS = [
  {
    id: 'polygon-pos',
    name: 'Polygon PoS',
    chainId: 137,
    icon: '🔮',
    tvl: '$1.2B',
    status: 'active',
    type: 'EVM Sidechain'
  },
  {
    id: 'polygon-zkevm',
    name: 'Polygon zkEVM',
    chainId: 1101,
    icon: '⚡',
    tvl: '$85M',
    status: 'active',
    type: 'ZK-Rollup'
  },
  {
    id: 'base',
    name: 'Base',
    chainId: 8453,
    icon: '🔵',
    tvl: '$2.8B',
    status: 'connected',
    type: 'Optimistic Rollup'
  },
  {
    id: 'x-layer',
    name: 'X Layer',
    chainId: 196,
    icon: '❌',
    tvl: '$120M',
    status: 'connected',
    type: 'ZK-Rollup'
  },
  {
    id: 'astar',
    name: 'Astar zkEVM',
    chainId: 3776,
    icon: '⭐',
    tvl: '$45M',
    status: 'connected',
    type: 'ZK-Rollup'
  }
];

interface CrossChainTransaction {
  id: string;
  fromChain: string;
  toChain: string;
  asset: string;
  amount: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  timestamp: number;
  txHash?: string;
  bridgeType: 'unified-bridge' | 'chain-aggregation';
}

interface UnifiedLiquidity {
  totalTVL: string;
  availableAssets: Array<{
    symbol: string;
    totalAmount: string;
    chains: string[];
    price: number;
  }>;
}

export function AggLayerIntegration() {
  const { toast } = useToast();
  const [selectedFromChain, setSelectedFromChain] = useState('');
  const [selectedToChain, setSelectedToChain] = useState('');
  const [bridgeAmount, setBridgeAmount] = useState('');
  const [selectedAsset, setSelectedAsset] = useState('CQT');
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactions, setTransactions] = useState<CrossChainTransaction[]>([]);
  const [unifiedLiquidity, setUnifiedLiquidity] = useState<UnifiedLiquidity>({
    totalTVL: '$4.25B',
    availableAssets: [
      { symbol: 'CQT', totalAmount: '50M', chains: ['polygon-pos', 'base', 'polygon-zkevm'], price: 0.125 },
      { symbol: 'ETH', totalAmount: '125K', chains: ['polygon-pos', 'base', 'polygon-zkevm', 'x-layer'], price: 3420 },
      { symbol: 'MATIC', totalAmount: '850M', chains: ['polygon-pos', 'polygon-zkevm'], price: 0.92 },
      { symbol: 'USDC', totalAmount: '1.2B', chains: ['polygon-pos', 'base', 'polygon-zkevm', 'x-layer', 'astar'], price: 1.00 }
    ]
  });

  // Simulate cross-chain gaming actions
  const gamingActions = [
    {
      id: 'cross-guild',
      title: 'Cross-Chain Guild Formation',
      description: 'Create guilds with members from different chains',
      chains: ['Polygon PoS', 'Base', 'X Layer'],
      cost: '50 CQT',
      benefits: ['Unified guild treasury', 'Cross-chain governance', 'Shared rewards']
    },
    {
      id: 'multi-chain-quest',
      title: 'Multi-Chain Quest Line',
      description: 'Complete quests across multiple networks',
      chains: ['Polygon zkEVM', 'Astar', 'Base'],
      cost: '25 CQT',
      benefits: ['Higher rewards', 'Unique NFTs', 'Cross-chain achievements']
    },
    {
      id: 'unified-marketplace',
      title: 'Unified Gaming Marketplace',
      description: 'Trade items across all connected chains',
      chains: ['All AggLayer Chains'],
      cost: '10 CQT',
      benefits: ['No wrapped tokens', 'Instant settlements', 'Lower fees']
    }
  ];

  const handleCrossChainBridge = async () => {
    if (!selectedFromChain || !selectedToChain || !bridgeAmount) {
      toast({
        title: "Missing Information",
        description: "Please select source chain, destination chain, and amount",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    const newTransaction: CrossChainTransaction = {
      id: `tx_${Date.now()}`,
      fromChain: selectedFromChain,
      toChain: selectedToChain,
      asset: selectedAsset,
      amount: bridgeAmount,
      status: 'pending',
      timestamp: Date.now(),
      bridgeType: 'unified-bridge'
    };

    // Simulate transaction processing
    setTransactions(prev => [newTransaction, ...prev]);

    // Simulate processing stages
    setTimeout(() => {
      setTransactions(prev => 
        prev.map(tx => 
          tx.id === newTransaction.id 
            ? { ...tx, status: 'processing', txHash: `0x${Math.random().toString(16).substr(2, 64)}` }
            : tx
        )
      );
    }, 2000);

    setTimeout(() => {
      setTransactions(prev => 
        prev.map(tx => 
          tx.id === newTransaction.id 
            ? { ...tx, status: 'completed' }
            : tx
        )
      );
      
      toast({
        title: "Cross-Chain Bridge Successful!",
        description: `${bridgeAmount} ${selectedAsset} bridged from ${selectedFromChain} to ${selectedToChain}`,
      });
      
      setIsProcessing(false);
      setBridgeAmount('');
    }, 5000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Timer className="w-4 h-4 text-yellow-500" />;
      case 'processing': return <Activity className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed': return <Timer className="w-4 h-4 text-red-500" />;
      default: return <Timer className="w-4 h-4" />;
    }
  };

  const getChainFromId = (chainId: string) => {
    return AGGLAYER_CHAINS.find(chain => chain.id === chainId);
  };

  return (
    <div className="space-y-6">
      {/* AggLayer Overview */}
      <Card className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="w-6 h-6" />
            Polygon AggLayer Integration
            <Badge className="ml-2 bg-gradient-to-r from-purple-500 to-blue-500">Revolutionary</Badge>
          </CardTitle>
          <CardDescription>
            Unified liquidity and cross-chain interoperability for seamless gaming across all networks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-5 h-5 text-purple-600" />
                <span className="font-semibold">Connected Chains</span>
              </div>
              <div className="text-2xl font-bold text-purple-600">{AGGLAYER_CHAINS.length}</div>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Coins className="w-5 h-5 text-blue-600" />
                <span className="font-semibold">Unified TVL</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">{unifiedLiquidity.totalTVL}</div>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="font-semibold">Security</span>
              </div>
              <div className="text-2xl font-bold text-green-600">ZK Proofs</div>
            </div>
            <div className="p-4 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-orange-600" />
                <span className="font-semibold">Native Tokens</span>
              </div>
              <div className="text-2xl font-bold text-orange-600">No Wrapping</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="bridge" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="bridge">Cross-Chain Bridge</TabsTrigger>
          <TabsTrigger value="gaming">Gaming Actions</TabsTrigger>
          <TabsTrigger value="liquidity">Unified Liquidity</TabsTrigger>
          <TabsTrigger value="networks">Connected Networks</TabsTrigger>
        </TabsList>

        <TabsContent value="bridge" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowLeftRight className="w-5 h-5" />
                Unified Bridge
              </CardTitle>
              <CardDescription>
                Bridge assets between chains with native tokens and no intermediaries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">From Chain</label>
                    <Select value={selectedFromChain} onValueChange={setSelectedFromChain}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select source chain" />
                      </SelectTrigger>
                      <SelectContent>
                        {AGGLAYER_CHAINS.map((chain) => (
                          <SelectItem key={chain.id} value={chain.id}>
                            <div className="flex items-center gap-2">
                              <span>{chain.icon}</span>
                              <span>{chain.name}</span>
                              <Badge variant="secondary" className="ml-auto">{chain.tvl}</Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">To Chain</label>
                    <Select value={selectedToChain} onValueChange={setSelectedToChain}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select destination chain" />
                      </SelectTrigger>
                      <SelectContent>
                        {AGGLAYER_CHAINS.filter(chain => chain.id !== selectedFromChain).map((chain) => (
                          <SelectItem key={chain.id} value={chain.id}>
                            <div className="flex items-center gap-2">
                              <span>{chain.icon}</span>
                              <span>{chain.name}</span>
                              <Badge variant="secondary" className="ml-auto">{chain.tvl}</Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Asset</label>
                    <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {unifiedLiquidity.availableAssets.map((asset) => (
                          <SelectItem key={asset.symbol} value={asset.symbol}>
                            <div className="flex items-center gap-2">
                              <span>{asset.symbol}</span>
                              <span className="text-sm text-gray-500">
                                ${asset.price} • {asset.totalAmount} available
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Amount</label>
                    <Input
                      type="number"
                      placeholder="0.0"
                      value={bridgeAmount}
                      onChange={(e) => setBridgeAmount(e.target.value)}
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleCrossChainBridge}
                  disabled={isProcessing || !selectedFromChain || !selectedToChain || !bridgeAmount}
                  className="w-full"
                >
                  {isProcessing ? (
                    <>
                      <Activity className="w-4 h-4 mr-2 animate-spin" />
                      Processing Bridge...
                    </>
                  ) : (
                    <>
                      <ArrowLeftRight className="w-4 h-4 mr-2" />
                      Bridge Assets
                    </>
                  )}
                </Button>

                {/* Transaction History */}
                {transactions.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold mb-4">Recent Transactions</h3>
                    <div className="space-y-3">
                      {transactions.slice(0, 5).map((tx) => (
                        <div key={tx.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {getStatusIcon(tx.status)}
                              <div>
                                <div className="font-medium">
                                  {tx.amount} {tx.asset}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  {getChainFromId(tx.fromChain)?.name} → {getChainFromId(tx.toChain)?.name}
                                </div>
                              </div>
                            </div>
                            <Badge variant={
                              tx.status === 'completed' ? 'default' :
                              tx.status === 'failed' ? 'destructive' :
                              'secondary'
                            }>
                              {tx.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gaming" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            {gamingActions.map((action) => (
              <Card key={action.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    {action.title}
                  </CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium mb-2">Supported Chains</div>
                      <div className="flex flex-wrap gap-2">
                        {action.chains.map((chain) => (
                          <Badge key={chain} variant="outline">{chain}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium mb-2">Benefits</div>
                      <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
                        {action.benefits.map((benefit, index) => (
                          <li key={index}>{benefit}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <div className="text-lg font-semibold text-green-600">
                        {action.cost}
                      </div>
                      <Button variant="outline">
                        <Zap className="w-4 h-4 mr-2" />
                        Activate
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="liquidity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Unified Liquidity Pool
              </CardTitle>
              <CardDescription>
                Shared TVL across all connected chains enables better capital efficiency
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {unifiedLiquidity.availableAssets.map((asset) => (
                  <div key={asset.symbol} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold">{asset.symbol}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        ${asset.price.toLocaleString()}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-2xl font-bold">{asset.totalAmount}</div>
                      <div className="text-lg text-green-600">
                        ${(parseFloat(asset.totalAmount.replace(/[^\d.]/g, '')) * asset.price).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-2">Available on chains:</div>
                      <div className="flex flex-wrap gap-2">
                        {asset.chains.map((chainId) => {
                          const chain = getChainFromId(chainId);
                          return chain ? (
                            <Badge key={chainId} variant="secondary">
                              {chain.icon} {chain.name}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="networks" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {AGGLAYER_CHAINS.map((chain) => (
              <Card key={chain.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">{chain.icon}</span>
                    {chain.name}
                    <Badge 
                      variant={chain.status === 'active' ? 'default' : 'secondary'}
                      className="ml-auto"
                    >
                      {chain.status}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{chain.type}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Chain ID:</span>
                      <span className="text-sm">{chain.chainId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">TVL:</span>
                      <span className="text-sm font-semibold text-green-600">{chain.tvl}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Security:</span>
                      <div className="flex items-center gap-1">
                        <Lock className="w-4 h-4 text-green-500" />
                        <span className="text-sm">ZK Secured</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}