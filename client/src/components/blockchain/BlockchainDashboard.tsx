import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { 
  Wallet, 
  TrendingUp, 
  Coins, 
  Shield, 
  Activity, 
  Globe,
  RefreshCw,
  ExternalLink,
  Database,
  Zap
} from 'lucide-react';

interface WalletData {
  address: string;
  balance: any[];
  nfts: any[];
  transactions: any[];
  networth: any;
  defiPositions: any[];
  pnl: any;
}

interface CoinbaseData {
  rates: any;
  wallets: any[];
  assets: any[];
  networks: any[];
}

export function BlockchainDashboard() {
  const [walletAddress, setWalletAddress] = useState('0xCc380FD8bfbdF0c020de64075b86C84c2BB0AE79');
  const [selectedChain, setSelectedChain] = useState('polygon');
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [coinbaseData, setCoinbaseData] = useState<CoinbaseData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const chains = [
    { id: 'polygon', name: 'Polygon', color: 'bg-purple-500' },
    { id: 'ethereum', name: 'Ethereum', color: 'bg-blue-500' },
    { id: 'base', name: 'Base', color: 'bg-blue-400' },
    { id: 'bsc', name: 'BSC', color: 'bg-yellow-500' }
  ];

  const fetchWalletData = async () => {
    if (!walletAddress) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const [balances, nfts, transactions, networth, defiPositions, pnl] = await Promise.all([
        fetch(`/api/moralis/balances/${walletAddress}?chain=${selectedChain}`).then(r => r.json()),
        fetch(`/api/moralis/nfts/${walletAddress}?chain=${selectedChain}`).then(r => r.json()),
        fetch(`/api/moralis/transactions/${walletAddress}?chain=${selectedChain}`).then(r => r.json()),
        fetch(`/api/moralis/networth/${walletAddress}?chain=${selectedChain}`).then(r => r.json()),
        fetch(`/api/moralis/defi/${walletAddress}?chain=${selectedChain}`).then(r => r.json()),
        fetch(`/api/moralis/pnl/${walletAddress}?chain=${selectedChain}`).then(r => r.json())
      ]);

      setWalletData({
        address: walletAddress,
        balance: balances.data || [],
        nfts: nfts.data || [],
        transactions: transactions.data || [],
        networth: networth.data || {},
        defiPositions: defiPositions.data || [],
        pnl: pnl.data || {}
      });
    } catch (err) {
      setError('Failed to fetch wallet data');
      console.error('Wallet data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCoinbaseData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [rates, wallets, assets, networks] = await Promise.all([
        fetch('/api/coinbase/rates').then(r => r.json()),
        fetch('/api/coinbase/wallets').then(r => r.json()),
        fetch('/api/coinbase/assets').then(r => r.json()),
        fetch('/api/coinbase/networks').then(r => r.json())
      ]);

      setCoinbaseData({
        rates: rates.data || {},
        wallets: wallets.data || [],
        assets: assets.data || [],
        networks: networks.data || []
      });
    } catch (err) {
      setError('Failed to fetch Coinbase data');
      console.error('Coinbase data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchWalletData();
        fetchCoinbaseData();
      }, 30000); // Refresh every 30 seconds
      
      return () => clearInterval(interval);
    }
  }, [autoRefresh, walletAddress, selectedChain]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full">
            <Database className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Blockchain Intelligence Hub
          </h1>
          <p className="text-xl text-gray-300">Real-time wallet analytics powered by Moralis & Coinbase</p>
        </div>

        {/* Controls */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-4 items-center">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter wallet address..."
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="w-80 bg-slate-700 border-slate-600 text-white"
                />
                <select 
                  value={selectedChain} 
                  onChange={(e) => setSelectedChain(e.target.value)}
                  className="px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                >
                  {chains.map(chain => (
                    <option key={chain.id} value={chain.id}>{chain.name}</option>
                  ))}
                </select>
              </div>
              <Button 
                onClick={fetchWalletData}
                disabled={loading}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
                Analyze Wallet
              </Button>
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
                onClick={fetchCoinbaseData}
                disabled={loading}
                variant="outline"
                className="border-slate-600 text-white hover:bg-slate-700"
              >
                <Zap className="w-4 h-4 mr-2" />
                Coinbase Data
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        <Tabs defaultValue="wallet" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800 border-slate-700">
            <TabsTrigger value="wallet" className="text-white">Wallet Analytics</TabsTrigger>
            <TabsTrigger value="defi" className="text-white">DeFi Positions</TabsTrigger>
            <TabsTrigger value="nfts" className="text-white">NFT Collection</TabsTrigger>
            <TabsTrigger value="coinbase" className="text-white">Coinbase Data</TabsTrigger>
          </TabsList>

          <TabsContent value="wallet" className="space-y-6">
            {walletData && (
              <>
                {/* Wallet Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-300">Net Worth</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">
                        {formatCurrency(walletData.networth?.total_networth_usd || 0)}
                      </div>
                      <div className="text-xs text-gray-400">Total Portfolio Value</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-300">Token Balance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-400">
                        {walletData.balance.length}
                      </div>
                      <div className="text-xs text-gray-400">Different Tokens</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-300">NFT Count</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-purple-400">
                        {walletData.nfts.length}
                      </div>
                      <div className="text-xs text-gray-400">Total NFTs Owned</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-300">Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-400">
                        {walletData.transactions.length}
                      </div>
                      <div className="text-xs text-gray-400">Recent Activity</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Token Holdings */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Coins className="w-5 h-5" />
                      Token Holdings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {walletData.balance.slice(0, 5).map((token: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-white">
                                {token.symbol?.slice(0, 2) || 'T'}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-white">{token.name || 'Unknown Token'}</div>
                              <div className="text-xs text-gray-400">{token.symbol || 'N/A'}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-white">
                              {parseFloat(token.balance_formatted || '0').toFixed(4)}
                            </div>
                            <div className="text-xs text-gray-400">
                              {formatCurrency(token.usd_value || 0)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="defi" className="space-y-6">
            {walletData && (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    DeFi Positions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {walletData.defiPositions.length > 0 ? (
                    <div className="space-y-4">
                      {walletData.defiPositions.map((position: any, index: number) => (
                        <div key={index} className="p-4 bg-slate-700/50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium text-white">{position.protocol_name || 'Unknown Protocol'}</div>
                            <Badge className="bg-green-600 text-white">Active</Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <div className="text-gray-400">Position Value</div>
                              <div className="text-white font-medium">
                                {formatCurrency(position.position_usd_value || 0)}
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-400">APY</div>
                              <div className="text-green-400 font-medium">
                                {(position.apy_percent || 0).toFixed(2)}%
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-400">Type</div>
                              <div className="text-white font-medium">{position.position_type || 'N/A'}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      No DeFi positions found
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="nfts" className="space-y-6">
            {walletData && (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    NFT Collection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {walletData.nfts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {walletData.nfts.slice(0, 6).map((nft: any, index: number) => (
                        <div key={index} className="p-4 bg-slate-700/50 rounded-lg">
                          <div className="aspect-square bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg mb-3 flex items-center justify-center">
                            <Shield className="w-8 h-8 text-white" />
                          </div>
                          <div className="space-y-2">
                            <div className="font-medium text-white truncate">
                              {nft.name || `NFT #${nft.token_id}`}
                            </div>
                            <div className="text-xs text-gray-400">
                              {formatAddress(nft.token_address)}
                            </div>
                            <div className="text-xs text-gray-400">
                              Token ID: {nft.token_id}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      No NFTs found
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="coinbase" className="space-y-6">
            {coinbaseData && (
              <>
                {/* Exchange Rates */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      Live Exchange Rates
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(coinbaseData.rates).slice(0, 8).map(([currency, rate]: [string, any]) => (
                        <div key={currency} className="p-3 bg-slate-700/50 rounded-lg text-center">
                          <div className="text-sm text-gray-400">{currency}</div>
                          <div className="text-lg font-bold text-white">
                            {typeof rate === 'number' ? formatCurrency(rate) : rate}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Networks */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      Supported Networks
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {coinbaseData.networks.slice(0, 6).map((network: any, index: number) => (
                        <div key={index} className="p-4 bg-slate-700/50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium text-white">{network.display_name || 'Unknown Network'}</div>
                            <Badge className="bg-blue-600 text-white">Active</Badge>
                          </div>
                          <div className="text-sm text-gray-400">
                            Chain ID: {network.chain_id || 'N/A'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}