import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  DollarSign, Target, Users, Rocket, Trophy, Globe, 
  TrendingUp, Star, CheckCircle, Clock, Award, Zap
} from "lucide-react";

// Grant funding targets based on original proposal
const GRANT_TARGETS = [
  {
    id: 'base-ecosystem',
    name: 'Base Ecosystem Fund',
    organization: 'Coinbase',
    amount: 2000000,
    status: 'active',
    progress: 85,
    description: 'CQT token live on BASE with Coinbase AgentKit integration',
    website: 'https://www.base.org/ecosystem',
    features: ['CQT Token Integration', 'OnchainKit Support', 'Smart Wallets', 'Gasless Transactions']
  },
  {
    id: 'game7-grants',
    name: 'Game7 Grants Program',
    organization: 'Game7',
    amount: 2000000,
    status: 'submitted',
    progress: 75,
    description: 'Revolutionary gaming hub with AR/VR/XR metaverse capabilities',
    website: 'https://game7.org/',
    features: ['Gaming Engine', 'Cloud Gaming', 'Social Hub', 'AI Assistant']
  },
  {
    id: 'polygon-grants',
    name: 'Polygon Ecosystem Grant',
    organization: 'Polygon',
    amount: 1000000,
    status: 'approved',
    progress: 100,
    description: '13+ verified smart contracts with AggLayer cross-chain integration',
    website: 'https://polygon.technology/grants',
    features: ['Smart Contracts', 'AggLayer Bridge', 'Cross-Chain Gaming', 'Unified Liquidity']
  },
  {
    id: 'aptos-foundation',
    name: 'Aptos Foundation Grant',
    organization: 'Aptos',
    amount: 1000000,
    status: 'preparing',
    progress: 40,
    description: 'Multi-chain integration with Move language support',
    website: 'https://aptosfoundation.org/grants',
    features: ['Move Integration', 'Cross-Chain Assets', 'Parallel Execution', 'Low Latency']
  },
  {
    id: 'solana-ecosystem',
    name: 'Solana Ecosystem Grant',
    organization: 'Solana',
    amount: 1000000,
    status: 'preparing',
    progress: 35,
    description: 'High-performance gaming with Solana blockchain',
    website: 'https://solana.com/grants',
    features: ['High TPS', 'Low Fees', 'Rust Integration', 'Gaming Optimization']
  },
  {
    id: 'epic-megagrants',
    name: 'Epic MegaGrants',
    organization: 'Epic Games',
    amount: 500000,
    status: 'submitted',
    progress: 60,
    description: 'Unreal Engine 5 integration with console gaming',
    website: 'https://www.unrealengine.com/en-US/megagrants',
    features: ['Unreal Engine 5', 'Console Integration', 'Ray Tracing', 'MetaHuman']
  },
  {
    id: 'optimism-grants',
    name: 'Optimism Grants',
    organization: 'Optimism',
    amount: 1000000,
    status: 'planning',
    progress: 25,
    description: 'Layer 2 scaling for enhanced gaming performance',
    website: 'https://optimism.io/grants',
    features: ['L2 Scaling', 'Low Gas Fees', 'Fast Transactions', 'EVM Compatible']
  },
  {
    id: 'unity-humanity',
    name: 'Unity for Humanity Grant',
    organization: 'Unity',
    amount: 500000,
    status: 'planning',
    progress: 20,
    description: 'Unity integration with social impact gaming',
    website: 'https://unity.com/unity-humanity-grant',
    features: ['Unity Engine', 'Cross-Platform', 'Social Impact', 'Educational Tools']
  }
];

const FUNDING_MILESTONES = [
  {
    milestone: '$1M - Foundation',
    description: 'Core MMORPG development and initial smart contracts',
    completed: true,
    features: ['Smart Contracts', 'Token Launch', 'Basic Gaming']
  },
  {
    milestone: '$3M - Platform',
    description: 'Cross-chain integration and console support',
    completed: true,
    features: ['AggLayer Integration', 'Console Gaming', 'Ready Player Me']
  },
  {
    milestone: '$5M - Ecosystem',
    description: 'AR/VR/XR metaverse and AI gaming assistant',
    completed: true,
    features: ['Virtual Worlds', 'AI Assistant', 'Language Wrappers']
  },
  {
    milestone: '$8M - Industry',
    description: 'Multi-language execution and enterprise features',
    completed: false,
    features: ['Python/Rust/C++', 'Enterprise APIs', 'Data Analytics']
  },
  {
    milestone: '$10M - Revolution',
    description: 'Complete ecosystem dominance and industry partnerships',
    completed: false,
    features: ['Industry Partnerships', 'Global Launch', 'Market Leadership']
  }
];

