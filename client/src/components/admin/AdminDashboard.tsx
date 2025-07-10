import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  Shield, Users, Settings, Activity, AlertTriangle,
  Key, Database, Server, Code, Wallet, Eye,
  CheckCircle, XCircle, Clock, TrendingUp,
  Lock, Unlock, UserCheck, UserX, Monitor,
  Play, Pause, Crown, Sparkles
} from 'lucide-react';
import { 
  StreamlitHeader, 
  StreamlitControls, 
  StreamlitMetricCard, 
  StreamlitChartContainer,
  StreamlitStatus,
  StreamlitProgress,
  StreamlitDataTable,
  useStreamlit
} from '@/components/shared/StreamlitCore';

interface UserPermission {
  id: string;
  address: string;
  role: 'founder' | 'developer' | 'admin';
  permissions: string[];
  lastActive: Date;
  status: 'active' | 'suspended' | 'pending';
  accessLevel: number;
}

interface SystemMetrics {
  totalUsers: number;
  activeUsers: number;
  systemUptime: string;
  securityScore: number;
  transactionVolume: number;
  errorRate: number;
}

interface SecurityEvent {
  id: string;
  type: 'login' | 'permission_change' | 'suspicious_activity' | 'system_access';
  user: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  resolved: boolean;
}

const mockUsers: UserPermission[] = [
  {
    id: '1',
    address: '0xCc380FD8bfbdF0c020de64075b86C84c2BB0AE79',
    role: 'founder',
    permissions: ['all'],
    lastActive: new Date(),
    status: 'active',
    accessLevel: 10
  },
  {
    id: '2',
    address: '0x742d35Cc6634C0532925a3b8D1234567890abcdef',
    role: 'developer',
    permissions: ['development', 'testing', 'deployment'],
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: 'active',
    accessLevel: 7
  }
];

const mockMetrics: SystemMetrics = {
  totalUsers: 12847,
  activeUsers: 8932,
  systemUptime: '99.97%',
  securityScore: 98.4,
  transactionVolume: 2847329,
  errorRate: 0.003
};

const mockSecurityEvents: SecurityEvent[] = [
  {
    id: '1',
    type: 'login',
    user: '0xCc38...AE79',
    timestamp: new Date(),
    severity: 'low',
    description: 'Founder login from Miami, Florida',
    resolved: true
  },
  {
    id: '2',
    type: 'permission_change',
    user: '0x742d...cdef',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    severity: 'medium',
    description: 'Developer permission modified',
    resolved: true
  },
  {
    id: '3',
    type: 'suspicious_activity',
    user: '0x1234...5678',
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    severity: 'high',
    description: 'Multiple failed login attempts',
    resolved: false
  }
];

