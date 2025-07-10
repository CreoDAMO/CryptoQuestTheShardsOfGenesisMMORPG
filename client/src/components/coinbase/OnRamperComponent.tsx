import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  ArrowRight, 
  Shield, 
  Clock, 
  CheckCircle,
  Building2,
  Smartphone,
  Globe,
  Lock,
  TrendingUp,
  Zap,
  Coins,
  Wallet,
  ExternalLink,
  RefreshCw,
  Star,
  AlertCircle
} from 'lucide-react';

interface OnRampOption {
  id: string;
  name: string;
  type: 'card' | 'bank' | 'wire' | 'crypto';
  fee: number;
  minAmount: number;
  maxAmount: number;
  processingTime: string;
  supported: boolean;
  popular: boolean;
}

interface PurchaseQuote {
  amount: number;
  currency: string;
  fees: number;
  total: number;
  rate: number;
  tokenAmount: number;
}

export function OnRamperComponent() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('card');
  const [amount, setAmount] = useState<string>('100');
  const [currency, setCurrency] = useState<string>('USD');
  const [quote, setQuote] = useState<PurchaseQuote | null>(null);
  const [loading, setLoading] = useState(false);
  const [kycStatus, setKycStatus] = useState<'pending' | 'verified' | 'required'>('required');

  const paymentMethods: OnRampOption[] = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      type: 'card',
      fee: 3.5,
      minAmount: 10,
      maxAmount: 1000,
      processingTime: 'Instant',
      supported: true,
      popular: true
    },
    {
      id: 'bank',
      name: 'Bank Transfer (ACH)',
      type: 'bank',
      fee: 1.0,
      minAmount: 25,
      maxAmount: 10000,
      processingTime: '1-3 business days',
      supported: true,
      popular: false
    },
    {
      id: 'wire',
      name: 'Wire Transfer',
      type: 'wire',
      fee: 0.5,
      minAmount: 500,
      maxAmount: 50000,
      processingTime: '1-2 business days',
      supported: true,
      popular: false
    },
    {
      id: 'crypto',
      name: 'Crypto Exchange',
      type: 'crypto',
      fee: 0.25,
      minAmount: 10,
      maxAmount: 25000,
      processingTime: '10-30 minutes',
      supported: true,
      popular: true
    }
  ];

  const supportedCurrencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' }
  ];

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case 'card': return <CreditCard className="w-5 h-5" />;
      case 'bank': return <Building2 className="w-5 h-5" />;
      case 'wire': return <Globe className="w-5 h-5" />;
      case 'crypto': return <Coins className="w-5 h-5" />;
      default: return <Wallet className="w-5 h-5" />;
    }
  };

  const calculateQuote = () => {
    setLoading(true);
    const selectedMethod = paymentMethods.find(m => m.id === selectedPaymentMethod);
    if (!selectedMethod) return;

    setTimeout(() => {
      const baseAmount = parseFloat(amount) || 0;
      const fees = baseAmount * (selectedMethod.fee / 100);
      const total = baseAmount + fees;
      const rate = 0.00024; // Mock CQT rate
      const tokenAmount = baseAmount * rate;

      setQuote({
        amount: baseAmount,
        currency,
        fees,
        total,
        rate,
        tokenAmount
      });
      setLoading(false);
    }, 1500);
  };

  useEffect(() => {
    if (amount && parseFloat(amount) > 0) {
      calculateQuote();
    }
  }, [amount, currency, selectedPaymentMethod]);

  const handlePurchase = async () => {
    if (!quote) return;
    
    setLoading(true);
    try {
      // Mock purchase flow
      console.log('Starting purchase flow...', quote);
      
      // Simulate KYC if required
      if (kycStatus === 'required') {
        setKycStatus('pending');
        setTimeout(() => setKycStatus('verified'), 3000);
      }
      
      // Simulate payment processing
      setTimeout(() => {
        setLoading(false);
        // Success state would be handled here
      }, 5000);
    } catch (error) {
      console.error('Purchase failed:', error);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          OnRamper Pro
        </h1>
        <p className="text-gray-300">
          Buy CQT tokens directly with fiat currency using Coinbase OnRamp
        </p>
      </div>

      {/* KYC Status */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-blue-400" />
            <span className="text-white font-medium">KYC Verification</span>
          </div>
          <div className="flex items-center gap-2">
            {kycStatus === 'verified' && (
              <>
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-green-400">Verified</span>
              </>
            )}
            {kycStatus === 'pending' && (
              <>
                <Clock className="w-5 h-5 text-yellow-400 animate-spin" />
                <span className="text-yellow-400">Verifying...</span>
              </>
            )}
            {kycStatus === 'required' && (
              <>
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-400">Required</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Purchase Form */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-semibold text-white">Purchase CQT Tokens</h3>
          
          {/* Amount Input */}
          <div className="space-y-2">
            <label className="text-sm text-gray-300">Amount</label>
            <div className="relative">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-transparent text-white border-none outline-none"
              >
                {supportedCurrencies.map(curr => (
                  <option key={curr.code} value={curr.code} className="bg-slate-800">
                    {curr.code}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-16 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter amount"
              />
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-3">
            <label className="text-sm text-gray-300">Payment Method</label>
            <div className="grid grid-cols-1 gap-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  onClick={() => setSelectedPaymentMethod(method.id)}
                  className={`relative p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedPaymentMethod === method.id
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-slate-600 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getPaymentMethodIcon(method.type)}
                      <div>
                        <div className="text-white font-medium flex items-center gap-2">
                          {method.name}
                          {method.popular && (
                            <span className="text-xs bg-yellow-500 text-black px-2 py-1 rounded-full">
                              Popular
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-400">
                          {method.fee}% fee • {method.processingTime}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">
                        ${method.minAmount} - ${method.maxAmount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quote Display */}
          {quote && (
            <div className="bg-slate-700/50 rounded-lg p-4 space-y-3">
              <h4 className="text-white font-medium">Purchase Quote</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">Amount</span>
                  <span className="text-white">{quote.currency} {quote.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Fees</span>
                  <span className="text-white">{quote.currency} {quote.fees.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-600 pt-2">
                  <span className="text-gray-300">Total</span>
                  <span className="text-white font-semibold">{quote.currency} {quote.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">You'll receive</span>
                  <span className="text-blue-400 font-semibold">{quote.tokenAmount.toFixed(2)} CQT</span>
                </div>
              </div>
            </div>
          )}

          {/* Purchase Button */}
          <button
            onClick={handlePurchase}
            disabled={!quote || loading || kycStatus !== 'verified'}
            className={`w-full py-3 rounded-lg font-medium transition-all ${
              !quote || loading || kycStatus !== 'verified'
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                Processing...
              </div>
            ) : kycStatus !== 'verified' ? (
              'Complete KYC to Purchase'
            ) : (
              'Purchase CQT Tokens'
            )}
          </button>
        </div>

        {/* Features & Security */}
        <div className="space-y-6">
          {/* Security Features */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Security & Features</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <div className="text-white font-medium">Bank-Level Security</div>
                  <div className="text-sm text-gray-400">
                    256-bit encryption and regulatory compliance
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-green-400 mt-0.5" />
                <div>
                  <div className="text-white font-medium">Instant Processing</div>
                  <div className="text-sm text-gray-400">
                    Tokens delivered directly to your wallet
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-purple-400 mt-0.5" />
                <div>
                  <div className="text-white font-medium">KYC Protected</div>
                  <div className="text-sm text-gray-400">
                    Identity verification for fraud prevention
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Globe className="w-5 h-5 text-orange-400 mt-0.5" />
                <div>
                  <div className="text-white font-medium">Global Support</div>
                  <div className="text-sm text-gray-400">
                    Available in 100+ countries worldwide
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Market Info */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">CQT Market Info</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Current Price</span>
                <span className="text-white">$0.00024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">24h Change</span>
                <span className="text-green-400">+12.5%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Market Cap</span>
                <span className="text-white">$2.4M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Circulating Supply</span>
                <span className="text-white">10.2B CQT</span>
              </div>
            </div>
          </div>

          {/* Supported Networks */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Supported Networks</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-700/50 rounded-lg p-3">
                <div className="text-white font-medium">Polygon</div>
                <div className="text-sm text-gray-400">Low fees, fast transactions</div>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-3">
                <div className="text-white font-medium">Base</div>
                <div className="text-sm text-gray-400">Coinbase L2 solution</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}