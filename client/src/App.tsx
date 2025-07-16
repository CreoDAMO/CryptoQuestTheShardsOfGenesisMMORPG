
import React, { useState } from 'react';
import { GameDashboard } from '@/components/game/GameDashboard';
import { EnhancedArbitrageDashboard } from '@/components/arbitrage/EnhancedArbitrageDashboard';
import { AgentDashboard } from '@/components/agentkit/AgentDashboard';
import { OnRamperComponent } from '@/components/coinbase/OnRamperComponent';
import { UnifiedNVIDIAHolographicDashboard } from '@/components/nvidia/UnifiedNVIDIAHolographicDashboard';
import { UnifiedDeFiDashboard } from '@/components/defi/UnifiedDeFiDashboard';
import { WhitePaperDashboard } from '@/components/whitepaper/WhitePaperDashboard';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { SECComplianceDashboard } from '@/components/compliance/SECComplianceDashboard';
import { AIControlCenter } from '@/components/ai/AIControlCenter';
import { CommunityAIChat } from '@/components/ai/CommunityAIChat';
import { MobileOptimizedLayout } from '@/components/mobile/MobileOptimizedLayout';
import { CryptoQuestHeaderLogo } from '@/components/brand/CryptoQuestLogo';
import { MetaMaskIntegration } from '@/components/wallet/MetaMaskIntegration';
import { BlockchainDashboard } from '@/components/blockchain/BlockchainDashboard';
import { UnifiedIntelligenceDashboard } from '@/components/enhanced/UnifiedIntelligenceDashboard';
import { PublicGameHub } from '@/pages/PublicGameHub';
import WalletManagement from '@/pages/WalletManagement';
import { SuperPayDashboard } from '@/components/superpay/SuperPayDashboard';
import { Bot, CreditCard, Gamepad2, TrendingUp, Sparkles, Coins, BookOpen, Eye, Shield, Layers, Wallet, DollarSign, Database, Brain, Users, Settings, Zap } from 'lucide-react';
import { Toaster } from "@/components/ui/toaster";