const MARKET_VALUATION = {
  currentValuation: '$50M',
  targetValuation: '$500M',
  marketCap: '$4.25B',
  totalAddressableMarket: '$200B',
  blockchainGamingMarket: '$65B',
  growthProjection: '1,000%'
};

export function GrantProposal() {
  const [selectedGrant, setSelectedGrant] = useState<string | null>(null);
  
  const totalFunding = GRANT_TARGETS.reduce((sum, grant) => sum + grant.amount, 0);
  const completedFunding = GRANT_TARGETS
    .filter(grant => grant.status === 'approved')
    .reduce((sum, grant) => sum + grant.amount, 0);
  
  const fundingProgress = (completedFunding / totalFunding) * 100;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500';
      case 'active': return 'bg-blue-500';
      case 'submitted': return 'bg-yellow-500';
      case 'preparing': return 'bg-orange-500';
      case 'planning': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Approved';
      case 'active': return 'Active';
      case 'submitted': return 'Submitted';
      case 'preparing': return 'Preparing';
      case 'planning': return 'Planning';
      default: return 'Unknown';
    }
  };

  return (
    <div className="space-y-6">
      {/* Market Valuation Overview */}
      <Card className="bg-gradient-to-r from-green-600/20 to-blue-600/20 backdrop-blur border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            CryptoQuest Market Valuation & Grant Strategy
            <Badge className="ml-2 bg-gradient-to-r from-green-500 to-blue-500">$10M Target</Badge>
          </CardTitle>
          <CardDescription>
            Revolutionary blockchain MMORPG with industry-disrupting multi-platform capabilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span className="font-semibold">Current Valuation</span>
              </div>
              <div className="text-2xl font-bold text-green-600">{MARKET_VALUATION.currentValuation}</div>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-blue-600" />
                <span className="font-semibold">Target Valuation</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">{MARKET_VALUATION.targetValuation}</div>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-5 h-5 text-purple-600" />
                <span className="font-semibold">Gaming Market</span>
              </div>
              <div className="text-2xl font-bold text-purple-600">{MARKET_VALUATION.totalAddressableMarket}</div>
            </div>
            <div className="p-4 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Rocket className="w-5 h-5 text-orange-600" />
                <span className="font-semibold">Growth Projection</span>
              </div>
              <div className="text-2xl font-bold text-orange-600">{MARKET_VALUATION.growthProjection}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="grants" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="grants">Grant Portfolio</TabsTrigger>
          <TabsTrigger value="milestones">Funding Milestones</TabsTrigger>
          <TabsTrigger value="strategy">Investment Strategy</TabsTrigger>
          <TabsTrigger value="ecosystem">Ecosystem Value</TabsTrigger>
        </TabsList>

        <TabsContent value="grants" className="space-y-6">
          {/* Funding Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Grant Funding Progress
              </CardTitle>
              <CardDescription>
                ${(completedFunding / 1000000).toFixed(1)}M secured of ${(totalFunding / 1000000).toFixed(1)}M total target
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress value={fundingProgress} className="w-full h-3" />
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Secured: ${(completedFunding / 1000000).toFixed(1)}M</span>
                  <span>Target: ${(totalFunding / 1000000).toFixed(1)}M</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Grant Applications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {GRANT_TARGETS.map((grant) => (
              <Card key={grant.id} className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedGrant(grant.id)}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Star className="w-5 h-5" />
                      {grant.name}
                    </span>
                    <Badge className={getStatusColor(grant.status)}>
                      {getStatusText(grant.status)}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{grant.organization}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Amount:</span>
                      <span className="text-lg font-bold text-green-600">
                        ${(grant.amount / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span>{grant.progress}%</span>
                      </div>
                      <Progress value={grant.progress} className="w-full" />
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {grant.description}
                    </p>

                    <div>
                      <div className="text-sm font-medium mb-2">Key Features:</div>
                      <div className="flex flex-wrap gap-1">
                        {grant.features.map((feature) => (
                          <Badge key={feature} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button variant="outline" size="sm" className="w-full">
                      <Globe className="w-4 h-4 mr-2" />
                      View Application
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="milestones" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Funding Milestones & Development Roadmap
              </CardTitle>
              <CardDescription>
                Strategic funding phases aligned with platform development and market expansion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {FUNDING_MILESTONES.map((milestone, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      milestone.completed ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      {milestone.completed ? (
                        <CheckCircle className="w-5 h-5 text-white" />
                      ) : (
                        <span className="text-white font-bold">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{milestone.milestone}</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {milestone.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {milestone.features.map((feature) => (
                          <Badge key={feature} variant={milestone.completed ? "default" : "secondary"}>
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strategy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Investment & Partnership Strategy
              </CardTitle>
              <CardDescription>
                Multi-ecosystem approach leveraging top blockchain and gaming platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <Alert>
                  <Zap className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Strategic Positioning:</strong> CryptoQuest demonstrates capabilities that force major gaming companies to either partner or compete, creating leverage for favorable partnerships and investments.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                    <h3 className="font-semibold mb-3">Blockchain Ecosystem Strategy</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>Polygon:</strong> 13+ verified smart contracts with $4.25B AggLayer liquidity</li>
                      <li>• <strong>Base:</strong> CQT token integration with Coinbase infrastructure</li>
                      <li>• <strong>Multi-Chain:</strong> Cross-chain gaming actions and unified marketplace</li>
                      <li>• <strong>Enterprise:</strong> Console gaming with custodial wallet solutions</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                    <h3 className="font-semibold mb-3">Gaming Industry Strategy</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>Console Integration:</strong> PS5/Xbox with platform-specific optimizations</li>
                      <li>• <strong>Engine Support:</strong> Unity, Unreal Engine 5 with blockchain integration</li>
                      <li>• <strong>AR/VR/XR:</strong> Metaverse platform with cross-reality support</li>
                      <li>• <strong>AI/ML:</strong> Advanced gaming with multi-language execution</li>
                    </ul>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                  <h3 className="font-semibold mb-3">Competitive Advantages</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <strong>Technical Superiority</strong>
                      <ul className="mt-2 space-y-1">
                        <li>• Console-quality gaming in React</li>
                        <li>• Multi-language execution environment</li>
                        <li>• Cross-chain unified liquidity</li>
                      </ul>
                    </div>
                    <div>
                      <strong>Infrastructure Leverage</strong>
                      <ul className="mt-2 space-y-1">
                        <li>• Coinbase AgentKit integration</li>
                        <li>• Polygon AggLayer connectivity</li>
                        <li>• Enterprise-grade security</li>
                      </ul>
                    </div>
                    <div>
                      <strong>Market Position</strong>
                      <ul className="mt-2 space-y-1">
                        <li>• Force industry partnerships</li>
                        <li>• Capture cross-chain value</li>
                        <li>• Revolutionary user experience</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ecosystem" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Ecosystem Value Proposition
              </CardTitle>
              <CardDescription>
                Comprehensive platform creating value across blockchain gaming ecosystem
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Revenue Streams</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                      <div className="font-medium">Transaction Fees</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Cross-chain bridge fees, marketplace commissions, staking rewards
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                      <div className="font-medium">NFT Sales</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Character avatars, in-game items, virtual real estate, exclusive content
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                      <div className="font-medium">Platform Licensing</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Console integration APIs, enterprise solutions, white-label platforms
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Market Metrics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between p-3 bg-blue-50 dark:bg-blue-900/30 rounded">
                      <span>Total Addressable Market</span>
                      <span className="font-bold">$200B</span>
                    </div>
                    <div className="flex justify-between p-3 bg-green-50 dark:bg-green-900/30 rounded">
                      <span>Blockchain Gaming Market</span>
                      <span className="font-bold">$65B</span>
                    </div>
                    <div className="flex justify-between p-3 bg-purple-50 dark:bg-purple-900/30 rounded">
                      <span>Cross-Chain DeFi TVL</span>
                      <span className="font-bold">$4.25B</span>
                    </div>
                    <div className="flex justify-between p-3 bg-orange-50 dark:bg-orange-900/30 rounded">
                      <span>Projected Market Share</span>
                      <span className="font-bold">2-5%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/30 dark:to-blue-900/30 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">Strategic Value Creation</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  CryptoQuest's revolutionary approach creates a platform that captures value from the entire cross-chain gaming ecosystem rather than being limited to a single network. The combination of console-quality gaming in React, multi-blockchain interoperability, AR/VR/XR capabilities, and AI-powered features positions the platform to dominate the emerging blockchain gaming market and force industry adoption of our standards.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}