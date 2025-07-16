import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Users, 
  Wallet, 
  TrendingUp, 
  DollarSign, 
  Bitcoin,
  Coins,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Settings,
  Eye,
  Lock
} from 'lucide-react';
import { walletManager } from '@/lib/wallet-manager';

interface TreasuryMetrics {
  safeMultisig: {
    totalValue: string;
    cqtBalance: string;
    usdcBalance: string;
    activeSigners: number;
    pendingTransactions: number;
  };
  totalSig: {
    totalValue: string;
    bitcoinBalance: string;
    ethereumBalance: string;
    activeChains: number;
    miningRewards24h: string;
  };
  operations: {
    lpCreated24h: string;
    bridgedAssets24h: string;
    userWalletsCreated: number;
    gasSponsored: string;
  };
}

export function AdminWalletDashboard() {
  const [metrics, setMetrics] = useState<TreasuryMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'safe' | 'totalsig' | 'operations'>('overview');

  useEffect(() => {
    loadTreasuryMetrics();
  }, []);

  const loadTreasuryMetrics = async () => {
    try {
      // Simulate API call to load treasury metrics
      const mockMetrics: TreasuryMetrics = {
        safeMultisig: {
          totalValue: '$2.45M',
          cqtBalance: '15.7M CQT',
          usdcBalance: '350K USDC',
          activeSigners: 4,
          pendingTransactions: 2
        },
        totalSig: {
          totalValue: '$1.82M',
          bitcoinBalance: '12.5 BTC',
          ethereumBalance: '245 ETH',
          activeChains: 6,
          miningRewards24h: '$8,450'
        },
        operations: {
          lpCreated24h: '$125K',
          bridgedAssets24h: '$67K',
          userWalletsCreated: 1247,
          gasSponsored: '$2,340'
        }
      };
      
      setMetrics(mockMetrics);
    } catch (error) {
      console.error('Failed to load treasury metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Eye className="w-4 h-4" /> },
    { id: 'safe', label: 'Safe Multisig', icon: <Shield className="w-4 h-4" /> },
    { id: 'totalsig', label: 'TotalSig Mining', icon: <Bitcoin className="w-4 h-4" /> },
    { id: 'operations', label: 'Operations', icon: <Settings className="w-4 h-4" /> }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Treasury Management
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Multi-wallet architecture for secure gaming operations
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
              <CheckCircle className="w-4 h-4" />
              All systems operational
            </div>
            <button
              onClick={loadTreasuryMetrics}
              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Treasury</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">$4.27M</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Signers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {metrics?.safeMultisig.activeSigners || 0}
              </p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Mining Chains</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {metrics?.totalSig.activeChains || 0}
              </p>
            </div>
            <Bitcoin className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">24h Mining</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {metrics?.totalSig.miningRewards24h || '$0'}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Safe Multisig Overview */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Safe Multisig Treasury
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total Value</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {metrics?.safeMultisig.totalValue}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">CQT Balance</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {metrics?.safeMultisig.cqtBalance}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">USDC Reserve</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {metrics?.safeMultisig.usdcBalance}
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {metrics?.safeMultisig.pendingTransactions} pending transactions
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* TotalSig Overview */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Bitcoin className="w-6 h-6 text-orange-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  TotalSig Mining
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total Value</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {metrics?.totalSig.totalValue}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Bitcoin</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {metrics?.totalSig.bitcoinBalance}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Ethereum</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {metrics?.totalSig.ethereumBalance}
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {metrics?.totalSig.miningRewards24h} earned today
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'safe' && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Safe Multisig Configuration
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Threshold Configuration
                  </label>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      3 of {walletManager.SAFE_MULTISIG_CONFIG.signers.length} signatures required
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Active Networks
                  </label>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Polygon, BASE
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Authorized Signers
                </label>
                <div className="space-y-2">
                  {walletManager.SAFE_MULTISIG_CONFIG.signers.map((signer, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="font-mono text-sm text-gray-900 dark:text-white">
                            {signer.slice(0, 6)}...{signer.slice(-4)}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {index === 0 ? 'Founder' : `Signer ${index + 1}`}
                          </p>
                        </div>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'totalsig' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Multi-Chain Mining Operations
              </h3>
              <div className="space-y-3">
                {walletManager.TOTALSIG_CONFIG.networks.map((network) => (
                  <div key={network} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                        <Bitcoin className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white capitalize">
                        {network}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Active</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Operations Flow
              </h3>
              <div className="space-y-3">
                {[
                  'AI Mining Collection',
                  'Asset Conversion to USDC',
                  'Bridge to Safe Multisig',
                  'LP Creation & Management',
                  'Player Reward Distribution'
                ].map((step, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xs font-medium text-blue-600 dark:text-blue-400">
                      {index + 1}
                    </div>
                    <span className="text-sm text-gray-900 dark:text-white">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'operations' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Coins className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">LP Created</span>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {metrics?.operations.lpCreated24h}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Last 24 hours</p>
            </div>

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <ExternalLink className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Bridged Assets</span>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {metrics?.operations.bridgedAssets24h}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Last 24 hours</p>
            </div>

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Wallet className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">User Wallets</span>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {metrics?.operations.userWalletsCreated}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total created</p>
            </div>

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Gas Sponsored</span>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {metrics?.operations.gasSponsored}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">This month</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}