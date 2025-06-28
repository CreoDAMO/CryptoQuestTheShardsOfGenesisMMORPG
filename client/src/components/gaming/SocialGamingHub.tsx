import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, MessageCircle, Trophy, Share2, Heart, Play, 
  Mic, MicOff, Video, VideoOff, Settings, Crown, Star,
  Gift, Zap, Globe, UserPlus, MessageSquare, Camera
} from 'lucide-react';

// Cross-Platform Social Gaming Hub - Discord + Xbox Live + PlayStation Network Hybrid
interface Friend {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  platform: 'PlayStation' | 'Xbox' | 'PC' | 'Mobile' | 'Switch';
  currentGame?: string;
  level: number;
  achievements: number;
  isStreaming?: boolean;
  isFavorite?: boolean;
}

interface Party {
  id: string;
  name: string;
  members: Friend[];
  maxMembers: number;
  currentGame: string;
  privacy: 'public' | 'friends' | 'invite';
  voiceEnabled: boolean;
  crossPlay: boolean;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
}

export function SocialGamingHub() {
  const [friends, setFriends] = useState<Friend[]>([
    {
      id: '1',
      username: 'CryptoKnight89',
      displayName: 'Alex Thompson',
      avatar: '/api/avatar/alex.jpg',
      status: 'online',
      platform: 'PlayStation',
      currentGame: 'CryptoQuest: Genesis',
      level: 42,
      achievements: 156,
      isStreaming: true,
      isFavorite: true
    },
    {
      id: '2',
      username: 'BlockchainMaster',
      displayName: 'Sarah Chen',
      avatar: '/api/avatar/sarah.jpg',
      status: 'online',
      platform: 'Xbox',
      currentGame: 'NFT Racing League',
      level: 38,
      achievements: 134,
      isStreaming: false,
      isFavorite: false
    },
    {
      id: '3',
      username: 'Web3Warrior',
      displayName: 'Marcus Rodriguez',
      avatar: '/api/avatar/marcus.jpg',
      status: 'away',
      platform: 'PC',
      currentGame: 'Blockchain Battles',
      level: 51,
      achievements: 203,
      isStreaming: false,
      isFavorite: true
    }
  ]);

  const [currentParty, setCurrentParty] = useState<Party | null>({
    id: 'party1',
    name: 'Genesis Raiders',
    members: friends.slice(0, 2),
    maxMembers: 8,
    currentGame: 'CryptoQuest: Genesis',
    privacy: 'friends',
    voiceEnabled: true,
    crossPlay: true
  });

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'ach1',
      title: 'Genesis Pioneer',
      description: 'First player to reach level 50 in CryptoQuest',
      icon: '🏆',
      rarity: 'legendary',
      points: 1000,
      unlockedAt: new Date()
    },
    {
      id: 'ach2',
      title: 'NFT Collector',
      description: 'Collect 100 unique NFTs',
      icon: '💎',
      rarity: 'epic',
      points: 500,
      progress: 87,
      maxProgress: 100
    },
    {
      id: 'ach3',
      title: 'Cross-Platform Master',
      description: 'Play on all supported platforms',
      icon: '🌐',
      rarity: 'rare',
      points: 250,
      unlockedAt: new Date(Date.now() - 86400000)
    }
  ]);

  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([
    'CryptoKnight89 just unlocked "Dragon Slayer"',
    'New guild raid starting in 15 minutes',
    'Sarah Chen is now streaming NFT Racing League'
  ]);

  // Voice chat functionality
  const toggleVoiceChat = () => {
    setIsVoiceEnabled(!isVoiceEnabled);
    // In real implementation, this would connect to WebRTC voice services
    console.log(`Voice chat ${!isVoiceEnabled ? 'enabled' : 'disabled'}`);
  };

  const toggleVideoChat = () => {
    setIsVideoEnabled(!isVideoEnabled);
    // In real implementation, this would enable video streaming
    console.log(`Video chat ${!isVideoEnabled ? 'enabled' : 'disabled'}`);
  };

  // Friend status updates simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setFriends(prev => prev.map(friend => ({
        ...friend,
        // Randomly update friend status for demo
        status: Math.random() > 0.7 ? 
          (['online', 'away', 'busy'] as const)[Math.floor(Math.random() * 3)] : 
          friend.status
      })));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'legendary': return 'text-yellow-500 border-yellow-500';
      case 'epic': return 'text-purple-500 border-purple-500';
      case 'rare': return 'text-blue-500 border-blue-500';
      default: return 'text-gray-500 border-gray-500';
    }
  };

  const getPlatformIcon = (platform: Friend['platform']) => {
    switch (platform) {
      case 'PlayStation': return '🎮';
      case 'Xbox': return '🎯';
      case 'PC': return '💻';
      case 'Mobile': return '📱';
      case 'Switch': return '🕹️';
      default: return '🎮';
    }
  };

  const getStatusColor = (status: Friend['status']) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Social Hub Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6" />
              Social Gaming Hub
              <Badge variant="outline">{friends.filter(f => f.status === 'online').length} Online</Badge>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={isVoiceEnabled ? "default" : "outline"}
                onClick={toggleVoiceChat}
              >
                {isVoiceEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              </Button>
              <Button
                size="sm"
                variant={isVideoEnabled ? "default" : "outline"}
                onClick={toggleVideoChat}
              >
                {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
              </Button>
              <Button size="sm" variant="outline">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Friends & Party */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="friends" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="friends">Friends</TabsTrigger>
              <TabsTrigger value="party">Party</TabsTrigger>
              <TabsTrigger value="discover">Discover</TabsTrigger>
            </TabsList>
            
            <TabsContent value="friends" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Friends ({friends.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {friends.map((friend) => (
                    <div key={friend.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={friend.avatar} />
                          <AvatarFallback>{friend.displayName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(friend.status)}`} />
                        {friend.isStreaming && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">{friend.displayName}</span>
                          {friend.isFavorite && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                          <span className="text-sm opacity-75">{getPlatformIcon(friend.platform)}</span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {friend.currentGame || 'Offline'}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>Level {friend.level}</span>
                          <span>•</span>
                          <span>{friend.achievements} achievements</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <UserPlus className="h-4 w-4" />
                        </Button>
                        {friend.isStreaming && (
                          <Button size="sm">
                            <Play className="h-4 w-4 mr-1" />
                            Watch
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="party">
              {currentParty ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Crown className="h-5 w-5 text-yellow-500" />
                        {currentParty.name}
                      </div>
                      <Badge variant={currentParty.crossPlay ? "default" : "secondary"}>
                        {currentParty.crossPlay ? "Cross-Play" : "Platform Locked"}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Playing: {currentParty.currentGame}</span>
                      <span className="text-sm text-gray-600">
                        {currentParty.members.length}/{currentParty.maxMembers} members
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      {currentParty.members.map((member) => (
                        <div key={member.id} className="flex items-center gap-3 p-2 rounded">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback>{member.displayName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{member.displayName}</span>
                              <span className="text-xs">{getPlatformIcon(member.platform)}</span>
                            </div>
                          </div>
                          {member.id === '1' && <Crown className="h-4 w-4 text-yellow-500" />}
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button className="flex-1">
                        <Play className="h-4 w-4 mr-2" />
                        Join Game
                      </Button>
                      <Button variant="outline">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-gray-500 mb-4">You're not in a party</p>
                    <Button>Create Party</Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="discover">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Discover Players
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Input placeholder="Search for players..." />
                    <div className="text-center py-8 text-gray-500">
                      <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Discover new players based on your interests</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Achievements & Activity */}
        <div className="space-y-6">
          {/* Live Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Live Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {notifications.map((notification, index) => (
                <div key={index} className="flex items-center gap-2 p-2 rounded bg-blue-50 dark:bg-blue-900/20">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span className="text-sm">{notification}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center gap-3 p-3 rounded-lg border">
                  <div className={`text-2xl p-2 rounded border-2 ${getRarityColor(achievement.rarity)}`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{achievement.title}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{achievement.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className={`text-xs ${getRarityColor(achievement.rarity)}`}>
                        {achievement.rarity}
                      </Badge>
                      <span className="text-xs text-gray-500">{achievement.points} pts</span>
                    </div>
                    {achievement.progress !== undefined && (
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                        <div 
                          className="bg-blue-600 h-1.5 rounded-full" 
                          style={{ width: `${(achievement.progress / (achievement.maxProgress || 100)) * 100}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start" variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                Start Group Chat
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Camera className="h-4 w-4 mr-2" />
                Share Screenshot
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Gift className="h-4 w-4 mr-2" />
                Send Gift
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}