'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { 
  Activity, 
  TrendingUp, 
  Zap, 
  Shield, 
  Gamepad2, 
  Bot, 
  DollarSign,
  Users,
  Settings,
  Wallet,
  BarChart3,
  Globe,
  Cpu,
  Database
} from 'lucide-react';

import { AgentDashboard } from '@/components/agentkit/AgentDashboard';
import { ArbitrageDashboard } from '@/components/arbitrage/ArbitrageDashboard';
import { GameDashboard } from '@/components/game/GameDashboard';
import { OnRamperDashboard } from '@/components/onramper/OnRamperDashboard';
import { SuperPayDashboard } from '@/components/superpay/SuperPayDashboard';
import { SmartContractManager } from '@/components/admin/SmartContractManager';
import { SafeMultisigSetup } from '@/components/wallet/SafeMultisigSetup';

import { walletManager } from '@/lib/wallet-manager';
import { CQT_CONTRACTS, fetchCQTPrice, REAL_TIME_METRICS } from '@/lib/contract-data';

interface CQTPriceData {
  price: string;
  volume24h: string;
  liquidity: string;
  priceChange24h: string;
}

export default function CryptoQuestDashboard() {
  const [cqtPrice, setCqtPrice] = useState<CQTPriceData>({
    price: '0.00',
    volume24h: '0',
    liquidity: '0',
    priceChange24h: '0'
  });

  const [activeTab, setActiveTab] = useState('overview');
  const [realTimeData, setRealTimeData] = useState(REAL_TIME_METRICS);

  useEffect(() => {
    // Fetch real CQT price on component mount
    const loadCQTPrice = async () => {
      const priceData = await fetchCQTPrice();
      setCqtPrice(priceData);
    };

    loadCQTPrice();

    // Update price every 30 seconds
    const priceInterval = setInterval(loadCQTPrice, 30000);

    return () => clearInterval(priceInterval);
  }, []);

  const creatorWallet = walletManager.getCreatorWallet();
  const ownerWallet = walletManager.getOwnerWallet();
  const multisigWallet = walletManager.getMultisigWallet();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            CryptoQuest Platform
          </h1>
          <p className="text-slate-300">
            Comprehensive Web3 Gaming & DeFi Ecosystem with AI Orchestration
          </p>
        </div>

        {/* Real-time CQT Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">CQT Price</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">${cqtPrice.price}</div>
              <p className={`text-xs ${parseFloat(cqtPrice.priceChange24h) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {parseFloat(cqtPrice.priceChange24h) >= 0 ? '+' : ''}{cqtPrice.priceChange24h}% 24h
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">24h Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">${parseInt(cqtPrice.volume24h).toLocaleString()}</div>
              <p className="text-xs text-slate-400">Across all DEXs</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Arbitrage Success</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">{realTimeData.arbitrage_success_rate}%</div>
              <p className="text-xs text-slate-400">94.7% success rate</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Security Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-400">{realTimeData.security_score}/100</div>
              <p className="text-xs text-slate-400">Enterprise grade</p>
            </CardContent>
          </Card>
        </div>

        {/* Wallet Management Section */}
        <Card className="bg-slate-800/50 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Wallet Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Creator Wallet */}
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-400 mb-2">Creator Wallet</h3>
                <p className="text-sm text-slate-300 mb-2">{creatorWallet?.address}</p>
                <Badge variant="outline" className="text-purple-400 border-purple-400">
                  Original Creator
                </Badge>
              </div>

              {/* Current Owner */}
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-400 mb-2">Current Owner</h3>
                <p className="text-sm text-slate-300 mb-2">{ownerWallet?.address}</p>
                <Badge variant="outline" className="text-green-400 border-green-400">
                  CQT Holder
                </Badge>
              </div>

              {/* Safe Multisig */}
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-400 mb-2">Safe Multisig</h3>
                <p className="text-sm text-slate-300 mb-2">{multisigWallet?.address}</p>
                <Badge variant="outline" className="text-blue-400 border-blue-400">
                  Multi-Signature
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contract Information */}
        <Card className="bg-slate-800/50 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Database className="h-5 w-5" />
              Live Contract Addresses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-lg font-semibold text-purple-400 mb-2">Polygon Network</h4>
                <div className="bg-slate-700/50 p-3 rounded">
                  <p className="text-sm text-slate-300">CQT Contract:</p>
                  <p className="text-xs font-mono text-green-400">{CQT_CONTRACTS.polygon.address}</p>
                  <a 
                    href={CQT_CONTRACTS.polygon.explorer}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-400 hover:text-blue-300"
                  >
                    View on PolygonScan →
                  </a>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-blue-400 mb-2">Base Network</h4>
                <div className="bg-slate-700/50 p-3 rounded">
                  <p className="text-sm text-slate-300">CQT Contract:</p>
                  <p className="text-xs font-mono text-green-400">{CQT_CONTRACTS.base.address}</p>
                  <a 
                    href={CQT_CONTRACTS.base.explorer}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-400 hover:text-blue-300"
                  >
                    View on BaseScan →
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 bg-slate-800/50 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="gaming" className="data-[state=active]:bg-purple-600">
              <Gamepad2 className="h-4 w-4 mr-2" />
              Gaming
            </TabsTrigger>
            <TabsTrigger value="ai-agent" className="data-[state=active]:bg-purple-600">
              <Bot className="h-4 w-4 mr-2" />
              AI Agent
            </TabsTrigger>
            <TabsTrigger value="arbitrage" className="data-[state=active]:bg-purple-600">
              <TrendingUp className="h-4 w-4 mr-2" />
              Arbitrage
            </TabsTrigger>
            <TabsTrigger value="onramper" className="data-[state=active]:bg-purple-600">
              <DollarSign className="h-4 w-4 mr-2" />
              OnRamper
            </TabsTrigger>
            <TabsTrigger value="superpay" className="data-[state=active]:bg-purple-600">
              <Zap className="h-4 w-4 mr-2" />
              SuperPay
            </TabsTrigger>
            <TabsTrigger value="admin" className="data-[state=active]:bg-purple-600">
              <Settings className="h-4 w-4 mr-2" />
              Admin
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Platform Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Active Liquidity Pools</span>
                      <span className="text-green-400 font-semibold">{realTimeData.active_liquidity_pools}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Cross-Chain Bridges</span>
                      <span className="text-blue-400 font-semibold">{realTimeData.cross_chain_bridges}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">AI Decisions (24h)</span>
                      <span className="text-purple-400 font-semibold">{realTimeData.ai_decisions_24h}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">System Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-300">Security Score</span>
                        <span className="text-orange-400">{realTimeData.security_score}%</span>
                      </div>
                      <Progress value={realTimeData.security_score} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-300">Arbitrage Success</span>
                        <span className="text-green-400">{realTimeData.arbitrage_success_rate}%</span>
                      </div>
                      <Progress value={realTimeData.arbitrage_success_rate} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="gaming">
            <GameDashboard />
          </TabsContent>

          <TabsContent value="ai-agent">
            <AgentDashboard />
          </TabsContent>

          <TabsContent value="arbitrage">
            <ArbitrageDashboard />
          </TabsContent>

          <TabsContent value="onramper">
            <OnRamperDashboard />
          </TabsContent>

          <TabsContent value="superpay">
            <SuperPayDashboard />
          </TabsContent>

          <TabsContent value="admin">
            <div className="space-y-6">
              <SmartContractManager />
              <SafeMultisigSetup />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}