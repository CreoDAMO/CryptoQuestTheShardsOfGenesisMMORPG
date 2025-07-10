import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  DollarSign, CreditCard, Banknote, Wallet, Shield, CheckCircle,
  TrendingUp, Activity, AlertCircle, Globe, Zap, RefreshCw,
  ExternalLink, Copy, Clock, Users, Target, BarChart3
} from 'lucide-react';

// Coinbase OnRamper Integration Types
interface OnRamperMetrics {
  supportedCountries: number;
  supportedCurrencies: string[];
  supportedPaymentMethods: string[];
  totalVolume: number;
  monthlyTransactions: number;
  averageTransactionSize: number;
  conversionRate: number;
  successRate: number;
  averageProcessingTime: number;
  kycEnabled: boolean;
  complianceScore: number;
}

interface TransactionHistory {
  id: string;
  amount: number;
  currency: string;
  cryptoCurrency: string;
  cryptoAmount: number;
  status: 'completed' | 'pending' | 'failed';
  timestamp: Date;
  paymentMethod: string;
  fees: number;
}

// Mock data representing Coinbase OnRamper capabilities
const initialMetrics: OnRamperMetrics = {
  supportedCountries: 180,
  supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'KRW', 'SGD', 'INR'],
  supportedPaymentMethods: ['Credit Card', 'Debit Card', 'Bank Transfer', 'Apple Pay', 'Google Pay', 'PayPal'],
  totalVolume: 2847329000, // $2.84B
  monthlyTransactions: 156847,
  averageTransactionSize: 285.50,
  conversionRate: 0.025, // 2.5% fee
  successRate: 97.8,
  averageProcessingTime: 3.2, // minutes
  kycEnabled: true,
  complianceScore: 98
};

const mockTransactions: TransactionHistory[] = [
  {
    id: 'tx_001',
    amount: 500,
    currency: 'USD',
    cryptoCurrency: 'CQT',
    cryptoAmount: 2137931034.48, // ~2.13B CQT
    status: 'completed',
    timestamp: new Date(Date.now() - 3600000),
    paymentMethod: 'Credit Card',
    fees: 12.50
  },
  {
    id: 'tx_002',
    amount: 1000,
    currency: 'EUR',
    cryptoCurrency: 'ETH',
    cryptoAmount: 0.4285,
    status: 'completed',
    timestamp: new Date(Date.now() - 7200000),
    paymentMethod: 'Bank Transfer',
    fees: 15.00
  },
  {
    id: 'tx_003',
    amount: 250,
    currency: 'GBP',
    cryptoCurrency: 'BTC',
    cryptoAmount: 0.0085,
    status: 'pending',
    timestamp: new Date(Date.now() - 1800000),
    paymentMethod: 'Apple Pay',
    fees: 7.50
  }
];

