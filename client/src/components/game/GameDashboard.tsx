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
    // Mock wallet connection check
    setIsConnected(true);
  }, []);

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/20 rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Character Stats</h3>
          <Sword className="w-5 h-5 text-purple-400" />
        </div>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-300">Level</span>
            <span className="text-white font-bold">{gameStats.level}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Experience</span>
            <span className="text-white font-bold">{gameStats.experience.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Health</span>
            <span className="text-green-400 font-bold">{gameStats.health}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Mana</span>
            <span className="text-blue-400 font-bold">{gameStats.mana}</span>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-emerald-900/30 to-teal-900/30 border border-emerald-500/20 rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Assets</h3>
          <Coins className="w-5 h-5 text-emerald-400" />
        </div>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-300">Gold</span>
            <span className="text-yellow-400 font-bold">{gameStats.gold.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">CQT Tokens</span>
            <span className="text-emerald-400 font-bold">{gameStats.tokenBalance}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">USD Value</span>
            <span className="text-white font-bold">${(gameStats.tokenBalance * 1.23).toFixed(2)}</span>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-rose-900/30 to-pink-900/30 border border-rose-500/20 rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Guild & Ranking</h3>
          <Trophy className="w-5 h-5 text-rose-400" />
        </div>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-300">Guild</span>
            <span className="text-white font-bold">{gameStats.guild}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Rank</span>
            <span className="text-rose-400 font-bold">{gameStats.rank}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">W/L Ratio</span>
            <span className="text-white font-bold">{(gameStats.wins / gameStats.losses).toFixed(1)}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const renderQuests = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Active Quests</h2>
      <div className="grid gap-4">
        {[
          { title: 'Dragon Lair Exploration', reward: '500 XP + 100 CQT', difficulty: 'Hard', progress: 75 },
          { title: 'Ancient Artifact Collection', reward: '300 XP + 50 CQT', difficulty: 'Medium', progress: 45 },
          { title: 'Guild Tournament Victory', reward: '1000 XP + 200 CQT', difficulty: 'Expert', progress: 20 }
        ].map((quest, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-800/50 border border-slate-700 rounded-lg p-4"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-white font-semibold">{quest.title}</h3>
              <span className={`px-2 py-1 rounded text-xs ${
                quest.difficulty === 'Hard' ? 'bg-orange-500/20 text-orange-400' :
                quest.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {quest.difficulty}
              </span>
            </div>
            <p className="text-gray-300 text-sm mb-3">Reward: {quest.reward}</p>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${quest.progress}%` }}
              />
            </div>
            <p className="text-right text-xs text-gray-400 mt-1">{quest.progress}% Complete</p>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full">
            <Gamepad2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            CryptoQuest Gaming Hub
          </h1>
          <p className="text-xl text-gray-300">The ultimate blockchain MMORPG experience</p>
        </motion.div>

        {/* Wallet Status */}
        <div className="flex justify-center">
          <div className={`px-6 py-3 rounded-full border ${
            isConnected 
              ? 'bg-green-500/20 border-green-500/50 text-green-400' 
              : 'bg-red-500/20 border-red-500/50 text-red-400'
          }`}>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
              {isConnected ? 'Wallet Connected' : 'Wallet Disconnected'}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center">
          <div className="flex bg-slate-800/50 border border-slate-700 rounded-lg p-1">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'quests', label: 'Quests', icon: Scroll },
              { id: 'inventory', label: 'Inventory', icon: Package },
              { id: 'trading', label: 'Trading', icon: TrendingUp }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setCurrentTab(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-colors ${
                  currentTab === id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="mt-8">
          {currentTab === 'overview' && renderOverview()}
          {currentTab === 'quests' && renderQuests()}
          {currentTab === 'inventory' && (
            <div className="text-center text-gray-400">
              <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Inventory system coming soon!</p>
            </div>
          )}
          {currentTab === 'trading' && (
            <div className="text-center text-gray-400">
              <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Trading features coming soon!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Fix missing import
const Scroll = () => <div>📜</div>;
const Package = () => <div>📦</div>;