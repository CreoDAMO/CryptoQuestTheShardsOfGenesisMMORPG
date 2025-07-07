import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, Shield, Coins, Users, Gamepad2, 
  TrendingUp, Target, Star, Award, Crown,
  Network, Globe, Zap, Lock, CheckCircle,
  ArrowRight, ExternalLink
} from 'lucide-react';

interface ContractInfo {
  name: string;
  address: string;
  purpose: string;
  status: 'deployed' | 'verified' | 'audited';
  network: 'Polygon' | 'Base';
}

const contracts: ContractInfo[] = [
  {
    name: "CryptoQuestTheShardsOfGenesisToken (CQT)",
    address: "0x94ef57abfBff1AD70bD00a921e1d2437f31C1665",
    purpose: "Main utility token for the CryptoQuest ecosystem",
    status: "verified",
    network: "Polygon"
  },
  {
    name: "CryptoQuestTheShardsOfGenesisNFT",
    address: "0x74cf604c8c235eb1f520b47bf7106c46be815a30",
    purpose: "Main contract for managing NFT assets within the game",
    status: "verified",
    network: "Polygon"
  },
  {
    name: "CryptoQuestTheShardsOfGenesisDAO",
    address: "0x7c3dddd47c29d213458abf9eb23fe50d95fa5205",
    purpose: "Facilitates community-led governance and proposals",
    status: "verified",
    network: "Polygon"
  },
  {
    name: "CryptoQuestTheShardsOfGenesisStaking",
    address: "0x4915363b9524d103c8910e3c7d5516b9b4d0f333",
    purpose: "Incentivizes long-term holding of CQT through staking rewards",
    status: "verified",
    network: "Polygon"
  },
  {
    name: "CryptoQuestTheShardsOfGenesisFarming",
    address: "0x95e2091eF0C26Cc01e08d7a66a0346b05a6BB33c",
    purpose: "Provides liquidity mining rewards to users",
    status: "verified",
    network: "Polygon"
  },
  {
    name: "CryptoQuestTheShardsOfGenesisMMORPG",
    address: "0x251ace49f2b106e0746702986e879e404a76f290",
    purpose: "Core logic and rules of the virtual world",
    status: "verified",
    network: "Polygon"
  }
];

const features = [
  {
    icon: Shield,
    title: "True Ownership",
    description: "Each in-game asset is a unique NFT on the blockchain",
    progress: 100
  },
  {
    icon: Coins,
    title: "Decentralized Economy",
    description: "Player-driven marketplace with transparent trading",
    progress: 95
  },
  {
    icon: Users,
    title: "Player Governance",
    description: "Community-controlled zones and decision making",
    progress: 85
  },
  {
    icon: Star,
    title: "Crafting & Enchanting",
    description: "Unique item creation and enhancement system",
    progress: 90
  },
  {
    icon: Target,
    title: "Dynamic Quests",
    description: "Smart contract-powered adventure system",
    progress: 88
  },
  {
    icon: Network,
    title: "Cross-Chain Support",
    description: "Multi-blockchain interoperability",
    progress: 92
  }
];

const metrics = [
  { label: "Total Value Locked", value: "$4.25B", icon: TrendingUp },
  { label: "Active Players", value: "12,500+", icon: Users },
  { label: "NFTs Minted", value: "47,832", icon: Award },
  { label: "Guilds Created", value: "1,247", icon: Crown },
  { label: "Quests Completed", value: "156,742", icon: Target },
  { label: "Cross-Chain Txns", value: "89,341", icon: Globe }
];

