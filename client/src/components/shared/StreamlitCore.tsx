import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Globe, 
  Settings, 
  RefreshCw, 
  Activity, 
  Play, 
  Pause, 
  MonitorSpeaker,
  BarChart3,
  TrendingUp,
  Zap,
  Shield,
  Eye,
  Clock
} from 'lucide-react';

// Core Streamlit-inspired interfaces and components
export interface StreamlitFragment {
  id: string;
  title: string;
  component: React.ReactNode;
  dependencies: string[];
  updateFrequency: number;
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'loading' | 'error' | 'paused';
}

export interface StreamlitConfig {
  realTimeEnabled: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
  theme: 'dark' | 'light';
  animation: boolean;
  sound: boolean;
  density: 'compact' | 'comfortable' | 'spacious';
}

export interface StreamlitMetrics {
  totalFragments: number;
  activeFragments: number;
  updateRate: number;
  performanceScore: number;
  memoryUsage: number;
  networkLatency: number;
}

// Streamlit Header Component
export function StreamlitHeader({ 
  title, 
  subtitle, 
  icon, 
  status = 'active',
  metrics 
}: {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  status?: 'active' | 'loading' | 'error';
  metrics?: StreamlitMetrics;
}) {
  return (
    <div className="text-center space-y-4 mb-8">
      <div className="flex items-center justify-center gap-3">
        <div className="relative">
          {icon}
          <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse ${
            status === 'active' ? 'bg-green-500' : 
            status === 'loading' ? 'bg-yellow-500' : 'bg-red-500'
          }`}></div>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
          {title}
        </h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Globe className="w-4 h-4" />
          <span className="capitalize">{status}</span>
        </div>
      </div>
      {subtitle && (
        <p className="text-gray-300 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
      {metrics && (
        <div className="flex justify-center gap-4 text-xs text-gray-400">
          <span>Fragments: {metrics.activeFragments}/{metrics.totalFragments}</span>
          <span>Performance: {metrics.performanceScore}%</span>
          <span>Latency: {metrics.networkLatency}ms</span>
        </div>
      )}
    </div>
  );
}

// Streamlit Control Panel
export function StreamlitControls({ 
  config, 
  onConfigChange, 
  fragments,
  onFragmentToggle 
}: {
  config: StreamlitConfig;
  onConfigChange: (config: StreamlitConfig) => void;
  fragments: StreamlitFragment[];
  onFragmentToggle: (fragmentId: string) => void;
}) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Streamlit Controls</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-300">Real-time</span>
            <button
              onClick={() => onConfigChange({ ...config, realTimeEnabled: !config.realTimeEnabled })}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                config.realTimeEnabled ? 'bg-green-500' : 'bg-gray-600'
              }`}
            >
              <div
                className={`absolute w-4 h-4 bg-white rounded-full top-1 transition-transform ${
                  config.realTimeEnabled ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-300">Auto-refresh</span>
            <button
              onClick={() => onConfigChange({ ...config, autoRefresh: !config.autoRefresh })}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                config.autoRefresh ? 'bg-blue-500' : 'bg-gray-600'
              }`}
            >
              <div
                className={`absolute w-4 h-4 bg-white rounded-full top-1 transition-transform ${
                  config.autoRefresh ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div className="flex items-center gap-2 text-green-400">
            <Activity className="w-4 h-4" />
            <span className="text-sm">
              {fragments.filter(f => f.status === 'active').length} Active
            </span>
          </div>
        </div>
      </div>

      {/* Fragment Controls */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {fragments.map((fragment) => (
          <button
            key={fragment.id}
            onClick={() => onFragmentToggle(fragment.id)}
            className={`p-2 rounded-lg text-xs font-medium transition-all ${
              fragment.status === 'active'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            <div className="flex items-center justify-between">
              <span>{fragment.title}</span>
              <div className={`w-2 h-2 rounded-full ${
                fragment.status === 'active' ? 'bg-green-400' :
                fragment.status === 'loading' ? 'bg-yellow-400' :
                fragment.status === 'error' ? 'bg-red-400' : 'bg-gray-400'
              }`} />
            </div>
          </button>
        ))}
      </div>

      {/* Performance Metrics */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-700/50 rounded-lg p-3">
          <div className="text-xs text-gray-400">Update Rate</div>
          <div className="text-lg font-bold text-blue-400">
            {config.refreshInterval/1000}s
          </div>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-3">
          <div className="text-xs text-gray-400">Theme</div>
          <div className="text-lg font-bold text-purple-400 capitalize">
            {config.theme}
          </div>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-3">
          <div className="text-xs text-gray-400">Density</div>
          <div className="text-lg font-bold text-green-400 capitalize">
            {config.density}
          </div>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-3">
          <div className="text-xs text-gray-400">Animation</div>
          <div className="text-lg font-bold text-orange-400">
            {config.animation ? 'ON' : 'OFF'}
          </div>
        </div>
      </div>
    </div>
  );
}

