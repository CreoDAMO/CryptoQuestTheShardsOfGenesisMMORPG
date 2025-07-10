import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  Shield, 
  ExternalLink, 
  Copy, 
  CheckCircle, 
  AlertCircle,
  Download,
  Globe,
  Lock,
  Zap,
  RefreshCw,
  Settings,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

interface WalletState {
  isConnected: boolean;
  address: string;
  balance: string;
  chainId: string;
  isCorrectNetwork: boolean;
}

interface NetworkConfig {
  chainId: string;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls: string[];
}

export function MetaMaskIntegration() {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: '',
    balance: '0',
    chainId: '',
    isCorrectNetwork: false
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [installPrompt, setInstallPrompt] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  // Network configurations
  const networks: Record<string, NetworkConfig> = {
    polygon: {
      chainId: '0x89',
      chainName: 'Polygon Mainnet',
      nativeCurrency: {
        name: 'MATIC',
        symbol: 'MATIC',
        decimals: 18
      },
      rpcUrls: ['https://polygon-rpc.com/'],
      blockExplorerUrls: ['https://polygonscan.com/']
    },
    base: {
      chainId: '0x2105',
      chainName: 'Base',
      nativeCurrency: {
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18
      },
      rpcUrls: ['https://mainnet.base.org'],
      blockExplorerUrls: ['https://basescan.org/']
    },
    polygonMumbai: {
      chainId: '0x13881',
      chainName: 'Polygon Mumbai',
      nativeCurrency: {
        name: 'MATIC',
        symbol: 'MATIC',
        decimals: 18
      },
      rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
      blockExplorerUrls: ['https://mumbai.polygonscan.com/']
    }
  };

  // Check if MetaMask is installed
  useEffect(() => {
    const checkMetaMask = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          // Check if already connected
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            await updateWalletState(accounts[0]);
          }
        } catch (error) {
          console.error('Error checking MetaMask:', error);
        }
      } else {
        setInstallPrompt(true);
      }
    };

    checkMetaMask();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      setWalletState({
        isConnected: false,
        address: '',
        balance: '0',
        chainId: '',
        isCorrectNetwork: false
      });
    } else {
      updateWalletState(accounts[0]);
    }
  };

  const handleChainChanged = (chainId: string) => {
    setWalletState(prev => ({
      ...prev,
      chainId,
      isCorrectNetwork: chainId === networks.polygon.chainId || chainId === networks.base.chainId
    }));
  };

  const updateWalletState = async (address: string) => {
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest']
      });
      
      // Convert balance from Wei to Ether
      const balanceInEther = (parseInt(balance, 16) / 1e18).toFixed(4);
      
      setWalletState({
        isConnected: true,
        address,
        balance: balanceInEther,
        chainId,
        isCorrectNetwork: chainId === networks.polygon.chainId || chainId === networks.base.chainId
      });
    } catch (error) {
      console.error('Error updating wallet state:', error);
      setError('Failed to update wallet state');
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      setInstallPrompt(true);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      if (accounts.length > 0) {
        await updateWalletState(accounts[0]);
      }
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      setError(error.message || 'Failed to connect wallet');
    } finally {
      setLoading(false);
    }
  };

  const switchNetwork = async (networkKey: string) => {
    if (!window.ethereum) return;

    const network = networks[networkKey];
    setLoading(true);

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: network.chainId }]
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [network]
          });
        } catch (addError) {
          console.error('Error adding network:', addError);
          setError('Failed to add network');
        }
      } else {
        console.error('Error switching network:', switchError);
        setError('Failed to switch network');
      }
    } finally {
      setLoading(false);
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(walletState.address);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const disconnect = () => {
    setWalletState({
      isConnected: false,
      address: '',
      balance: '0',
      chainId: '',
      isCorrectNetwork: false
    });
  };

  const getNetworkName = (chainId: string) => {
    const network = Object.values(networks).find(n => n.chainId === chainId);
    return network?.chainName || 'Unknown Network';
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (installPrompt) {
    return (
      <div className="w-full max-w-md mx-auto p-6 space-y-6">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center space-y-4">
          <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto">
            <Download className="w-8 h-8 text-orange-400" />
          </div>
          <h3 className="text-xl font-semibold text-white">MetaMask Required</h3>
          <p className="text-gray-300">
            To use CryptoQuest features, you need to install MetaMask browser extension.
          </p>
          <a
            href="https://metamask.io/download/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-700 hover:to-red-700 transition-all"
          >
            <Download className="w-4 h-4" />
            Install MetaMask
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          MetaMask Integration
        </h1>
        <p className="text-gray-300">
          Connect your MetaMask wallet to access CryptoQuest features
        </p>
      </div>

      {/* Connection Status */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Wallet Status</h3>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${walletState.isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className={`text-sm ${walletState.isConnected ? 'text-green-400' : 'text-red-400'}`}>
              {walletState.isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        {!walletState.isConnected ? (
          <div className="space-y-4">
            <p className="text-gray-300">Connect your MetaMask wallet to get started</p>
            <button
              onClick={connectWallet}
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-lg font-medium hover:from-orange-700 hover:to-red-700 transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Connecting...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Wallet className="w-5 h-5" />
                  Connect MetaMask
                </div>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Wallet Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-700/50 rounded-lg p-4">
                <div className="text-sm text-gray-300 mb-1">Address</div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-mono">{formatAddress(walletState.address)}</span>
                  <button
                    onClick={copyAddress}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {copiedAddress ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4">
                <div className="text-sm text-gray-300 mb-1">Balance</div>
                <div className="text-white font-semibold">{walletState.balance} ETH</div>
              </div>
            </div>

            {/* Network Status */}
            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-300">Network</div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${walletState.isCorrectNetwork ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                  <span className={`text-sm ${walletState.isCorrectNetwork ? 'text-green-400' : 'text-yellow-400'}`}>
                    {walletState.isCorrectNetwork ? 'Supported' : 'Switch Required'}
                  </span>
                </div>
              </div>
              <div className="text-white font-semibold">{getNetworkName(walletState.chainId)}</div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={disconnect}
                className="flex-1 bg-slate-700 text-white py-2 rounded-lg font-medium hover:bg-slate-600 transition-colors"
              >
                Disconnect
              </button>
              <button
                onClick={() => window.open(`https://polygonscan.com/address/${walletState.address}`, '_blank')}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                View on Explorer
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Network Switching */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Supported Networks</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(networks).map(([key, network]) => (
            <div
              key={key}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                walletState.chainId === network.chainId
                  ? 'border-green-500 bg-green-500/10'
                  : 'border-slate-600 hover:border-slate-500'
              }`}
              onClick={() => switchNetwork(key)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">{network.chainName}</div>
                  <div className="text-sm text-gray-400">{network.nativeCurrency.symbol}</div>
                </div>
                <div className="flex items-center gap-2">
                  {walletState.chainId === network.chainId ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
              <div className="text-white font-medium">Secure Connection</div>
              <div className="text-sm text-gray-400">
                Industry-standard wallet security
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-green-400 mt-0.5" />
            <div>
              <div className="text-white font-medium">Fast Transactions</div>
              <div className="text-sm text-gray-400">
                Low-cost Polygon and Base networks
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-purple-400 mt-0.5" />
            <div>
              <div className="text-white font-medium">Full Control</div>
              <div className="text-sm text-gray-400">
                Your keys, your crypto
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Globe className="w-5 h-5 text-orange-400 mt-0.5" />
            <div>
              <div className="text-white font-medium">Multi-Network</div>
              <div className="text-sm text-gray-400">
                Polygon, Base, and testnet support
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <div className="text-red-300">{error}</div>
        </div>
      )}
    </div>
  );
}

// TypeScript declarations for MetaMask
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, handler: (data: any) => void) => void;
      removeListener: (event: string, handler: (data: any) => void) => void;
    };
  }
}