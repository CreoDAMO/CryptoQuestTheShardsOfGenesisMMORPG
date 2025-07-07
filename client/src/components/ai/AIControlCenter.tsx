import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  Brain, Mic, Video, MessageSquare, Settings, Play, Pause,
  Activity, CheckCircle, AlertTriangle, Clock, Zap, Target,
  User, Bot, Sparkles, Shield, Code, TrendingUp, Eye
} from 'lucide-react';

interface AIAgent {
  id: string;
  name: string;
  role: string;
  capabilities: string[];
  status: 'active' | 'inactive' | 'processing';
  lastAction: Date;
  decisions: number;
  successRate: number;
}

interface AIDecision {
  id: string;
  agentId: string;
  type: 'strategic' | 'operational' | 'security' | 'content' | 'analysis';
  description: string;
  reasoning: string;
  confidence: number;
  timestamp: Date;
  executed: boolean;
  outcome?: string;
  manualOverride?: boolean;
}

interface AIInteraction {
  id: string;
  type: 'voice' | 'text' | 'video';
  agentId: string;
  content: string;
  timestamp: Date;
  userQuery: string;
  response: string;
  mood: 'helpful' | 'analytical' | 'creative' | 'serious';
}

const mockAgents: AIAgent[] = [
  {
    id: 'claude-strategist',
    name: 'Claude Strategic Advisor',
    role: 'Strategic Decision Making & Governance',
    capabilities: [
      'Complex reasoning and analysis',
      'Strategic planning and governance',
      'Risk assessment and mitigation',
      'Community engagement strategies',
      'Economic modeling and tokenomics',
      'Cross-chain protocol optimization'
    ],
    status: 'active',
    lastAction: new Date(),
    decisions: 247,
    successRate: 0.94
  },
  {
    id: 'openai-creator',
    name: 'OpenAI Content Creator',
    role: 'Content Generation & Multi-Modal AI',
    capabilities: [
      'Video content generation',
      'Educational material creation',
      'Code documentation and analysis',
      'Visual asset generation',
      'Voice synthesis and audio content',
      'Interactive tutorial development'
    ],
    status: 'active',
    lastAction: new Date(Date.now() - 5 * 60 * 1000),
    decisions: 189,
    successRate: 0.97
  },
  {
    id: 'grok-analyst',
    name: 'Grok Market Analyst',
    role: 'Real-Time Market Analysis & Community Interaction',
    capabilities: [
      'Real-time market data analysis',
      'Social sentiment monitoring',
      'Community interaction and engagement',
      'Trend prediction and forecasting',
      'Arbitrage opportunity identification',
      'News and event impact analysis'
    ],
    status: 'processing',
    lastAction: new Date(Date.now() - 2 * 60 * 1000),
    decisions: 324,
    successRate: 0.91
  },
  {
    id: 'deepseek-engineer',
    name: 'DeepSeek Code Engineer',
    role: 'Code Optimization & Security Analysis',
    capabilities: [
      'Code optimization and refactoring',
      'Security vulnerability detection',
      'Smart contract analysis',
      'Performance optimization',
      'Gas usage optimization',
      'Architecture recommendations'
    ],
    status: 'active',
    lastAction: new Date(Date.now() - 10 * 60 * 1000),
    decisions: 156,
    successRate: 0.98
  }
];

const mockDecisions: AIDecision[] = [
  {
    id: '1',
    agentId: 'claude-strategist',
    type: 'strategic',
    description: 'Optimize cross-chain liquidity allocation',
    reasoning: 'Current market conditions show higher APY on Base network. Recommend rebalancing 30% of liquidity from Polygon to Base for improved returns.',
    confidence: 0.87,
    timestamp: new Date(),
    executed: true,
    outcome: 'Success: 12% APY improvement achieved'
  },
  {
    id: '2',
    agentId: 'deepseek-engineer',
    type: 'security',
    description: 'Update smart contract security parameters',
    reasoning: 'Detected potential reentrancy vulnerability in staking contract. Recommend implementing additional checks.',
    confidence: 0.95,
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    executed: false
  },
  {
    id: '3',
    agentId: 'grok-analyst',
    type: 'analysis',
    description: 'Market sentiment indicates bullish trend',
    reasoning: 'Social media sentiment analysis shows 78% positive mentions. Recommend increasing marketing campaigns.',
    confidence: 0.82,
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    executed: true,
    outcome: 'Success: 15% increase in user engagement'
  }
];