// Streamlit Metric Card
export function StreamlitMetricCard({ 
  title, 
  value, 
  change, 
  icon, 
  trend = 'neutral',
  size = 'medium'
}: {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  size?: 'small' | 'medium' | 'large';
}) {
  const sizeClasses = {
    small: 'p-3',
    medium: 'p-4',
    large: 'p-6'
  };

  const valueSizes = {
    small: 'text-lg',
    medium: 'text-2xl',
    large: 'text-3xl'
  };

  return (
    <div className={`bg-slate-800/50 border border-slate-700 rounded-xl ${sizeClasses[size]}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-300">{title}</h3>
        <div className="text-blue-400">{icon}</div>
      </div>
      <div className={`font-bold text-white ${valueSizes[size]} mb-1`}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      {change && (
        <div className={`text-sm flex items-center gap-1 ${
          trend === 'up' ? 'text-green-400' :
          trend === 'down' ? 'text-red-400' : 'text-gray-400'
        }`}>
          {trend === 'up' && <TrendingUp className="w-3 h-3" />}
          {trend === 'down' && <TrendingDown className="w-3 h-3" />}
          {trend === 'neutral' && <Activity className="w-3 h-3" />}
          {change}
        </div>
      )}
    </div>
  );
}

// Streamlit Chart Container
export function StreamlitChartContainer({ 
  title, 
  children, 
  controls,
  fullscreen = false
}: {
  title: string;
  children: React.ReactNode;
  controls?: React.ReactNode;
  fullscreen?: boolean;
}) {
  return (
    <div className={`bg-slate-800/50 border border-slate-700 rounded-xl p-6 ${fullscreen ? 'col-span-full' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        {controls && (
          <div className="flex items-center gap-2">
            {controls}
          </div>
        )}
      </div>
      <div className="relative">
        {children}
      </div>
    </div>
  );
}

// Streamlit Status Indicator
export function StreamlitStatus({ 
  status, 
  message, 
  details 
}: {
  status: 'success' | 'warning' | 'error' | 'info';
  message: string;
  details?: string;
}) {
  const statusConfig = {
    success: { color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500' },
    warning: { color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500' },
    error: { color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500' },
    info: { color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500' }
  };

  const config = statusConfig[status];

  return (
    <div className={`${config.bg} ${config.border} border rounded-lg p-4 mb-4`}>
      <div className={`${config.color} font-medium`}>{message}</div>
      {details && (
        <div className="text-gray-300 text-sm mt-1">{details}</div>
      )}
    </div>
  );
}

// Streamlit Progress Bar
export function StreamlitProgress({ 
  value, 
  max = 100, 
  label, 
  color = 'blue' 
}: {
  value: number;
  max?: number;
  label?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange';
}) {
  const percentage = (value / max) * 100;
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500'
  };

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-300">{label}</span>
          <span className="text-white">{value}/{max}</span>
        </div>
      )}
      <div className="w-full bg-slate-700 rounded-full h-2">
        <div 
          className={`h-2 rounded-full ${colorClasses[color]} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// Streamlit Data Table
export function StreamlitDataTable({ 
  data, 
  columns, 
  searchable = true,
  sortable = true 
}: {
  data: any[];
  columns: Array<{ key: string; label: string; sortable?: boolean }>;
  searchable?: boolean;
  sortable?: boolean;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const filteredData = searchable ? 
    data.filter(item => 
      Object.values(item).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    ) : data;

  const sortedData = sortable && sortColumn ? 
    [...filteredData].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      const modifier = sortDirection === 'asc' ? 1 : -1;
      return aVal < bVal ? -modifier : aVal > bVal ? modifier : 0;
    }) : filteredData;

  return (
    <div className="space-y-4">
      {searchable && (
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-400 uppercase bg-slate-700">
            <tr>
              {columns.map((column) => (
                <th 
                  key={column.key} 
                  className="px-6 py-3 cursor-pointer hover:bg-slate-600"
                  onClick={() => {
                    if (sortable && column.sortable !== false) {
                      if (sortColumn === column.key) {
                        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                      } else {
                        setSortColumn(column.key);
                        setSortDirection('asc');
                      }
                    }
                  }}
                >
                  {column.label}
                  {sortColumn === column.key && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item, index) => (
              <tr key={index} className="bg-slate-800 border-b border-slate-700 hover:bg-slate-700">
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 text-white">
                    {item[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Hook for Streamlit functionality
export function useStreamlit(initialConfig: Partial<StreamlitConfig> = {}) {
  const [config, setConfig] = useState<StreamlitConfig>({
    realTimeEnabled: true,
    autoRefresh: true,
    refreshInterval: 5000,
    theme: 'dark',
    animation: true,
    sound: false,
    density: 'comfortable',
    ...initialConfig
  });

  const [fragments, setFragments] = useState<StreamlitFragment[]>([]);
  const [metrics, setMetrics] = useState<StreamlitMetrics>({
    totalFragments: 0,
    activeFragments: 0,
    updateRate: 0,
    performanceScore: 100,
    memoryUsage: 0,
    networkLatency: 0
  });

  const addFragment = (fragment: StreamlitFragment) => {
    setFragments(prev => [...prev, fragment]);
  };

  const updateFragment = (id: string, updates: Partial<StreamlitFragment>) => {
    setFragments(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const toggleFragment = (id: string) => {
    setFragments(prev => prev.map(f => 
      f.id === id ? { 
        ...f, 
        status: f.status === 'active' ? 'paused' : 'active' 
      } : f
    ));
  };

  const removeFragment = (id: string) => {
    setFragments(prev => prev.filter(f => f.id !== id));
  };

  useEffect(() => {
    setMetrics(prev => ({
      ...prev,
      totalFragments: fragments.length,
      activeFragments: fragments.filter(f => f.status === 'active').length
    }));
  }, [fragments]);

  return {
    config,
    setConfig,
    fragments,
    metrics,
    addFragment,
    updateFragment,
    toggleFragment,
    removeFragment
  };
}