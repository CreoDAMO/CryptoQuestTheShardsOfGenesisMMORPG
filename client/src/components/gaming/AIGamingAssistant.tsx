import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, Mic, MicOff, Volume2, VolumeX, Zap, Target, 
  TrendingUp, Award, Shield, Lightbulb, Bot, MessageSquare,
  BarChart3, Eye, Headphones, Settings, Sparkles
} from 'lucide-react';

// Revolutionary AI Gaming Assistant - Combines NVIDIA GeForce Experience + Sony's AI + Xbox Game Bar
interface AIGamingAssistantProps {
  onOptimizationApplied?: (optimization: GameOptimization) => void;
  onInsightGenerated?: (insight: AIInsight) => void;
}

interface GameOptimization {
  type: 'performance' | 'strategy' | 'settings' | 'social';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  category: string;
  confidence: number;
}

interface AIInsight {
  id: string;
  type: 'achievement' | 'strategy' | 'social' | 'market' | 'performance';
  title: string;
  description: string;
  actionable: boolean;
  priority: 'low' | 'medium' | 'high';
  timestamp: Date;
}

interface VoiceCommand {
  phrase: string;
  action: string;
  confidence: number;
}

export function AIGamingAssistant({ onOptimizationApplied, onInsightGenerated }: AIGamingAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentInsight, setCurrentInsight] = useState<AIInsight | null>(null);
  const [voiceCommands, setVoiceCommands] = useState<VoiceCommand[]>([]);
  const [optimizations, setOptimizations] = useState<GameOptimization[]>([]);
  const [aiPersonality, setAiPersonality] = useState<'assistant' | 'coach' | 'analyst' | 'companion'>('assistant');
  const [conversationHistory, setConversationHistory] = useState<Array<{role: 'user' | 'ai', message: string, timestamp: Date}>>([]);
  
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);
  const [inputMessage, setInputMessage] = useState('');

  // Initialize Speech Recognition and Synthesis
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        
        if (event.results[event.results.length - 1].isFinal) {
          processVoiceCommand(transcript);
        }
      };
    }
    
    if ('speechSynthesis' in window) {
      synthesisRef.current = window.speechSynthesis;
    }
  }, []);

  // Advanced AI Insights Generation
  useEffect(() => {
    const generateInsights = () => {
      const insights: AIInsight[] = [
        {
          id: Math.random().toString(36),
          type: 'strategy',
          title: 'Optimal Quest Path Detected',
          description: 'Based on your playstyle, completing the Dragon Lair quest chain before the Ancient Ruins will yield 23% more experience points.',
          actionable: true,
          priority: 'high',
          timestamp: new Date()
        },
        {
          id: Math.random().toString(36),
          type: 'market',
          title: 'NFT Market Opportunity',
          description: 'Fire-type weapons are trending 45% above average. Consider listing your Flame Sword now.',
          actionable: true,
          priority: 'medium',
          timestamp: new Date()
        },
        {
          id: Math.random().toString(36),
          type: 'performance',
          title: 'Frame Rate Optimization Available',
          description: 'Reducing shadow quality by one level would increase your FPS by 15% with minimal visual impact.',
          actionable: true,
          priority: 'medium',
          timestamp: new Date()
        }
      ];
      
      const newInsight = insights[Math.floor(Math.random() * insights.length)];
      setCurrentInsight(newInsight);
      onInsightGenerated?.(newInsight);
    };

    const interval = setInterval(generateInsights, 15000);
    generateInsights(); // Initial insight
    
    return () => clearInterval(interval);
  }, [onInsightGenerated]);

  // Voice Command Processing
  const processVoiceCommand = (transcript: string) => {
    const command: VoiceCommand = {
      phrase: transcript,
      action: 'unknown',
      confidence: 0.8
    };

    const lowerTranscript = transcript.toLowerCase();
    
    if (lowerTranscript.includes('optimize performance')) {
      command.action = 'optimize_performance';
      applyPerformanceOptimization();
    } else if (lowerTranscript.includes('check inventory')) {
      command.action = 'check_inventory';
      speakResponse('Opening your inventory now.');
    } else if (lowerTranscript.includes('market analysis')) {
      command.action = 'market_analysis';
      speakResponse('Analyzing current NFT market trends for optimal trading opportunities.');
    } else if (lowerTranscript.includes('find party')) {
      command.action = 'find_party';
      speakResponse('Searching for compatible party members based on your skill level and preferences.');
    }
    
    setVoiceCommands(prev => [command, ...prev.slice(0, 4)]);
    
    // Add to conversation history
    const userMessage = { role: 'user' as const, message: transcript, timestamp: new Date() };
    setConversationHistory(prev => [userMessage, ...prev.slice(0, 9)]);
  };

  // Text-to-Speech Response
  const speakResponse = (text: string) => {
    if (synthesisRef.current) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;
      
      utterance.onend = () => setIsSpeaking(false);
      synthesisRef.current.speak(utterance);
      
      // Add to conversation history
      const aiMessage = { role: 'ai' as const, message: text, timestamp: new Date() };
      setConversationHistory(prev => [aiMessage, ...prev.slice(0, 9)]);
    }
  };

  // Performance Optimization
  const applyPerformanceOptimization = () => {
    const optimization: GameOptimization = {
      type: 'performance',
      title: 'Graphics Settings Optimized',
      description: 'Adjusted texture quality and shadow resolution for optimal performance',
      impact: 'high',
      category: 'Graphics',
      confidence: 0.92
    };
    
    setOptimizations(prev => [optimization, ...prev.slice(0, 4)]);
    onOptimizationApplied?.(optimization);
    speakResponse('Performance optimizations applied. You should see improved frame rates.');
  };

  // Toggle Voice Recognition
  const toggleVoiceRecognition = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  // Handle Text Input
  const handleTextInput = (message: string) => {
    if (!message.trim()) return;
    
    // Process text command similar to voice
    processVoiceCommand(message);
    
    // Generate AI response based on personality
    let response = '';
    switch (aiPersonality) {
      case 'coach':
        response = "Great question! Let me analyze your gameplay and provide strategic recommendations.";
        break;
      case 'analyst':
        response = "Analyzing data patterns... Here's what the metrics suggest for optimal performance.";
        break;
      case 'companion':
        response = "I'm here to help! Let's work together to enhance your gaming experience.";
        break;
      default:
        response = "I understand your request. Let me provide the most relevant assistance.";
    }
    
    speakResponse(response);
    setInputMessage('');
  };

  const getPersonalityIcon = () => {
    switch (aiPersonality) {
      case 'coach': return <Target className="h-4 w-4" />;
      case 'analyst': return <BarChart3 className="h-4 w-4" />;
      case 'companion': return <Sparkles className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'medium': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      default: return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* AI Assistant Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getPersonalityIcon()}
              AI Gaming Assistant
              <Badge variant={isListening ? "default" : "secondary"}>
                {isListening ? "Listening" : "Ready"}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={isListening ? "default" : "outline"}
                onClick={toggleVoiceRecognition}
                className={isListening ? "animate-pulse" : ""}
              >
                {isListening ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              </Button>
              <Button
                size="sm"
                variant={isSpeaking ? "default" : "outline"}
                disabled
              >
                {isSpeaking ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
              <select
                value={aiPersonality}
                onChange={(e) => setAiPersonality(e.target.value as typeof aiPersonality)}
                className="px-2 py-1 rounded border text-sm"
              >
                <option value="assistant">Assistant</option>
                <option value="coach">Coach</option>
                <option value="analyst">Analyst</option>
                <option value="companion">Companion</option>
              </select>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Ask me anything about your game..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleTextInput(inputMessage)}
            />
            <Button onClick={() => handleTextInput(inputMessage)}>
              <MessageSquare className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Insight */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentInsight ? (
              <div className={`p-4 rounded-lg border-2 ${getPriorityColor(currentInsight.priority)}`}>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-sm">{currentInsight.title}</h3>
                  <Badge variant="outline" className="text-xs">
                    {currentInsight.type}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {currentInsight.description}
                </p>
                {currentInsight.actionable && (
                  <div className="flex gap-2">
                    <Button size="sm">Apply</Button>
                    <Button size="sm" variant="outline">Dismiss</Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Analyzing your gameplay for insights...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Voice Commands History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Headphones className="h-5 w-5" />
              Recent Commands
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {voiceCommands.length > 0 ? (
              voiceCommands.map((command, index) => (
                <div key={index} className="flex items-center gap-3 p-2 rounded bg-gray-50 dark:bg-gray-800">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{command.phrase}</div>
                    <div className="text-xs text-gray-500">
                      Action: {command.action} • Confidence: {(command.confidence * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                <Mic className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No voice commands yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Optimizations & Conversation */}
      <Tabs defaultValue="optimizations" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="optimizations">Optimizations</TabsTrigger>
          <TabsTrigger value="conversation">Conversation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="optimizations">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Applied Optimizations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {optimizations.length > 0 ? (
                optimizations.map((opt, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded border">
                    <div className={`w-3 h-3 rounded-full ${
                      opt.impact === 'high' ? 'bg-green-500' : 
                      opt.impact === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{opt.title}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{opt.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{opt.category}</Badge>
                        <span className="text-xs text-gray-500">
                          Confidence: {(opt.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No optimizations applied yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="conversation">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Conversation History
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-96 overflow-y-auto">
              {conversationHistory.length > 0 ? (
                conversationHistory.map((msg, index) => (
                  <div key={index} className={`flex gap-3 p-3 rounded ${
                    msg.role === 'user' ? 'bg-blue-50 dark:bg-blue-900/20 ml-8' : 'bg-gray-50 dark:bg-gray-800 mr-8'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${
                      msg.role === 'user' ? 'bg-blue-500' : 'bg-purple-500'
                    }`}>
                      {msg.role === 'user' ? 'U' : 'AI'}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{msg.message}</p>
                      <span className="text-xs text-gray-500">{msg.timestamp.toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Start a conversation with your AI assistant</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}