import React, { useState } from 'react';
import { GameDashboard } from '@/components/game/GameDashboard';
import { ArbitrageDashboard } from '@/components/arbitrage/ArbitrageDashboard';
import { AgentDashboard } from '@/components/agentkit/AgentDashboard';
import { SuperPayDashboard } from '@/components/superpay/SuperPayDashboard';
import { RTXDashboard } from '@/components/nvidia/RTXDashboard';
import { DeFiDashboard } from '@/components/defi/DeFiDashboard';
import { Bot, CreditCard, Gamepad2, TrendingUp, Sparkles, Coins } from 'lucide-react';
import { Toaster } from "@/components/ui/toaster";

// Simplified AgentKit Component
function AgentKitDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            CryptoQuest AI Agent
          </h1>
          <p className="text-xl text-gray-300">AI-powered blockchain gaming assistant</p>
        </div>
        
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Available Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {['Transfer Tokens', 'Get Balance', 'Deploy Contract', 'Stake Tokens', 'Create Guild', 'Quest Management'].map((action) => (
              <button
                key={action}
                className="p-4 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg text-white text-left transition-colors"
              >
                {action}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
            <div className="text-2xl font-bold text-purple-400">247</div>
            <div className="text-sm text-gray-300">Actions Executed</div>
          </div>
          <div className="text-center p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
            <div className="text-2xl font-bold text-green-400">98.5%</div>
            <div className="text-sm text-gray-300">Success Rate</div>
          </div>
          <div className="text-center p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
            <div className="text-2xl font-bold text-blue-400">1.2s</div>
            <div className="text-sm text-gray-300">Avg Response Time</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simplified SuperPay Component
function SuperPayDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            SuperPay
          </h1>
          <p className="text-xl text-gray-300">Seamless crypto payments for gaming</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
            <div className="text-2xl font-bold text-blue-400">2.456 ETH</div>
            <div className="text-sm text-gray-300">Wallet Balance</div>
          </div>
          <div className="text-center p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
            <div className="text-2xl font-bold text-green-400">$6,140</div>
            <div className="text-sm text-gray-300">USD Value</div>
          </div>
          <div className="text-center p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
            <div className="text-2xl font-bold text-purple-400">0x742d...1234</div>
            <div className="text-sm text-gray-300">Address</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">Send Payment</h3>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Recipient Address (0x...)" 
                className="w-full p-3 bg-slate-700 border border-slate-600 rounded text-white"
              />
              <div className="flex gap-2">
                <input 
                  type="number" 
                  placeholder="Amount" 
                  className="flex-1 p-3 bg-slate-700 border border-slate-600 rounded text-white"
                />
                <select className="p-3 bg-slate-700 border border-slate-600 rounded text-white">
                  <option>ETH</option>
                  <option>USDC</option>
                  <option>CQT</option>
                </select>
              </div>
              <button className="w-full p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded text-white font-medium hover:from-blue-600 hover:to-purple-600 transition-colors">
                Send Payment
              </button>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">Gaming Payments</h3>
            <div className="space-y-3">
              <button className="w-full p-3 bg-slate-700 hover:bg-slate-600 rounded text-white text-left transition-colors">
                <span className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded mr-3 inline-block"></span>
                Legendary Sword - 0.5 ETH
              </button>
              <button className="w-full p-3 bg-slate-700 hover:bg-slate-600 rounded text-white text-left transition-colors">
                <span className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded mr-3 inline-block"></span>
                Magic Armor Set - 100 CQT
              </button>
              <button className="w-full p-3 bg-slate-700 hover:bg-slate-600 rounded text-white text-left transition-colors">
                <span className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-500 rounded mr-3 inline-block"></span>
                Guild Membership - 0.2 ETH
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [activeView, setActiveView] = useState<'game' | 'agent' | 'superpay' | 'arbitrage' | 'rtx' | 'defi'>('game');

  const renderView = () => {
    switch (activeView) {
      case 'agent':
        return <AgentKitDemo />;
      case 'superpay':
        return <SuperPayDemo />;
      case 'arbitrage':
        return <ArbitrageDashboard />;
      case 'rtx':
        return <RTXDashboard />;
      case 'defi':
        return <DeFiDashboard />;
      default:
        return <GameDashboard />;
    }
  };

  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex gap-2 bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-full p-2">
          <button
            onClick={() => setActiveView('game')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeView === 'game' 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            Game Hub
          </button>
          <button
            onClick={() => setActiveView('agent')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
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
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeView === 'superpay' 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            SuperPay
          </button>
          <button
            onClick={() => setActiveView('arbitrage')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeView === 'arbitrage' 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            CQT Bot
          </button>
          <button
            onClick={() => setActiveView('rtx')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeView === 'rtx' 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            RTX Gaming
          </button>
          <button
            onClick={() => setActiveView('defi')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeView === 'defi' 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Coins className="w-4 h-4" />
            DeFi Hub
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
  );
}