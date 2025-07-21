'use client';

import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowUpRight, 
  DollarSign, 
  CreditCard, 
  Shield, 
  Zap,
  ExternalLink,
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react';

export default function OnRamperDashboard() {
  const supportedMethods = [
    { name: 'Bank Transfer', fee: '0.5%', time: '1-3 days', available: true },
    { name: 'Debit Card', fee: '3.99%', time: 'Instant', available: true },
    { name: 'Credit Card', fee: '3.99%', time: 'Instant', available: true },
    { name: 'Apple Pay', fee: '3.99%', time: 'Instant', available: true },
    { name: 'Google Pay', fee: '3.99%', time: 'Instant', available: true },
    { name: 'PayPal', fee: '2.99%', time: '5-10 min', available: true }
  ];

  const recentTransactions = [
    { id: 1, amount: '$500.00', crypto: '0.15 ETH', status: 'completed', method: 'Debit Card' },
    { id: 2, amount: '$250.00', crypto: '250 USDC', status: 'processing', method: 'Bank Transfer' },
    { id: 3, amount: '$1000.00', crypto: '0.024 BTC', status: 'completed', method: 'Credit Card' }
  ];

  const supportedCrypto = [
    { symbol: 'CQT', name: 'CryptoQuest Token', network: 'BASE', available: true },
    { symbol: 'ETH', name: 'Ethereum', network: 'Ethereum', available: true },
    { symbol: 'USDC', name: 'USD Coin', network: 'BASE', available: true },
    { symbol: 'BTC', name: 'Bitcoin', network: 'Bitcoin', available: true },
    { symbol: 'MATIC', name: 'Polygon', network: 'Polygon', available: true },
    { symbol: 'USDT', name: 'Tether', network: 'Multiple', available: true }
  ];

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <ArrowUpRight className="w-5 h-5" />
            Coinbase OnRamper - Fiat to Crypto Gateway
          </CardTitle>
          <p className="text-purple-200 text-sm">
            Seamlessly convert fiat currency to CQT tokens and other cryptocurrencies with Coinbase's enterprise-grade infrastructure
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2 holographic-glow">$2.4M</div>
              <div className="text-lg text-purple-200">Volume (24h)</div>
              <div className="text-sm text-purple-300">Fiat → Crypto</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">12,543</div>
              <div className="text-lg text-purple-200">Transactions</div>
              <div className="text-sm text-purple-300">This Month</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">0.5%</div>
              <div className="text-lg text-purple-200">Min Fee</div>
              <div className="text-sm text-purple-300">Bank Transfer</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">99.9%</div>
              <div className="text-lg text-purple-200">Uptime</div>
              <div className="text-sm text-purple-300">Enterprise Grade</div>
            </div>
          </div>

          <div className="mt-6 grid md:grid-cols-3 gap-4">
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <div className="text-green-400 font-semibold flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Secure & Compliant
              </div>
              <div className="text-purple-200 text-sm">SOC 2 Type 2 • Bank-level Security</div>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <div className="text-blue-400 font-semibold flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Instant Processing
              </div>
              <div className="text-purple-200 text-sm">Real-time fiat to crypto conversion</div>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
              <div className="text-purple-400 font-semibold flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Direct CQT Purchase
              </div>
              <div className="text-purple-200 text-sm">Buy CQT tokens directly with fiat</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Payment Methods */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white">Supported Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {supportedMethods.map((method, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-4 h-4 text-purple-400" />
                    <div>
                      <div className="text-white font-medium">{method.name}</div>
                      <div className="text-purple-300 text-xs">{method.time}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-purple-200 text-sm">{method.fee}</div>
                    {method.available && (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                        Available
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Supported Cryptocurrencies */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white">Supported Cryptocurrencies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {supportedCrypto.map((crypto, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{crypto.symbol}</span>
                    </div>
                    <div>
                      <div className="text-white font-medium">{crypto.name}</div>
                      <div className="text-purple-300 text-xs">{crypto.network} Network</div>
                    </div>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                    Available
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Purchase Interface */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white">Quick Purchase Interface</CardTitle>
          <p className="text-purple-200 text-sm">Convert fiat directly to CQT tokens for gaming</p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-purple-200 text-sm block mb-2">You Pay (Fiat)</label>
                <div className="flex">
                  <input
                    type="text"
                    placeholder="100"
                    className="flex-1 bg-white/10 border border-white/20 rounded-l-lg px-4 py-3 text-white"
                  />
                  <div className="bg-white/20 border border-white/20 rounded-r-lg px-4 py-3 text-purple-200">
                    USD
                  </div>
                </div>
              </div>

              <div>
                <label className="text-purple-200 text-sm block mb-2">You Receive (Crypto)</label>
                <div className="flex">
                  <input
                    type="text"
                    placeholder="~47,832"
                    className="flex-1 bg-white/10 border border-white/20 rounded-l-lg px-4 py-3 text-white"
                    readOnly
                  />
                  <div className="bg-white/20 border border-white/20 rounded-r-lg px-4 py-3 text-purple-200">
                    CQT
                  </div>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                <div className="text-blue-400 text-sm font-medium">Exchange Rate</div>
                <div className="text-purple-200 text-xs">1 USD = 478.32 CQT</div>
                <div className="text-purple-300 text-xs">Fee: 3.99% • Network: BASE</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                <div className="text-purple-400 font-semibold mb-3">Purchase Summary</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-purple-200">Amount</span>
                    <span className="text-white">$100.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-200">Processing Fee</span>
                    <span className="text-white">$3.99</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-200">Network Fee</span>
                    <span className="text-white">$0.50</span>
                  </div>
                  <hr className="border-white/20" />
                  <div className="flex justify-between font-semibold">
                    <span className="text-purple-200">Total</span>
                    <span className="text-white">$104.49</span>
                  </div>
                </div>
              </div>

              <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <CreditCard className="w-4 h-4 mr-2" />
                Purchase CQT Tokens
              </Button>

              <div className="text-center">
                <Button variant="ghost" className="text-purple-400 text-sm">
                  <ExternalLink className="w-4 h-4 mr-1" />
                  View on Coinbase
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white">Recent OnRamp Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <ArrowUpRight className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-medium">{tx.amount} → {tx.crypto}</div>
                    <div className="text-purple-300 text-sm">via {tx.method}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {tx.status === 'completed' ? (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Completed
                    </Badge>
                  ) : (
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                      <Clock className="w-3 h-3 mr-1" />
                      Processing
                    </Badge>
                  )}
                  <Button size="sm" variant="ghost" className="text-purple-400">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Integration Benefits */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white">Enterprise Integration Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-white font-semibold mb-2">Regulatory Compliance</div>
              <div className="text-purple-300 text-sm">
                Full AML/KYC compliance with bank-level security standards
              </div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-white font-semibold mb-2">Real-time Rates</div>
              <div className="text-purple-300 text-sm">
                Live exchange rates with competitive pricing and minimal slippage
              </div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-white font-semibold mb-2">Instant Settlement</div>
              <div className="text-purple-300 text-sm">
                Immediate crypto delivery to game wallets with instant confirmation
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}