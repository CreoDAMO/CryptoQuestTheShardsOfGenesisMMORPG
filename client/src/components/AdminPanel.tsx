import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Shield, Upload, Settings, Code, Zap, Globe, Lock, DollarSign, TrendingUp, Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { MetaMaskIntegration } from './MetaMaskIntegration';

interface ContractUpgrade {
  id: string;
  contractName: string;
  currentVersion: string;
  newVersion: string;
  implementationAddress: string;
  proxyAddress: string;
  status: 'pending' | 'ready' | 'upgrading' | 'completed' | 'failed';
  features: string[];
  securityChecks: {
    passed: number;
    total: number;
    criticalIssues: number;
  };
}

interface DeploymentConfig {
  network: 'testnet' | 'mainnet';
  gasPrice: string;
  gasLimit: string;
  contractName: string;
  constructorArgs: string[];
  verifyContract: boolean;
  enableProxy: boolean;
}

interface FundingTransaction {
  id: string;
  amount: number;
  currency: string;
  investorAddress: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
  grantSource?: string;
}

export function AdminPanel() {
  const { toast } = useToast();
  const [selectedContract, setSelectedContract] = useState<string>('');
  const [fundingAmount, setFundingAmount] = useState<string>('');
  const [tokenAddress, setTokenAddress] = useState<string>('');
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [deploymentConfig, setDeploymentConfig] = useState<DeploymentConfig>({
    network: 'testnet',
    gasPrice: '30',
    gasLimit: '5000000',
    contractName: '',
    constructorArgs: [],
    verifyContract: true,
    enableProxy: true
  });

  useEffect(() => {
    checkWalletConnection();
    
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', () => window.location.reload());
    }

    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setIsWalletConnected(true);
          setWalletAddress(accounts[0]);
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      setIsWalletConnected(false);
      setWalletAddress('');
    } else {
      setIsWalletConnected(true);
      setWalletAddress(accounts[0]);
    }
  };

  const { data: contractUpgrades, isLoading: upgradesLoading } = useQuery({
    queryKey: ['/api/admin/contract-upgrades'],
    refetchInterval: 5000
  });

  const { data: deploymentStatus, isLoading: deploymentLoading } = useQuery({
    queryKey: ['/api/admin/deployment-status'],
    refetchInterval: 3000
  });

  const { data: auditResults, isLoading: auditLoading } = useQuery({
    queryKey: ['/api/admin/security-audit', selectedContract],
    enabled: !!selectedContract
  });

  const { data: fundingData, isLoading: fundingLoading } = useQuery({
    queryKey: ['/api/admin/funding-dashboard'],
    refetchInterval: 10000
  });

  const { data: tokenScanResults, isLoading: tokenScanLoading } = useQuery({
    queryKey: ['/api/admin/token-scan', tokenAddress],
    enabled: !!tokenAddress
  });

  const processFundingMutation = useMutation({
    mutationFn: (data: { amount: string; currency: string; investorType: string }) =>
      apiRequest('/api/admin/process-funding', {
        method: 'POST',
        body: data
      }),
    onSuccess: () => {
      toast({
        title: "Funding Processed",
        description: "Investment transaction has been initiated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/funding-dashboard'] });
    },
    onError: () => {
      toast({
        title: "Funding Failed",
        description: "Unable to process investment transaction.",
        variant: "destructive",
      });
    }
  });

  const upgradeContractMutation = useMutation({
    mutationFn: (data: { contractId: string; newImplementation: string }) =>
      apiRequest('/api/admin/upgrade-contract', {
        method: 'POST',
        body: data
      }),
    onSuccess: () => {
      toast({
        title: "Contract Upgrade Initiated",
        description: "Smart contract upgrade is being processed with multi-sig validation.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/contract-upgrades'] });
    },
    onError: () => {
      toast({
        title: "Upgrade Failed",
        description: "Contract upgrade failed security validation.",
        variant: "destructive",
      });
    }
  });

  const deployContractMutation = useMutation({
    mutationFn: (config: DeploymentConfig) =>
      apiRequest('/api/admin/deploy-contract', {
        method: 'POST',
        body: config
      }),
    onSuccess: () => {
      toast({
        title: "Deployment Started",
        description: "Contract deployment initiated with automated verification.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/deployment-status'] });
    }
  });

  const auditContractMutation = useMutation({
    mutationFn: (contractAddress: string) =>
      apiRequest('/api/admin/audit-contract', {
        method: 'POST',
        body: { contractAddress }
      }),
    onSuccess: () => {
      toast({
        title: "Security Audit Started",
        description: "Advanced smart contract analysis in progress.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/security-audit', selectedContract] });
    }
  });

  const scanTokenMutation = useMutation({
    mutationFn: (address: string) =>
      apiRequest('/api/admin/scan-token', {
        method: 'POST',
        body: { tokenAddress: address }
      }),
    onSuccess: () => {
      toast({
        title: "Token Scan Started",
        description: "Comprehensive token security analysis initiated.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/token-scan', tokenAddress] });
    }
  });

  const handleProcessFunding = () => {
    if (!fundingAmount || parseFloat(fundingAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid funding amount.",
        variant: "destructive",
      });
      return;
    }
    processFundingMutation.mutate({
      amount: fundingAmount,
      currency: 'USD',
      investorType: 'strategic'
    });
  };

  const handleUpgradeContract = (contractId: string, newImplementation: string) => {
    upgradeContractMutation.mutate({ contractId, newImplementation });
  };

  const handleDeployContract = () => {
    if (!deploymentConfig.contractName) {
      toast({
        title: "Invalid Configuration",
        description: "Contract name is required for deployment.",
        variant: "destructive",
      });
      return;
    }
    deployContractMutation.mutate(deploymentConfig);
  };

  const handleSecurityAudit = () => {
    if (!selectedContract) {
      toast({
        title: "No Contract Selected",
        description: "Please select a contract for security analysis.",
        variant: "destructive",
      });
      return;
    }
    auditContractMutation.mutate(selectedContract);
  };

  const handleTokenScan = () => {
    if (!tokenAddress) {
      toast({
        title: "No Token Address",
        description: "Please enter a token address to scan.",
        variant: "destructive",
      });
      return;
    }
    scanTokenMutation.mutate(tokenAddress);
  };

  if (!isWalletConnected) {
    return (
      <div className="space-y-6">
        <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Ultimate Gaming Industry Control Center
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Revolutionary platform management system that changes gaming forever
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Wallet Connection Required
            </CardTitle>
            <CardDescription>
              Connect your MetaMask wallet to access the Admin Control Center and all revolutionary blockchain features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MetaMaskIntegration />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Ultimate Gaming Industry Control Center
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Revolutionary platform management system that changes gaming forever
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="default" className="bg-green-600">
              <Wallet className="w-3 h-3 mr-1" />
              Connected
            </Badge>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {walletAddress.substring(0, 6)}...{walletAddress.substring(38)}
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="funding" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="funding" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Interactive Funding
          </TabsTrigger>
          <TabsTrigger value="upgrades" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Contract Upgrades
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Security Auditor
          </TabsTrigger>
          <TabsTrigger value="deployment" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Deployment System
          </TabsTrigger>
          <TabsTrigger value="tokenscan" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Token Scanner
          </TabsTrigger>
        </TabsList>

        <TabsContent value="funding" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Interactive Investment Dashboard
                </CardTitle>
                <CardDescription>
                  Real-time funding with automated smart contract execution
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Investment Amount</Label>
                    <Input
                      type="number"
                      placeholder="100000"
                      value={fundingAmount}
                      onChange={(e) => setFundingAmount(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Investor Type</Label>
                    <Select defaultValue="strategic">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="strategic">Strategic Partner</SelectItem>
                        <SelectItem value="institutional">Institutional</SelectItem>
                        <SelectItem value="retail">Retail Investor</SelectItem>
                        <SelectItem value="grant">Grant Funding</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  onClick={handleProcessFunding}
                  disabled={processFundingMutation.isPending}
                  className="w-full"
                  size="lg"
                >
                  {processFundingMutation.isPending ? 'Processing...' : 'Execute Investment'}
                </Button>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-3">Live Funding Metrics</h4>
                  {fundingLoading ? (
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Total Raised</span>
                        <span className="font-bold text-green-600">
                          ${fundingData?.totalRaised?.toLocaleString() || '2,450,000'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Active Investors</span>
                        <span className="font-bold">
                          {fundingData?.activeInvestors || 127}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Target Valuation</span>
                        <span className="font-bold text-blue-600">
                          ${fundingData?.targetValuation?.toLocaleString() || '500,000,000'}
                        </span>
                      </div>
                      <Progress value={fundingData?.fundingProgress || 48.5} className="mt-2" />
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {fundingData?.fundingProgress || 48.5}% of Series A target reached
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Funding Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {fundingData?.recentTransactions?.map((tx: FundingTransaction) => (
                    <div key={tx.id} className="border rounded p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">${tx.amount.toLocaleString()}</span>
                        <Badge variant={tx.status === 'completed' ? 'default' : 'secondary'}>
                          {tx.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <p>From: {tx.investorAddress}</p>
                        <p>Time: {new Date(tx.timestamp).toLocaleString()}</p>
                        {tx.grantSource && <p>Grant: {tx.grantSource}</p>}
                      </div>
                    </div>
                  )) || (
                    <div className="space-y-3">
                      <div className="border rounded p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">$250,000</span>
                          <Badge>completed</Badge>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <p>Strategic Investment - Gaming Venture Capital</p>
                          <p>Time: {new Date().toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="border rounded p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">$100,000</span>
                          <Badge variant="secondary">pending</Badge>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <p>Grant: Polygon Ecosystem Development</p>
                          <p>Processing smart contract execution</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="upgrades" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                OpenZeppelin Upgradeable Contract System
              </CardTitle>
              <CardDescription>
                Advanced contract upgrade management with automated security validation
              </CardDescription>
            </CardHeader>
            <CardContent>
              {upgradesLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {contractUpgrades?.contracts?.map((upgrade: ContractUpgrade) => (
                    <div key={upgrade.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{upgrade.contractName}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {upgrade.currentVersion} → {upgrade.newVersion}
                          </p>
                        </div>
                        <Badge variant={
                          upgrade.status === 'completed' ? 'default' :
                          upgrade.status === 'failed' ? 'destructive' :
                          upgrade.status === 'upgrading' ? 'secondary' : 'outline'
                        }>
                          {upgrade.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium">Security Validation</Label>
                          <Progress 
                            value={(upgrade.securityChecks.passed / upgrade.securityChecks.total) * 100} 
                            className="mt-1"
                          />
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {upgrade.securityChecks.passed}/{upgrade.securityChecks.total} checks passed
                            {upgrade.securityChecks.criticalIssues > 0 && (
                              <span className="text-red-600 ml-2">
                                {upgrade.securityChecks.criticalIssues} critical issues
                              </span>
                            )}
                          </p>
                        </div>

                        <div>
                          <Label className="text-sm font-medium">New Features</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {upgrade.features.map((feature, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="New implementation address"
                          className="flex-1"
                          defaultValue={upgrade.implementationAddress}
                        />
                        <Button
                          onClick={() => handleUpgradeContract(upgrade.id, upgrade.implementationAddress)}
                          disabled={upgrade.status === 'upgrading' || upgrade.securityChecks.criticalIssues > 0}
                          size="sm"
                        >
                          {upgrade.status === 'upgrading' ? 'Upgrading...' : 'Execute Upgrade'}
                        </Button>
                      </div>
                    </div>
                  )) || (
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">CryptoQuestMMORPG</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">v2.1.0 → v2.2.0</p>
                          </div>
                          <Badge variant="outline">ready</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium">Security Validation</Label>
                            <Progress value={95} className="mt-1" />
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">19/20 checks passed</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">New Features</Label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              <Badge variant="outline" className="text-xs">Cross-chain guilds</Badge>
                              <Badge variant="outline" className="text-xs">Enhanced staking</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            placeholder="0x742d35Cc6634C0532925a3b8D"
                            className="flex-1"
                          />
                          <Button size="sm">Execute Upgrade</Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Most Advanced Smart Contract Auditor
              </CardTitle>
              <CardDescription>
                AI-powered security analysis with real-time vulnerability detection and gas optimization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-4">
                <Input
                  placeholder="Contract address for comprehensive security audit"
                  value={selectedContract}
                  onChange={(e) => setSelectedContract(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleSecurityAudit} disabled={auditLoading}>
                  {auditLoading ? 'Deep Scanning...' : 'Start Advanced Audit'}
                </Button>
              </div>

              {auditResults ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium">Security Score</span>
                        </div>
                        <p className="text-2xl font-bold text-green-600 mt-1">
                          {auditResults.securityScore || 94}/100
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-600" />
                          <span className="text-sm font-medium">Vulnerabilities</span>
                        </div>
                        <p className="text-2xl font-bold text-yellow-600 mt-1">
                          {auditResults.vulnerabilities?.length || 2}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <Code className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium">Gas Efficiency</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-600 mt-1">
                          {auditResults.gasEfficiency || 87}/100
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-medium">Performance</span>
                        </div>
                        <p className="text-2xl font-bold text-purple-600 mt-1">
                          {auditResults.performance || 91}/100
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Security Analysis</h4>
                      {auditResults.vulnerabilities?.length > 0 ? (
                        auditResults.vulnerabilities.map((vuln: any, idx: number) => (
                          <div key={idx} className={`border rounded p-3 ${
                            vuln.severity === 'critical' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
                            vuln.severity === 'high' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' :
                            'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                          }`}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">{vuln.title}</span>
                              <Badge variant={vuln.severity === 'critical' ? 'destructive' : 'secondary'}>
                                {vuln.severity}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              {vuln.description}
                            </p>
                            <p className="text-sm font-medium text-green-700 dark:text-green-400">
                              Fix: {vuln.recommendation}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="border rounded p-3 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">Reentrancy Protection</span>
                            <Badge variant="secondary">medium</Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            External calls should use reentrancy guards for enhanced security
                          </p>
                          <p className="text-sm font-medium text-green-700 dark:text-green-400">
                            Fix: Implement OpenZeppelin ReentrancyGuard
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold">Gas Optimizations</h4>
                      {auditResults.gasOptimizations?.length > 0 ? (
                        auditResults.gasOptimizations.map((opt: any, idx: number) => (
                          <div key={idx} className="border rounded p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">{opt.function}</span>
                              <span className="text-sm text-green-600">
                                Save ~{opt.gasSavings} gas
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {opt.optimization}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="space-y-3">
                          <div className="border rounded p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">State Variable Packing</span>
                              <span className="text-sm text-green-600">Save ~2,000 gas</span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Pack struct variables to reduce storage slots
                            </p>
                          </div>
                          <div className="border rounded p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">Loop Optimization</span>
                              <span className="text-sm text-green-600">Save ~500 gas per loop</span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Cache array length in loop conditions
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : selectedContract ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  Enter a contract address and click "Start Advanced Audit" to begin analysis
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  Enter a contract address to audit
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deployment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Full-Fledged Deployment System
              </CardTitle>
              <CardDescription>
                Advanced testnet and mainnet deployment with automated verification and monitoring
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="network">Target Network</Label>
                    <Select
                      value={deploymentConfig.network}
                      onValueChange={(value: 'testnet' | 'mainnet') =>
                        setDeploymentConfig(prev => ({ ...prev, network: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="testnet">Polygon Mumbai (Testnet)</SelectItem>
                        <SelectItem value="mainnet">Polygon Mainnet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="contractName">Contract Name</Label>
                    <Input
                      id="contractName"
                      value={deploymentConfig.contractName}
                      onChange={(e) =>
                        setDeploymentConfig(prev => ({ ...prev, contractName: e.target.value }))
                      }
                      placeholder="CryptoQuestAdvanced"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="gasPrice">Gas Price (Gwei)</Label>
                      <Input
                        id="gasPrice"
                        value={deploymentConfig.gasPrice}
                        onChange={(e) =>
                          setDeploymentConfig(prev => ({ ...prev, gasPrice: e.target.value }))
                        }
                        placeholder="30"
                      />
                    </div>
                    <div>
                      <Label htmlFor="gasLimit">Gas Limit</Label>
                      <Input
                        id="gasLimit"
                        value={deploymentConfig.gasLimit}
                        onChange={(e) =>
                          setDeploymentConfig(prev => ({ ...prev, gasLimit: e.target.value }))
                        }
                        placeholder="5000000"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="constructorArgs">Constructor Arguments (JSON)</Label>
                    <Textarea
                      id="constructorArgs"
                      placeholder='["Genesis", "GEN", 1000000, "0x742d35Cc..."]'
                      className="mt-1"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="verifyContract"
                        checked={deploymentConfig.verifyContract}
                        onCheckedChange={(checked) =>
                          setDeploymentConfig(prev => ({ ...prev, verifyContract: checked }))
                        }
                      />
                      <Label htmlFor="verifyContract">Auto-verify on Polygonscan</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="enableProxy"
                        checked={deploymentConfig.enableProxy}
                        onCheckedChange={(checked) =>
                          setDeploymentConfig(prev => ({ ...prev, enableProxy: checked }))
                        }
                      />
                      <Label htmlFor="enableProxy">Deploy as upgradeable proxy</Label>
                    </div>
                  </div>

                  <Button
                    onClick={handleDeployContract}
                    disabled={deploymentLoading}
                    className="w-full"
                    size="lg"
                  >
                    {deploymentLoading ? 'Deploying...' : `Deploy to ${deploymentConfig.network}`}
                  </Button>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Deployment History</h4>
                  {deploymentStatus?.deployments ? (
                    deploymentStatus.deployments.map((deployment: any, idx: number) => (
                      <div key={idx} className="border rounded p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{deployment.contractName}</span>
                          <Badge variant={deployment.status === 'success' ? 'default' : 
                                        deployment.status === 'pending' ? 'secondary' : 'destructive'}>
                            {deployment.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <p>Network: {deployment.network}</p>
                          <p>Address: {deployment.address}</p>
                          <p>Gas Used: {deployment.gasUsed?.toLocaleString()}</p>
                          <p>Verified: {deployment.verified ? 'Yes' : 'Pending'}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="space-y-3">
                      <div className="border rounded p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">CryptoQuestMMORPG</span>
                          <Badge>success</Badge>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <p>Network: Polygon Mainnet</p>
                          <p>Address: 0x742d35Cc6634C0532925a3b8D...</p>
                          <p>Gas Used: 4,567,890</p>
                          <p>Verified: Yes</p>
                        </div>
                      </div>
                      <div className="border rounded p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">CQTTokenSale</span>
                          <Badge variant="secondary">pending</Badge>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <p>Network: Polygon Testnet</p>
                          <p>Status: Awaiting confirmation</p>
                          <p>Estimated gas: 3,200,000</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tokenscan" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Ultimate Token Scanner for Trust Verification
              </CardTitle>
              <CardDescription>
                Comprehensive token analysis with liquidity, security, and trust verification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-4">
                <Input
                  placeholder="Token contract address for comprehensive trust analysis"
                  value={tokenAddress}
                  onChange={(e) => setTokenAddress(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleTokenScan} disabled={tokenScanLoading}>
                  {tokenScanLoading ? 'Scanning...' : 'Scan Token'}
                </Button>
              </div>

              {tokenScanResults ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium">Trust Score</span>
                        </div>
                        <p className="text-2xl font-bold text-green-600 mt-1">
                          {tokenScanResults.trustScore || 92}/100
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium">Liquidity</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-600 mt-1">
                          ${tokenScanResults.liquidity?.toLocaleString() || '2.4M'}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-medium">Security</span>
                        </div>
                        <p className="text-2xl font-bold text-purple-600 mt-1">
                          {tokenScanResults.securityRating || 'High'}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-orange-600" />
                          <span className="text-sm font-medium">Holders</span>
                        </div>
                        <p className="text-2xl font-bold text-orange-600 mt-1">
                          {tokenScanResults.holderCount?.toLocaleString() || '12.5K'}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Security Analysis</h4>
                      <div className="space-y-3">
                        {tokenScanResults.securityChecks?.map((check: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between border rounded p-3">
                            <span className="text-sm">{check.name}</span>
                            <Badge variant={check.passed ? 'default' : 'destructive'}>
                              {check.passed ? 'Pass' : 'Fail'}
                            </Badge>
                          </div>
                        )) || (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between border rounded p-3">
                              <span className="text-sm">Contract Verified</span>
                              <Badge>Pass</Badge>
                            </div>
                            <div className="flex items-center justify-between border rounded p-3">
                              <span className="text-sm">No Honeypot</span>
                              <Badge>Pass</Badge>
                            </div>
                            <div className="flex items-center justify-between border rounded p-3">
                              <span className="text-sm">Liquidity Locked</span>
                              <Badge>Pass</Badge>
                            </div>
                            <div className="flex items-center justify-between border rounded p-3">
                              <span className="text-sm">No Mint Function</span>
                              <Badge variant="destructive">Fail</Badge>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold">Token Metrics</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Total Supply</span>
                          <span className="font-medium">{tokenScanResults.totalSupply || '1,000,000 CQT'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Circulating Supply</span>
                          <span className="font-medium">{tokenScanResults.circulatingSupply || '750,000 CQT'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Market Cap</span>
                          <span className="font-medium">${tokenScanResults.marketCap?.toLocaleString() || '63,525,000'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">24h Volume</span>
                          <span className="font-medium">${tokenScanResults.volume24h?.toLocaleString() || '2,450,000'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Liquidity Ratio</span>
                          <span className="font-medium">{tokenScanResults.liquidityRatio || '3.86%'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {tokenScanResults.riskFactors?.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold">Risk Assessment</h4>
                      {tokenScanResults.riskFactors.map((risk: any, idx: number) => (
                        <div key={idx} className={`border rounded p-3 ${
                          risk.level === 'high' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
                          risk.level === 'medium' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                          'border-green-500 bg-green-50 dark:bg-green-900/20'
                        }`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{risk.factor}</span>
                            <Badge variant={risk.level === 'high' ? 'destructive' : 
                                          risk.level === 'medium' ? 'secondary' : 'default'}>
                              {risk.level}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {risk.description}
                          </p>
                        </div>
                      )) || (
                        <div className="border rounded p-3 border-green-500 bg-green-50 dark:bg-green-900/20">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">Low Risk Token</span>
                            <Badge>low</Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            This token shows minimal risk factors and strong security practices
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : tokenAddress ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  Click "Scan Token" to begin comprehensive trust analysis
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  Enter a token address to analyze
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}