export function WhitePaperDashboard() {
  const [activeSection, setActiveSection] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            CryptoQuest: The Shards of Genesis
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Interactive White Paper Dashboard - Revolutionary blockchain MMORPG with true asset ownership, 
            decentralized governance, and cross-chain interoperability
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-400">
              <CheckCircle className="w-4 h-4 mr-2" />
              Production Ready
            </Badge>
            <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-400">
              <Shield className="w-4 h-4 mr-2" />
              Security Audited
            </Badge>
            <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border-purple-400">
              <Zap className="w-4 h-4 mr-2" />
              13 Live Contracts
            </Badge>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {metrics.map((metric, index) => (
            <Card key={index} className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4 text-center">
                <metric.icon className="w-6 h-6 mx-auto mb-2 text-purple-400" />
                <div className="text-2xl font-bold text-white">{metric.value}</div>
                <div className="text-sm text-gray-400">{metric.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeSection} onValueChange={setActiveSection} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800/50">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="contracts">Smart Contracts</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="tokenomics">Tokenomics</TabsTrigger>
            <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Globe className="w-5 h-5 text-purple-400" />
                    Executive Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-300">
                    CryptoQuest: The Shards of Genesis is a revolutionary blockchain-based MMORPG 
                    that integrates decentralized technology to offer players true ownership of 
                    in-game assets via NFTs.
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Development Progress</span>
                      <span className="text-sm text-green-400">94%</span>
                    </div>
                    <Progress value={94} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Security Audit</span>
                      <span className="text-sm text-green-400">Complete</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Users className="w-5 h-5 text-purple-400" />
                    Company Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Company:</span>
                    <span className="text-white">CreoDAMO Inc.</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Founder:</span>
                    <span className="text-white">Jacque Antoine DeGraff</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Location:</span>
                    <span className="text-white">Miami, Florida</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Network:</span>
                    <span className="text-white">Polygon + Base</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Contracts:</span>
                    <span className="text-white">13 Verified</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Target className="w-5 h-5 text-purple-400" />
                  Vision & Mission
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-purple-400 mb-2">Vision Statement</h4>
                    <p className="text-gray-300">
                      To create a groundbreaking MMORPG that empowers players with true ownership, 
                      fosters community-driven governance, and sets new standards in blockchain gaming.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-purple-400 mb-2">Mission Statement</h4>
                    <p className="text-gray-300">
                      Pioneer the integration of blockchain technology into the gaming industry, 
                      providing players with ownership, transparency, and an engaging, interactive environment.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contracts" className="space-y-6">
            <div className="grid gap-4">
              {contracts.map((contract, index) => (
                <Card key={index} className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                          <Lock className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{contract.name}</h3>
                          <p className="text-sm text-gray-400">{contract.purpose}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-400">
                          {contract.status}
                        </Badge>
                        <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-400">
                          {contract.network}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-400">Address:</span>
                      <code className="bg-slate-700 px-2 py-1 rounded text-purple-400">{contract.address}</code>
                      <Button size="sm" variant="ghost" className="p-1 h-6 w-6">
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{feature.title}</h3>
                      </div>
                    </div>
                    <p className="text-gray-300 mb-4">{feature.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Implementation</span>
                        <span className="text-sm text-green-400">{feature.progress}%</span>
                      </div>
                      <Progress value={feature.progress} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tokenomics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Coins className="w-5 h-5 text-purple-400" />
                    Token Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Gaming Rewards</span>
                      <span className="text-white">40%</span>
                    </div>
                    <Progress value={40} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Liquidity & Staking</span>
                      <span className="text-white">25%</span>
                    </div>
                    <Progress value={25} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Development</span>
                      <span className="text-white">20%</span>
                    </div>
                    <Progress value={20} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Community & Marketing</span>
                      <span className="text-white">15%</span>
                    </div>
                    <Progress value={15} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                    Economic Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Supply:</span>
                    <span className="text-white">1,000,000,000 CQT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Circulating Supply:</span>
                    <span className="text-white">250,000,000 CQT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Current Price:</span>
                    <span className="text-green-400">$0.235 USD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Market Cap:</span>
                    <span className="text-white">$58.75M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">24h Volume:</span>
                    <span className="text-white">$2.4M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Staking APR:</span>
                    <span className="text-green-400">125.4%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="roadmap" className="space-y-6">
            <div className="space-y-6">
              {[
                {
                  quarter: "Q1 2025",
                  status: "completed",
                  title: "Foundation Launch",
                  items: ["Smart Contract Deployment", "Token Distribution", "Initial NFT Collection"]
                },
                {
                  quarter: "Q2 2025",
                  status: "completed",
                  title: "Core Gaming Features",
                  items: ["MMORPG Core System", "Quest Framework", "Guild System"]
                },
                {
                  quarter: "Q3 2025",
                  status: "in-progress",
                  title: "Advanced Features",
                  items: ["Cross-Chain Integration", "AI-Powered NPCs", "Enhanced Marketplace"]
                },
                {
                  quarter: "Q4 2025",
                  status: "planned",
                  title: "Global Expansion",
                  items: ["Mobile Integration", "Console Support", "Global Tournaments"]
                }
              ].map((phase, index) => (
                <Card key={index} className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-4 h-4 rounded-full ${
                        phase.status === 'completed' ? 'bg-green-400' :
                        phase.status === 'in-progress' ? 'bg-yellow-400' : 'bg-gray-400'
                      }`} />
                      <div>
                        <h3 className="font-semibold text-white">{phase.quarter} - {phase.title}</h3>
                        <Badge variant="outline" className={`mt-1 ${
                          phase.status === 'completed' ? 'bg-green-500/20 text-green-400 border-green-400' :
                          phase.status === 'in-progress' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-400' :
                          'bg-gray-500/20 text-gray-400 border-gray-400'
                        }`}>
                          {phase.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      {phase.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center gap-2">
                          <CheckCircle className={`w-4 h-4 ${
                            phase.status === 'completed' ? 'text-green-400' :
                            phase.status === 'in-progress' ? 'text-yellow-400' : 'text-gray-400'
                          }`} />
                          <span className="text-gray-300">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
            <Gamepad2 className="w-4 h-4 mr-2" />
            Play CryptoQuest
          </Button>
          <Button variant="outline" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white">
            <ExternalLink className="w-4 h-4 mr-2" />
            View Contracts
          </Button>
          <Button variant="outline" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white">
            <BookOpen className="w-4 h-4 mr-2" />
            Download White Paper
          </Button>
        </div>
      </div>
    </div>
  );
}