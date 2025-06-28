import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  Brain, Shield, Zap, TrendingUp, Eye, Wallet,
  Database, Activity, Target, Sparkles, ChevronRight,
  BarChart3, PieChart, LineChart, AlertTriangle
} from "lucide-react";

interface MoralisPortfolio {
  totalTokens: number;
  totalNFTs: number;
  verifiedTokens: number;
  spamTokens: number;
  securityScore: number;
  tokens: any[];
  nfts: any[];
  walletAge: string;
}

interface AIAnalysis {
  securityScore: number;
  gasEfficiency: number;
  codeQuality: number;
  vulnerabilities: string[];
  recommendations: string[];
  trustScore: number;
}

interface MarketInsights {
  sentiment: string;
  priceTarget: string;
  riskLevel: string;
  recommendation: string;
  keyFactors: string[];
  timeframe: string;
}

export function EnhancedAdminPanel() {
  const [selectedWallet, setSelectedWallet] = useState("0xfC334Dc853dfeaf9Ec8dB458F197E3eE0810A9e2");
  const [contractAddress, setContractAddress] = useState("0x94ef57abfBff1AD70bD00a921e1d2437f31C1665");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Moralis Portfolio Analysis
  const { data: portfolio, isLoading: portfolioLoading } = useQuery<MoralisPortfolio>({
    queryKey: ['/api/moralis/portfolio', selectedWallet],
    enabled: !!selectedWallet
  });

  // Token Analytics
  const { data: tokenAnalytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['/api/moralis/token-analytics', contractAddress],
    enabled: !!contractAddress
  });

  // Enhanced Scanner with AI
  const { data: enhancedScan, isLoading: scanLoading } = useQuery({
    queryKey: ['/api/enhanced-scanner', contractAddress],
    enabled: !!contractAddress
  });

  // Gaming Intelligence
  const { data: gamingIntel, isLoading: intelLoading } = useQuery({
    queryKey: ['/api/gaming-intelligence', selectedWallet],
    enabled: !!selectedWallet
  });

  // AI Contract Analysis Mutation
  const contractAnalysisMutation = useMutation({
    mutationFn: async ({ contractCode, contractAddress }: { contractCode: string; contractAddress: string }) => {
      const response = await fetch('/api/ai/contract-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractCode, contractAddress })
      });
      if (!response.ok) throw new Error('Analysis failed');
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "AI Analysis Complete",
        description: `Security Score: ${data.securityScore}/100, Trust Score: ${data.trustScore}/100`
      });
      queryClient.invalidateQueries({ queryKey: ['/api/ai/contract-analysis'] });
    }
  });

  // AI Market Insights Mutation
  const marketInsightsMutation = useMutation({
    mutationFn: async ({ tokenData, priceHistory }: { tokenData: any; priceHistory: any[] }) => {
      const response = await fetch('/api/ai/market-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokenData, priceHistory })
      });
      if (!response.ok) throw new Error('Market analysis failed');
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Market Insights Generated",
        description: `Sentiment: ${data.sentiment}, Recommendation: ${data.recommendation}`
      });
    }
  });

  const analyzeContract = () => {
    const sampleCode = `
      pragma solidity ^0.8.0;
      contract CQTToken {
        mapping(address => uint256) balances;
        function transfer(address to, uint256 amount) public returns (bool) {
          require(balances[msg.sender] >= amount);
          balances[msg.sender] -= amount;
          balances[to] += amount;
          return true;
        }
      }
    `;
    
    contractAnalysisMutation.mutate({
      contractCode: sampleCode,
      contractAddress: contractAddress
    });
  };

  const generateMarketInsights = () => {
    if (tokenAnalytics) {
      marketInsightsMutation.mutate({
        tokenData: tokenAnalytics.token,
        priceHistory: tokenAnalytics.recentActivity || []
      });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Enhanced Gaming Intelligence Center
        </h1>
        <p className="text-muted-foreground">
          AI-Powered Blockchain Analytics with Real-Time Intelligence
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Wallet Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Enter wallet address..."
              value={selectedWallet}
              onChange={(e) => setSelectedWallet(e.target.value)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Contract Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Enter contract address..."
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
            />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="portfolio" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="portfolio">Portfolio Intelligence</TabsTrigger>
          <TabsTrigger value="security">AI Security Audit</TabsTrigger>
          <TabsTrigger value="market">Market Insights</TabsTrigger>
          <TabsTrigger value="gaming">Gaming Analytics</TabsTrigger>
          <TabsTrigger value="enhanced">Enhanced Scanner</TabsTrigger>
        </TabsList>

        <TabsContent value="portfolio" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Moralis Portfolio Analysis
              </CardTitle>
              <CardDescription>
                Real-time blockchain portfolio intelligence powered by Moralis API
              </CardDescription>
            </CardHeader>
            <CardContent>
              {portfolioLoading ? (
                <div className="text-center py-8">Analyzing portfolio...</div>
              ) : portfolio ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-blue-600">{portfolio.totalTokens}</div>
                      <div className="text-sm text-muted-foreground">Total Tokens</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-purple-600">{portfolio.totalNFTs}</div>
                      <div className="text-sm text-muted-foreground">Total NFTs</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-green-600">{portfolio.verifiedTokens}</div>
                      <div className="text-sm text-muted-foreground">Verified Tokens</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-orange-600">{portfolio.securityScore}%</div>
                      <div className="text-sm text-muted-foreground">Security Score</div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Enter a wallet address to analyze portfolio
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                DeepSeek AI Security Analysis
              </CardTitle>
              <CardDescription>
                Advanced AI-powered smart contract security auditing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={analyzeContract}
                disabled={contractAnalysisMutation.isPending}
                className="w-full"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {contractAnalysisMutation.isPending ? "Analyzing..." : "Run AI Security Audit"}
              </Button>

              {contractAnalysisMutation.data && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold">{contractAnalysisMutation.data.securityScore}</div>
                            <div className="text-sm text-muted-foreground">Security Score</div>
                          </div>
                          <Shield className="w-8 h-8 text-green-500" />
                        </div>
                        <Progress value={contractAnalysisMutation.data.securityScore} className="mt-2" />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold">{contractAnalysisMutation.data.gasEfficiency}</div>
                            <div className="text-sm text-muted-foreground">Gas Efficiency</div>
                          </div>
                          <Zap className="w-8 h-8 text-yellow-500" />
                        </div>
                        <Progress value={contractAnalysisMutation.data.gasEfficiency} className="mt-2" />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold">{contractAnalysisMutation.data.trustScore}</div>
                            <div className="text-sm text-muted-foreground">Trust Score</div>
                          </div>
                          <Target className="w-8 h-8 text-blue-500" />
                        </div>
                        <Progress value={contractAnalysisMutation.data.trustScore} className="mt-2" />
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">AI Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {contractAnalysisMutation.data.recommendations.map((rec: string, index: number) => (
                          <div key={index} className="flex items-start gap-2">
                            <ChevronRight className="w-4 h-4 mt-0.5 text-blue-500" />
                            <span className="text-sm">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="market" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                AI Market Intelligence
              </CardTitle>
              <CardDescription>
                DeepSeek AI-powered market analysis and investment insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={generateMarketInsights}
                disabled={marketInsightsMutation.isPending || !tokenAnalytics}
                className="w-full"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                {marketInsightsMutation.isPending ? "Analyzing..." : "Generate Market Insights"}
              </Button>

              {marketInsightsMutation.data && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Market Sentiment</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Badge 
                        variant={marketInsightsMutation.data.sentiment === 'Bullish' ? 'default' : 
                                marketInsightsMutation.data.sentiment === 'Bearish' ? 'destructive' : 'secondary'}
                        className="text-lg p-2"
                      >
                        {marketInsightsMutation.data.sentiment}
                      </Badge>
                      <div className="mt-2 text-sm text-muted-foreground">
                        Target: {marketInsightsMutation.data.priceTarget}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">AI Recommendation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Badge variant="outline" className="text-lg p-2">
                        {marketInsightsMutation.data.recommendation}
                      </Badge>
                      <div className="mt-2 text-sm text-muted-foreground">
                        Risk: {marketInsightsMutation.data.riskLevel}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gaming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Gaming Intelligence Dashboard
              </CardTitle>
              <CardDescription>
                Real-time gaming performance analytics and strategy optimization
              </CardDescription>
            </CardHeader>
            <CardContent>
              {intelLoading ? (
                <div className="text-center py-8">Loading gaming intelligence...</div>
              ) : gamingIntel ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold text-blue-600">
                          {gamingIntel.performance.totalTokens}
                        </div>
                        <div className="text-sm text-muted-foreground">Token Holdings</div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold text-purple-600">
                          {gamingIntel.performance.totalNFTs}
                        </div>
                        <div className="text-sm text-muted-foreground">NFT Collection</div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold text-green-600">
                          {gamingIntel.performance.securityScore}%
                        </div>
                        <div className="text-sm text-muted-foreground">Security Score</div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold text-orange-600">
                          {gamingIntel.performance.optimizationScore}%
                        </div>
                        <div className="text-sm text-muted-foreground">AI Optimization</div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">AI Strategy Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {gamingIntel.strategy.priorityActions.map((action: string, index: number) => (
                          <div key={index} className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-blue-500" />
                            <span className="text-sm">{action}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Enter a player address to view gaming intelligence
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="enhanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Enhanced Token Scanner
              </CardTitle>
              <CardDescription>
                Combined Moralis + AI analysis for comprehensive token intelligence
              </CardDescription>
            </CardHeader>
            <CardContent>
              {scanLoading ? (
                <div className="text-center py-8">Running enhanced scan...</div>
              ) : enhancedScan ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Enhanced Trust Score</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-green-600">
                          {enhancedScan.enhancedTrustScore}/100
                        </div>
                        <Progress value={enhancedScan.enhancedTrustScore} className="mt-2" />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Liquidity Health</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Badge variant="outline" className="text-lg p-2">
                          {enhancedScan.tokenAnalytics.liquidityHealth}
                        </Badge>
                        <div className="mt-2 text-sm text-muted-foreground">
                          Updated: {new Date(enhancedScan.timestamp).toLocaleTimeString()}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">AI Market Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Sentiment:</span>
                          <Badge variant="outline">{enhancedScan.marketInsights.sentiment}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Recommendation:</span>
                          <Badge variant="outline">{enhancedScan.marketInsights.recommendation}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Risk Level:</span>
                          <Badge variant="outline">{enhancedScan.marketInsights.riskLevel}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Enter a contract address to run enhanced scan
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}