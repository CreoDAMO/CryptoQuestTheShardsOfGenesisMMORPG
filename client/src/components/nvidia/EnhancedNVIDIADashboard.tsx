import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  Cpu, Database, Zap, Activity, Settings, BarChart3,
  Monitor, Sparkles, RefreshCw, AlertCircle, CheckCircle,
  Cloud, Layers, Target, Clock, Shield, Globe, TrendingUp,
  GamepadIcon, Brain, Eye, Workflow, Server, HardDrive,
  Network, Lock, Unlock, Download, Upload
} from 'lucide-react';

// NVIDIA DGX Cloud Integration
interface NVIDIACloudMetrics {
  dgxCloud: {
    instances: Array<{
      id: string;
      type: string;
      status: 'running' | 'stopped' | 'pending';
      region: string;
      gpus: number;
      memory: string;
      storage: string;
      utilization: number;
      cost: number;
    }>;
    totalCredits: number;
    usedCredits: number;
    apiCalls: number;
    maxApiCalls: number;
  };
  ngcCatalog: {
    availableModels: Array<{
      name: string;
      category: string;
      version: string;
      size: string;
      downloads: number;
      rating: number;
      optimized: boolean;
    }>;
    deployedModels: Array<{
      name: string;
      endpoint: string;
      status: 'active' | 'deploying' | 'failed';
      requests: number;
      avgLatency: number;
    }>;
  };
  gaming: {
    rtxEnabled: boolean;
    dlssVersion: string;
    rayTracingLevel: number;
    frameRate: number;
    resolution: string;
    aiCharacters: number;
    aceEnabled: boolean;
  };
  aiModels: {
    totalModels: number;
    activeModels: number;
    trainingJobs: number;
    accuracy: number;
    inferenceSpeed: number;
    gpuUtilization: number;
  };
  holographic: {
    renderingEnabled: boolean;
    complexity: number;
    algorithms: string[];
    performance: number;
    qualityScore: number;
    framerate: number;
  };
}

// NVIDIA NGC Model Categories
const NGC_CATEGORIES = [
  'Language Models',
  'Computer Vision',
  'Speech AI',
  'Recommendation Systems',
  'Conversational AI',
  'Multi-Modal',
  'Omniverse',
  'Healthcare',
  'Financial Services',
  'Robotics'
];

// Mock data representing real NVIDIA Cloud capabilities
const initialMetrics: NVIDIACloudMetrics = {
  dgxCloud: {
    instances: [
      {
        id: 'dgx-h100-001',
        type: 'DGX H100',
        status: 'running',
        region: 'us-east-1',
        gpus: 8,
        memory: '640GB HBM3',
        storage: '30TB NVMe',
        utilization: 87.3,
        cost: 24.50
      },
      {
        id: 'dgx-a100-002',
        type: 'DGX A100',
        status: 'running',
        region: 'us-west-2',
        gpus: 8,
        memory: '320GB HBM2e',
        storage: '15TB NVMe',
        utilization: 92.1,
        cost: 18.75
      }
    ],
    totalCredits: 25000,
    usedCredits: 12400,
    apiCalls: 15240,
    maxApiCalls: 50000
  },
  ngcCatalog: {
    availableModels: [
      {
        name: 'Llama 3.1 70B Instruct',
        category: 'Language Models',
        version: '1.0',
        size: '140GB',
        downloads: 2847329,
        rating: 4.9,
        optimized: true
      },
      {
        name: 'CLIP ViT-B/32',
        category: 'Computer Vision',
        version: '2.1',
        size: '605MB',
        downloads: 1239847,
        rating: 4.7,
        optimized: true
      },
      {
        name: 'Nemotron-4 340B',
        category: 'Language Models',
        version: '1.2',
        size: '680GB',
        downloads: 892847,
        rating: 4.8,
        optimized: true
      }
    ],
    deployedModels: [
      {
        name: 'CryptoQuest AI Assistant',
        endpoint: 'https://api.nvidia.com/v1/cq-assistant',
        status: 'active',
        requests: 247893,
        avgLatency: 125
      },
      {
        name: 'Market Prediction Model',
        endpoint: 'https://api.nvidia.com/v1/market-pred',
        status: 'active',
        requests: 89472,
        avgLatency: 89
      }
    ]
  },
  gaming: {
    rtxEnabled: true,
    dlssVersion: '4.0',
    rayTracingLevel: 95,
    frameRate: 120,
    resolution: '4K',
    aiCharacters: 24,
    aceEnabled: true
  },
  aiModels: {
    totalModels: 47,
    activeModels: 12,
    trainingJobs: 3,
    accuracy: 96.2,
    inferenceSpeed: 2.4,
    gpuUtilization: 89.7
  },
  holographic: {
    renderingEnabled: true,
    complexity: 85,
    algorithms: ['OpenHolo', 'HoloPy', 'FFT Processing', 'Neural Enhancement'],
    performance: 94.5,
    qualityScore: 92,
    framerate: 60
  }
};

