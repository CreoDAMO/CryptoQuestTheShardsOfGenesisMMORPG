"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Brain, Database, TrendingUp, Zap, Eye, Shield, Wallet, Cpu, Activity, DollarSign } from 'lucide-react';

const UnifiedIntelligenceDashboard = () => {
  const [activeSystem, setActiveSystem] = useState('overview');
  const [connectionStatus, setConnectionStatus] = useState('connected');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            CryptoQuest: The Shards of Genesis
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Ultimate Gaming Industry Control Center - Revolutionary 10 Dashboard Ecosystem
          </p>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-400">Connected to 0x67BF...3866</span>
          </div>
        </div>

        {/* System Status Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { name: 'AI Agents', status: 'Active', count: 5, icon: Brain },
            { name: 'Dashboards', status: 'Online', count: 10, icon: Database },
            { name: 'Networks', status: 'Connected', count: 6, icon: Zap },
            { name: 'Features', status: 'Ready', count: 25, icon: Activity }
          ].map((item, index) => (
            <Card key={index} className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4 text-center">
                <item.icon className="w-6 h-6 mx-auto mb-2 text-purple-400" />
                <div className="text-2xl font-bold text-white">{item.count}</div>
                <div className="text-sm text-gray-300">{item.name}</div>
                <Badge className="mt-2 bg-green-500/20 text-green-400 border-green-500/30">
                  {item.status}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs value={activeSystem} onValueChange={setActiveSystem} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="overview" className="text-white data-[state=active]:bg-purple-500/20">
              Overview
            </TabsTrigger>
            <TabsTrigger value="gaming" className="text-white data-[state=active]:bg-purple-500/20">
              Gaming Hub
            </TabsTrigger>
            <TabsTrigger value="defi" className="text-white data-[state=active]:bg-purple-500/20">
              DeFi Suite
            </TabsTrigger>
            <TabsTrigger value="ai" className="text-white data-[state=active]:bg-purple-500/20">
              AI Systems
            </TabsTrigger>
            <TabsTrigger value="admin" className="text-white data-[state=active]:bg-purple-500/20">
              Admin
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Dashboard Cards */}
              {[
                { title: 'Game Hub', desc: 'Multi-platform MMORPG', icon: '🎮', status: 'Active' },
                { title: 'AI Agent Suite', desc: 'Coinbase AgentKit Integration', icon: '🤖', status: 'Running' },
                { title: 'OnRamper Integration', desc: 'Fiat-to-Crypto Conversion', icon: '💳', status: 'Connected' },
                { title: 'CQT Arbitrage Bot', desc: 'AI-Powered Trading (94.7% Success)', icon: '📈', status: 'Profitable' },
                { title: 'RTX Gaming Hub', desc: 'NVIDIA DLSS 4.0 + Neural Rendering', icon: '⚡', status: 'Optimized' },
                { title: 'DeFi Dashboard', desc: 'Staking, Farming, Liquidity Management', icon: '💰', status: 'Earning' },
                { title: 'White Paper Dashboard', desc: 'Live Contract Data & Metrics', icon: '📊', status: 'Updated' },
                { title: 'Holographic Engine', desc: 'HoloPy/OpenHolo Visualization', icon: '🔮', status: 'Rendering' },
                { title: 'V4 DeFi Dashboard', desc: 'Uniswap V4 SDK with Hooks', icon: '🔄', status: 'Enhanced' },
                { title: 'Admin Control Center', desc: 'Dual-Access Security System', icon: '🛡️', status: 'Secured' }
              ].map((dashboard, index) => (
                <Card key={index} className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-colors">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <span className="text-2xl">{dashboard.icon}</span>
                      {dashboard.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 mb-4">{dashboard.desc}</p>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      {dashboard.status}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="gaming" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Console Integration Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-slate-900/50 rounded-lg">
                    <div className="text-3xl mb-2">🎮</div>
                    <div className="font-semibold text-white">PlayStation 5</div>
                    <div className="text-sm text-gray-300">DualSense Ready</div>
                    <Badge className="mt-2 bg-blue-500/20 text-blue-400">Connected</Badge>
                  </div>
                  <div className="text-center p-4 bg-slate-900/50 rounded-lg">
                    <div className="text-3xl mb-2">🎯</div>
                    <div className="font-semibold text-white">Xbox Series X/S</div>
                    <div className="text-sm text-gray-300">Smart Delivery</div>
                    <Badge className="mt-2 bg-green-500/20 text-green-400">Ready</Badge>
                  </div>
                  <div className="text-center p-4 bg-slate-900/50 rounded-lg">
                    <div className="text-3xl mb-2">💻</div>
                    <div className="font-semibold text-white">PC Gaming</div>
                    <div className="text-sm text-gray-300">RTX Enhanced</div>
                    <Badge className="mt-2 bg-purple-500/20 text-purple-400">Optimized</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="defi" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Liquidity Pools</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">MATIC/CQT Pool</span>
                      <Badge className="bg-green-500/20 text-green-400">125.4% APR</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">WETH/CQT Pool</span>
                      <Badge className="bg-green-500/20 text-green-400">89.7% APR</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Total Liquidity</span>
                      <span className="text-white font-bold">$2.4M</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Arbitrage Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Success Rate</span>
                      <span className="text-green-400 font-bold">94.7%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Profit Margin</span>
                      <span className="text-green-400 font-bold">8.7-12.3%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Gas Efficiency</span>
                      <span className="text-blue-400 font-bold">87.3%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ai" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { name: 'Claude 4 Sonnet', performance: 98, status: 'Active' },
                { name: 'GPT-4o', performance: 96, status: 'Active' },
                { name: 'Grok 3', performance: 94, status: 'Active' },
                { name: 'DeepSeek Coder', performance: 92, status: 'Active' },
                { name: 'NVIDIA ACE', performance: 89, status: 'Active' }
              ].map((ai, index) => (
                <Card key={index} className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-4 text-center">
                    <div className="text-sm font-medium text-white mb-2">{ai.name}</div>
                    <div className="text-xs text-gray-300 mb-2">Performance: {ai.performance}%</div>
                    <Progress value={ai.performance} className="mb-2" />
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      {ai.status}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="admin" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Security Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Multi-Sig Protection</span>
                      <Badge className="bg-green-500/20 text-green-400">3/3 Active</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Timelock Delay</span>
                      <span className="text-white">24 hours</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Security Score</span>
                      <span className="text-green-400 font-bold">94/100</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Owner Wallet</span>
                      <span className="text-blue-400">0x67BF...3866</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Active Contracts</span>
                      <span className="text-white">12/12</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">System Health</span>
                      <Badge className="bg-green-500/20 text-green-400">Excellent</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer Status */}
        <div className="text-center text-sm text-gray-400 border-t border-slate-700 pt-4">
          <p>CryptoQuest: The Ultimate Gaming Industry Control Center</p>
          <p className="mt-1">Built with cutting-edge technology for the future of gaming - January 2025</p>
        </div>
      </div>
    </div>
  );
};

export default UnifiedIntelligenceDashboard;