import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Wallet, Download, Shield, CheckCircle, AlertTriangle, ExternalLink, Chrome, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MetaMaskState {
  isInstalled: boolean;
  isConnected: boolean;
  account: string | null;
  chainId: string | null;
  balance: string | null;
  networkName: string;
}

interface WalletOption {
  name: string;
  icon: string;
  downloadUrl: string;
  description: string;
  features: string[];
  supported: boolean;
}

export function MetaMaskIntegration() {
  const { toast } = useToast();
  const [metaMaskState, setMetaMaskState] = useState<MetaMaskState>({
    isInstalled: false,
    isConnected: false,
    account: null,
    chainId: null,
    balance: null,
    networkName: 'Unknown'
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  const walletOptions: WalletOption[] = [
    {
      name: "MetaMask",
      icon: "🦊",
      downloadUrl: "https://metamask.io/download/",
      description: "The most popular Ethereum wallet with full DApp support",
      features: ["Hardware wallet support", "Mobile app", "Browser extension", "DeFi integration"],
      supported: true
    },
    {
      name: "Coinbase Wallet",
      icon: "🔵",
      downloadUrl: "https://www.coinbase.com/wallet",
      description: "Secure wallet by Coinbase with built-in DApp browser",
      features: ["NFT support", "DApp browser", "Mobile first", "Easy onboarding"],
      supported: true
    },
    {
      name: "WalletConnect",
      icon: "🔗",
      downloadUrl: "https://walletconnect.com/",
      description: "Connect any wallet that supports WalletConnect protocol",
      features: ["Multi-wallet support", "QR code connection", "Mobile wallets", "Cross-platform"],
      supported: true
    },
    {
      name: "Brave Wallet",
      icon: "🦁",
      downloadUrl: "https://brave.com/wallet/",
      description: "Built-in wallet for Brave browser users",
      features: ["Privacy focused", "Built-in browser", "No extension needed", "Crypto rewards"],
      supported: false
    }
  ];

  const networkConfigs = {
    '0x89': { name: 'Polygon', color: 'bg-purple-500' },
    '0x13881': { name: 'Mumbai Testnet', color: 'bg-orange-500' },
    '0x1': { name: 'Ethereum', color: 'bg-blue-500' },
    '0x2105': { name: 'Base', color: 'bg-blue-600' }
  };

  useEffect(() => {
    checkMetaMaskStatus();
    
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('connect', handleConnect);
      window.ethereum.on('disconnect', handleDisconnect);
    }

    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
        window.ethereum.removeListener('connect', handleConnect);
        window.ethereum.removeListener('disconnect', handleDisconnect);
      }
    };
  }, []);

  const checkMetaMaskStatus = async () => {
    if (typeof window.ethereum !== 'undefined') {
      setMetaMaskState(prev => ({ ...prev, isInstalled: true }));
      
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        
        if (accounts.length > 0) {
          const balance = await window.ethereum.request({
            method: 'eth_getBalance',
            params: [accounts[0], 'latest']
          });
          
          const balanceInEth = (parseInt(balance, 16) / Math.pow(10, 18)).toFixed(4);
          const networkName = networkConfigs[chainId as keyof typeof networkConfigs]?.name || 'Unknown Network';
          
          setMetaMaskState({
            isInstalled: true,
            isConnected: true,
            account: accounts[0],
            chainId,
            balance: balanceInEth,
            networkName
          });
        }
      } catch (error) {
        console.error('Error checking MetaMask status:', error);
      }
    } else {
      setMetaMaskState(prev => ({ ...prev, isInstalled: false }));
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      setMetaMaskState(prev => ({
        ...prev,
        isConnected: false,
        account: null,
        balance: null
      }));
      toast({
        title: "Wallet Disconnected",
        description: "MetaMask has been disconnected from this site.",
        variant: "destructive"
      });
    } else {
      setMetaMaskState(prev => ({ ...prev, account: accounts[0] }));
      updateBalance(accounts[0]);
    }
  };

  const handleChainChanged = (chainId: string) => {
    const networkName = networkConfigs[chainId as keyof typeof networkConfigs]?.name || 'Unknown Network';
    setMetaMaskState(prev => ({ ...prev, chainId, networkName }));
    
    if (metaMaskState.account) {
      updateBalance(metaMaskState.account);
    }
    
    toast({
      title: "Network Changed",
      description: `Switched to ${networkName}`,
    });
  };

  const handleConnect = () => {
    toast({
      title: "Wallet Connected",
      description: "MetaMask connection established successfully.",
    });
  };

  const handleDisconnect = () => {
    setMetaMaskState(prev => ({
      ...prev,
      isConnected: false,
      account: null,
      balance: null
    }));
    toast({
      title: "Wallet Disconnected",
      description: "MetaMask has been disconnected.",
      variant: "destructive"
    });
  };

  const updateBalance = async (account: string) => {
    try {
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [account, 'latest']
      });
      const balanceInEth = (parseInt(balance, 16) / Math.pow(10, 18)).toFixed(4);
      setMetaMaskState(prev => ({ ...prev, balance: balanceInEth }));
    } catch (error) {
      console.error('Error updating balance:', error);
    }
  };

  const connectMetaMask = async () => {
    if (!metaMaskState.isInstalled) {
      setShowInstallGuide(true);
      return;
    }

    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      if (accounts.length > 0) {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        const balance = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [accounts[0], 'latest']
        });
        
        const balanceInEth = (parseInt(balance, 16) / Math.pow(10, 18)).toFixed(4);
        const networkName = networkConfigs[chainId as keyof typeof networkConfigs]?.name || 'Unknown Network';
        
        setMetaMaskState({
          isInstalled: true,
          isConnected: true,
          account: accounts[0],
          chainId,
          balance: balanceInEth,
          networkName
        });

        toast({
          title: "Wallet Connected Successfully",
          description: `Connected to ${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`,
        });
      }
    } catch (error: any) {
      console.error('Error connecting to MetaMask:', error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect to MetaMask",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const switchToPolygon = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x89' }]
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x89',
              chainName: 'Polygon Mainnet',
              nativeCurrency: {
                name: 'MATIC',
                symbol: 'MATIC',
                decimals: 18
              },
              rpcUrls: ['https://polygon-rpc.com/'],
              blockExplorerUrls: ['https://polygonscan.com/']
            }]
          });
        } catch (addError) {
          console.error('Error adding Polygon network:', addError);
        }
      }
    }
  };

  const disconnectWallet = () => {
    setMetaMaskState(prev => ({
      ...prev,
      isConnected: false,
      account: null,
      balance: null
    }));
    toast({
      title: "Wallet Disconnected",
      description: "You have been disconnected from MetaMask.",
    });
  };

  if (showInstallGuide) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Wallet Setup Required
            </CardTitle>
            <CardDescription>
              Choose a wallet to access all blockchain features of CryptoQuest
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="metamask" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="metamask">MetaMask</TabsTrigger>
                <TabsTrigger value="coinbase">Coinbase</TabsTrigger>
                <TabsTrigger value="walletconnect">WalletConnect</TabsTrigger>
                <TabsTrigger value="guide">Setup Guide</TabsTrigger>
              </TabsList>
              
              {walletOptions.map((wallet) => (
                <TabsContent key={wallet.name.toLowerCase().replace(' ', '')} value={wallet.name.toLowerCase().replace(' ', '')} className="space-y-4">
                  <div className="border rounded-lg p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{wallet.icon}</span>
                      <div>
                        <h3 className="font-semibold text-lg">{wallet.name}</h3>
                        <p className="text-gray-600 dark:text-gray-400">{wallet.description}</p>
                      </div>
                      {wallet.supported && (
                        <Badge variant="default" className="ml-auto">Recommended</Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {wallet.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      onClick={() => window.open(wallet.downloadUrl, '_blank')}
                      className="w-full"
                      size="lg"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Install {wallet.name}
                    </Button>
                  </div>
                </TabsContent>
              ))}
              
              <TabsContent value="guide" className="space-y-4">
                <div className="space-y-6">
                  <div className="border rounded-lg p-6">
                    <h3 className="font-semibold text-lg mb-4">Quick Setup Guide</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center font-semibold">1</div>
                        <div>
                          <h4 className="font-medium">Install MetaMask Browser Extension</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Visit metamask.io and click "Download" for your browser</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center font-semibold">2</div>
                        <div>
                          <h4 className="font-medium">Create or Import Wallet</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Follow the setup wizard to create a new wallet or import existing one</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center font-semibold">3</div>
                        <div>
                          <h4 className="font-medium">Add Polygon Network</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">We'll help you add Polygon network automatically when you connect</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center font-semibold">4</div>
                        <div>
                          <h4 className="font-medium">Refresh and Connect</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Refresh this page and click "Connect Wallet" to start using CryptoQuest</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Security Tip:</strong> Never share your seed phrase with anyone. CryptoQuest will never ask for your private keys or seed phrase.
                    </AlertDescription>
                  </Alert>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex gap-3 mt-6">
              <Button 
                variant="outline" 
                onClick={() => setShowInstallGuide(false)}
                className="flex-1"
              >
                Back to App
              </Button>
              <Button 
                onClick={() => window.location.reload()}
                className="flex-1"
              >
                <Chrome className="w-4 h-4 mr-2" />
                Check Installation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Wallet Connection
          </CardTitle>
          <CardDescription>
            Connect your wallet to access all CryptoQuest features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!metaMaskState.isInstalled ? (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                MetaMask is not installed. Please install a compatible wallet to use blockchain features.
              </AlertDescription>
            </Alert>
          ) : !metaMaskState.isConnected ? (
            <Alert>
              <Wallet className="h-4 w-4" />
              <AlertDescription>
                Connect your wallet to access the Admin Control Center and all blockchain features.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Wallet connected successfully! You now have full access to all CryptoQuest features.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Installation Status</span>
                <Badge variant={metaMaskState.isInstalled ? "default" : "destructive"}>
                  {metaMaskState.isInstalled ? "Installed" : "Not Installed"}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Connection Status</span>
                <Badge variant={metaMaskState.isConnected ? "default" : "secondary"}>
                  {metaMaskState.isConnected ? "Connected" : "Disconnected"}
                </Badge>
              </div>
              
              {metaMaskState.isConnected && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Network</span>
                    <Badge 
                      variant="outline" 
                      className={networkConfigs[metaMaskState.chainId as keyof typeof networkConfigs]?.color || 'bg-gray-500'}
                    >
                      {metaMaskState.networkName}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Balance</span>
                    <span className="text-sm font-mono">{metaMaskState.balance} ETH</span>
                  </div>
                </>
              )}
            </div>

            <div className="space-y-3">
              {metaMaskState.isConnected && metaMaskState.account && (
                <div>
                  <span className="text-sm font-medium">Connected Account</span>
                  <div className="text-sm font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1">
                    {metaMaskState.account.substring(0, 6)}...{metaMaskState.account.substring(38)}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            {!metaMaskState.isInstalled ? (
              <Button 
                onClick={() => setShowInstallGuide(true)}
                className="flex-1"
                size="lg"
              >
                <Download className="w-4 h-4 mr-2" />
                Install Wallet
              </Button>
            ) : !metaMaskState.isConnected ? (
              <Button 
                onClick={connectMetaMask}
                disabled={isConnecting}
                className="flex-1"
                size="lg"
              >
                <Wallet className="w-4 h-4 mr-2" />
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </Button>
            ) : (
              <>
                {metaMaskState.chainId !== '0x89' && (
                  <Button 
                    onClick={switchToPolygon}
                    variant="outline"
                    className="flex-1"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    Switch to Polygon
                  </Button>
                )}
                <Button 
                  onClick={disconnectWallet}
                  variant="outline"
                  className="flex-1"
                >
                  Disconnect
                </Button>
              </>
            )}
          </div>

          {metaMaskState.isConnected && (
            <div className="text-xs text-gray-600 dark:text-gray-400 text-center">
              You now have access to: Admin Control Center, NFT Marketplace, Token Operations, DAO Governance, and all blockchain features
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}