export function EnhancedNVIDIADashboard() {
  const [metrics, setMetrics] = useState<NVIDIACloudMetrics>(initialMetrics);
  const [activeSection, setActiveSection] = useState<'overview' | 'dgx' | 'ngc' | 'gaming' | 'ai' | 'holographic'>('overview');
  const [realTimeEnabled, setRealTimeEnabled] = useState(true);
  const [loading, setLoading] = useState(false);

  // Real-time metrics simulation
  useEffect(() => {
    if (!realTimeEnabled) return;

    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        dgxCloud: {
          ...prev.dgxCloud,
          instances: prev.dgxCloud.instances.map(instance => ({
            ...instance,
            utilization: Math.max(0, Math.min(100, instance.utilization + (Math.random() - 0.5) * 5))
          })),
          usedCredits: prev.dgxCloud.usedCredits + Math.random() * 10,
          apiCalls: prev.dgxCloud.apiCalls + Math.floor(Math.random() * 50)
        },
        gaming: {
          ...prev.gaming,
          frameRate: Math.max(60, prev.gaming.frameRate + (Math.random() - 0.5) * 10)
        },
        aiModels: {
          ...prev.aiModels,
          accuracy: Math.max(90, Math.min(100, prev.aiModels.accuracy + (Math.random() - 0.5) * 0.5)),
          gpuUtilization: Math.max(70, Math.min(100, prev.aiModels.gpuUtilization + (Math.random() - 0.5) * 3))
        },
        holographic: {
          ...prev.holographic,
          performance: Math.max(85, Math.min(100, prev.holographic.performance + (Math.random() - 0.5) * 2))
        }
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [realTimeEnabled]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-cyan-500 rounded-full">
            <Cpu className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
            NVIDIA DGX Cloud Platform
          </h1>
          <p className="text-xl text-gray-300">
            Enterprise AI Computing + NGC Catalog + Gaming AI + Holographic Rendering
          </p>
          <div className="flex items-center justify-center gap-4">
            <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500">
              <CheckCircle className="w-4 h-4 mr-1" />
              DGX H100 Active
            </Badge>
            <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500">
              <Activity className="w-4 h-4 mr-1" />
              {metrics.dgxCloud.apiCalls.toLocaleString()} API Calls
            </Badge>
            <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border-purple-500">
              <Brain className="w-4 h-4 mr-1" />
              {metrics.aiModels.activeModels} AI Models
            </Badge>
          </div>
        </div>

        {/* Real-time Toggle */}
        <div className="flex items-center justify-center gap-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4">
          <span className="text-gray-300">Real-time Monitoring</span>
          <Switch checked={realTimeEnabled} onCheckedChange={setRealTimeEnabled} />
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${realTimeEnabled ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
            <span className="text-sm text-gray-400">
              {realTimeEnabled ? 'Live' : 'Paused'}
            </span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.open('https://developer.nvidia.com/dgx-cloud', '_blank')}
            className="border-slate-600"
          >
            DGX Cloud Docs
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.open('https://catalog.ngc.nvidia.com/', '_blank')}
            className="border-slate-600"
          >
            NGC Catalog
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap gap-2 justify-center">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'dgx', label: 'DGX Cloud', icon: Cloud },
            { id: 'ngc', label: 'NGC Catalog', icon: Database },
            { id: 'gaming', label: 'RTX Gaming', icon: GamepadIcon },
            { id: 'ai', label: 'AI Models', icon: Brain },
            { id: 'holographic', label: 'Holographic', icon: Eye }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeSection === id
                  ? 'bg-green-600 text-white'
                  : 'text-gray-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Primary Content */}
          <div className="lg:col-span-2">
            {activeSection === 'overview' && <OverviewSection metrics={metrics} />}
            {activeSection === 'dgx' && <DGXCloudSection metrics={metrics.dgxCloud} />}
            {activeSection === 'ngc' && <NGCCatalogSection metrics={metrics.ngcCatalog} />}
            {activeSection === 'gaming' && <RTXGamingSection metrics={metrics.gaming} />}
            {activeSection === 'ai' && <AIModelsSection metrics={metrics.aiModels} />}
            {activeSection === 'holographic' && <HolographicSection metrics={metrics.holographic} />}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <ResourceUsageCard metrics={metrics} />
            <QuickActionsCard />
            <SystemStatusCard metrics={metrics} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Section Components
function OverviewSection({ metrics }: { metrics: NVIDIACloudMetrics }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">GPU Utilization</p>
                <p className="text-2xl font-bold text-white">
                  {metrics.aiModels.gpuUtilization.toFixed(1)}%
                </p>
              </div>
              <Cpu className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">AI Models</p>
                <p className="text-2xl font-bold text-white">
                  {metrics.aiModels.activeModels}/{metrics.aiModels.totalModels}
                </p>
              </div>
              <Brain className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Frame Rate</p>
                <p className="text-2xl font-bold text-white">
                  {metrics.gaming.frameRate.toFixed(0)} FPS
                </p>
              </div>
              <Monitor className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Credits Used</p>
                <p className="text-2xl font-bold text-white">
                  {((metrics.dgxCloud.usedCredits / metrics.dgxCloud.totalCredits) * 100).toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">DGX Cloud Instances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.dgxCloud.instances.map((instance) => (
                <div key={instance.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div>
                    <p className="font-semibold text-white">{instance.type}</p>
                    <p className="text-sm text-gray-400">{instance.region} • {instance.gpus} GPUs</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-green-400">{instance.utilization.toFixed(1)}%</p>
                    <p className="text-xs text-gray-400">${instance.cost}/hr</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">AI Model Accuracy</span>
                  <span className="text-green-400">{metrics.aiModels.accuracy.toFixed(1)}%</span>
                </div>
                <Progress value={metrics.aiModels.accuracy} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Holographic Quality</span>
                  <span className="text-purple-400">{metrics.holographic.qualityScore}%</span>
                </div>
                <Progress value={metrics.holographic.qualityScore} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">RTX Performance</span>
                  <span className="text-blue-400">{metrics.gaming.rayTracingLevel}%</span>
                </div>
                <Progress value={metrics.gaming.rayTracingLevel} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DGXCloudSection({ metrics }: { metrics: NVIDIACloudMetrics['dgxCloud'] }) {
  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Cloud className="w-5 h-5" />
            DGX Cloud Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-slate-700/50 rounded-lg">
                <h3 className="font-semibold text-white mb-2">Resource Usage</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Credits Used</span>
                    <span className="text-white">{metrics.usedCredits.toLocaleString()} / {metrics.totalCredits.toLocaleString()}</span>
                  </div>
                  <Progress value={(metrics.usedCredits / metrics.totalCredits) * 100} className="h-2" />
                </div>
              </div>
              
              <div className="p-4 bg-slate-700/50 rounded-lg">
                <h3 className="font-semibold text-white mb-2">API Usage</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">API Calls</span>
                    <span className="text-white">{metrics.apiCalls.toLocaleString()} / {metrics.maxApiCalls.toLocaleString()}</span>
                  </div>
                  <Progress value={(metrics.apiCalls / metrics.maxApiCalls) * 100} className="h-2" />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-white">Active Instances</h3>
              {metrics.instances.map((instance) => (
                <div key={instance.id} className="p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-white">{instance.type}</span>
                    <Badge variant={instance.status === 'running' ? 'default' : 'secondary'}>
                      {instance.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-400">Region:</span>
                      <span className="text-white ml-2">{instance.region}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">GPUs:</span>
                      <span className="text-white ml-2">{instance.gpus}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Memory:</span>
                      <span className="text-white ml-2">{instance.memory}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Storage:</span>
                      <span className="text-white ml-2">{instance.storage}</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Utilization</span>
                      <span className="text-green-400">{instance.utilization.toFixed(1)}%</span>
                    </div>
                    <Progress value={instance.utilization} className="h-2 mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function NGCCatalogSection({ metrics }: { metrics: NVIDIACloudMetrics['ngcCatalog'] }) {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="available" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="available">NGC Catalog</TabsTrigger>
          <TabsTrigger value="deployed">Deployed Models</TabsTrigger>
        </TabsList>
        
        <TabsContent value="available" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Database className="w-5 h-5" />
                Available Models
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.availableModels.map((model, index) => (
                  <div key={index} className="p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-white">{model.name}</h3>
                        <p className="text-sm text-gray-400">{model.category} • v{model.version}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {model.optimized && (
                          <Badge variant="outline" className="bg-green-500/20 text-green-400">
                            Optimized
                          </Badge>
                        )}
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          Deploy
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Size:</span>
                        <span className="text-white ml-2">{model.size}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Downloads:</span>
                        <span className="text-white ml-2">{model.downloads.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Rating:</span>
                        <span className="text-yellow-400 ml-2">★ {model.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="deployed" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Server className="w-5 h-5" />
                Deployed Models
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.deployedModels.map((model, index) => (
                  <div key={index} className="p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-white">{model.name}</h3>
                        <p className="text-sm text-gray-400 font-mono">{model.endpoint}</p>
                      </div>
                      <Badge variant={model.status === 'active' ? 'default' : 'secondary'}>
                        {model.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Requests:</span>
                        <span className="text-white ml-2">{model.requests.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Avg Latency:</span>
                        <span className="text-green-400 ml-2">{model.avgLatency}ms</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function RTXGamingSection({ metrics }: { metrics: NVIDIACloudMetrics['gaming'] }) {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <GamepadIcon className="w-5 h-5" />
          RTX Gaming Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 bg-slate-700/50 rounded-lg">
              <h3 className="font-semibold text-white mb-3">DLSS 4.0 Performance</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Frame Rate</span>
                  <span className="text-green-400 font-semibold">{metrics.frameRate.toFixed(0)} FPS</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Resolution</span>
                  <span className="text-white">{metrics.resolution}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">DLSS Version</span>
                  <span className="text-blue-400">{metrics.dlssVersion}</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-slate-700/50 rounded-lg">
              <h3 className="font-semibold text-white mb-3">Ray Tracing</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Ray Tracing Level</span>
                  <span className="text-purple-400">{metrics.rayTracingLevel}%</span>
                </div>
                <Progress value={metrics.rayTracingLevel} className="h-2" />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-slate-700/50 rounded-lg">
              <h3 className="font-semibold text-white mb-3">ACE AI Characters</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Active Characters</span>
                  <span className="text-yellow-400 font-semibold">{metrics.aiCharacters}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">ACE Enabled</span>
                  <Badge variant={metrics.aceEnabled ? 'default' : 'secondary'}>
                    {metrics.aceEnabled ? 'Yes' : 'No'}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-slate-700/50 rounded-lg">
              <h3 className="font-semibold text-white mb-3">RTX Features</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-green-500/20 text-green-400">Neural Rendering</Badge>
                <Badge variant="outline" className="bg-blue-500/20 text-blue-400">Global Illumination</Badge>
                <Badge variant="outline" className="bg-purple-500/20 text-purple-400">AI Denoising</Badge>
                <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400">Multi-Frame Generation</Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AIModelsSection({ metrics }: { metrics: NVIDIACloudMetrics['aiModels'] }) {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Brain className="w-5 h-5" />
          AI Models & Training
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                <p className="text-sm text-gray-400">Total Models</p>
                <p className="text-2xl font-bold text-white">{metrics.totalModels}</p>
              </div>
              <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                <p className="text-sm text-gray-400">Active Models</p>
                <p className="text-2xl font-bold text-green-400">{metrics.activeModels}</p>
              </div>
            </div>
            
            <div className="p-4 bg-slate-700/50 rounded-lg">
              <h3 className="font-semibold text-white mb-3">Training Jobs</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Active Jobs</span>
                  <span className="text-blue-400">{metrics.trainingJobs}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Avg Accuracy</span>
                  <span className="text-green-400">{metrics.accuracy.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-slate-700/50 rounded-lg">
              <h3 className="font-semibold text-white mb-3">Performance Metrics</h3>
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">GPU Utilization</span>
                    <span className="text-purple-400">{metrics.gpuUtilization.toFixed(1)}%</span>
                  </div>
                  <Progress value={metrics.gpuUtilization} className="h-2" />
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Inference Speed</span>
                  <span className="text-green-400">{metrics.inferenceSpeed.toFixed(1)}s</span>
                </div>
              </div>
            </div>
            
            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              Launch New Training Job
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function HolographicSection({ metrics }: { metrics: NVIDIACloudMetrics['holographic'] }) {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Holographic Rendering Engine
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                <p className="text-sm text-gray-400">Frame Rate</p>
                <p className="text-2xl font-bold text-green-400">{metrics.framerate} FPS</p>
              </div>
              <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                <p className="text-sm text-gray-400">Quality Score</p>
                <p className="text-2xl font-bold text-purple-400">{metrics.qualityScore}/100</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Complexity Level</span>
                  <span className="text-blue-400">{metrics.complexity}%</span>
                </div>
                <Progress value={metrics.complexity} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Performance</span>
                  <span className="text-green-400">{metrics.performance.toFixed(1)}%</span>
                </div>
                <Progress value={metrics.performance} className="h-2" />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-slate-700/50 rounded-lg">
              <h3 className="font-semibold text-white mb-3">Active Algorithms</h3>
              <div className="flex flex-wrap gap-2">
                {metrics.algorithms.map((algorithm, index) => (
                  <Badge key={index} variant="outline" className="bg-purple-500/20 text-purple-400">
                    {algorithm}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Enhance Rendering Quality
              </Button>
              <Button variant="outline" className="w-full border-slate-600">
                Export Holographic Data
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Sidebar Components
function ResourceUsageCard({ metrics }: { metrics: NVIDIACloudMetrics }) {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white text-sm">Resource Usage</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-400">DGX Credits</span>
            <span className="text-sm text-white">
              {((metrics.dgxCloud.usedCredits / metrics.dgxCloud.totalCredits) * 100).toFixed(1)}%
            </span>
          </div>
          <Progress value={(metrics.dgxCloud.usedCredits / metrics.dgxCloud.totalCredits) * 100} className="h-2" />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-400">GPU Utilization</span>
            <span className="text-sm text-green-400">{metrics.aiModels.gpuUtilization.toFixed(1)}%</span>
          </div>
          <Progress value={metrics.aiModels.gpuUtilization} className="h-2" />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-400">API Calls</span>
            <span className="text-sm text-blue-400">
              {((metrics.dgxCloud.apiCalls / metrics.dgxCloud.maxApiCalls) * 100).toFixed(1)}%
            </span>
          </div>
          <Progress value={(metrics.dgxCloud.apiCalls / metrics.dgxCloud.maxApiCalls) * 100} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}

function QuickActionsCard() {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white text-sm">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button className="w-full bg-green-600 hover:bg-green-700" size="sm">
          <Cloud className="w-4 h-4 mr-2" />
          Launch DGX Instance
        </Button>
        <Button className="w-full bg-purple-600 hover:bg-purple-700" size="sm">
          <Database className="w-4 h-4 mr-2" />
          Browse NGC Catalog
        </Button>
        <Button className="w-full bg-blue-600 hover:bg-blue-700" size="sm">
          <Brain className="w-4 h-4 mr-2" />
          Deploy AI Model
        </Button>
        <Button className="w-full bg-pink-600 hover:bg-pink-700" size="sm">
          <Eye className="w-4 h-4 mr-2" />
          Start Holographic
        </Button>
      </CardContent>
    </Card>
  );
}

function SystemStatusCard({ metrics }: { metrics: NVIDIACloudMetrics }) {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white text-sm flex items-center gap-2">
          <Activity className="w-4 h-4" />
          System Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">DGX Cloud</span>
          <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500">
            <CheckCircle className="w-3 h-3 mr-1" />
            Online
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">NGC Catalog</span>
          <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500">
            <CheckCircle className="w-3 h-3 mr-1" />
            Available
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">RTX Gaming</span>
          <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500">
            <Monitor className="w-3 h-3 mr-1" />
            Active
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">AI Models</span>
          <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500">
            <Brain className="w-3 h-3 mr-1" />
            {metrics.aiModels.activeModels} Running
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Holographic</span>
          <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border-purple-500">
            <Eye className="w-3 h-3 mr-1" />
            {metrics.holographic.framerate} FPS
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}