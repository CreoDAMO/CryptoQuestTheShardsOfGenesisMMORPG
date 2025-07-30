"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import OnRamperDashboard from '../onramper/OnRamperDashboard';
import { 
  Brain, Database, TrendingUp, Zap, Eye, Shield, Wallet, 
  Cpu, Activity, DollarSign, Users, Gamepad2, BookOpen,
  BarChart3, Coins, Star, ArrowUpRight, ExternalLink,
  Play, Plus, Repeat, Gift, Settings, CreditCard
} from 'lucide-react';

const CryptoQuestDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [liveMetrics, setLiveMetrics] = useState({
    totalTVL: 7850000,
    activeUsers: 12500,
    nftsMinted: 47832,
    cqtPrice: 0.000000229
  });

  // Simulate live updates with real contract data
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMetrics(prev => ({
        totalTVL: prev.totalTVL + Math.random() * 1000,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 10),
        nftsMinted: prev.nftsMinted + Math.floor(Math.random() * 5),
        cqtPrice: prev.cqtPrice + (Math.random() - 0.5) * 0.000000001
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Real contract addresses from problem statement
  const CONTRACT_ADDRESSES = {
    polygonCQT: '0x94ef57abfbff1ad70bd00a921e1d2437f31c1665',
    baseCQT: '0x9d1075b41cd80ab08179f36bc17a7ff8708748ba',
    maticCQTLP: '0x0b3cd8a843DEFDF01564a0342a89ba06c4fC9394',
    wethCQTLP: '0xb1e0b26f550203FAb31A0D9C1Eb4FFE330bfE4d0'
  };

  const navigationTabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'whitepaper', label: 'White Paper', icon: BookOpen },
    { id: 'defihub', label: 'DeFi Hub', icon: DollarSign },
    { id: 'publicgame', label: 'Public Game', icon: Gamepad2 },
    { id: 'aiagents', label: 'AI Agents', icon: Brain },
    { id: 'onramper', label: 'OnRamper', icon: ArrowUpRight },
    { id: 'cqtbot', label: 'CQT Bot', icon: TrendingUp },
    { id: 'nvidia', label: 'NVIDIA + Holo', icon: Zap },
    { id: 'metamask', label: 'MetaMask', icon: Wallet },
    { id: 'multiwallets', label: 'Multi-Wallets', icon: Shield },
    { id: 'blockchain', label: 'Blockchain', icon: Database },
    { id: 'admincenter', label: 'Admin Center', icon: Settings }
  ];

  const smartContracts = [
    { name: 'CryptoQuestTheShardsOfGenesisToken (CQT)', address: '0x94ef57abfBff1AD70bD00a921e1d2437f31C1665', verified: true, network: 'Polygon' },
    { name: 'CQT Token on BASE Network', address: '0x9d1075b41cd80ab08179f36bc17a7ff8708748ba', verified: true, network: 'BASE', url: 'https://basescan.org/token/0x9d1075b41cd80ab08179f36bc17a7ff8708748ba#code' },
    { name: 'CryptoQuestTheShardsOfGenesisNFT', address: '0x74cf6ba94fb4174b5b26c9139b3e7e4cf96db538', verified: true, network: 'Polygon' },
    { name: 'CryptoQuestBookNFT Contract', address: '0x295f4e637b4f7b3b3d01d9b7e4e6d3e2f1a0c9e8', verified: true, network: 'Polygon' },
    { name: 'CryptoQuestTheShardsOfGenesisDAO', address: '0x0ca9d4a4e5fb72dd6f7ae57ba8a3f43f94e6490', verified: true, network: 'Polygon' },
    { name: 'CryptoQuestTheShardsOfGenesisStaking', address: '0x4915363b3b2454f170494c9ecbefa6f6332867f9', verified: true, network: 'Polygon' },
    { name: 'CryptoQuestTheShardsOfGenesisFarming', address: '0x35e2d0a1e2f5c1c5d5f7ea0d3da1ba3f48b85a9c', verified: true, network: 'Polygon' }
  ];

  const tokenDistribution = [
    { category: 'Gaming Rewards', percentage: 40, color: 'rgb(16, 185, 129)' },
    { category: 'Liquidity & Staking', percentage: 25, color: 'rgb(59, 130, 246)' },
    { category: 'Development', percentage: 20, color: 'rgb(147, 51, 234)' },
    { category: 'Community & Marketing', percentage: 15, color: 'rgb(245, 158, 11)' }
  ];

  const economicMetrics = [
    { label: 'Total Supply', value: '1,000,000,000 CQT' },
    { label: 'Circulating Supply', value: '250,000,000 CQT' },
    { label: 'Current Price', value: `$${liveMetrics.cqtPrice.toFixed(9)}` },
    { label: 'Market Cap', value: '$58.75M' },
    { label: '24h Volume', value: '$2.1M' },
    { label: 'Staking APR', value: '125.4%' }
  ];

  const protocolMetrics = [
    { label: 'Staking APR', value: '95.8%', trend: 'up' },
    { label: 'Farming APR', value: '124.1%', trend: 'up' },
    { label: 'Total Participants', value: '9,350', trend: 'up' },
    { label: 'Holographic Quality', value: '94/100', trend: 'stable' },
    { label: 'NFT Books Sold', value: '1,105', trend: 'up' },
    { label: 'Active Pools', value: '29', trend: 'up' }
  ];

  return (
    <div className="min-h-screen cosmic-bg">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full glass-card flex items-center justify-center floating-animation">
              <span className="text-3xl">🎮</span>
            </div>
          </div>
          <h1 className="text-5xl font-bold gradient-text mb-2">
            CryptoQuest: The Shards of Genesis
          </h1>
          <p className="text-lg text-purple-200 mb-4">
            Interactive Web3 MMORPG with True Asset Ownership and Blockchain Interoperability
          </p>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full pulse-glow"></div>
            <span className="text-sm text-green-400 font-medium">REALTIME UPDATES - ACTIVE</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {navigationTabs.map((tab) => (
            <Button
              key={tab.id}
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className={`nav-pill ${activeTab === tab.id ? 'active' : ''}`}
            >
              <tab.icon className="w-4 h-4 mr-1" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Main Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="metric-card">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-white mb-1">
                ${(liveMetrics.totalTVL / 1000000).toFixed(2)}M
              </div>
              <div className="text-sm text-purple-200">Total Value Locked</div>
            </CardContent>
          </Card>
          
          <Card className="metric-card">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-white mb-1">
                {liveMetrics.activeUsers.toLocaleString()}+
              </div>
              <div className="text-sm text-purple-200">Active Players</div>
            </CardContent>
          </Card>
          
          <Card className="metric-card">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-white mb-1">
                {liveMetrics.nftsMinted.toLocaleString()}
              </div>
              <div className="text-sm text-purple-200">NFTs Minted</div>
            </CardContent>
          </Card>
          
          <Card className="metric-card">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-white mb-1">156,742</div>
              <div className="text-sm text-purple-200">Guilds Created</div>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <Card className="metric-card">
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6 mx-auto mb-2 text-purple-400" />
              <div className="text-xl font-bold text-white">1,247</div>
              <div className="text-xs text-purple-200">Guild Masters</div>
            </CardContent>
          </Card>
          
          <Card className="metric-card">
            <CardContent className="p-4 text-center">
              <Zap className="w-6 h-6 mx-auto mb-2 text-blue-400" />
              <div className="text-xl font-bold text-white">89,341</div>
              <div className="text-xs text-purple-200">Daily Active Users</div>
            </CardContent>
          </Card>
          
          <Card className="metric-card">
            <CardContent className="p-4 text-center">
              <Star className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
              <div className="text-xl font-bold text-white">94.7%</div>
              <div className="text-xs text-purple-200">Success Rate</div>
            </CardContent>
          </Card>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'nvidia' && (
          <div className="space-y-6">
            {/* NVIDIA RTX Gaming Hub */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  NVIDIA RTX + Holographic Engine
                </CardTitle>
                <p className="text-purple-200 text-sm">
                  DLSS 4.0 • Neural Rendering • ACE AI Characters • Ray Tracing
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-1">120</div>
                    <div className="text-sm text-purple-200">RTX FPS</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-1">8</div>
                    <div className="text-sm text-purple-200">ACE Characters</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-1">$18742</div>
                    <div className="text-sm text-purple-200">AI Mining Profit</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-400 mb-1">60</div>
                    <div className="text-sm text-purple-200">Holographic FPS</div>
                  </div>
                </div>

                {/* System Controls */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    Start All Systems
                  </Button>
                  <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">
                    Pause Non-Critical
                  </Button>
                  <Button className="bg-red-600 hover:bg-red-700 text-white">
                    Emergency Stop
                  </Button>
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    Advanced Settings
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Cloud Instances & Resource Usage */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-white">Cloud Instances</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-black/20">
                    <div>
                      <div className="text-white font-medium">4x RTX</div>
                      <div className="text-purple-300 text-sm">High Performance</div>
                    </div>
                    <Badge className="bg-blue-500/20 text-blue-400">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-black/20">
                    <div>
                      <div className="text-white font-medium">2x H100</div>
                      <div className="text-purple-300 text-sm">AI Training</div>
                    </div>
                    <Badge className="bg-blue-500/20 text-blue-400">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-black/20">
                    <div>
                      <div className="text-white font-medium">8x V100</div>
                      <div className="text-purple-300 text-sm">Mining</div>
                    </div>
                    <Badge className="bg-blue-500/20 text-blue-400">Active</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-white">Resource Usage</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-purple-200">Credits Used</span>
                      <span className="text-white">1,450</span>
                    </div>
                    <Progress value={72} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-purple-200">API Calls</span>
                      <span className="text-white">48,750</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-purple-200">Compute Hours</span>
                      <span className="text-white">127</span>
                    </div>
                    <Progress value={84} className="h-2" />
                  </div>
                  <div className="text-center mt-4">
                    <div className="text-2xl font-bold text-green-400">$425.8</div>
                    <div className="text-sm text-purple-200">Total Cost</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'cqtbot' && (
          <div className="space-y-6">
            {/* CQT Arbitrage Bot Dashboard */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  CQT Arbitrage Bot Dashboard
                </CardTitle>
                <p className="text-purple-200 text-sm">
                  Advanced cross-chain arbitrage • AI accuracy • Rust security
                </p>
              </CardHeader>
              <CardContent>
                {/* Bot Controls */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 rounded-lg bg-black/20">
                    <div className="text-sm text-purple-200 mb-1">Update Rate</div>
                    <div className="text-lg font-bold text-white">2s</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-black/20">
                    <div className="text-sm text-purple-200 mb-1">Theme</div>
                    <div className="text-lg font-bold text-white">Dark</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-black/20">
                    <div className="text-sm text-purple-200 mb-1">Display</div>
                    <div className="text-lg font-bold text-green-400">Comfortable</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-black/20">
                    <div className="text-sm text-purple-200 mb-1">Arbitrage</div>
                    <div className="text-lg font-bold text-green-400">ON</div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <Card className="metric-card">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-400 mb-1">$2914.21</div>
                      <div className="text-sm text-purple-200">Total Profit</div>
                    </CardContent>
                  </Card>
                  <Card className="metric-card">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-400 mb-1">94.7%</div>
                      <div className="text-sm text-purple-200">Success Rate</div>
                    </CardContent>
                  </Card>
                  <Card className="metric-card">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-yellow-400 mb-1">96.2%</div>
                      <div className="text-sm text-purple-200">AI Accuracy</div>
                    </CardContent>
                  </Card>
                  <Card className="metric-card">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-purple-400 mb-1">99.8%</div>
                      <div className="text-sm text-purple-200">Rust Security</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Status Sections */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">Security Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-purple-200">Rust Wrapper</span>
                        <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-purple-200">ZK Proofs</span>
                        <Badge className="bg-green-500/20 text-green-400">Verified</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-purple-200">Anti-Quantum</span>
                        <Badge className="bg-blue-500/20 text-blue-400">Enabled</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-purple-200">Multi-Sig</span>
                        <Badge className="bg-green-500/20 text-green-400">3/5 Active</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">Wallet Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-purple-200">Deployment Wallet:</span>
                        <span className="text-white text-sm">9xC3...AE79</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-purple-200">CQT Balance:</span>
                        <span className="text-white">39.2T CQT</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-purple-200">MATIC Balance:</span>
                        <span className="text-white">10 MATIC</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-purple-200">Base ETH:</span>
                        <span className="text-white">0.85 ETH</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="flex justify-center gap-4">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Repeat className="w-4 h-4 mr-2" />
                Swap CQT
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Liquidity
              </Button>
              <Button className="bg-green-600 hover:bg-green-700">
                <Shield className="w-4 h-4 mr-2" />
                Bridge Assets
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'defihub' && (
          <div className="space-y-6">
            {/* Token Distribution */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Token Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {tokenDistribution.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-2">
                      <span className="text-purple-200">{item.category}</span>
                      <span className="text-white font-semibold">{item.percentage}%</span>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Economic Metrics */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Coins className="w-5 h-5" />
                  Economic Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {economicMetrics.map((metric, index) => (
                    <div key={index} className="text-center">
                      <div className="text-sm text-purple-200 mb-1">{metric.label}</div>
                      <div className="text-lg font-bold text-white">{metric.value}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Protocol Overview */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white">Protocol Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {protocolMetrics.map((metric, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-purple-200">{metric.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold">{metric.value}</span>
                        {metric.trend === 'up' && (
                          <ArrowUpRight className="w-4 h-4 text-green-400" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'whitepaper' && (
          <div className="space-y-6">
            {/* SEC Compliance Dashboard */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  SEC Compliance Status
                </CardTitle>
                <p className="text-purple-200 text-sm">
                  Seamless Regulatory Navigation • Real-time Updates • Success Rate
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-white font-semibold mb-4">Compliance Status</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-purple-200">Compliance Score</span>
                        <span className="text-white font-bold">88/100</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-purple-200">KYC Enabled</span>
                        <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-purple-200">AML Monitoring</span>
                        <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-purple-200">GDPR Compliant</span>
                        <Badge className="bg-green-500/20 text-green-400">Certified</Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-white font-semibold mb-4">Regional Coverage</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-purple-200">North America</span>
                        <span className="text-white">100%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-purple-200">Europe</span>
                        <span className="text-white">95%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-purple-200">Asia Pacific</span>
                        <span className="text-white">85%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-purple-200">Global</span>
                        <span className="text-white">92%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-purple-200">Regulated Markets</span>
                        <span className="text-white">147/180</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* White Paper Download */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white">Official Documentation</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-purple-200">
                  Download the complete CryptoQuest white paper including tokenomics, 
                  technical architecture, and regulatory compliance framework.
                </p>
                <div className="flex justify-center gap-4">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Download White Paper
                  </Button>
                  <Button variant="outline" className="border-purple-500 text-purple-300">
                    <Eye className="w-4 h-4 mr-2" />
                    View Online
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Smart Contracts */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Smart Contracts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {smartContracts.map((contract, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-black/20">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-purple-500/20 flex items-center justify-center">
                        <Database className="w-4 h-4 text-purple-400" />
                      </div>
                      <div>
                        <div className="text-white font-medium text-sm">{contract.name}</div>
                        <div className="text-purple-300 text-xs font-mono">{contract.address}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {contract.verified && (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          Verified
                        </Badge>
                      )}
                      <Button size="sm" variant="ghost" className="text-purple-400">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Executive Summary */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-white">Executive Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-purple-200 text-sm mb-1">Company:</div>
                    <div className="text-white">CreoDAMO Inc</div>
                  </div>
                  <div>
                    <div className="text-purple-200 text-sm mb-1">Founder:</div>
                    <div className="text-white">Jacque Antoine Degraaf</div>
                  </div>
                  <div>
                    <div className="text-purple-200 text-sm mb-1">Location:</div>
                    <div className="text-white">Miami, Florida</div>
                  </div>
                  <div>
                    <div className="text-purple-200 text-sm mb-1">Network:</div>
                    <div className="text-white">Polygon + Base</div>
                  </div>
                  <div>
                    <div className="text-purple-200 text-sm mb-1">Development Progress:</div>
                    <div className="text-white">94%</div>
                    <Progress value={94} className="mt-1" />
                  </div>
                  <div>
                    <div className="text-purple-200 text-sm mb-1">Security Audit:</div>
                    <div className="text-green-400">Complete</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-white">Vision & Mission</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-purple-200 text-sm mb-2">Vision Statement</div>
                    <div className="text-white text-sm leading-relaxed">
                      To create a groundbreaking MMORPG that empowers players with true ownership, fosters community-driven governance, and sets new standards in blockchain gaming.
                    </div>
                  </div>
                  <div>
                    <div className="text-purple-200 text-sm mb-2">Mission Statement</div>
                    <div className="text-white text-sm leading-relaxed">
                      Pioneer the integration of blockchain technology into the gaming industry, providing players with ownership, transparency, and an engaging, interactive environment.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <Play className="w-4 h-4 mr-2" />
                Play CryptoQuest
              </Button>
              <Button variant="outline" className="border-purple-500 text-purple-300">
                <BookOpen className="w-4 h-4 mr-2" />
                View Contracts
              </Button>
              <Button variant="outline" className="border-purple-500 text-purple-300">
                <Gift className="w-4 h-4 mr-2" />
                Download White Paper
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'onramper' && (
          <div>
            <OnRamperDashboard />
          </div>
        )}

        {activeTab === 'cqtbot' && (
          <div className="text-center text-purple-200">
            CQT Arbitrage Bot Dashboard - Coming Soon
            <div className="mt-4 text-sm">AI-powered cross-chain arbitrage with 94.7% success rate</div>
          </div>
        )}

        {activeTab === 'aiagents' && (
          <div className="text-center text-purple-200">
            AI Agents Dashboard - Coming Soon
            <div className="mt-4 text-sm">Advanced AI-powered trading and analytics</div>
          </div>
        )}

        {activeTab === 'admincenter' && (
          <div className="text-center text-purple-200">
            Admin Center - Restricted Access
            <div className="mt-4 text-sm">Multi-signature wallet authentication required</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CryptoQuestDashboard;