export function OnRamperComponent() {
  const [metrics, setMetrics] = useState<OnRamperMetrics>(initialMetrics);
  const [transactions, setTransactions] = useState<TransactionHistory[]>(mockTransactions);
  const [activeTab, setActiveTab] = useState<'overview' | 'buy' | 'history' | 'compliance'>('overview');
  const [realTimeEnabled, setRealTimeEnabled] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [selectedCrypto, setSelectedCrypto] = useState('CQT');
  const [amount, setAmount] = useState('');

  // Real-time metrics simulation
  useEffect(() => {
    if (!realTimeEnabled) return;

    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        totalVolume: prev.totalVolume + Math.random() * 10000,
        monthlyTransactions: prev.monthlyTransactions + Math.floor(Math.random() * 5),
        successRate: Math.max(95, Math.min(100, prev.successRate + (Math.random() - 0.5) * 0.5)),
        averageProcessingTime: Math.max(1, Math.min(10, prev.averageProcessingTime + (Math.random() - 0.5) * 0.5))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [realTimeEnabled]);

  const handleBuyCrypto = () => {
    // Simulate OnRamper widget integration
    const newTransaction: TransactionHistory = {
      id: `tx_${Date.now()}`,
      amount: parseFloat(amount) || 0,
      currency: selectedCurrency,
      cryptoCurrency: selectedCrypto,
      cryptoAmount: calculateCryptoAmount(parseFloat(amount) || 0, selectedCrypto),
      status: 'pending',
      timestamp: new Date(),
      paymentMethod: 'Credit Card',
      fees: (parseFloat(amount) || 0) * metrics.conversionRate
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
    setAmount('');
    
    // Simulate completion after 30 seconds
    setTimeout(() => {
      setTransactions(prev => 
        prev.map(tx => 
          tx.id === newTransaction.id 
            ? { ...tx, status: 'completed' as const }
            : tx
        )
      );
    }, 30000);
  };

  const calculateCryptoAmount = (fiatAmount: number, crypto: string): number => {
    const prices = {
      'CQT': 0.000000234, // Current CQT price
      'ETH': 2340.50,
      'BTC': 45789.25,
      'USDC': 1.00,
      'MATIC': 0.85
    };
    return fiatAmount / (prices[crypto as keyof typeof prices] || 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Coinbase OnRamper
          </h1>
          <p className="text-xl text-gray-300">
            Seamless Fiat-to-Crypto Gateway • 180+ Countries • 97.8% Success Rate
          </p>
          <div className="flex items-center justify-center gap-4">
            <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500">
              <CheckCircle className="w-4 h-4 mr-1" />
              KYC Compliant
            </Badge>
            <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500">
              <Shield className="w-4 h-4 mr-1" />
              Bank-Grade Security
            </Badge>
            <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border-purple-500">
              <Globe className="w-4 h-4 mr-1" />
              Global Coverage
            </Badge>
          </div>
        </div>

        {/* Real-time Toggle */}
        <div className="flex items-center justify-center gap-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4">
          <span className="text-gray-300">Real-time Updates</span>
          <Switch checked={realTimeEnabled} onCheckedChange={setRealTimeEnabled} />
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${realTimeEnabled ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
            <span className="text-sm text-gray-400">
              {realTimeEnabled ? 'Live' : 'Paused'}
            </span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.open('https://www.coinbase.com/onramp', '_blank')}
            className="border-slate-600"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            OnRamper Docs
          </Button>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="buy" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Buy Crypto
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              History
            </TabsTrigger>
            <TabsTrigger value="compliance" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Compliance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-400">Total Volume</p>
                      <p className="text-2xl font-bold text-white">
                        ${(metrics.totalVolume / 1000000000).toFixed(2)}B
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-400">Success Rate</p>
                      <p className="text-2xl font-bold text-white">
                        {metrics.successRate.toFixed(1)}%
                      </p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-400">Avg Processing</p>
                      <p className="text-2xl font-bold text-white">
                        {metrics.averageProcessingTime.toFixed(1)}m
                      </p>
                    </div>
                    <Clock className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-400">Countries</p>
                      <p className="text-2xl font-bold text-white">
                        {metrics.supportedCountries}
                      </p>
                    </div>
                    <Globe className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Payment Methods</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {metrics.supportedPaymentMethods.map((method) => (
                      <div key={method} className="flex items-center gap-2 p-3 bg-slate-700/50 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-white text-sm">{method}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Supported Currencies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {metrics.supportedCurrencies.map((currency) => (
                      <Badge key={currency} variant="outline" className="bg-blue-500/20 text-blue-400">
                        {currency}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Monthly Transactions</span>
                      <span className="text-white">{metrics.monthlyTransactions.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Avg Transaction Size</span>
                      <span className="text-green-400">${metrics.averageTransactionSize.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="buy" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700 max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Buy Cryptocurrency
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">Fiat Currency</label>
                    <select 
                      value={selectedCurrency}
                      onChange={(e) => setSelectedCurrency(e.target.value)}
                      className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    >
                      {metrics.supportedCurrencies.map((currency) => (
                        <option key={currency} value={currency}>{currency}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">Cryptocurrency</label>
                    <select 
                      value={selectedCrypto}
                      onChange={(e) => setSelectedCrypto(e.target.value)}
                      className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    >
                      <option value="CQT">CQT (CryptoQuest Token)</option>
                      <option value="ETH">ETH (Ethereum)</option>
                      <option value="BTC">BTC (Bitcoin)</option>
                      <option value="USDC">USDC (USD Coin)</option>
                      <option value="MATIC">MATIC (Polygon)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Amount ({selectedCurrency})</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  />
                </div>

                {amount && (
                  <div className="p-4 bg-slate-700/50 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">You'll receive:</span>
                      <span className="text-white font-semibold">
                        {calculateCryptoAmount(parseFloat(amount), selectedCrypto).toLocaleString()} {selectedCrypto}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Processing fee:</span>
                      <span className="text-yellow-400">
                        {((parseFloat(amount) || 0) * metrics.conversionRate).toFixed(2)} {selectedCurrency}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-slate-600 pt-2">
                      <span className="text-gray-400">Total:</span>
                      <span className="text-white font-semibold">
                        {((parseFloat(amount) || 0) * (1 + metrics.conversionRate)).toFixed(2)} {selectedCurrency}
                      </span>
                    </div>
                  </div>
                )}

                <Button 
                  onClick={handleBuyCrypto}
                  disabled={!amount || parseFloat(amount) <= 0}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  size="lg"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Buy {selectedCrypto}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">
                            {tx.amount.toFixed(2)} {tx.currency} → {tx.cryptoAmount.toLocaleString()} {tx.cryptoCurrency}
                          </span>
                          <Badge variant={tx.status === 'completed' ? 'default' : tx.status === 'pending' ? 'secondary' : 'destructive'}>
                            {tx.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400">
                          {tx.paymentMethod} • {tx.timestamp.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">Fee: {tx.fees.toFixed(2)} {tx.currency}</p>
                        <Button size="sm" variant="outline" className="border-slate-600 mt-1">
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Compliance Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Compliance Score</span>
                      <span className="text-green-400">{metrics.complianceScore}/100</span>
                    </div>
                    <Progress value={metrics.complianceScore} className="h-2" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">KYC Enabled</span>
                      <Badge variant="outline" className="bg-green-500/20 text-green-400">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">AML Monitoring</span>
                      <Badge variant="outline" className="bg-green-500/20 text-green-400">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">GDPR Compliant</span>
                      <Badge variant="outline" className="bg-green-500/20 text-green-400">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Certified
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Regional Coverage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                        <p className="text-sm text-gray-400">North America</p>
                        <p className="text-lg font-bold text-green-400">100%</p>
                      </div>
                      <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                        <p className="text-sm text-gray-400">Europe</p>
                        <p className="text-lg font-bold text-green-400">95%</p>
                      </div>
                      <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                        <p className="text-sm text-gray-400">Asia Pacific</p>
                        <p className="text-lg font-bold text-blue-400">85%</p>
                      </div>
                      <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                        <p className="text-sm text-gray-400">Global</p>
                        <p className="text-lg font-bold text-purple-400">92%</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Regulated Markets</span>
                        <span className="text-white">147/180</span>
                      </div>
                      <Progress value={(147/180) * 100} className="h-2" />
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