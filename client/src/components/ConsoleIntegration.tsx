import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ConsoleAccount {
  platform: 'ps5' | 'xbox' | 'pc';
  playerId: string;
  walletAddress: string;
  isLinked: boolean;
}

interface ConsoleIntegrationProps {
  onAccountLinked: (account: ConsoleAccount) => void;
}

export function ConsoleIntegration({ onAccountLinked }: ConsoleIntegrationProps) {
  const [accounts, setAccounts] = useState<ConsoleAccount[]>([]);
  const [isLinking, setIsLinking] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<'ps5' | 'xbox' | 'pc'>('ps5');

  const linkConsoleAccount = async (platform: 'ps5' | 'xbox' | 'pc', playerId: string) => {
    setIsLinking(true);
    try {
      // Call backend API to create custodial wallet
      const response = await fetch('/api/console-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, playerId })
      });

      if (!response.ok) throw new Error('Failed to link account');

      const data = await response.json();
      const newAccount: ConsoleAccount = {
        platform,
        playerId,
        walletAddress: data.walletAddress,
        isLinked: true
      };

      setAccounts(prev => [...prev, newAccount]);
      onAccountLinked(newAccount);
    } catch (error) {
      console.error('Failed to link console account:', error);
    } finally {
      setIsLinking(false);
    }
  };

  const platformFeatures = {
    ps5: {
      name: 'PlayStation 5',
      icon: '🎮',
      features: ['DualSense Haptic Feedback', 'Ray Tracing', 'SSD Loading', 'Exclusive Samurai Saga Questline'],
      compliance: 'TRC Certified - 60 FPS Guarantee'
    },
    xbox: {
      name: 'Xbox Series X/S',
      icon: '🎯',
      features: ['Smart Delivery', 'Quick Resume', 'Game Pass Integration', 'Exclusive Knights Crusade Tournament'],
      compliance: 'XR Certified - <100ms Latency'
    },
    pc: {
      name: 'PC / Mobile',
      icon: '💻',
      features: ['Direct Wallet Connection', 'Modding Support', 'Ultra Graphics', 'Beta Access'],
      compliance: 'Direct Web3 Integration'
    }
  };

  const ConsoleCard = ({ platform }: { platform: 'ps5' | 'xbox' | 'pc' }) => {
    const config = platformFeatures[platform];
    const linkedAccount = accounts.find(acc => acc.platform === platform);

    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">{config.icon}</span>
            {config.name}
            {linkedAccount && <Badge variant="secondary">Linked</Badge>}
          </CardTitle>
          <Badge variant="outline" className="w-fit">
            {config.compliance}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Platform Features:</h4>
            <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
              {config.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-purple-500 rounded-full"></span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {linkedAccount ? (
            <div className="space-y-2">
              <p className="text-sm">
                <strong>Player ID:</strong> {linkedAccount.playerId}
              </p>
              <p className="text-sm font-mono text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded">
                {linkedAccount.walletAddress}
              </p>
              <Badge className="bg-green-500">
                Custodial Wallet Active
              </Badge>
            </div>
          ) : (
            <Button 
              onClick={() => {
                const playerId = prompt(`Enter your ${config.name} Player ID:`);
                if (playerId) linkConsoleAccount(platform, playerId);
              }}
              disabled={isLinking}
              className="w-full"
              variant={platform === 'pc' ? 'default' : 'outline'}
            >
              {isLinking ? 'Linking...' : `Link ${config.name} Account`}
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            Console Integration
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-400">
            Link your console accounts for cross-platform play with secure custodial wallets
          </p>
        </CardHeader>
      </Card>

      <Tabs defaultValue="platforms" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="platforms">Platform Setup</TabsTrigger>
          <TabsTrigger value="features">Console Features</TabsTrigger>
        </TabsList>

        <TabsContent value="platforms" className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <ConsoleCard platform="ps5" />
            <ConsoleCard platform="xbox" />
            <ConsoleCard platform="pc" />
          </div>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cross-Platform Benefits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Shared Features:</h4>
                  <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                    <li>• NFT avatars sync across all platforms</li>
                    <li>• Shared quest progress and achievements</li>
                    <li>• Cross-platform guild membership</li>
                    <li>• Unified token balance and staking</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Security:</h4>
                  <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                    <li>• AWS KMS encrypted private keys</li>
                    <li>• Platform-compliant UI guidelines</li>
                    <li>• GDPR and accessibility standards</li>
                    <li>• Secure transaction proxy system</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {accounts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Linked Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {accounts.map((account, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{platformFeatures[account.platform].icon}</span>
                    <div>
                      <p className="font-medium">{platformFeatures[account.platform].name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{account.playerId}</p>
                    </div>
                  </div>
                  <Badge className="bg-green-500">Active</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}