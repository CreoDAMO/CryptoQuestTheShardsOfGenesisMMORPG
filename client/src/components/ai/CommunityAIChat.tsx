
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Mic, MicOff, Volume2, VolumeX, Send, Users, Bot, Brain,
  MessageSquare, Headphones, Radio, Sparkles, Zap, Crown,
  Globe, Shield, Code, TrendingUp, Eye, Settings, Play, Pause
} from 'lucide-react';

interface AIMessage {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  aiAgent: string;
  voiceEnabled: boolean;
  actions?: string[];
  mood?: 'helpful' | 'analytical' | 'creative' | 'serious' | 'playful';
}

interface VoiceSettings {
  enabled: boolean;
  autoSpeak: boolean;
  voice: string;
  speed: number;
  pitch: number;
}

interface CommunityMember {
  id: string;
  username: string;
  role: 'founder' | 'developer' | 'community' | 'moderator';
  isOnline: boolean;
  aiAssistant: boolean;
}

const aiAgents = [
  { id: 'claude-community', name: 'Claude Community Manager', icon: Crown, color: 'purple' },
  { id: 'gpt-creator', name: 'GPT Content Creator', icon: Sparkles, color: 'blue' },
  { id: 'grok-social', name: 'Grok Social Analyst', icon: TrendingUp, color: 'green' },
  { id: 'deepseek-dev', name: 'DeepSeek Dev Assistant', icon: Code, color: 'orange' }
];

