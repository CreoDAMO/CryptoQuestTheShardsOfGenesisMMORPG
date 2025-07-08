import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  Shield, 
  DollarSign, 
  Bot, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  ExternalLink,
  RefreshCw,
  Download,
  Play,
  Pause
} from 'lucide-react';

interface ComplianceMetrics {
  secCompliance: number;
  taxIntegration: number;
  aiAuditScore: number;
  listingProgress: number;
}

interface ListingStatus {
  coinGecko: {
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    trustScore: number;
    requirements: {
      tokenContract: boolean;
      logo: boolean;
      description: boolean;
      website: boolean;
      whitepaper: boolean;
      socialLinks: boolean;
      auditReport: boolean;
      secCompliance: boolean;
      taxDocs: boolean;
      liquidityProof: boolean;
      kycDisclosure: boolean;
    };
  };
  coinMarketCap: {
    status: 'PENDING' | 'REVIEW' | 'APPROVED' | 'REJECTED';
    requirements: {
      tokenContract: boolean;
      tradingVolume: boolean;
      marketData: boolean;
      projectInfo: boolean;
      secFiling: boolean;
      taxIntegration: boolean;
    };
    note: string;
  };
}

export function SECComplianceDashboard() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const metrics: ComplianceMetrics = {
    secCompliance: 94.7,
    taxIntegration: 97.2,
    aiAuditScore: 96.0,
    listingProgress: 92.3
  };

  const listingStatus: ListingStatus = {
    coinGecko: {
      status: 'PENDING',
      trustScore: 8.7,
      requirements: {
        tokenContract: true,
        logo: true,
        description: true,
        website: true,
        whitepaper: true,
        socialLinks: true,
        auditReport: true,
        secCompliance: true,
        taxDocs: true,
        liquidityProof: true,
        kycDisclosure: true
      }
    },
    coinMarketCap: {
      status: 'REVIEW',
      requirements: {
        tokenContract: true,
        tradingVolume: false,
        marketData: true,
        projectInfo: true,
        secFiling: true,
        taxIntegration: true
      },
      note: "Awaiting trading volume requirements. Need $50K+ liquidity for 30 days."
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  const handleExport = () => {
    // Export functionality
    console.log('Exporting compliance data...');
  };

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-500';
      case 'PENDING': return 'bg-yellow-500';
      case 'REVIEW': return 'bg-blue-500';
      case 'REJECTED': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (completed: boolean) => {
    return completed ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <AlertCircle className="w-4 h-4 text-yellow-500" />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                NXD
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-300">
                <span>SEC Compliant</span>
                <span>Tax Integrated</span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                  >
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExport}
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-xl text-gray-300 max-w-4xl mx-auto">
            Comprehensive SEC-compliant Web3 domain ecosystem with integrated tax calculations and AI-powered auditing
          </p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center space-x-2">
                <Shield className="w-5 h-5 text-blue-500" />
                <span>SEC Compliance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {metrics.secCompliance}%
              </div>
              <p className="text-sm text-gray-400">
                Fully compliant with Reg D 506(c)
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                <span>Tax Integration</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400 mb-2">
                {metrics.taxIntegration}%
              </div>
              <p className="text-sm text-gray-400">
                CST 5.72% + IRS 24% automated
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center space-x-2">
                <Bot className="w-5 h-5 text-purple-500" />
                <span>AI Audit Score</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {metrics.aiAuditScore}%
              </div>
              <p className="text-sm text-gray-400">
                5-model AI verification
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-orange-500" />
                <span>Listing Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-400 mb-2">
                {metrics.listingProgress}%
              </div>
              <p className="text-sm text-gray-400">
                CoinGecko + CoinMarketCap ready
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-8 bg-slate-800/50 border-slate-700">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sec-tax">SEC & Tax</TabsTrigger>
            <TabsTrigger value="ai-audit">AI Audit</TabsTrigger>
            <TabsTrigger value="exchanges">Exchanges</TabsTrigger>
            <TabsTrigger value="tokenomics">Tokenomics</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="ecosystem">Ecosystem</TabsTrigger>
            <TabsTrigger value="tools" className="flex items-center space-x-1">
              <span>Tools</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleListening}
                className="h-6 w-6 p-0"
              >
                {isListening ? (
                  <Pause className="w-3 h-3" />
                ) : (
                  <Play className="w-3 h-3" />
                )}
              </Button>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* CoinGecko Listing */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <span>CoinGecko Listing</span>
                    <Badge className={`${getStatusColor(listingStatus.coinGecko.status)} text-white`}>
                      {listingStatus.coinGecko.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-yellow-400 mb-2">
                      {listingStatus.coinGecko.trustScore}/10
                    </div>
                    <p className="text-sm text-gray-400">Trust Score</p>
                  </div>
                  
                  <div className="space-y-2">
                    {Object.entries(listingStatus.coinGecko.requirements).map(([key, completed]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm text-gray-300 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        {getStatusIcon(completed)}
                      </div>
                    ))}
                  </div>
                  
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                    Submit to CoinGecko
                  </Button>
                </CardContent>
              </Card>

              {/* CoinMarketCap Listing */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <span>CoinMarketCap Listing</span>
                    <Badge className={`${getStatusColor(listingStatus.coinMarketCap.status)} text-white`}>
                      {listingStatus.coinMarketCap.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {Object.entries(listingStatus.coinMarketCap.requirements).map(([key, completed]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm text-gray-300 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        {getStatusIcon(completed)}
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <p className="text-sm text-yellow-300">
                      {listingStatus.coinMarketCap.note}
                    </p>
                  </div>
                  
                  <Button className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
                    Submit to CoinMarketCap
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sec-tax" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">SEC Compliance Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Regulation D 506(c)</span>
                      <Badge className="bg-green-500 text-white">Compliant</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Form D Filing</span>
                      <Badge className="bg-green-500 text-white">Filed</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Accredited Investor Verification</span>
                      <Badge className="bg-green-500 text-white">Active</Badge>
                    </div>
                    <Progress value={metrics.secCompliance} className="mt-4" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Tax Integration Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Capital Gains Tax (CST)</span>
                      <Badge className="bg-blue-500 text-white">5.72%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Federal Income Tax</span>
                      <Badge className="bg-blue-500 text-white">24%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Automated Reporting</span>
                      <Badge className="bg-green-500 text-white">Active</Badge>
                    </div>
                    <Progress value={metrics.taxIntegration} className="mt-4" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ai-audit" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">AI-Powered Security Audit</CardTitle>
                <CardDescription className="text-gray-400">
                  Comprehensive 5-model AI verification system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <h3 className="font-semibold text-white mb-2">Security Score</h3>
                    <div className="text-2xl font-bold text-green-400">94/100</div>
                  </div>
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <h3 className="font-semibold text-white mb-2">Gas Efficiency</h3>
                    <div className="text-2xl font-bold text-blue-400">87/100</div>
                  </div>
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <h3 className="font-semibold text-white mb-2">Code Quality</h3>
                    <div className="text-2xl font-bold text-purple-400">92/100</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="exchanges" className="space-y-6">
            <div className="text-center text-gray-400">
              <p>Exchange listings and trading pairs will be displayed here</p>
            </div>
          </TabsContent>

          <TabsContent value="tokenomics" className="space-y-6">
            <div className="text-center text-gray-400">
              <p>Tokenomics details and distribution will be displayed here</p>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="text-center text-gray-400">
              <p>Analytics and performance metrics will be displayed here</p>
            </div>
          </TabsContent>

          <TabsContent value="ecosystem" className="space-y-6">
            <div className="text-center text-gray-400">
              <p>Ecosystem overview and partnerships will be displayed here</p>
            </div>
          </TabsContent>

          <TabsContent value="tools" className="space-y-6">
            <div className="text-center">
              <Button
                onClick={toggleListening}
                className={`px-6 py-3 rounded-lg font-semibold ${
                  isListening 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {isListening ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Stop Listening
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Start Listening
                  </>
                )}
              </Button>
              <p className="text-sm text-gray-400 mt-2">
                AI voice assistant for compliance monitoring
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}