'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { Switch } from '../ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Loader2, 
  CreditCard, 
  Send, 
  Receipt, 
  Wallet, 
  DollarSign, 
  Clock, 
  CheckCircle,
  XCircle,
  Plus,
  Eye,
  Copy,
  Zap,
  Shield,
  Users,
  TrendingUp,
  Settings,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Gamepad2,
  Bot,
  Globe
} from 'lucide-react';

interface Invoice {
  id: string;
  amount: number;
  currency: string;
  recipient: string;
  description: string;
  status: 'pending' | 'paid' | 'expired' | 'cancelled';
  createdAt: string;
  expiresAt: string;
  paymentHash?: string;
}

interface PaymentTransaction {
  id: string;
  type: 'send' | 'receive' | 'gaming' | 'staking';
  amount: number;
  currency: string;
  from: string;
  to: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  gasless: boolean;
  description?: string;
}

export function SuperPayDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState({
    cqt: 156.7,
    eth: 2.456,
    usdc: 1250.0
  });
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [paymasterEnabled, setPaymasterEnabled] = useState(true);
  const [adminWallet] = useState('0x67BF9f428d92704C3Db3a08dC05Bc941A8647866');

  // Mock data for demonstration
  useEffect(() => {
    const mockTransactions: PaymentTransaction[] = [
      {
        id: '1',
        type: 'gaming',
        amount: 50,
        currency: 'CQT',
        from: adminWallet,
        to: '0x742d35Cc6634C0532925a3b8D5c8584EC94E1234',
        timestamp: '2024-01-15T10:30:00Z',
        status: 'completed',
        gasless: true,
        description: 'Legendary CQT Sword Purchase'
      },
      {
        id: '2',
        type: 'staking',
        amount: 100,
        currency: 'CQT',
        from: adminWallet,
        to: '0x4915363b5f2e5f2c8f2a4b9e7f1a2b3c4d5e6f7g',
        timestamp: '2024-01-15T09:15:00Z',
        status: 'completed',
        gasless: true,
        description: 'CQT Staking Reward'
      },
      {
        id: '3',
        type: 'send',
        amount: 0.1,
        currency: 'ETH',
        from: adminWallet,
        to: '0x9d1075B4f7b7a8b9c0d1e2f3a4b5c6d7e8f9a0b1',
        timestamp: '2024-01-15T08:45:00Z',
        status: 'completed',
        gasless: false,
        description: 'Gas fee payment'
      }
    ];

    const mockInvoices: Invoice[] = [
      {
        id: 'inv_001',
        amount: 25,
        currency: 'CQT',
        recipient: '0x742d35Cc6634C0532925a3b8D5c8584EC94E1234',
        description: 'NFT Armor Set',
        status: 'pending',
        createdAt: '2024-01-15T11:00:00Z',
        expiresAt: '2024-01-16T11:00:00Z'
      }
    ];

    setTransactions(mockTransactions);
    setInvoices(mockInvoices);
  }, [adminWallet]);

  const handleSendPayment = async (formData: any) => {
    setIsLoading(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newTransaction: PaymentTransaction = {
        id: Date.now().toString(),
        type: 'send',
        amount: formData.amount,
        currency: formData.currency,
        from: adminWallet,
        to: formData.recipient,
        timestamp: new Date().toISOString(),
        status: 'completed',
        gasless: paymasterEnabled,
        description: formData.description || 'Payment'
      };

      setTransactions(prev => [newTransaction, ...prev]);
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'gaming':
        return <Gamepad2 className="w-4 h-4" />;
      case 'staking':
        return <TrendingUp className="w-4 h-4" />;
      case 'send':
        return <ArrowUpRight className="w-4 h-4" />;
      case 'receive':
        return <ArrowDownRight className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            SuperPay Gateway
          </h1>
          <p className="text-xl text-gray-300">
            Gasless payments with Multi-AI Paymaster integration
          </p>
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-400">Connected: {adminWallet.slice(0, 6)}...{adminWallet.slice(-4)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-400">MultiSig Protected</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">CQT Balance</p>
                  <p className="text-2xl font-bold text-blue-400">{walletBalance.cqt}</p>
                </div>
                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">ETH Balance</p>
                  <p className="text-2xl font-bold text-green-400">{walletBalance.eth}</p>
                </div>
                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">USDC Balance</p>
                  <p className="text-2xl font-bold text-purple-400">{walletBalance.usdc}</p>
                </div>
                <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <Globe className="w-5 h-5 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Paymaster</p>
                  <p className="text-2xl font-bold text-cyan-400">Active</p>
                </div>
                <div className="w-10 h-10 bg-cyan-500/20 rounded-full flex items-center justify-center">
                  <Zap className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 bg-slate-800/50">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="send">Send Payment</TabsTrigger>
            <TabsTrigger value="gaming">Gaming Store</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Activity className="w-5 h-5" />
                    Recent Transactions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {transactions.slice(0, 5).map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                            {getTransactionIcon(tx.type)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{tx.description}</p>
                            <p className="text-xs text-gray-400">{new Date(tx.timestamp).toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-white">
                            {tx.type === 'send' ? '-' : '+'}{tx.amount} {tx.currency}
                          </p>
                          <div className="flex items-center gap-1">
                            {tx.gasless && <Zap className="w-3 h-3 text-cyan-400" />}
                            <Badge variant={tx.status === 'completed' ? 'default' : 'secondary'}>
                              {tx.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Settings className="w-5 h-5" />
                    Paymaster Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Gasless Transactions</span>
                      <Badge variant="default" className="bg-green-500">✓ Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">AI Auto-Approval</span>
                      <Badge variant="default" className="bg-green-500">✓ Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Cross-Chain Support</span>
                      <Badge variant="default" className="bg-green-500">✓ Available</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Multi-AI Integration</span>
                      <Badge variant="default" className="bg-green-500">✓ Connected</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="send">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Send Payment</CardTitle>
                <p className="text-gray-400">Send crypto payments with gasless transactions</p>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  handleSendPayment(Object.fromEntries(formData));
                }}>
                  <div className="space-y-2">
                    <Label htmlFor="recipient">Recipient Address</Label>
                    <Input
                      id="recipient"
                      name="recipient"
                      placeholder="0x..."
                      className="bg-slate-700 border-slate-600"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount</Label>
                      <Input
                        id="amount"
                        name="amount"
                        type="number"
                        step="0.000001"
                        placeholder="0.0"
                        className="bg-slate-700 border-slate-600"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <select
                        id="currency"
                        name="currency"
                        className="w-full h-10 px-3 bg-slate-700 border border-slate-600 rounded-md text-white"
                        required
                      >
                        <option value="CQT">CQT</option>
                        <option value="ETH">ETH</option>
                        <option value="USDC">USDC</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Input
                      id="description"
                      name="description"
                      placeholder="Payment description"
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="gasless"
                      checked={paymasterEnabled}
                      onChange={(e) => setPaymasterEnabled(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="gasless" className="text-sm">
                      Use Paymaster (Gasless Transaction)
                    </Label>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Payment'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gaming">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'Legendary CQT Sword', price: 50, currency: 'CQT', rarity: 'legendary' },
                { name: 'NFT Armor Set', price: 25, currency: 'CQT', rarity: 'epic' },
                { name: 'Premium Guild Pass', price: 10, currency: 'CQT', rarity: 'rare' },
                { name: 'Magic Potion Bundle', price: 5, currency: 'CQT', rarity: 'common' },
                { name: 'Exclusive Mount', price: 0.1, currency: 'ETH', rarity: 'mythic' },
                { name: 'Gaming Boost Pack', price: 100, currency: 'USDC', rarity: 'epic' }
              ].map((item, index) => (
                <Card key={index} className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className={`w-full h-32 rounded-lg bg-gradient-to-br ${
                        item.rarity === 'legendary' ? 'from-yellow-400 to-orange-500' :
                        item.rarity === 'mythic' ? 'from-purple-400 to-pink-500' :
                        item.rarity === 'epic' ? 'from-blue-400 to-cyan-500' :
                        item.rarity === 'rare' ? 'from-green-400 to-emerald-500' :
                        'from-gray-400 to-slate-500'
                      } flex items-center justify-center`}>
                        <Gamepad2 className="w-12 h-12 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{item.name}</h3>
                        <p className="text-sm text-gray-400 capitalize">{item.rarity} item</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-white">
                          {item.price} {item.currency}
                        </span>
                        <Button 
                          size="sm" 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                        >
                          Buy Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="invoices">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Payment Invoices</CardTitle>
                <p className="text-gray-400">Manage and track payment invoices</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {invoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                      <div>
                        <p className="font-medium text-white">{invoice.description}</p>
                        <p className="text-sm text-gray-400">
                          {invoice.amount} {invoice.currency} • {new Date(invoice.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={invoice.status === 'paid' ? 'default' : 'secondary'}>
                          {invoice.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">SuperPay Settings</CardTitle>
                <p className="text-gray-400">Configure your payment preferences</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">Enable Paymaster</p>
                      <p className="text-sm text-gray-400">Allow gasless transactions</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={paymasterEnabled}
                      onChange={(e) => setPaymasterEnabled(e.target.checked)}
                      className="w-4 h-4"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Default Currency</Label>
                    <select className="w-full h-10 px-3 bg-slate-700 border border-slate-600 rounded-md text-white">
                      <option value="CQT">CQT</option>
                      <option value="ETH">ETH</option>
                      <option value="USDC">USDC</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>Transaction Confirmation</Label>
                    <select className="w-full h-10 px-3 bg-slate-700 border border-slate-600 rounded-md text-white">
                      <option value="auto">Auto-confirm</option>
                      <option value="manual">Manual confirmation</option>
                    </select>
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