export function CommunityAIChat() {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(aiAgents[0]);
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    enabled: true,
    autoSpeak: true,
    voice: 'en-US-AriaNeural',
    speed: 1.0,
    pitch: 1.0
  });
  const [communityMembers, setCommunityMembers] = useState<CommunityMember[]>([
    { id: '1', username: 'CryptoFounder', role: 'founder', isOnline: true, aiAssistant: false },
    { id: '2', username: 'DevLead', role: 'developer', isOnline: true, aiAssistant: false },
    { id: '3', username: 'Claude-AI', role: 'community', isOnline: true, aiAssistant: true },
    { id: '4', username: 'GPT-Assistant', role: 'community', isOnline: true, aiAssistant: true },
    { id: '5', username: 'GameMaster_42', role: 'community', isOnline: false, aiAssistant: false }
  ]);
  const [activeRoom, setActiveRoom] = useState('general');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'ai',
      content: `Welcome to CryptoQuest Community Chat! I'm ${selectedAgent.name}, your AI assistant. I can help with gameplay strategies, market analysis, code development, and community management. Try saying "What's new with CryptoQuest?" or ask me anything about the game!`,
      timestamp: new Date(),
      aiAgent: selectedAgent.id,
      voiceEnabled: voiceSettings.enabled,
      mood: 'helpful'
    };
    setMessages([welcomeMessage]);
    
    if (voiceSettings.enabled && voiceSettings.autoSpeak) {
      speakMessage(welcomeMessage.content);
    }
  }, []);

  const speakMessage = async (text: string) => {
    if (!voiceSettings.enabled || !('speechSynthesis' in window)) return;
    
    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = voiceSettings.speed;
    utterance.pitch = voiceSettings.pitch;
    utterance.onend = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice input not supported in this browser');
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputMessage(transcript);
    };

    recognition.start();
  };

  const generateAIResponse = async (userMessage: string, agent: typeof selectedAgent): Promise<string> => {
    const responses = {
      'claude-community': [
        `Great question! Based on our community feedback, here's what I recommend: ${userMessage.includes('strategy') ? 'Focus on guild collaboration and long-term token accumulation strategies.' : 'The community is very active around DeFi farming and NFT trading opportunities.'}`,
        `I've analyzed recent community discussions and ${userMessage.includes('price') ? 'the sentiment is very bullish with strong technical indicators.' : 'there\'s growing excitement about our upcoming AR/VR integration.'}`,
        `As your community manager, I suggest ${userMessage.includes('game') ? 'exploring the new quest system and joining an active guild for better rewards.' : 'participating in our weekly community events for exclusive NFT drops.'}`
      ],
      'gpt-creator': [
        `I can create comprehensive content about that! ${userMessage.includes('tutorial') ? 'I\'ll generate a step-by-step video tutorial with visual guides.' : 'Let me craft engaging social media content to showcase this feature.'}`,
        `Perfect timing for content creation! ${userMessage.includes('explain') ? 'I\'ll break this down into digestible visual content with animations.' : 'This would make an excellent educational video series.'}`,
        `Content-wise, this is excellent material! ${userMessage.includes('share') ? 'I\'ll create shareable infographics and video snippets.' : 'I can develop interactive tutorials for this topic.'}`
      ],
      'grok-social': [
        `Social sentiment analysis shows ${userMessage.includes('market') ? '78% bullish sentiment with high engagement on gaming tokens.' : 'strong community growth and positive mentions across platforms.'}`,
        `Real-time data indicates ${userMessage.includes('trending') ? 'CryptoQuest is trending in gaming communities with 340% mention increase.' : 'high user engagement and growing influencer attention.'}`,
        `Market intelligence suggests ${userMessage.includes('invest') ? 'strong accumulation patterns and growing institutional interest.' : 'positive momentum building across all social metrics.'}`
      ],
      'deepseek-dev': [
        `From a technical perspective, ${userMessage.includes('code') ? 'I can optimize that smart contract for 15% better gas efficiency.' : 'the implementation looks solid with potential for performance improvements.'}`,
        `Development-wise, ${userMessage.includes('bug') ? 'I\'ve identified the root cause and can provide a security-audited fix.' : 'we could enhance this feature with additional safety checks.'}`,
        `Code analysis shows ${userMessage.includes('security') ? 'all contracts pass security audits with 95/100 score.' : 'excellent architecture with room for gas optimization.'}`
      ]
    };

    const agentResponses = responses[agent.id as keyof typeof responses] || responses['claude-community'];
    return agentResponses[Math.floor(Math.random() * agentResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
      aiAgent: selectedAgent.id,
      voiceEnabled: false
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Simulate AI processing delay
    setTimeout(async () => {
      const aiResponse = await generateAIResponse(inputMessage, selectedAgent);
      const aiMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date(),
        aiAgent: selectedAgent.id,
        voiceEnabled: voiceSettings.enabled,
        actions: ['Execute Action', 'Learn More', 'Share'],
        mood: Math.random() > 0.5 ? 'helpful' : 'analytical'
      };

      setMessages(prev => [...prev, aiMessage]);
      
      if (voiceSettings.enabled && voiceSettings.autoSpeak) {
        speakMessage(aiResponse);
      }
    }, 1000 + Math.random() * 2000);
  };

  const executeAIAction = async (action: string, messageId: string) => {
    const actionMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'system',
      content: `🤖 ${selectedAgent.name} executed: ${action}`,
      timestamp: new Date(),
      aiAgent: selectedAgent.id,
      voiceEnabled: false
    };
    
    setMessages(prev => [...prev, actionMessage]);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'founder': return 'bg-purple-500/20 text-purple-400 border-purple-400';
      case 'developer': return 'bg-blue-500/20 text-blue-400 border-blue-400';
      case 'moderator': return 'bg-green-500/20 text-green-400 border-green-400';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            AI Community Chat
          </h1>
          <p className="text-xl text-gray-300">
            Voice-enabled AI assistants with real community interaction
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-3 space-y-4">
            {/* AI Agent Selector */}
            <div className="flex gap-2 flex-wrap">
              {aiAgents.map((agent) => {
                const IconComponent = agent.icon;
                return (
                  <Button
                    key={agent.id}
                    onClick={() => setSelectedAgent(agent)}
                    variant={selectedAgent.id === agent.id ? "default" : "outline"}
                    className={`${selectedAgent.id === agent.id ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    {agent.name.split(' ')[0]}
                  </Button>
                );
              })}
            </div>

            {/* Chat Messages */}
            <Card className="bg-slate-800/50 border-slate-700 h-96 flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <selectedAgent.icon className="w-5 h-5" />
                    {selectedAgent.name}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-400">
                      <Radio className="w-3 h-3 mr-1" />
                      Live
                    </Badge>
                    {isSpeaking && (
                      <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-400">
                        <Volume2 className="w-3 h-3 mr-1" />
                        Speaking
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-purple-600 text-white'
                          : message.type === 'system'
                          ? 'bg-slate-700 text-gray-300'
                          : 'bg-slate-700 text-white'
                      }`}
                    >
                      <div className="text-sm">{message.content}</div>
                      <div className="text-xs opacity-60 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                      {message.actions && (
                        <div className="flex gap-1 mt-2">
                          {message.actions.map((action) => (
                            <Button
                              key={action}
                              size="sm"
                              variant="outline"
                              onClick={() => executeAIAction(action, message.id)}
                              className="text-xs"
                            >
                              {action}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </CardContent>
            </Card>

            {/* Message Input */}
            <div className="flex gap-2">
              <div className="flex-1 flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask me anything about CryptoQuest..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 bg-slate-800 border-slate-700 text-white"
                />
                <Button
                  onClick={startVoiceInput}
                  variant={isListening ? "destructive" : "outline"}
                  size="icon"
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
                <Button onClick={handleSendMessage} className="bg-purple-600 hover:bg-purple-700">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Voice Settings */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-white">Voice AI Features</span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Headphones className="w-4 h-4 text-gray-400" />
                      <Switch 
                        checked={voiceSettings.enabled}
                        onCheckedChange={(checked) => setVoiceSettings(prev => ({ ...prev, enabled: checked }))}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">Auto-speak</span>
                      <Switch 
                        checked={voiceSettings.autoSpeak}
                        onCheckedChange={(checked) => setVoiceSettings(prev => ({ ...prev, autoSpeak: checked }))}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Community Sidebar */}
          <div className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Community Members
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {communityMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${member.isOnline ? 'bg-green-400' : 'bg-gray-400'}`} />
                      <span className="text-white text-sm">{member.username}</span>
                      {member.aiAssistant && <Bot className="w-3 h-3 text-purple-400" />}
                    </div>
                    <Badge variant="outline" className={getRoleColor(member.role)}>
                      {member.role}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  AI Capabilities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Shield className="w-3 h-3 text-green-400" />
                    Smart Contract Analysis
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <TrendingUp className="w-3 h-3 text-blue-400" />
                    Market Intelligence
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Code className="w-3 h-3 text-purple-400" />
                    Code Generation
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Sparkles className="w-3 h-3 text-yellow-400" />
                    Content Creation
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Eye className="w-3 h-3 text-cyan-400" />
                    Community Management
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
