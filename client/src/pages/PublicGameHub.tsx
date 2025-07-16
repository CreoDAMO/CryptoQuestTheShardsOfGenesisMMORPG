
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Gamepad2, Zap, Users, Trophy, Shield, Coins, Sparkles, Bot } from 'lucide-react';

interface GameStats {
  level: number;
  experience: number;
  cqtBalance: number;
  nftsOwned: number;
  guildRank: string;
}

export function PublicGameHub() {
  const [isConnected, setIsConnected] = useState(false);
  const [gameStats, setGameStats] = useState<GameStats>({
    level: 1,
    experience: 0,
    cqtBalance: 0,
    nftsOwned: 0,
    guildRank: 'Novice'
  });

  const connectWallet = async () => {
    // Simulate wallet connection
    setIsConnected(true);
    setGameStats({
      level: 23,
      experience: 15420,
      cqtBalance: 156.7,
      nftsOwned: 12,
      guildRank: 'Elite Guardian'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 pt-24">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            CryptoQuest: The Shards of Genesis
          </h1>
          <p className="text-xl text-gray-300">
            Revolutionary blockchain MMORPG with AI-powered gameplay
          </p>
          {!isConnected ? (
            <Button 
              onClick={connectWallet}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg"
            >
              <Wallet className="w-5 h-5 mr-2" />
              Connect Wallet to Play
            </Button>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-medium">Connected & Ready to Play!</span>
            </div>
          )}
        </div>

        {/* Player Stats - Only show when connected */}
        {isConnected && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">{gameStats.level}</div>
                <div className="text-sm text-gray-400">Level</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">{gameStats.experience.toLocaleString()}</div>
                <div className="text-sm text-gray-400">XP</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-400">{gameStats.cqtBalance}</div>
                <div className="text-sm text-gray-400">CQT Balance</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400">{gameStats.nftsOwned}</div>
                <div className="text-sm text-gray-400">NFTs Owned</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4 text-center">
                <div className="text-lg font-bold text-orange-400">{gameStats.guildRank}</div>
                <div className="text-sm text-gray-400">Guild Rank</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Game Interface */}
        <Tabs defaultValue="quests" className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 bg-slate-800/50 border-slate-700">
            <TabsTrigger value="quests" className="data-[state=active]:bg-purple-600">
              <Trophy className="w-4 h-4 mr-2" />
              Quests
            </TabsTrigger>
            <TabsTrigger value="marketplace" className="data-[state=active]:bg-purple-600">
              <Coins className="w-4 h-4 mr-2" />
              Marketplace
            </TabsTrigger>
            <TabsTrigger value="guilds" className="data-[state=active]:bg-purple-600">
              <Users className="w-4 h-4 mr-2" />
              Guilds
            </TabsTrigger>
            <TabsTrigger value="arena" className="data-[state=active]:bg-purple-600">
              <Shield className="w-4 h-4 mr-2" />
              Arena
            </TabsTrigger>
            <TabsTrigger value="ai-companion" className="data-[state=active]:bg-purple-600">
              <Bot className="w-4 h-4 mr-2" />
              AI Companion
            </TabsTrigger>
          </TabsList>

          <TabsContent value="quests" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Active Quests
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isConnected ? (
                  <>
                    <div className="p-4 bg-slate-700/50 rounded-lg border border-purple-500/30">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-white font-medium">The Crystal Caverns</h3>
                        <Badge className="bg-purple-600">Epic</Badge>
                      </div>
                      <p className="text-gray-400 text-sm mb-3">
                        Explore the mysterious crystal caverns and recover the lost CQT shards.
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="text-green-400 text-sm">Progress: 75%</div>
                        <div className="text-yellow-400 text-sm">Reward: 50 CQT + Rare NFT</div>
                      </div>
                    </div>
                    <div className="p-4 bg-slate-700/50 rounded-lg border border-blue-500/30">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-white font-medium">Guild Tournament</h3>
                        <Badge className="bg-blue-600">PvP</Badge>
                      </div>
                      <p className="text-gray-400 text-sm mb-3">
                        Participate in the weekly guild tournament for massive rewards.
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="text-green-400 text-sm">Starts in: 2h 15m</div>
                        <div className="text-yellow-400 text-sm">Reward: 200 CQT Pool</div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400">Connect your wallet to view available quests</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="marketplace" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Coins className="w-5 h-5" />
                  NFT Marketplace
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isConnected ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-700/50 rounded-lg">
                      <div className="w-full h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded mb-3"></div>
                      <h4 className="text-white font-medium">Legendary Sword of CQT</h4>
                      <p className="text-gray-400 text-sm">+150 Attack Power</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-green-400">50 CQT</span>
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">Buy</Button>
                      </div>
                    </div>
                    <div className="p-4 bg-slate-700/50 rounded-lg">
                      <div className="w-full h-32 bg-gradient-to-br from-blue-500 to-cyan-500 rounded mb-3"></div>
                      <h4 className="text-white font-medium">Mystic Armor Set</h4>
                      <p className="text-gray-400 text-sm">+200 Defense Power</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-green-400">75 CQT</span>
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">Buy</Button>
                      </div>
                    </div>
                    <div className="p-4 bg-slate-700/50 rounded-lg">
                      <div className="w-full h-32 bg-gradient-to-br from-yellow-500 to-orange-500 rounded mb-3"></div>
                      <h4 className="text-white font-medium">Guild Banner NFT</h4>
                      <p className="text-gray-400 text-sm">Exclusive Guild Access</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-green-400">25 CQT</span>
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">Buy</Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400">Connect your wallet to access the marketplace</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="guilds" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Guild System
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isConnected ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-purple-900/30 rounded-lg border border-purple-500/50">
                      <h3 className="text-white font-medium mb-2">Your Guild: Crypto Legends</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold text-purple-400">47</div>
                          <div className="text-xs text-gray-400">Members</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-blue-400">#3</div>
                          <div className="text-xs text-gray-400">Global Rank</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-green-400">2,450</div>
                          <div className="text-xs text-gray-400">Guild CQT</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-yellow-400">Elite</div>
                          <div className="text-xs text-gray-400">Your Rank</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400">Connect your wallet to join or create a guild</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="arena" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Combat Arena
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isConnected ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button className="h-20 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700">
                        <div className="text-center">
                          <div className="text-lg font-bold">Quick Match</div>
                          <div className="text-sm opacity-80">Find opponent instantly</div>
                        </div>
                      </Button>
                      <Button className="h-20 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                        <div className="text-center">
                          <div className="text-lg font-bold">Ranked Match</div>
                          <div className="text-sm opacity-80">Compete for leaderboard</div>
                        </div>
                      </Button>
                    </div>
                    <div className="p-4 bg-slate-700/50 rounded-lg">
                      <h4 className="text-white font-medium mb-2">Arena Stats</h4>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold text-green-400">24</div>
                          <div className="text-xs text-gray-400">Wins</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-red-400">8</div>
                          <div className="text-xs text-gray-400">Losses</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-blue-400">1,847</div>
                          <div className="text-xs text-gray-400">Rating</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400">Connect your wallet to enter the arena</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-companion" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  AI Gaming Assistant
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isConnected ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-lg border border-purple-500/30">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-white font-medium">CryptoQuest AI</span>
                        <Badge className="bg-green-600">Online</Badge>
                      </div>
                      <p className="text-gray-300 text-sm mb-3">
                        Your AI companion powered by 5 advanced AI models is ready to assist with strategy, 
                        quest optimization, and market analysis.
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <Button size="sm" variant="outline" className="border-purple-500 text-purple-400">
                          Battle Strategy
                        </Button>
                        <Button size="sm" variant="outline" className="border-blue-500 text-blue-400">
                          Market Analysis
                        </Button>
                        <Button size="sm" variant="outline" className="border-green-500 text-green-400">
                          Quest Optimizer
                        </Button>
                        <Button size="sm" variant="outline" className="border-yellow-500 text-yellow-400">
                          Guild Management
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400">Connect your wallet to activate AI companion</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Game Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6 text-center">
              <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-white font-bold mb-2">NVIDIA RTX Gaming</h3>
              <p className="text-gray-400 text-sm">
                Experience console-quality graphics with DLSS 4.0, ray tracing, and AI-enhanced rendering
              </p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6 text-center">
              <Zap className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-white font-bold mb-2">Cross-Platform Play</h3>
              <p className="text-gray-400 text-sm">
                Play seamlessly across PlayStation 5, Xbox Series X/S, PC, and mobile devices
              </p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6 text-center">
              <Bot className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-white font-bold mb-2">AI-Powered Gameplay</h3>
              <p className="text-gray-400 text-sm">
                Advanced AI models provide intelligent NPCs, dynamic quests, and personalized experiences
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
