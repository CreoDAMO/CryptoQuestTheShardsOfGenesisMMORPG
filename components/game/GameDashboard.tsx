'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Sword, 
  Users, 
  Trophy, 
  Coins, 
  Settings, 
  Zap, 
  Globe,
  Gamepad2,
  Sparkles,
  Activity,
  TrendingUp
} from 'lucide-react';

interface GameStats {
  level: number;
  experience: number;
  health: number;
  mana: number;
  gold: number;
  tokenBalance: number;
  guild: string;
  wins: number;
  losses: number;
  rank: string;
}

export function GameDashboard() {
  const [gameStats, setGameStats] = useState<GameStats>({
    level: 47,
    experience: 89234,
    health: 850,
    mana: 1200,
    gold: 15420,
    tokenBalance: 2847.5,
    guild: 'Shadow Guardians',
    wins: 134,
    losses: 23,
    rank: 'Diamond II'
  });

  const [isConnected, setIsConnected] = useState(false);
  const [currentTab, setCurrentTab] = useState('overview');

  useEffect(() => {
    const interval = setInterval(() => {
      setGameStats(prev => ({
        ...prev,
        experience: prev.experience + Math.floor(Math.random() * 100),
        tokenBalance: prev.tokenBalance + Math.random() * 10,
        gold: prev.gold + Math.floor(Math.random() * 50)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'character', label: 'Character', icon: Shield },
    { id: 'guild', label: 'Guild', icon: Users },
    { id: 'marketplace', label: 'Marketplace', icon: Coins },
    { id: 'tournaments', label: 'Tournaments', icon: Trophy },
    { id: 'defi', label: 'DeFi Hub', icon: TrendingUp },
    { id: 'agglayer', label: 'AggLayer', icon: Globe },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex h-screen">
        {/* Sidebar */}
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-64 bg-slate-900/50 backdrop-blur-xl border-r border-purple-500/20 p-4"
        >
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  CryptoQuest
                </h1>
                <p className="text-sm text-purple-300">The Shards of Genesis</p>
              </div>
            </div>
            
            <button 
              onClick={() => setIsConnected(!isConnected)}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                isConnected 
                  ? 'bg-green-600/30 text-green-300 border border-green-500/30' 
                  : 'bg-purple-600/30 text-purple-300 border border-purple-500/30 hover:bg-purple-600/50'
              }`}
            >
              {isConnected ? 'Connected' : 'Connect Wallet'}
            </button>
          </div>

          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  currentTab === tab.id
                    ? 'bg-purple-600/30 text-purple-300 shadow-lg shadow-purple-500/20'
                    : 'text-gray-400 hover:text-purple-300 hover:bg-purple-600/10'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </motion.div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-slate-900/30 backdrop-blur-xl border-b border-purple-500/20 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent capitalize">
                  {currentTab}
                </h2>
                <p className="text-purple-300 text-sm mt-1">
                  {currentTab === 'overview' && 'Command center for your gaming empire'}
                  {currentTab === 'character' && 'Manage your character stats and equipment'}
                  {currentTab === 'guild' && 'Connect with your guild and participate in raids'}
                  {currentTab === 'marketplace' && 'Trade items and earn rewards'}
                  {currentTab === 'tournaments' && 'Compete in global tournaments'}
                  {currentTab === 'defi' && 'Stake, farm, and earn with DeFi protocols'}
                  {currentTab === 'agglayer' && 'Cross-chain bridge and unified liquidity'}
                  {currentTab === 'settings' && 'Customize your gaming experience'}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-purple-600/20 px-4 py-2 rounded-lg">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-medium">{gameStats.tokenBalance.toFixed(1)} CQT</span>
                </div>
                <div className="flex items-center gap-2 bg-yellow-600/20 px-4 py-2 rounded-lg">
                  <Coins className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-medium">{gameStats.gold.toLocaleString()} Gold</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {currentTab === 'overview' && (
              <div className="space-y-6">
                {/* Gaming HUD */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 rounded-lg p-6"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Shield className="w-6 h-6 text-purple-400" />
                      <h3 className="text-lg font-bold text-purple-300">Level</h3>
                    </div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                      {gameStats.level}
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-slate-900/50 backdrop-blur-xl border border-green-500/20 rounded-lg p-6"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Trophy className="w-6 h-6 text-green-400" />
                      <h3 className="text-lg font-bold text-green-300">Rank</h3>
                    </div>
                    <div className="text-xl font-bold text-green-400">
                      {gameStats.rank}
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="bg-slate-900/50 backdrop-blur-xl border border-yellow-500/20 rounded-lg p-6"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Coins className="w-6 h-6 text-yellow-400" />
                      <h3 className="text-lg font-bold text-yellow-300">Gold</h3>
                    </div>
                    <div className="text-xl font-bold text-yellow-400">
                      {gameStats.gold.toLocaleString()}
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="bg-slate-900/50 backdrop-blur-xl border border-cyan-500/20 rounded-lg p-6"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Zap className="w-6 h-6 text-cyan-400" />
                      <h3 className="text-lg font-bold text-cyan-300">CQT Tokens</h3>
                    </div>
                    <div className="text-xl font-bold text-cyan-400">
                      {gameStats.tokenBalance.toFixed(1)}
                    </div>
                  </motion.div>
                </div>

                {/* Experience Progress */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 rounded-lg p-6"
                >
                  <h3 className="text-xl font-bold text-purple-300 mb-4">Experience Progress</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Current XP: {gameStats.experience.toLocaleString()}</span>
                      <span>Next Level: {((gameStats.level + 1) * 1000).toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-cyan-500 h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${(gameStats.experience % 1000) / 10}%` }}
                      ></div>
                    </div>
                  </div>
                </motion.div>

                {/* Live Metrics */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 rounded-lg p-6"
                >
                  <h3 className="text-xl font-bold text-purple-300 mb-4">Live Metrics</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-400">{gameStats.health}</div>
                      <div className="text-sm text-red-300">Health</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">{gameStats.mana}</div>
                      <div className="text-sm text-blue-300">Mana</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">{gameStats.wins}</div>
                      <div className="text-sm text-green-300">Wins</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-400">{gameStats.losses}</div>
                      <div className="text-sm text-orange-300">Losses</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Other tabs content */}
            {currentTab !== 'overview' && (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Sparkles className="w-16 h-16 mx-auto mb-4 text-purple-400 opacity-50" />
                  <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                    {currentTab.charAt(0).toUpperCase() + currentTab.slice(1)} Module
                  </h3>
                  <p className="text-purple-300 mb-4">Advanced gaming features coming soon</p>
                  <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-200">
                    Explore Features
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}