export function AdminDashboard() {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [users, setUsers] = useState<UserPermission[]>(mockUsers);
  const [metrics, setMetrics] = useState<SystemMetrics>(mockMetrics);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>(mockSecurityEvents);
  const [isFounderMode, setIsFounderMode] = useState(true); // Simulate founder access
  const [systemActive, setSystemActive] = useState(true);
  
  const { config, setConfig, fragments, metrics: streamlitMetrics, addFragment, toggleFragment } = useStreamlit({
    realTimeEnabled: true,
    autoRefresh: true,
    refreshInterval: 5000
  });

  // Initialize Streamlit fragments
  useEffect(() => {
    addFragment({
      id: 'system-metrics',
      title: 'System Metrics',
      component: <></>,
      dependencies: ['system'],
      updateFrequency: 5000,
      priority: 'high',
      status: 'active'
    });
    
    addFragment({
      id: 'user-management',
      title: 'User Management',
      component: <></>,
      dependencies: ['users'],
      updateFrequency: 10000,
      priority: 'high',
      status: 'active'
    });
    
    addFragment({
      id: 'security-events',
      title: 'Security Events',
      component: <></>,
      dependencies: ['security'],
      updateFrequency: 3000,
      priority: 'high',
      status: 'active'
    });
  }, []);

  // Real-time metrics updates
  useEffect(() => {
    if (!config.realTimeEnabled) return;
    
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        activeUsers: Math.max(0, prev.activeUsers + Math.floor((Math.random() - 0.5) * 20)),
        transactionVolume: prev.transactionVolume + Math.floor(Math.random() * 1000),
        errorRate: Math.max(0, prev.errorRate + (Math.random() - 0.5) * 0.001)
      }));
    }, config.refreshInterval);

    return () => clearInterval(interval);
  }, [config.realTimeEnabled, config.refreshInterval]);

  const updateUserStatus = (userId: string, status: UserPermission['status']) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status } : user
    ));
  };

  const updateUserPermissions = (userId: string, permissions: string[]) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, permissions } : user
    ));
  };

  const addSecurityEvent = (event: Omit<SecurityEvent, 'id'>) => {
    const newEvent: SecurityEvent = {
      ...event,
      id: Date.now().toString()
    };
    setSecurityEvents(prev => [newEvent, ...prev].slice(0, 50));
  };

  const resolveSecurityEvent = (eventId: string) => {
    setSecurityEvents(prev => prev.map(event => 
      event.id === eventId ? { ...event, resolved: true } : event
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <StreamlitHeader
          title="CryptoQuest Admin Dashboard"
          subtitle="Dual-access administrative control panel with founder and developer permissions, real-time monitoring, and comprehensive security management"
          icon={<Shield className="w-8 h-8 text-red-500" />}
          status={systemActive ? 'active' : 'paused'}
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
            title="Total Users"
            value={metrics.totalUsers.toLocaleString()}
            change={`${metrics.activeUsers.toLocaleString()} active`}
            icon={<Users className="w-5 h-5" />}
            trend="up"
          />
          <StreamlitMetricCard
            title="Security Score"
            value={`${metrics.securityScore}%`}
            change="↑ 0.2%"
            icon={<Shield className="w-5 h-5" />}
            trend="up"
          />
          <StreamlitMetricCard
            title="System Uptime"
            value={metrics.systemUptime}
            change="Last 30 days"
            icon={<Activity className="w-5 h-5" />}
            trend="up"
          />
          <StreamlitMetricCard
            title="Transaction Volume"
            value={metrics.transactionVolume.toLocaleString()}
            change={`${(metrics.errorRate * 100).toFixed(3)}% error rate`}
            icon={<TrendingUp className="w-5 h-5" />}
            trend="up"
          />
        </div>

        <StreamlitStatus
          status={isFounderMode ? 'success' : 'warning'}
          message={isFounderMode ? 'Founder Access Level' : 'Developer Access Level'}
          details={`Current access level: ${isFounderMode ? 'Full system control' : 'Limited to development functions'}`}
        />

        <StreamlitChartContainer title="Admin Control Panel" controls={
          <div className="flex gap-2">
            <button
              onClick={() => setSystemActive(!systemActive)}
              className={`p-2 rounded-lg ${systemActive ? 'bg-green-600' : 'bg-gray-600'}`}
            >
              {systemActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsFounderMode(!isFounderMode)}
              className={`p-2 rounded-lg ${isFounderMode ? 'bg-red-600' : 'bg-blue-600'}`}
            >
              {isFounderMode ? <Crown className="w-4 h-4" /> : <Code className="w-4 h-4" />}
            </button>
          </div>
        }>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <StreamlitProgress
                value={metrics.securityScore}
                max={100}
                label="Security Score"
                color="red"
              />
              <StreamlitProgress
                value={(metrics.activeUsers / metrics.totalUsers) * 100}
                max={100}
                label="Active Users Ratio"
                color="blue"
              />
              <StreamlitProgress
                value={100 - (metrics.errorRate * 100000)}
                max={100}
                label="System Reliability"
                color="green"
              />
            </div>
            <div className="space-y-4">
              <div className="bg-slate-700/50 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3">User Permissions</h3>
                <div className="space-y-2">
                  {users.map((user, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">{user.role}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        user.status === 'active' ? 'bg-green-500/20 text-green-400' : 
                        user.status === 'suspended' ? 'bg-red-500/20 text-red-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {user.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </StreamlitChartContainer>
      </div>
    </div>
  );
}