// Enhanced AI Agent Component
function AgentKitDemo() {
  const [selectedModel, setSelectedModel] = useState('claude-4-sonnet');
  const [agentStatus, setAgentStatus] = useState('active');

  const aiModels = [
    { id: 'claude-4-sonnet', name: 'Claude 4 Sonnet', status: 'active', performance: 98 },
    { id: 'gpt-4o', name: 'GPT-4o', status: 'active', performance: 96 },
    { id: 'grok-3', name: 'Grok 3', status: 'active', performance: 94 },
    { id: 'deepseek-coder', name: 'DeepSeek Coder', status: 'active', performance: 92 },
    { id: 'nvidia-ace', name: 'NVIDIA ACE', status: 'active', performance: 89 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            CryptoQuest AI Agent Suite
          </h1>
          <p className="text-xl text-gray-300">Multi-AI powered blockchain gaming assistant</p>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-400">All 5 AI Models Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          {aiModels.map((model) => (
            <div key={model.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 text-center">
              <div className="text-sm font-medium text-white mb-2">{model.name}</div>
              <div className="text-xs text-gray-300 mb-2">Performance: {model.performance}%</div>
              <div className={`w-2 h-2 rounded-full mx-auto ${
                model.status === 'active' ? 'bg-green-400' : 'bg-red-400'
              }`}></div>
            </div>
          ))}
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Available Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              'Transfer CQT Tokens', 
              'Get Wallet Balance', 
              'Deploy Smart Contract', 
              'Stake CQT Tokens', 
              'Create Gaming Guild', 
              'Quest Management',
              'Arbitrage Trading',
              'LP Management',
              'MultiSig Operations',
              'AI Miner Control',
              'Contract Auditing',
              'Paymaster Operations'
            ].map((action) => (
              <button
                key={action}
                className="p-4 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg text-white text-left transition-colors"
              >
                {action}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
            <div className="text-2xl font-bold text-purple-400">2,847</div>
            <div className="text-sm text-gray-300">Actions Executed</div>
          </div>
          <div className="text-center p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
            <div className="text-2xl font-bold text-green-400">99.2%</div>
            <div className="text-sm text-gray-300">Success Rate</div>
          </div>
          <div className="text-center p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
            <div className="text-2xl font-bold text-blue-400">0.8s</div>
            <div className="text-sm text-gray-300">Avg Response Time</div>
          </div>
          <div className="text-center p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
            <div className="text-2xl font-bold text-cyan-400">Live</div>
            <div className="text-sm text-gray-300">Contract Status</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced SuperPay Component
function SuperPayDemo() {
  const [walletConnected, setWalletConnected] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('metamask');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            SuperPay Gateway
          </h1>
          <p className="text-xl text-gray-300">Gasless payments with Paymaster integration</p>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-400">Connected to 0x67BF...3866</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
            <div className="text-2xl font-bold text-blue-400">156.7 CQT</div>
            <div className="text-sm text-gray-300">CQT Balance</div>
          </div>
          <div className="text-center p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
            <div className="text-2xl font-bold text-green-400">$12,840</div>
            <div className="text-sm text-gray-300">USD Value</div>
          </div>
          <div className="text-center p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
            <div className="text-2xl font-bold text-purple-400">MultiSig</div>
            <div className="text-sm text-gray-300">Wallet Type</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">Gaming Payments</h3>
            <div className="space-y-3">
              <button className="w-full p-3 bg-slate-700 hover:bg-slate-600 rounded text-white text-left transition-colors">
                <span className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded mr-3 inline-block"></span>
                Legendary CQT Sword - 50 CQT
              </button>
              <button className="w-full p-3 bg-slate-700 hover:bg-slate-600 rounded text-white text-left transition-colors">
                <span className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded mr-3 inline-block"></span>
                NFT Armor Set - 25 CQT
              </button>
              <button className="w-full p-3 bg-slate-700 hover:bg-slate-600 rounded text-white text-left transition-colors">
                <span className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-500 rounded mr-3 inline-block"></span>
                Premium Guild Pass - 10 CQT
              </button>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">Paymaster Features</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Gasless Transactions</span>
                <span className="text-green-400">✓ Enabled</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Auto-Approval</span>
                <span className="text-green-400">✓ Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Cross-Chain</span>
                <span className="text-green-400">✓ Supported</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [activeView, setActiveView] = useState<'whitepaper' | 'game' | 'public-game' | 'agent' | 'superpay' | 'onramper' | 'arbitrage' | 'nvidia' | 'defi' | 'holographic' | 'admin' | 'wallet' | 'blockchain' | 'unified' | 'walletmgmt' | 'ai-center' | 'compliance'>('whitepaper');

  const renderView = () => {
    switch (activeView) {
      case 'agent':
        return <AgentKitDemo />;
      case 'superpay':
        return <SuperPayDemo />;
      case 'onramper':
        return <OnRamperComponent />;
      case 'arbitrage':
        return <EnhancedArbitrageDashboard />;
      case 'whitepaper':
        return <WhitePaperDashboard />;
      case 'nvidia':
        return <UnifiedNVIDIAHolographicDashboard />;
      case 'defi':
        return <UnifiedDeFiDashboard />;
      case 'wallet':
        return <MetaMaskIntegration />;
      case 'walletmgmt':
        return <WalletManagement />;
      case 'blockchain':
        return <BlockchainDashboard />;
      case 'unified':
        return <UnifiedIntelligenceDashboard />;
      case 'ai-center':
        return <AIControlCenter />;
      case 'compliance':
        return <SECComplianceDashboard />;
      case 'public-game':
        return <PublicGameHub />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <GameDashboard />;
    }
  };

  return (
    <MobileOptimizedLayout currentView={activeView} onViewChange={setActiveView}>
      <main className="min-h-screen">
        {/* Logo Header - Always visible */}
        <div className="fixed top-4 left-4 z-50">
          <CryptoQuestHeaderLogo />
        </div>

        {/* Live Status Indicator */}
        <div className="fixed top-4 right-4 z-50">
          <div className="flex items-center gap-2 bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-full px-4 py-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-400 font-medium">LIVE CONTRACTS</span>
          </div>
        </div>

        {/* Navigation - Desktop only */}
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 hidden md:block">
          <div className="flex flex-wrap gap-2 bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-full p-2 max-w-6xl">
            <button
              onClick={() => setActiveView('whitepaper')}
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                activeView === 'whitepaper' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              White Paper
            </button>
            <button
              onClick={() => setActiveView('defi')}
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                activeView === 'defi' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              DeFi Hub
            </button>
            <button
              onClick={() => setActiveView('public-game')}
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                activeView === 'public-game' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              Public Game
            </button>
            <button
              onClick={() => setActiveView('agent')}
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                activeView === 'agent' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Bot className="w-4 h-4" />
              AI Agent
            </button>
            <button
              onClick={() => setActiveView('superpay')}
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                activeView === 'superpay' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Zap className="w-4 h-4" />
              SuperPay
            </button>
            <button
              onClick={() => setActiveView('onramper')}
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                activeView === 'onramper' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              OnRamper
            </button>
            <button
              onClick={() => setActiveView('arbitrage')}
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                activeView === 'arbitrage' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              CQT Bot
            </button>
            <button
              onClick={() => setActiveView('nvidia')}
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                activeView === 'nvidia' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              NVIDIA + Holo
            </button>
            <button
              onClick={() => setActiveView('wallet')}
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                activeView === 'wallet' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Wallet className="w-4 h-4" />
              MetaMask
            </button>
            <button
              onClick={() => setActiveView('walletmgmt')}
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                activeView === 'walletmgmt' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" />
              Multi-Wallet
            </button>
            <button
              onClick={() => setActiveView('unified')}
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                activeView === 'unified' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Brain className="w-4 h-4" />
              Unified Hub
            </button>
            <button
              onClick={() => setActiveView('blockchain')}
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                activeView === 'blockchain' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Database className="w-4 h-4" />
              Blockchain
            </button>
            <button
              onClick={() => setActiveView('admin')}
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                activeView === 'admin' 
                  ? 'bg-red-600 text-white' 
                  : 'text-gray-300 hover:bg-red-700 hover:text-white'
              }`}
            >
              <Shield className="w-4 h-4" />
              Admin Center
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10">
          {renderView()}
        </div>

        {/* Toast notifications */}
        <Toaster />
      </main>
    </MobileOptimizedLayout>
  );
}