export function AIControlCenter() {
  const [agents, setAgents] = useState<AIAgent[]>(mockAgents);
  const [decisions, setDecisions] = useState<AIDecision[]>(mockDecisions);
  const [interactions, setInteractions] = useState<AIInteraction[]>([]);
  const [autonomousMode, setAutonomousMode] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [voiceQuery, setVoiceQuery] = useState('');
  const [isListening, setIsListening] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => ({
        ...agent,
        lastAction: agent.status === 'processing' ? new Date() : agent.lastAction,
        status: Math.random() > 0.7 ? 'processing' : 'active'
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const executeDecision = (decisionId: string) => {
    setDecisions(prev => prev.map(decision => 
      decision.id === decisionId 
        ? { ...decision, executed: true, outcome: 'Manual execution successful' }
        : decision
    ));
  };

  const deploySmartContract = async (contractType: string) => {
    const newDecision: AIDecision = {
      id: Date.now().toString(),
      agentId: 'deepseek-engineer',
      type: 'operational',
      description: `Deploy ${contractType} smart contract`,
      reasoning: `AI analysis indicates optimal deployment conditions. Gas fees are low, network congestion minimal, and code has passed all security audits.`,
      confidence: 0.96,
      timestamp: new Date(),
      executed: false
    };
    
    setDecisions(prev => [newDecision, ...prev]);
  };

  const executeArbitrageTrade = async (opportunity: string) => {
    const newDecision: AIDecision = {
      id: Date.now().toString(),
      agentId: 'grok-analyst',
      type: 'operational',
      description: `Execute arbitrage trade: ${opportunity}`,
      reasoning: `Detected 2.3% arbitrage opportunity between Uniswap and SushiSwap. Expected profit: $847 after gas fees.`,
      confidence: 0.91,
      timestamp: new Date(),
      executed: true,
      outcome: 'Success: $847 profit realized'
    };
    
    setDecisions(prev => [newDecision, ...prev]);
  };

  const manageCommunityEvent = async (eventType: string) => {
    const newDecision: AIDecision = {
      id: Date.now().toString(),
      agentId: 'claude-strategist',
      type: 'strategic',
      description: `Launch community event: ${eventType}`,
      reasoning: `Community engagement is at 78% this week. Launching ${eventType} event will boost participation and reward active members.`,
      confidence: 0.88,
      timestamp: new Date(),
      executed: false
    };
    
    setDecisions(prev => [newDecision, ...prev]);
  };

  const generateVideoContent = async (topic: string) => {
    // Simulate video generation
    const newInteraction: AIInteraction = {
      id: Date.now().toString(),
      type: 'video',
      agentId: 'openai-creator',
      content: `Generated comprehensive video script about: ${topic}`,
      timestamp: new Date(),
      userQuery: topic,
      response: `Video content created with visual explanations, animations, and step-by-step guidance for ${topic}. Perfect for users who prefer visual learning over text.`,
      mood: 'creative'
    };
    
    setInteractions(prev => [newInteraction, ...prev]);
  };

  const handleVoiceInteraction = async () => {
    if (!voiceQuery.trim()) return;
    
    const agentId = selectedAgent || 'claude-strategist';
    const newInteraction: AIInteraction = {
      id: Date.now().toString(),
      type: 'voice',
      agentId,
      content: voiceQuery,
      timestamp: new Date(),
      userQuery: voiceQuery,
      response: `AI response from ${agents.find(a => a.id === agentId)?.name}: Processed your query about "${voiceQuery}" and provided comprehensive analysis.`,
      mood: 'helpful'
    };
    
    setInteractions(prev => [newInteraction, ...prev]);
    setVoiceQuery('');
  };

  const getAgentIcon = (agentId: string) => {
    switch (agentId) {
      case 'claude-strategist': return Brain;
      case 'openai-creator': return Sparkles;
      case 'grok-analyst': return TrendingUp;
      case 'deepseek-engineer': return Code;
      default: return Bot;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-400';
      case 'processing': return 'bg-blue-500/20 text-blue-400 border-blue-400';
      case 'inactive': return 'bg-gray-500/20 text-gray-400 border-gray-400';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            AI Control Center
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Autonomous AI system with Claude 4, OpenAI, Grok3, and DeepSeek working together
            while maintaining manual control for founders and community members
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <Badge variant="outline" className={`${autonomousMode ? 'bg-green-500/20 text-green-400 border-green-400' : 'bg-red-500/20 text-red-400 border-red-400'}`}>
              {autonomousMode ? <Play className="w-4 h-4 mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
              {autonomousMode ? 'Autonomous Mode' : 'Manual Mode'}
            </Badge>
            <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border-purple-400">
              <Activity className="w-4 h-4 mr-2" />
              {agents.filter(a => a.status === 'active').length} Active Agents
            </Badge>
            <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-400">
              <CheckCircle className="w-4 h-4 mr-2" />
              {decisions.filter(d => d.executed).length}/{decisions.length} Executed
            </Badge>
          </div>
        </div>

        {/* System Controls */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-purple-400" />
                  <span className="text-white">Autonomous Mode</span>
                </div>
                <Switch checked={autonomousMode} onCheckedChange={setAutonomousMode} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4 text-center">
              <Activity className="w-6 h-6 mx-auto mb-2 text-green-400" />
              <div className="text-2xl font-bold text-white">{agents.length}</div>
              <div className="text-sm text-gray-400">AI Agents</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4 text-center">
              <Target className="w-6 h-6 mx-auto mb-2 text-blue-400" />
              <div className="text-2xl font-bold text-white">{decisions.length}</div>
              <div className="text-sm text-gray-400">Total Decisions</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4 text-center">
              <Zap className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
              <div className="text-2xl font-bold text-white">
                {((decisions.filter(d => d.executed && d.outcome?.includes('Success')).length / decisions.length) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-400">Success Rate</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Interface */}
        <Tabs defaultValue="agents" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800/50">
            <TabsTrigger value="agents">AI Agents</TabsTrigger>
            <TabsTrigger value="decisions">Decisions</TabsTrigger>
            <TabsTrigger value="interactions">Interactions</TabsTrigger>
            <TabsTrigger value="voice">Voice AI</TabsTrigger>
            <TabsTrigger value="content">Content AI</TabsTrigger>
          </TabsList>

          <TabsContent value="agents" className="space-y-6">
            <div className="grid gap-4">
              {agents.map((agent) => {
                const IconComponent = getAgentIcon(agent.id);
                return (
                  <Card key={agent.id} className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">{agent.name}</h3>
                            <p className="text-sm text-gray-400">{agent.role}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={getStatusColor(agent.status)}>
                            {agent.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-white">{agent.decisions}</div>
                          <div className="text-sm text-gray-400">Decisions</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-400">
                            {(agent.successRate * 100).toFixed(1)}%
                          </div>
                          <div className="text-sm text-gray-400">Success Rate</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-400">
                            {Math.floor((Date.now() - agent.lastAction.getTime()) / 60000)}m
                          </div>
                          <div className="text-sm text-gray-400">Last Active</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-400">
                            {agent.capabilities.length}
                          </div>
                          <div className="text-sm text-gray-400">Capabilities</div>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <h4 className="text-white font-semibold">Capabilities</h4>
                        <div className="flex flex-wrap gap-2">
                          {agent.capabilities.map((capability) => (
                            <Badge key={capability} variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-400">
                              {capability}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          size="sm"
                          className="bg-purple-600 hover:bg-purple-700"
                          onClick={() => setSelectedAgent(agent.id)}
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Interact
                        </Button>
                        <Button size="sm" variant="outline" className="border-blue-400 text-blue-400">
                          <Settings className="w-4 h-4 mr-2" />
                          Configure
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className={agent.status === 'active' ? 'border-red-400 text-red-400' : 'border-green-400 text-green-400'}
                        >
                          {agent.status === 'active' ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                          {agent.status === 'active' ? 'Pause' : 'Activate'}
                        </Button>

                        {/* Agent-specific operational buttons */}
                        {agent.id === 'deepseek-engineer' && (
                          <Button 
                            size="sm"
                            onClick={() => deploySmartContract('NFT Collection')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Code className="w-4 h-4 mr-2" />
                            Deploy Contract
                          </Button>
                        )}
                        
                        {agent.id === 'grok-analyst' && (
                          <Button 
                            size="sm"
                            onClick={() => executeArbitrageTrade('USDC/USDT 2.3%')}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Execute Trade
                          </Button>
                        )}
                        
                        {agent.id === 'claude-strategist' && (
                          <Button 
                            size="sm"
                            onClick={() => manageCommunityEvent('Guild Tournament')}
                            className="bg-yellow-600 hover:bg-yellow-700"
                          >
                            <Target className="w-4 h-4 mr-2" />
                            Launch Event
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="decisions" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">AI Decisions</h2>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Brain className="w-4 h-4 mr-2" />
                Trigger Analysis
              </Button>
            </div>

            <div className="grid gap-4">
              {decisions.map((decision) => {
                const agent = agents.find(a => a.id === decision.agentId);
                return (
                  <Card key={decision.id} className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            decision.executed ? 'bg-green-400' : 'bg-yellow-400'
                          }`} />
                          <div>
                            <h3 className="font-semibold text-white">{decision.description}</h3>
                            <p className="text-sm text-gray-400">
                              {agent?.name} • {decision.type} • {decision.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border-purple-400">
                            {(decision.confidence * 100).toFixed(0)}% confidence
                          </Badge>
                          {decision.executed ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : (
                            <Button 
                              size="sm"
                              onClick={() => executeDecision(decision.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Execute
                            </Button>
                          )}
                        </div>
                      </div>

                      <p className="text-gray-300 mb-4">{decision.reasoning}</p>

                      {decision.outcome && (
                        <div className="mt-4 p-3 bg-slate-700/50 rounded">
                          <p className="text-sm text-gray-300">
                            <strong>Outcome:</strong> {decision.outcome}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="interactions" className="space-y-6">
            <div className="grid gap-4">
              {interactions.map((interaction) => {
                const agent = agents.find(a => a.id === interaction.agentId);
                return (
                  <Card key={interaction.id} className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-400">
                            {interaction.type}
                          </Badge>
                          <span className="text-white font-semibold">{agent?.name}</span>
                        </div>
                        <span className="text-sm text-gray-400">{interaction.timestamp.toLocaleTimeString()}</span>
                      </div>
                      <p className="text-gray-300 text-sm mb-2">
                        <strong>Query:</strong> {interaction.userQuery}
                      </p>
                      <p className="text-gray-300 text-sm">
                        <strong>Response:</strong> {interaction.response}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="voice" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Mic className="w-5 h-5 text-green-400" />
                  Voice AI Interaction
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Select AI Agent</label>
                  <select 
                    value={selectedAgent || ''}
                    onChange={(e) => setSelectedAgent(e.target.value)}
                    className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white"
                  >
                    <option value="">Choose an agent...</option>
                    {agents.map(agent => (
                      <option key={agent.id} value={agent.id}>{agent.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Voice Query</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={voiceQuery}
                      onChange={(e) => setVoiceQuery(e.target.value)}
                      placeholder="Ask anything about CryptoQuest..."
                      className="flex-1 p-2 bg-slate-700 border border-slate-600 rounded text-white"
                    />
                    <Button 
                      onClick={handleVoiceInteraction}
                      className="bg-green-600 hover:bg-green-700"
                      disabled={!voiceQuery.trim() || !selectedAgent}
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="text-center">
                  <Button 
                    className={`${isListening ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                    onClick={() => setIsListening(!isListening)}
                  >
                    <Mic className="w-4 h-4 mr-2" />
                    {isListening ? 'Stop Listening' : 'Start Voice Input'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Video className="w-5 h-5 text-purple-400" />
                  AI Content Generation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300">
                  Generate video content for users who prefer visual explanations over text.
                  Perfect for tutorials, explanations, and educational content.
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <Button 
                    onClick={() => generateVideoContent('How to use CryptoQuest DeFi features')}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    DeFi Tutorial Video
                  </Button>
                  <Button 
                    onClick={() => generateVideoContent('CryptoQuest arbitrage bot explanation')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Arbitrage Guide Video
                  </Button>
                  <Button 
                    onClick={() => generateVideoContent('Holographic visualization walkthrough')}
                    className="bg-cyan-600 hover:bg-cyan-700"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Holographic Demo Video
                  </Button>
                  <Button 
                    onClick={() => generateVideoContent('Admin dashboard overview')}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Admin Guide Video
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}