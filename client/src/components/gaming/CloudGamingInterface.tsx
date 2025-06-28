import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Cloud, Monitor, Smartphone, Tv, Gamepad2, Wifi, Signal, 
  Zap, Settings, PlayCircle, PauseCircle, RotateCcw, Download
} from 'lucide-react';

// Revolutionary Cloud Gaming Interface - Xbox Game Pass Ultimate + PlayStation Plus Premium Hybrid
interface CloudGamingProps {
  onStreamingStateChange?: (state: StreamingState) => void;
}

interface StreamingState {
  isStreaming: boolean;
  quality: 'Auto' | '720p' | '1080p' | '4K';
  latency: number;
  bandwidth: number;
  device: 'PC' | 'Mobile' | 'TV' | 'Browser';
  frameRate: number;
}

interface GameSession {
  id: string;
  title: string;
  platform: 'PlayStation' | 'Xbox' | 'PC' | 'Mobile';
  thumbnail: string;
  progress: number;
  timeRemaining: string;
  lastPlayed: Date;
}

export function CloudGamingInterface({ onStreamingStateChange }: CloudGamingProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [streamingState, setStreamingState] = useState<StreamingState>({
    isStreaming: false,
    quality: 'Auto',
    latency: 0,
    bandwidth: 0,
    device: 'Browser',
    frameRate: 60
  });
  
  const [activeSessions, setActiveSessions] = useState<GameSession[]>([
    {
      id: '1',
      title: 'CryptoQuest: Genesis Realm',
      platform: 'PC',
      thumbnail: '/api/placeholder/game1.jpg',
      progress: 75,
      timeRemaining: '2h 30m',
      lastPlayed: new Date()
    },
    {
      id: '2', 
      title: 'Blockchain Warriors',
      platform: 'PlayStation',
      thumbnail: '/api/placeholder/game2.jpg',
      progress: 45,
      timeRemaining: '4h 15m',
      lastPlayed: new Date(Date.now() - 3600000)
    },
    {
      id: '3',
      title: 'NFT Racing League',
      platform: 'Xbox',
      thumbnail: '/api/placeholder/game3.jpg',
      progress: 90,
      timeRemaining: '1h 10m', 
      lastPlayed: new Date(Date.now() - 7200000)
    }
  ]);

  const [networkStats, setNetworkStats] = useState({
    downloadSpeed: 0,
    uploadSpeed: 0,
    ping: 0,
    packetLoss: 0,
    jitter: 0
  });

  // Real-time network monitoring
  useEffect(() => {
    const updateNetworkStats = () => {
      // Simulate real network monitoring
      setNetworkStats({
        downloadSpeed: Math.random() * 500 + 100, // 100-600 Mbps
        uploadSpeed: Math.random() * 50 + 10,     // 10-60 Mbps
        ping: Math.random() * 30 + 5,            // 5-35ms
        packetLoss: Math.random() * 2,           // 0-2%
        jitter: Math.random() * 5 + 1            // 1-6ms
      });
    };

    const interval = setInterval(updateNetworkStats, 2000);
    updateNetworkStats();
    
    return () => clearInterval(interval);
  }, []);

  // Advanced streaming quality adjustment
  const adjustStreamingQuality = (quality: StreamingState['quality']) => {
    const newState = { ...streamingState, quality };
    
    // Auto-adjust based on network conditions
    if (quality === 'Auto') {
      if (networkStats.downloadSpeed > 300 && networkStats.ping < 20) {
        newState.quality = '4K';
        newState.frameRate = 60;
      } else if (networkStats.downloadSpeed > 100 && networkStats.ping < 40) {
        newState.quality = '1080p';
        newState.frameRate = 60;
      } else {
        newState.quality = '720p';
        newState.frameRate = 30;
      }
    }
    
    setStreamingState(newState);
    onStreamingStateChange?.(newState);
  };

  // WebRTC-based game streaming simulation
  const startGameStream = async (gameId: string) => {
    try {
      // Simulate WebRTC connection setup
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { 
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 60 }
        },
        audio: true
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      const newState = { ...streamingState, isStreaming: true };
      setStreamingState(newState);
      onStreamingStateChange?.(newState);
      
      console.log(`Started streaming game: ${gameId}`);
    } catch (error) {
      console.error('Failed to start game stream:', error);
    }
  };

  const stopGameStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    const newState = { ...streamingState, isStreaming: false };
    setStreamingState(newState);
    onStreamingStateChange?.(newState);
  };

  // Device-specific optimizations
  const getDeviceOptimizations = () => {
    const userAgent = navigator.userAgent;
    let device: StreamingState['device'] = 'Browser';
    
    if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
      device = 'Mobile';
    } else if (/TV|SmartTV/.test(userAgent)) {
      device = 'TV';
    } else {
      device = 'PC';
    }
    
    return {
      device,
      recommendedQuality: device === 'Mobile' ? '720p' : device === 'TV' ? '4K' : '1080p',
      recommendedFrameRate: device === 'Mobile' ? 30 : 60
    };
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Main Streaming Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-6 w-6" />
            Cloud Gaming Platform
            <Badge variant={streamingState.isStreaming ? "default" : "secondary"}>
              {streamingState.isStreaming ? "Streaming" : "Ready"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Video Stream */}
            <div className="lg:col-span-2">
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                {streamingState.isStreaming ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-white">
                    <div className="text-center">
                      <PlayCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p>Select a game to start streaming</p>
                    </div>
                  </div>
                )}
                
                {/* Stream Controls Overlay */}
                {streamingState.isStreaming && (
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    <Button size="sm" onClick={stopGameStream}>
                      <PauseCircle className="h-4 w-4 mr-2" />
                      Stop
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                
                {/* Quality Indicator */}
                {streamingState.isStreaming && (
                  <div className="absolute top-4 right-4 bg-black/80 text-white px-2 py-1 rounded text-sm">
                    {streamingState.quality} @ {streamingState.frameRate}fps
                  </div>
                )}
              </div>
            </div>
            
            {/* Controls & Stats */}
            <div className="space-y-4">
              {/* Network Status */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Wifi className="h-4 w-4" />
                  Network Status
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Download:</span>
                    <span className="font-mono">{networkStats.downloadSpeed.toFixed(1)} Mbps</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Upload:</span>
                    <span className="font-mono">{networkStats.uploadSpeed.toFixed(1)} Mbps</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ping:</span>
                    <span className="font-mono">{networkStats.ping.toFixed(0)}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Packet Loss:</span>
                    <span className="font-mono">{networkStats.packetLoss.toFixed(2)}%</span>
                  </div>
                </div>
              </Card>
              
              {/* Quality Settings */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Stream Quality</h3>
                <div className="space-y-2">
                  {['Auto', '4K', '1080p', '720p'].map((quality) => (
                    <button
                      key={quality}
                      onClick={() => adjustStreamingQuality(quality as StreamingState['quality'])}
                      className={`w-full text-left px-3 py-2 rounded text-sm ${
                        streamingState.quality === quality 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {quality}
                      {quality === 'Auto' && (
                        <span className="text-xs opacity-75 ml-2">(Recommended)</span>
                      )}
                    </button>
                  ))}
                </div>
              </Card>
              
              {/* Device Info */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Monitor className="h-4 w-4" />
                  Device
                </h3>
                <div className="text-sm">
                  <div className="flex justify-between mb-2">
                    <span>Platform:</span>
                    <Badge variant="outline">{getDeviceOptimizations().device}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Optimized for:</span>
                    <span>{getDeviceOptimizations().recommendedQuality}</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Game Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gamepad2 className="h-6 w-6" />
            Active Game Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Games</TabsTrigger>
              <TabsTrigger value="playstation">PlayStation</TabsTrigger>
              <TabsTrigger value="xbox">Xbox</TabsTrigger>
              <TabsTrigger value="pc">PC</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeSessions.map((session) => (
                  <Card key={session.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Gamepad2 className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate">{session.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">{session.platform}</Badge>
                          <span className="text-xs text-gray-500">{session.timeRemaining}</span>
                        </div>
                        <Progress value={session.progress} className="mt-2 h-2" />
                        <div className="flex gap-2 mt-3">
                          <Button 
                            size="sm" 
                            onClick={() => startGameStream(session.id)}
                            disabled={streamingState.isStreaming}
                          >
                            <PlayCircle className="h-3 w-3 mr-1" />
                            Play
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            {/* Platform-specific tabs would filter the sessions */}
            <TabsContent value="playstation">
              <div className="text-center py-8 text-gray-500">
                PlayStation games would be filtered here
              </div>
            </TabsContent>
            
            <TabsContent value="xbox">
              <div className="text-center py-8 text-gray-500">
                Xbox Game Pass games would be filtered here
              </div>
            </TabsContent>
            
            <TabsContent value="pc">
              <div className="text-center py-8 text-gray-500">
                PC games would be filtered here
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}