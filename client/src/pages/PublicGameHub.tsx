import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Gamepad2, 
  Users, 
  Trophy, 
  Coins, 
  Play, 
  Star,
  Zap,
  Crown,
  Sword,
  Shield,
  Gem
} from 'lucide-react';

export function PublicGameHub() {
  const [playerStats, setPlayerStats] = useState({
    level: 12,
    cqtBalance: 1250.75,
    wins: 47,
    totalPlayers: 2847
  });

  const [gameFeatures] = useState([
    {
      name: 'MMORPG Adventure',
      icon: <Sword className="w-6 h-6" />,
      description: 'Explore the CryptoQuest universe with advanced AI NPCs',
      players: 1247,
      difficulty: 'Medium',
      rewards: '50-200 CQT'
    },
    {
      name: 'NFT Card Battles',
      icon: <Shield className="w-6 h-6" />,
      description: 'Strategic card game with collectible NFTs',
      players: 892,
      difficulty: 'Easy',
      rewards: '25-100 CQT'
    },
    {
      name: 'DeFi Trading Game',
      icon: <Trophy className="w-6 h-6" />,
      description: 'Learn DeFi trading in a risk-free environment',
      players: 654,
      difficulty: 'Hard',
      rewards: '100-500 CQT'
    },
    {
      name: 'Holographic Racing',
      icon: <Zap className="w-6 h-6" />,
      description: 'AR/VR racing with holographic effects',
      players: 423,
      difficulty: 'Medium',
      rewards: '75-250 CQT'
    }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full">
            <Gamepad2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            CryptoQuest Gaming
          </h1>
          <p className="text-xl text-gray-300">
            NVIDIA RTX Cloud • Holographic Engine • AI NPCs • Cross-Chain Quests
          </p>
        </div>

        {/* Player Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6 text-center">
              <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{playerStats.level}</div>
              <div className="text-sm text-gray-400">Player Level</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6 text-center">
              <Gem className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{playerStats.cqtBalance.toLocaleString()}</div>
              <div className="text-sm text-gray-400">CQT Balance</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6 text-center">
              <Trophy className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{playerStats.wins}</div>
              <div className="text-sm text-gray-400">Total Wins</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{playerStats.totalPlayers.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Active Players</div>
            </CardContent>
          </Card>
        </div>

        {/* Game Features */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Play className="w-5 h-5" />
              Available Games
            </CardTitle>
            <p className="text-gray-400">Choose your adventure and start earning CQT tokens</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {gameFeatures.map((game, index) => (
                <div key={index} className="p-6 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                        {game.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{game.name}</h3>
                        <p className="text-sm text-gray-400">{game.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-gray-400">
                        <Users className="w-4 h-4 inline mr-1" />
                        {game.players} playing
                      </div>
                      <Badge className={
                        game.difficulty === 'Easy' ? 'bg-green-600' :
                        game.difficulty === 'Medium' ? 'bg-yellow-600' : 'bg-red-600'
                      }>
                        {game.difficulty}
                      </Badge>
                    </div>
                    <div className="text-sm text-green-400 font-medium">
                      <Coins className="w-4 h-4 inline mr-1" />
                      {game.rewards}
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                    <Play className="w-4 h-4 mr-2" />
                    Play Now
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Star className="w-5 h-5" />
              Top Players This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { rank: 1, name: 'CryptoMaster', score: 125400, reward: '500 CQT' },
                { rank: 2, name: 'QuestHero', score: 98750, reward: '300 CQT' },
                { rank: 3, name: 'TokenSlayer', score: 87650, reward: '200 CQT' },
                { rank: 4, name: 'DeFiWarrior', score: 76540, reward: '150 CQT' },
                { rank: 5, name: 'NFTCollector', score: 65890, reward: '100 CQT' }
              ].map((player) => (
                <div key={player.rank} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                      player.rank === 1 ? 'bg-yellow-500' :
                      player.rank === 2 ? 'bg-gray-400' :
                      player.rank === 3 ? 'bg-orange-500' : 'bg-slate-600'
                    }`}>
                      {player.rank}
                    </div>
                    <div>
                      <div className="font-medium text-white">{player.name}</div>
                      <div className="text-sm text-gray-400">{player.score.toLocaleString()} points</div>
                    </div>
                  </div>
                  <Badge className="bg-green-600 text-white">
                    {player.reward}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}