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
  TrendingUp,
  Play,
  Pause,
  Target,
  Star,
  Crown,
  Gem,
  Flame,
  Eye,
  RefreshCw
} from 'lucide-react';
import { 
  StreamlitHeader, 
  StreamlitControls, 
  StreamlitMetricCard, 
  StreamlitChartContainer,
  StreamlitStatus,
  StreamlitProgress,
  useStreamlit
} from '@/components/shared/StreamlitCore';

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
  const [realTimeUpdates, setRealTimeUpdates] = useState(true);
  const [gameActive, setGameActive] = useState(false);
  
  const { config, setConfig, fragments, metrics, addFragment, toggleFragment } = useStreamlit({
    realTimeEnabled: true,
    autoRefresh: true,
    refreshInterval: 3000
  });

  useEffect(() => {
    // Mock wallet connection check
    setIsConnected(true);
    
    // Initialize Streamlit fragments
    addFragment({
      id: 'character-stats',
      title: 'Character',
      component: <></>,
      dependencies: ['gameStats'],
      updateFrequency: 5000,
      priority: 'high',
      status: 'active'
    });
    
    addFragment({
      id: 'guild-info',
      title: 'Guild',
      component: <></>,
      dependencies: ['guild'],
      updateFrequency: 10000,
      priority: 'medium',
      status: 'active'
    });
    
    addFragment({
      id: 'marketplace',
      title: 'Market',
      component: <></>,
      dependencies: ['economy'],
      updateFrequency: 3000,
      priority: 'high',
      status: 'active'
    });
    
    addFragment({
      id: 'achievements',
      title: 'Achievements',
      component: <></>,
      dependencies: ['progress'],
      updateFrequency: 30000,
      priority: 'low',
      status: 'active'
    });
  }, []);

  // Real-time updates
  useEffect(() => {
    if (!config.realTimeEnabled) return;
    
    const interval = setInterval(() => {
      setGameStats(prev => ({
        ...prev,
        experience: prev.experience + Math.floor(Math.random() * 100),
        gold: prev.gold + Math.floor(Math.random() * 50),
        tokenBalance: prev.tokenBalance + (Math.random() * 5)
      }));
    }, config.refreshInterval);

    return () => clearInterval(interval);
  }, [config.realTimeEnabled, config.refreshInterval]);

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Streamlit Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StreamlitMetricCard
          title="Character Level"
          value={gameStats.level}
          change={`+${Math.floor(Math.random() * 3)} today`}
          icon={<Crown className="w-5 h-5" />}
          trend="up"
        />
        <StreamlitMetricCard
          title="Experience Points"
          value={gameStats.experience.toLocaleString()}
          change={`+${Math.floor(Math.random() * 500)} XP/hr`}
          icon={<Star className="w-5 h-5" />}
          trend="up"
        />
        <StreamlitMetricCard
          title="CQT Balance"
          value={gameStats.tokenBalance.toFixed(2)}
          change={`+${(Math.random() * 10).toFixed(1)}%`}
          icon={<Coins className="w-5 h-5" />}
          trend="up"
        />
        <StreamlitMetricCard
          title="Guild Rank"
          value={gameStats.rank}
          change="↑ 2 positions"
          icon={<Trophy className="w-5 h-5" />}
          trend="up"
        />
      </div>

      {/* Enhanced Character Stats */}
      <StreamlitChartContainer title="Character Status" controls={
        <div className="flex gap-2">
          <button
            onClick={() => setGameActive(!gameActive)}
            className={`p-2 rounded-lg ${gameActive ? 'bg-green-600' : 'bg-gray-600'}`}
          >
            {gameActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setRealTimeUpdates(!realTimeUpdates)}
            className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      }>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <StreamlitProgress
              value={gameStats.health}
              max={1000}
              label="Health"
              color="green"
            />
            <StreamlitProgress
              value={gameStats.mana}
              max={1500}
              label="Mana"
              color="blue"
            />
            <StreamlitProgress
              value={gameStats.experience % 1000}
              max={1000}
              label="Experience to Next Level"
              color="purple"
            />
          </div>
          <div className="space-y-4">
            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300">Combat Stats</span>
                <Sword className="w-4 h-4 text-red-400" />
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-center">
                  <div className="text-green-400 font-bold">{gameStats.wins}</div>
                  <div className="text-gray-400">Wins</div>
                </div>
                <div className="text-center">
                  <div className="text-red-400 font-bold">{gameStats.losses}</div>
                  <div className="text-gray-400">Losses</div>
                </div>
              </div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300">Guild: {gameStats.guild}</span>
                <Users className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-sm text-gray-300">
                Active Members: 247 • Rank: #12
              </div>
            </div>
          </div>
        </div>
      </StreamlitChartContainer>

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
        <StreamlitHeader
          title="CryptoQuest Gaming Hub"
          subtitle="Advanced Blockchain MMORPG Dashboard with Real-time Analytics"
          icon={<Gamepad2 className="w-8 h-8 text-purple-500" />}
          status={gameActive ? 'active' : 'paused'}
          metrics={metrics}
        />

        <StreamlitControls
          config={config}
          onConfigChange={setConfig}
          fragments={fragments}
          onFragmentToggle={toggleFragment}
        />

        {!isConnected ? (
          <StreamlitStatus
            status="warning"
            message="Wallet Connection Required"
            details="Connect your MetaMask wallet to access full gaming features"
          />
        ) : (
          <StreamlitStatus
            status="success"
            message="Connected to Polygon Network"
            details="All gaming features are available"
          />
        )}

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