import React, { useState } from 'react';
import { 
  Wallet, 
  Shield, 
  Users, 
  CreditCard, 
  Globe, 
  Zap,
  ExternalLink,
  CheckCircle,
  ArrowRight,
  X
} from 'lucide-react';

interface WalletOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  recommended?: boolean;
  comingSoon?: boolean;
  onConnect: () => void;
}

interface WalletSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWalletConnect: (walletType: string) => void;
}

export function WalletSelectionModal({ isOpen, onClose, onWalletConnect }: WalletSelectionModalProps) {
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

  if (!isOpen) return null;

  const walletOptions: WalletOption[] = [
    {
      id: 'privy',
      name: 'Easy Sign-Up',
      description: 'Perfect for beginners - sign up with email, phone, or social media',
      icon: <Zap className="w-6 h-6" />,
      features: ['Email/SMS login', 'Social media sign-up', 'No crypto experience needed', 'Gasless transactions'],
      recommended: true,
      comingSoon: true,
      onConnect: () => onWalletConnect('privy')
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      description: 'Connect your existing Coinbase account with millions of users',
      icon: <CreditCard className="w-6 h-6" />,
      features: ['Existing Coinbase users', 'Built-in fiat onramps', 'Mobile & desktop', 'Familiar interface'],
      onConnect: () => onWalletConnect('coinbase')
    },
    {
      id: 'circle',
      name: 'Circle USDC Wallet',
      description: 'Optimized for USDC payments and stable gaming transactions',
      icon: <Shield className="w-6 h-6" />,
      features: ['USDC optimized', 'Low transaction fees', 'Enterprise security', 'Programmable policies'],
      comingSoon: true,
      onConnect: () => onWalletConnect('circle')
    },
    {
      id: 'metamask',
      name: 'MetaMask',
      description: 'The most popular Web3 wallet for advanced crypto users',
      icon: <Globe className="w-6 h-6" />,
      features: ['Universal compatibility', 'DeFi integration', 'Advanced features', 'Full control'],
      onConnect: () => onWalletConnect('metamask')
    },
    {
      id: 'walletconnect',
      name: 'Other Wallets',
      description: 'Connect Rainbow, Trust Wallet, and 100+ other wallets',
      icon: <Users className="w-6 h-6" />,
      features: ['100+ wallet support', 'Mobile wallets', 'Hardware wallet support', 'Universal standard'],
      onConnect: () => onWalletConnect('walletconnect')
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Choose Your Wallet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Select how you'd like to connect to CryptoQuest
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Treasury Information Banner */}
        <div className="p-6 bg-blue-50 dark:bg-blue-900/20 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                Secure Multi-Wallet Architecture
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                CryptoQuest uses Safe Multisig for treasury operations and TotalSig for AI mining across 6+ blockchains. 
                Your personal wallet connects to our secure gaming ecosystem.
              </p>
            </div>
          </div>
        </div>

        {/* Wallet Options */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {walletOptions.map((option) => (
              <div
                key={option.id}
                className={`relative border rounded-xl p-6 transition-all cursor-pointer ${
                  option.recommended 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                } ${
                  option.comingSoon 
                    ? 'opacity-60' 
                    : 'hover:shadow-lg'
                }`}
                onClick={option.comingSoon ? undefined : option.onConnect}
              >
                {/* Recommended Badge */}
                {option.recommended && (
                  <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                    Recommended
                  </div>
                )}

                {/* Coming Soon Badge */}
                {option.comingSoon && (
                  <div className="absolute -top-2 -left-2 bg-amber-600 text-white text-xs px-2 py-1 rounded-full">
                    Coming Soon
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${
                    option.recommended 
                      ? 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                  }`}>
                    {option.icon}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {option.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {option.description}
                    </p>
                    
                    <ul className="space-y-1">
                      {option.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {!option.comingSoon && (
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
            <Shield className="w-4 h-4" />
            <span>
              All wallets are secured with industry-leading encryption and multi-signature protection.
            </span>
            <a 
              href="#" 
              className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
            >
              Learn more <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}