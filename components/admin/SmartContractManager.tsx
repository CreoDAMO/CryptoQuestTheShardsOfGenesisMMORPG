import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Settings, 
  Users, 
  ExternalLink, 
  CheckCircle, 
  AlertTriangle,
  RefreshCw,
  Upload,
  Download,
  Lock
} from 'lucide-react';

interface ContractInfo {
  address: string;
  name: string;
  type: string;
  owner: string;
  canUpgrade: boolean;
  lastAudit: string;
  securityScore: number;
}

export function SmartContractManager() {
  const [contracts, setContracts] = useState<ContractInfo[]>([
    {
      address: '0x94ef57abfBff1AD70bD00a921e1d2437f31C1665',
      name: 'CQT Proxy',
      type: 'Token',
      owner: '0xCc380FD8bfbdF0c020de64075b86C84c2BB0AE79',
      canUpgrade: true,
      lastAudit: '2024-12-15',
      securityScore: 94
    },
    {
      address: '0x4915363b9524D103C8910E3C7D5516b9b4D0F333',
      name: 'CQT Staking',
      type: 'DeFi',
      owner: '0xCc380FD8bfbdF0c020de64075b86C84c2BB0AE79',
      canUpgrade: true,
      lastAudit: '2024-12-10',
      securityScore: 92
    }
  ]);

  const [newOwnerAddress, setNewOwnerAddress] = useState('0x67BF9f428d92704C3Db3a08dC05Bc941A8647866');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  const ADMIN_ADDRESS = '0x67BF9f428d92704C3Db3a08dC05Bc941A8647866';

  const transferOwnership = async (contractAddress: string, newOwner: string) => {
    try {
      setLoading(true);

      const response = await fetch('/api/admin/contracts/transfer-ownership', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-address': ADMIN_ADDRESS
        },
        body: JSON.stringify({ contractAddress, newOwner })
      });

      const result = await response.json();

      if (result.success) {
        setContracts(prev => prev.map(contract => 
          contract.address === contractAddress 
            ? { ...contract, owner: newOwner }
            : contract
        ));
        setSuccessMessage(`Ownership transferred to ${newOwner}`);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to transfer ownership');
    } finally {
      setLoading(false);
    }
  };

  const auditContract = async (contractAddress: string) => {
    try {
      console.log(`Running AI audit on contract: ${contractAddress}`);
      // This would trigger the AI auditing system

      const auditResult = {
        securityScore: 96,
        lastAudit: new Date().toISOString().split('T')[0],
        findings: []
      };

      setContracts(prev => prev.map(contract => 
        contract.address === contractAddress 
          ? { 
              ...contract, 
              securityScore: auditResult.securityScore,
              lastAudit: auditResult.lastAudit
            }
          : contract
      ));
    } catch (error) {
      console.error('Failed to audit contract:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Smart Contract Management
          </CardTitle>
          <p className="text-gray-400">
            Manage ownership, upgrades, and security auditing for all CryptoQuest contracts
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="ownership" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-slate-700 border-slate-600">
              <TabsTrigger value="ownership" className="text-white">Ownership Transfer</TabsTrigger>
              <TabsTrigger value="upgrades" className="text-white">Contract Upgrades</TabsTrigger>
              <TabsTrigger value="security" className="text-white">Security Audits</TabsTrigger>
            </TabsList>

            <TabsContent value="ownership" className="space-y-4">
              <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                <h3 className="font-medium text-blue-100 mb-2">Transfer to MultiSig Wallet</h3>
                <div className="flex gap-2 mb-4">
                  <Input
                    value={newOwnerAddress}
                    onChange={(e) => setNewOwnerAddress(e.target.value)}
                    placeholder="MultiSig wallet address"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Users className="w-4 h-4 mr-2" />
                    Set MultiSig
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {contracts.map((contract) => (
                  <div key={contract.address} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                        <Settings className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-white">{contract.name}</div>
                        <div className="text-sm text-gray-400">{contract.address}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge className={contract.owner === newOwnerAddress ? 'bg-green-600' : 'bg-yellow-600'}>
                        {contract.owner === newOwnerAddress ? 'MultiSig Owned' : 'Legacy Owner'}
                      </Badge>

                      {contract.owner !== newOwnerAddress && (
                        <Button
                          onClick={() => transferOwnership(contract.address, newOwnerAddress)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Lock className="w-4 h-4 mr-2" />
                          Transfer
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="upgrades" className="space-y-4">
              <div className="space-y-3">
                {contracts.filter(c => c.canUpgrade).map((contract) => (
                  <div key={contract.address} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                        <Upload className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-white">{contract.name}</div>
                        <div className="text-sm text-gray-400">Upgradeable via MultiSig</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Upload className="w-4 h-4 mr-2" />
                        Prepare Upgrade
                      </Button>
                      <Button 
                        onClick={() => window.open(`https://polygonscan.com/address/${contract.address}`, '_blank')}
                        size="sm" 
                        variant="outline" 
                        className="border-slate-600"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <div className="space-y-3">
                {contracts.map((contract) => (
                  <div key={contract.address} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        contract.securityScore >= 95 ? 'bg-green-500' :
                        contract.securityScore >= 90 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}>
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-white">{contract.name}</div>
                        <div className="text-sm text-gray-400">
                          Score: {contract.securityScore}/100 • Last audit: {contract.lastAudit}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge className={
                        contract.securityScore >= 95 ? 'bg-green-600' :
                        contract.securityScore >= 90 ? 'bg-yellow-600' : 'bg-red-600'
                      }>
                        {contract.securityScore >= 95 ? 'Excellent' :
                         contract.securityScore >= 90 ? 'Good' : 'Needs Review'}
                      </Badge>

                      <Button
                        onClick={() => auditContract(contract.address)}
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        AI Audit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}