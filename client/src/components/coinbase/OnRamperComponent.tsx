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
  AlertCircle,
  Play,
  Pause
} from 'lucide-react';
import { 
  StreamlitHeader, 
  StreamlitControls, 
  StreamlitMetricCard, 
  StreamlitChartContainer,
  StreamlitStatus,
  StreamlitProgress,
  useStreamlit
} from '@/components/shared/StreamlitCore';

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
  const [systemActive, setSystemActive] = useState(true);
  
  const { config, setConfig, fragments, metrics: streamlitMetrics, addFragment, toggleFragment } = useStreamlit({
    realTimeEnabled: true,
    autoRefresh: true,
    refreshInterval: 3000
  });

  // Initialize Streamlit fragments
  useEffect(() => {
    addFragment({
      id: 'payment-methods',
      title: 'Payment Methods',
      component: <></>,
      dependencies: ['payments'],
      updateFrequency: 5000,
      priority: 'high',
      status: 'active'
    });
    
    addFragment({
      id: 'pricing-quotes',
      title: 'Real-time Pricing',
      component: <></>,
      dependencies: ['pricing'],
      updateFrequency: 3000,
      priority: 'high',
      status: 'active'
    });
  }, []);

  const paymentMethods: OnRampOption[] = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      type: 'card',
      fee: 3.99,
      minAmount: 10,
      maxAmount: 1000,
      processingTime: '5-10 minutes',
      supported: true,
      popular: true
    },
    {
      id: 'bank',
      name: 'Bank Transfer',
      type: 'bank',
      fee: 1.49,
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

  const generateQuote = () => {
    calculateQuote();
  };

  useEffect(() => {
    if (amount && parseFloat(amount) > 0) {
      calculateQuote();
    }
  }, [amount, currency, selectedPaymentMethod]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <StreamlitHeader
          title="OnRamper - Fiat to Crypto"
          subtitle="Buy crypto instantly with multiple payment methods and real-time pricing"
          icon={<CreditCard className="w-8 h-8 text-blue-500" />}
          status={systemActive ? 'active' : 'paused'}
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
            title="Payment Methods"
            value={paymentMethods.filter(m => m.supported).length.toString()}
            change={`${paymentMethods.filter(m => m.popular).length} popular`}
            icon={<CreditCard className="w-5 h-5" />}
            trend="up"
          />
          <StreamlitMetricCard
            title="Processing Time"
            value={paymentMethods.find(m => m.id === selectedPaymentMethod)?.processingTime || 'N/A'}
            change={`${paymentMethods.find(m => m.id === selectedPaymentMethod)?.fee || 0}% fee`}
            icon={<Clock className="w-5 h-5" />}
            trend="neutral"
          />
          <StreamlitMetricCard
            title="KYC Status"
            value={kycStatus.charAt(0).toUpperCase() + kycStatus.slice(1)}
            change={kycStatus === 'verified' ? 'Verified' : 'Required'}
            icon={<Shield className="w-5 h-5" />}
            trend={kycStatus === 'verified' ? 'up' : 'neutral'}
          />
          <StreamlitMetricCard
            title="Current Rate"
            value={quote ? `$${quote.rate.toFixed(2)}` : 'Loading...'}
            change={quote ? `${quote.tokenAmount.toFixed(6)} CQT` : 'N/A'}
            icon={<TrendingUp className="w-5 h-5" />}
            trend="up"
          />
        </div>

        <StreamlitStatus
          status={kycStatus === 'verified' ? 'success' : 'warning'}
          message={kycStatus === 'verified' ? 'KYC Verified - Ready to Purchase' : 'KYC Required for Large Transactions'}
          details={`Selected method: ${paymentMethods.find(m => m.id === selectedPaymentMethod)?.name || 'N/A'}`}
        />

        <StreamlitChartContainer title="Purchase Configuration" controls={
          <div className="flex gap-2">
            <button
              onClick={() => setSystemActive(!systemActive)}
              className={`p-2 rounded-lg ${systemActive ? 'bg-green-600' : 'bg-gray-600'}`}
            >
              {systemActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={() => generateQuote()}
              className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        }>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <StreamlitProgress
                value={parseFloat(amount) || 0}
                max={paymentMethods.find(m => m.id === selectedPaymentMethod)?.maxAmount || 1000}
                label="Amount vs Max Limit"
                color="blue"
              />
              <div className="bg-slate-700/50 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3">Payment Methods</h3>
                <div className="space-y-2">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">{method.name}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        method.supported ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {method.supported ? `${method.fee}% fee` : 'Not Available'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {quote && (
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-3">Purchase Quote</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Amount:</span>
                      <span className="text-white">${quote.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Fees:</span>
                      <span className="text-white">${quote.fees.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Total:</span>
                      <span className="text-white font-bold">${quote.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">You'll receive:</span>
                      <span className="text-green-400 font-bold">{quote.tokenAmount.toFixed(6)} CQT</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </StreamlitChartContainer>
      </div>
    </div>
  );
}