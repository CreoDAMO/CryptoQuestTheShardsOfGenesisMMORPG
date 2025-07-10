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
  Shield,
  Play,
  Pause,
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
  const [gameActive, setGameActive] = useState(true);
  
  const { config, setConfig, fragments, metrics: streamlitMetrics, addFragment, toggleFragment } = useStreamlit({
    realTimeEnabled: true,
    autoRefresh: true,
    refreshInterval: 1000
  });

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
    // Initialize Streamlit fragments
    addFragment({
      id: 'rtx-performance',
      title: 'RTX Performance',
      component: <></>,
      dependencies: ['gpu'],
      updateFrequency: 1000,
      priority: 'high',
      status: 'active'
    });
    
    addFragment({
      id: 'dlss-metrics',
      title: 'DLSS',
      component: <></>,
      dependencies: ['dlss'],
      updateFrequency: 2000,
      priority: 'high',
      status: 'active'
    });
    
    addFragment({
      id: 'ace-npcs',
      title: 'ACE NPCs',
      component: <></>,
      dependencies: ['ai'],
      updateFrequency: 5000,
      priority: 'medium',
      status: 'active'
    });
  }, []);

  useEffect(() => {
    if (!config.realTimeEnabled) return;
    
    const interval = setInterval(() => {
      // Simulate real-time metrics updates
      setMetrics(prev => ({
        ...prev,
        fps: Math.max(30, Math.min(240, prev.fps + (Math.random() - 0.5) * 10)),
        gpuUtilization: Math.max(50, Math.min(95, prev.gpuUtilization + (Math.random() - 0.5) * 5)),
        latency: Math.max(5, Math.min(15, prev.latency + (Math.random() - 0.5) * 2)),
        dlssPerformanceGain: Math.max(50, Math.min(120, prev.dlssPerformanceGain + (Math.random() - 0.5) * 5))
      }));
    }, config.refreshInterval);

    return () => clearInterval(interval);
  }, [config.realTimeEnabled, config.refreshInterval]);

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
        <StreamlitHeader
          title="NVIDIA RTX Gaming Hub"
          subtitle="Advanced RTX technologies for CryptoQuest with real-time performance monitoring"
          icon={<Sparkles className="w-8 h-8 text-green-500" />}
          status={gameActive ? 'active' : 'paused'}
          metrics={streamlitMetrics}
        />

        <StreamlitControls
          config={config}
          onConfigChange={setConfig}
          fragments={fragments}
          onFragmentToggle={toggleFragment}
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StreamlitMetricCard
            title="Frame Rate"
            value={`${Math.round(metrics.fps)} FPS`}
            change={`${dlssEnabled ? '+' + Math.round(metrics.dlssPerformanceGain) + '%' : 'DLSS OFF'}`}
            icon={<Monitor className="w-5 h-5" />}
            trend={metrics.fps > 120 ? 'up' : 'neutral'}
          />
          <StreamlitMetricCard
            title="GPU Utilization"
            value={`${metrics.gpuUtilization}%`}
            change={`${metrics.powerConsumption}W`}
            icon={<Cpu className="w-5 h-5" />}
            trend={metrics.gpuUtilization > 80 ? 'up' : 'neutral'}
          />
          <StreamlitMetricCard
            title="Latency"
            value={`${metrics.latency}ms`}
            change={reflexEnabled ? 'Reflex ON' : 'Reflex OFF'}
            icon={<Zap className="w-5 h-5" />}
            trend={metrics.latency < 10 ? 'up' : 'neutral'}
          />
          <StreamlitMetricCard
            title="DLSS Gain"
            value={`${Math.round(metrics.dlssPerformanceGain)}%`}
            change={dlssEnabled ? 'Active' : 'Disabled'}
            icon={<Eye className="w-5 h-5" />}
            trend="up"
          />
        </div>

        <StreamlitStatus
          status={rtxEnabled ? 'success' : 'warning'}
          message={rtxEnabled ? 'RTX Technologies Active' : 'RTX Technologies Disabled'}
          details={`${capabilities.gpuModel} • Driver ${capabilities.driverVersion} • ${capabilities.tensorCoresAvailable ? 'Tensor Cores Available' : 'No Tensor Cores'}`}
        />

        <StreamlitChartContainer title="RTX Performance Metrics" controls={
          <div className="flex gap-2">
            <button
              onClick={() => setGameActive(!gameActive)}
              className={`p-2 rounded-lg ${gameActive ? 'bg-green-600' : 'bg-gray-600'}`}
            >
              {gameActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={toggleRTX}
              className={`p-2 rounded-lg ${rtxEnabled ? 'bg-green-600' : 'bg-red-600'}`}
              disabled={loading}
            >
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        }>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <StreamlitProgress
                value={metrics.fps}
                max={240}
                label="Frame Rate (FPS)"
                color="green"
              />
              <StreamlitProgress
                value={metrics.gpuUtilization}
                max={100}
                label="GPU Utilization (%)"
                color="blue"
              />
              <StreamlitProgress
                value={100 - metrics.latency}
                max={100}
                label="Responsiveness (Lower latency = better)"
                color="purple"
              />
            </div>
            <div className="space-y-4">
              <div className="bg-slate-700/50 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3">RTX Features</h3>
                <div className="space-y-2">
                  {rtxFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">{feature.name}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        feature.enabled ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {feature.enabled ? feature.performance : 'OFF'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </StreamlitChartContainer>

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