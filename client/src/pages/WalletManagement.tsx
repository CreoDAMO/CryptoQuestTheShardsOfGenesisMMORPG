import React, { useState } from 'react';
import { 
  Wallet, 
  Shield, 
  Users, 
  Settings, 
  Plus,
  ExternalLink,
  TrendingUp
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
// Import the new SafeMultisig setup component
import { SafeMultisigSetup } from '../../../components/wallet/SafeMultisigSetup';

function WalletManagement() {
  const [activeTab, setActiveTab] = useState<'overview' | 'admin' | 'user' | 'setup'>('overview');
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [newOwnerAddress, setNewOwnerAddress] = useState('');

  // Fetch wallet providers
  const { data: providers } = useQuery({
    queryKey: ['/api/wallet/providers'],
    queryFn: async () => {
      const response = await fetch('/api/wallet/providers');
      if (!response.ok) throw new Error('Failed to fetch providers');
      return response.json();
    }
  });

  // Fetch integration status
  const { data: status } = useQuery({
    queryKey: ['/api/wallet/status'],
    queryFn: async () => {
      const response = await fetch('/api/wallet/status');
      if (!response.ok) throw new Error('Failed to fetch status');
      return response.json();
    }
  });

  // Fetch operational flow
  const { data: flow } = useQuery({
    queryKey: ['/api/wallet/flow'],
    queryFn: async () => {
      const response = await fetch('/api/wallet/flow');
      if (!response.ok) throw new Error('Failed to fetch flow');
      return response.json();
    }
  });

  const handleWalletConnect = (walletType: string) => {
    console.log(`Connecting with wallet type: ${walletType}`);
    setShowWalletModal(false);
    // Here you would implement the actual wallet connection logic
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'setup', label: 'SafeGlobal Setup', icon: <Shield className="w-4 h-4" /> },
    { id: 'admin', label: 'Treasury Management', icon: <Settings className="w-4 h-4" /> },
    { id: 'user', label: 'User Wallets', icon: <Users className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Multi-Wallet Architecture
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Comprehensive wallet management for gaming treasury and user onboarding
              </p>
            </div>
            <button
              onClick={() => setShowWalletModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Connect Wallet
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
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
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Architecture Overview */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Wallet Architecture Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Treasury Management</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Safe Multisig for core operations, TotalSig for AI mining
                    </p>
                    <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                      <li>• CQT token treasury and LP management</li>
                      <li>• Cross-chain mining across 6+ blockchains</li>
                      <li>• Multi-signature security protection</li>
                    </ul>
                  </div>
                  
                  <div className="border-l-4 border-green-500 pl-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">User Onboarding</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Multiple wallet options for all user types
                    </p>
                    <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                      <li>• Privy: Social login for beginners</li>
                      <li>• Coinbase: Mainstream crypto users</li>
                      <li>• Circle: USDC-optimized payments</li>
                      <li>• WalletConnect: Universal compatibility</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Operational Flow</h3>
                  {flow?.success && (
                    <div className="space-y-2">
                      {Object.entries(flow.flow).map(([step, description], index) => (
                        <div key={step} className="flex items-start gap-2 text-xs">
                          <div className="w-5 h-5 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-medium">
                            {index + 1}
                          </div>
                          <span className="text-gray-700 dark:text-gray-300">{description}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Integration Status */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Integration Status
              </h2>
              {status?.success && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-3">Admin Wallets</h3>
                    <div className="space-y-2">
                      {Object.entries(status.status.adminWallets).map(([key, wallet]: [string, any]) => (
                        <div key={key} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                          <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">{key}</span>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${wallet.integrated ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {wallet.networks?.join(', ')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-3">User Wallets</h3>
                    <div className="space-y-2">
                      {Object.entries(status.status.userWallets).map(([key, wallet]: [string, any]) => (
                        <div key={key} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                          <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">{key}</span>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${wallet.integrated ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {wallet.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Wallet Providers */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Available Wallet Providers
              </h2>
              {providers?.success && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {providers.providers.map((provider: any) => (
                    <div key={provider.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          provider.type === 'admin' ? 'bg-red-100 dark:bg-red-900' : 'bg-blue-100 dark:bg-blue-900'
                        }`}>
                          {provider.type === 'admin' ? 
                            <Shield className="w-4 h-4 text-red-600 dark:text-red-400" /> :
                            <Wallet className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          }
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">{provider.name}</h3>
                          <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">{provider.type}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{provider.purpose}</p>
                      <div className="flex flex-wrap gap-1">
                        {provider.networks.slice(0, 3).map((network: string) => (
                          <span key={network} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                            {network}
                          </span>
                        ))}
                        {provider.networks.length > 3 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">+{provider.networks.length - 3}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'setup' && (
          <SafeMultisigSetup 
            currentOwnerAddress={newOwnerAddress}
            onAddressUpdate={setNewOwnerAddress}
          />
        )}

        {activeTab === 'admin' && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Treasury Management Dashboard
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 dark:text-white">Safe Multisig Operations</h3>
                <div className="space-y-2">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <div className="text-sm font-medium text-blue-900 dark:text-blue-100">CQT Treasury</div>
                    <div className="text-xs text-blue-700 dark:text-blue-300">39.23T CQT tokens managed</div>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded">
                    <div className="text-sm font-medium text-green-900 dark:text-green-100">LP Management</div>
                    <div className="text-xs text-green-700 dark:text-green-300">Active liquidity pools on Polygon & Base</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 dark:text-white">TotalSig AI Mining</h3>
                <div className="space-y-2">
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded">
                    <div className="text-sm font-medium text-purple-900 dark:text-purple-100">Multi-Chain Mining</div>
                    <div className="text-xs text-purple-700 dark:text-purple-300">6+ blockchains automated</div>
                  </div>
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                    <div className="text-sm font-medium text-yellow-900 dark:text-yellow-100">Asset Optimization</div>
                    <div className="text-xs text-yellow-700 dark:text-yellow-300">Portfolio diversification active</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'user' && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                User Wallet Management
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Connect your wallet to access user management features
              </p>
              <button
                onClick={() => setShowWalletModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Connect Wallet
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Simple Wallet Selection Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Connect Wallet</h3>
            <div className="space-y-3">
              {['MetaMask', 'Coinbase Wallet', 'WalletConnect', 'Privy (Coming Soon)'].map((wallet) => (
                <button
                  key={wallet}
                  onClick={() => handleWalletConnect(wallet)}
                  disabled={wallet.includes('Coming Soon')}
                  className="w-full p-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="font-medium text-gray-900 dark:text-white">{wallet}</div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowWalletModal(false)}
              className="mt-4 w-full p-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default WalletManagement;