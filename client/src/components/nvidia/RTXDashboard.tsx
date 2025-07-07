import React, { useState, useEffect } from 'react';
import { 
  Monitor, 
  Zap, 
  Settings, 
  Cpu, 
  Gauge, 
  Sparkles, 
  Bot, 
  Users,
  Eye,
  Activity,
  Clock,
  TrendingUp,
  Gamepad2,
  Shield
} from 'lucide-react';

interface RTXMetrics {
  fps: number;
  frameTime: number;
  gpuUtilization: number;
  vramUsage: number;
  latency: number;
  dlssPerformanceGain: number;
  rayTracingImpact: number;
  powerConsumption: number;
}

interface RTXCapabilities {
  dlssSupported: boolean;
  dlss4Supported: boolean;
  rayTracingSupported: boolean;
  reflexSupported: boolean;
  aceSupported: boolean;
  rtxKitSupported: boolean;
  neuralShadersSupported: boolean;
  multiFrameGeneration: boolean;
  tensorCoresAvailable: boolean;
  gpuModel: string;
  driverVersion: string;
}

export function RTXDashboard() {
  const [rtxEnabled, setRtxEnabled] = useState(true);
  const [dlssEnabled, setDlssEnabled] = useState(true);
  const [reflexEnabled, setReflexEnabled] = useState(true);
  const [aceEnabled, setAceEnabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const [metrics, setMetrics] = useState<RTXMetrics>({
    fps: 165,
    frameTime: 6.06,
    gpuUtilization: 78,
    vramUsage: 12.4,
    latency: 8,
    dlssPerformanceGain: 94.1,
    rayTracingImpact: -15,
    powerConsumption: 320
  });

  const [capabilities] = useState<RTXCapabilities>({
    dlssSupported: true,
    dlss4Supported: true,
    rayTracingSupported: true,
    reflexSupported: true,
    aceSupported: true,
    rtxKitSupported: true,
    neuralShadersSupported: true,
    multiFrameGeneration: true,
    tensorCoresAvailable: true,
    gpuModel: 'GeForce RTX 5090',
    driverVersion: '572.16'
  });

  const [aceCharacters] = useState([
    { id: 'npc_001', name: 'Sage Aldric', type: 'wise', status: 'active' },
    { id: 'npc_002', name: 'Merchant Kira', type: 'friendly', status: 'active' },
    { id: 'npc_003', name: 'Guard Captain', type: 'aggressive', status: 'training' }
  ]);

  const [rtxFeatures] = useState([
    { name: 'DLSS 4 Multi Frame Generation', enabled: true, performance: '+800%' },
    { name: 'RTX Neural Shaders', enabled: true, performance: '+45%' },
    { name: 'RTX Mega Geometry', enabled: true, performance: '+25%' },
    { name: 'Neural Texture Compression', enabled: true, performance: '8x compression' },
    { name: 'ACE Conversational AI', enabled: true, performance: 'Real-time' },
    { name: 'Reflex 2 Low Latency', enabled: true, performance: '8ms latency' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time metrics updates
      setMetrics(prev => ({
        ...prev,
        fps: prev.fps + (Math.random() - 0.5) * 10,
        gpuUtilization: Math.max(50, Math.min(95, prev.gpuUtilization + (Math.random() - 0.5) * 5)),
        latency: Math.max(5, Math.min(15, prev.latency + (Math.random() - 0.5) * 2))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const toggleRTX = async () => {
    setLoading(true);
    setRtxEnabled(!rtxEnabled);
    
    // Simulate performance change
    setTimeout(() => {
      setMetrics(prev => ({
        ...prev,
        fps: rtxEnabled ? 85 : 165,
        frameTime: rtxEnabled ? 11.76 : 6.06,
        rayTracingImpact: rtxEnabled ? 0 : -15
      }));
      setLoading(false);
    }, 1500);
  };

  const toggleDLSS = async () => {
    setLoading(true);
    setDlssEnabled(!dlssEnabled);
    
    setTimeout(() => {
      setMetrics(prev => ({
        ...prev,
        dlssPerformanceGain: dlssEnabled ? 0 : 94.1,
        fps: dlssEnabled ? prev.fps * 0.6 : prev.fps * 1.67
      }));
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            NVIDIA RTX Gaming Hub
          </h1>
          <p className="text-xl text-gray-300">Advanced RTX technologies for CryptoQuest</p>
        </div>

        {/* GPU Information */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">GPU Status</h2>
            <Monitor className="w-6 h-6 text-green-400" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-slate-700/50 rounded-lg">
              <div className="text-xl font-bold text-green-400">{capabilities.gpuModel}</div>
              <div className="text-sm text-gray-300">Graphics Card</div>
            </div>
            <div className="text-center p-4 bg-slate-700/50 rounded-lg">
              <div className="text-xl font-bold text-blue-400">{capabilities.driverVersion}</div>
              <div className="text-sm text-gray-300">Driver Version</div>
            </div>
            <div className="text-center p-4 bg-slate-700/50 rounded-lg">
              <div className="text-xl font-bold text-purple-400">5th Gen</div>
              <div className="text-sm text-gray-300">Tensor Cores</div>
            </div>
            <div className="text-center p-4 bg-slate-700/50 rounded-lg">
              <div className="text-xl font-bold text-orange-400">RTX Kit</div>
              <div className="text-sm text-gray-300">Neural Rendering</div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-500/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-white">Frame Rate</h3>
              <Activity className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-blue-400">{Math.round(metrics.fps)}</div>
            <div className="text-sm text-gray-300">FPS</div>
          </div>

          <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-500/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-white">Latency</h3>
              <Clock className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-green-400">{Math.round(metrics.latency)}</div>
            <div className="text-sm text-gray-300">ms</div>
          </div>

          <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-white">GPU Usage</h3>
              <Cpu className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-purple-400">{Math.round(metrics.gpuUtilization)}</div>
            <div className="text-sm text-gray-300">%</div>
          </div>

          <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 border border-orange-500/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-white">VRAM</h3>
              <Gauge className="w-5 h-5 text-orange-400" />
            </div>
            <div className="text-3xl font-bold text-orange-400">{metrics.vramUsage.toFixed(1)}</div>
            <div className="text-sm text-gray-300">GB</div>
          </div>
        </div>

        {/* RTX Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">RTX Controls</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Ray Tracing</span>
                <button
                  onClick={toggleRTX}
                  disabled={loading}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    rtxEnabled ? 'bg-green-500' : 'bg-gray-600'
                  } ${loading ? 'opacity-50' : ''}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    rtxEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-300">DLSS 4</span>
                <button
                  onClick={toggleDLSS}
                  disabled={loading}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    dlssEnabled ? 'bg-blue-500' : 'bg-gray-600'
                  } ${loading ? 'opacity-50' : ''}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    dlssEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-300">Reflex 2</span>
                <button
                  onClick={() => setReflexEnabled(!reflexEnabled)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    reflexEnabled ? 'bg-purple-500' : 'bg-gray-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    reflexEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-300">ACE for Games</span>
                <button
                  onClick={() => setAceEnabled(!aceEnabled)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    aceEnabled ? 'bg-orange-500' : 'bg-gray-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    aceEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">ACE Characters</h3>
            <div className="space-y-3">
              {aceCharacters.map((character, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Bot className="w-5 h-5 text-blue-400" />
                    <div>
                      <div className="text-white font-medium">{character.name}</div>
                      <div className="text-sm text-gray-400 capitalize">{character.type}</div>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs ${
                    character.status === 'active' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {character.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RTX Features */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">RTX Features</h2>
            <Settings className="w-6 h-6 text-green-400" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rtxFeatures.map((feature, index) => (
              <div key={index} className="p-4 bg-slate-700/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-white">{feature.name}</h3>
                  <div className={`w-3 h-3 rounded-full ${
                    feature.enabled ? 'bg-green-400' : 'bg-gray-400'
                  }`} />
                </div>
                <div className="text-sm text-gray-300">Performance: {feature.performance}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Impact */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Performance Impact</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-slate-700/50 rounded-lg">
              <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-400">+{metrics.dlssPerformanceGain.toFixed(1)}%</div>
              <div className="text-sm text-gray-300">DLSS Performance Gain</div>
            </div>
            <div className="text-center p-4 bg-slate-700/50 rounded-lg">
              <Shield className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-400">{metrics.rayTracingImpact}%</div>
              <div className="text-sm text-gray-300">Ray Tracing Impact</div>
            </div>
            <div className="text-center p-4 bg-slate-700/50 rounded-lg">
              <Zap className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-400">{metrics.powerConsumption}W</div>
              <div className="text-sm text-gray-300">Power Consumption</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}