import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Activity, 
  Database, 
  Server, 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  Zap,
  Globe,
  Lock,
  Eye,
  Settings,
  BarChart3,
  Terminal,
  Wifi,
  HardDrive,
  Cpu,
  Network,
  Bell,
  Play,
  Pause,
  RefreshCw,
  Power,
  MonitorSpeaker,
  Radar,
  Satellite,
  Command
} from 'lucide-react';

// System Status Types
interface SystemStatus {
  overall: 'operational' | 'warning' | 'critical';
  services: ServiceStatus[];
  metrics: SystemMetrics;
  alerts: Alert[];
  security: SecurityStatus;
}

interface ServiceStatus {
  name: string;
  status: 'online' | 'offline' | 'degraded';
  uptime: number;
  response_time: number;
  load: number;
}

interface SystemMetrics {
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  network_io: number;
  active_connections: number;
  total_requests: number;
}

interface Alert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  timestamp: Date;
  acknowledged: boolean;
}

interface SecurityStatus {
  threat_level: 'low' | 'medium' | 'high' | 'critical';
  active_sessions: number;
  failed_logins: number;
  blocked_ips: number;
  security_score: number;
}

export function OperatingCenterDashboard() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    overall: 'operational',
    services: [
      { name: 'API Gateway', status: 'online', uptime: 99.9, response_time: 45, load: 67 },
      { name: 'Database', status: 'online', uptime: 100, response_time: 12, load: 34 },
      { name: 'NVIDIA Cloud', status: 'online', uptime: 98.7, response_time: 78, load: 89 },
      { name: 'Coinbase Services', status: 'degraded', uptime: 95.2, response_time: 156, load: 23 },
      { name: 'DeFi Hub', status: 'online', uptime: 99.5, response_time: 67, load: 78 },
      { name: 'AI Agents', status: 'online', uptime: 97.8, response_time: 234, load: 56 }
    ],
    metrics: {
      cpu_usage: 67,
      memory_usage: 78,
      disk_usage: 45,
      network_io: 89,
      active_connections: 2847,
      total_requests: 1248931
    },
    alerts: [
      { id: '1', type: 'warning', message: 'Coinbase API rate limit approaching', timestamp: new Date(), acknowledged: false },
      { id: '2', type: 'info', message: 'System backup completed successfully', timestamp: new Date(), acknowledged: true },
      { id: '3', type: 'critical', message: 'Unusual traffic pattern detected', timestamp: new Date(), acknowledged: false }
    ],
    security: {
      threat_level: 'medium',
      active_sessions: 1847,
      failed_logins: 23,
      blocked_ips: 156,
      security_score: 94
    }
  });

  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedService, setSelectedService] = useState<string>('');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        // Simulate real-time updates
        setSystemStatus(prev => ({
          ...prev,
          metrics: {
            ...prev.metrics,
            cpu_usage: Math.max(10, Math.min(95, prev.metrics.cpu_usage + (Math.random() - 0.5) * 10)),
            memory_usage: Math.max(10, Math.min(95, prev.metrics.memory_usage + (Math.random() - 0.5) * 8)),
            network_io: Math.max(10, Math.min(100, prev.metrics.network_io + (Math.random() - 0.5) * 15)),
            active_connections: Math.max(0, prev.metrics.active_connections + Math.floor((Math.random() - 0.5) * 100)),
            total_requests: prev.metrics.total_requests + Math.floor(Math.random() * 50)
          }
        }));
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': case 'operational': return 'text-green-400';
      case 'degraded': case 'warning': return 'text-yellow-400';
      case 'offline': case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online': case 'operational': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'degraded': case 'warning': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'offline': case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const acknowledgeAlert = (alertId: string) => {
    setSystemStatus(prev => ({
      ...prev,
      alerts: prev.alerts.map(alert => 
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    }));
  };

  return (
    <div className="min-h-screen bg-black p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Command className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">CryptoQuest Operating Center</h1>
              <p className="text-gray-400">Advanced System Control & Monitoring</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Auto Refresh</span>
              <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Maintenance Mode</span>
              <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
            </div>
            <Badge className={getStatusBadge(systemStatus.overall)}>
              {systemStatus.overall.toUpperCase()}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Dashboard */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 bg-gray-900 border-gray-700">
          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">Overview</TabsTrigger>
          <TabsTrigger value="services" className="data-[state=active]:bg-blue-600">Services</TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-blue-600">Security</TabsTrigger>
          <TabsTrigger value="monitoring" className="data-[state=active]:bg-blue-600">Monitoring</TabsTrigger>
          <TabsTrigger value="alerts" className="data-[state=active]:bg-blue-600">Alerts</TabsTrigger>
          <TabsTrigger value="control" className="data-[state=active]:bg-blue-600">Control</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* System Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">CPU Usage</p>
                    <p className="text-2xl font-bold text-white">{systemStatus.metrics.cpu_usage}%</p>
                  </div>
                  <Cpu className="w-8 h-8 text-blue-500" />
                </div>
                <Progress value={systemStatus.metrics.cpu_usage} className="mt-3" />
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Memory Usage</p>
                    <p className="text-2xl font-bold text-white">{systemStatus.metrics.memory_usage}%</p>
                  </div>
                  <HardDrive className="w-8 h-8 text-green-500" />
                </div>
                <Progress value={systemStatus.metrics.memory_usage} className="mt-3" />
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Network I/O</p>
                    <p className="text-2xl font-bold text-white">{systemStatus.metrics.network_io}%</p>
                  </div>
                  <Network className="w-8 h-8 text-purple-500" />
                </div>
                <Progress value={systemStatus.metrics.network_io} className="mt-3" />
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Active Connections</p>
                    <p className="text-2xl font-bold text-white">{systemStatus.metrics.active_connections.toLocaleString()}</p>
                  </div>
                  <Users className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Service Status Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Service Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemStatus.services.map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${service.status === 'online' ? 'bg-green-500' : service.status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                        <span className="text-white font-medium">{service.name}</span>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusBadge(service.status)}>
                          {service.status}
                        </Badge>
                        <p className="text-xs text-gray-400 mt-1">{service.uptime}% uptime</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Threat Level</span>
                    <Badge className={getStatusBadge(systemStatus.security.threat_level)}>
                      {systemStatus.security.threat_level.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Security Score</span>
                    <span className="text-green-400 font-bold">{systemStatus.security.security_score}/100</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Active Sessions</span>
                    <span className="text-white">{systemStatus.security.active_sessions.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Blocked IPs</span>
                    <span className="text-red-400">{systemStatus.security.blocked_ips}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {systemStatus.services.map((service, index) => (
              <Card key={index} className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <span>{service.name}</span>
                    <Badge className={getStatusBadge(service.status)}>
                      {service.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Uptime</span>
                      <span className="text-white">{service.uptime}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Response Time</span>
                      <span className="text-white">{service.response_time}ms</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Load</span>
                      <span className="text-white">{service.load}%</span>
                    </div>
                    <Progress value={service.load} className="mt-3" />
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Play className="w-4 h-4 mr-2" />
                        Restart
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Settings className="w-4 h-4 mr-2" />
                        Configure
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-4">
                      <Shield className="w-10 h-10 text-green-500" />
                    </div>
                    <p className="text-2xl font-bold text-white">{systemStatus.security.security_score}/100</p>
                    <p className="text-gray-400">Security Score</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                      <p className="text-xl font-bold text-white">{systemStatus.security.active_sessions}</p>
                      <p className="text-sm text-gray-400">Active Sessions</p>
                    </div>
                    <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                      <p className="text-xl font-bold text-red-400">{systemStatus.security.failed_logins}</p>
                      <p className="text-sm text-gray-400">Failed Logins</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Security Controls
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Two-Factor Authentication</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">IP Whitelisting</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Rate Limiting</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">DDoS Protection</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Intrusion Detection</span>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Monitoring Tab */}
        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Real-time Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Total Requests</span>
                    <span className="text-white font-bold">{systemStatus.metrics.total_requests.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Requests/min</span>
                    <span className="text-green-400 font-bold">2,847</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Error Rate</span>
                    <span className="text-red-400 font-bold">0.02%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Avg Response Time</span>
                    <span className="text-blue-400 font-bold">87ms</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Terminal className="w-5 h-5" />
                  System Logs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm font-mono">
                  <div className="text-green-400">[INFO] API Gateway responding normally</div>
                  <div className="text-yellow-400">[WARN] Coinbase API rate limit at 85%</div>
                  <div className="text-blue-400">[DEBUG] DeFi Hub processed 1,247 transactions</div>
                  <div className="text-green-400">[INFO] Database backup completed</div>
                  <div className="text-red-400">[ERROR] Failed login attempt from 192.168.1.100</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-6">
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Bell className="w-5 h-5" />
                System Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemStatus.alerts.map((alert) => (
                  <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${
                    alert.type === 'critical' ? 'bg-red-900/20 border-red-500' :
                    alert.type === 'warning' ? 'bg-yellow-900/20 border-yellow-500' :
                    alert.type === 'error' ? 'bg-red-900/20 border-red-500' :
                    'bg-blue-900/20 border-blue-500'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className={`w-5 h-5 ${
                          alert.type === 'critical' ? 'text-red-400' :
                          alert.type === 'warning' ? 'text-yellow-400' :
                          alert.type === 'error' ? 'text-red-400' :
                          'text-blue-400'
                        }`} />
                        <div>
                          <p className="text-white font-medium">{alert.message}</p>
                          <p className="text-sm text-gray-400">{alert.timestamp.toLocaleString()}</p>
                        </div>
                      </div>
                      {!alert.acknowledged && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => acknowledgeAlert(alert.id)}
                        >
                          Acknowledge
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Control Tab */}
        <TabsContent value="control" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  System Controls
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button className="w-full" variant="outline">
                    <Power className="w-4 h-4 mr-2" />
                    System Restart
                  </Button>
                  <Button className="w-full" variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh Services
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Database className="w-4 h-4 mr-2" />
                    Database Backup
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Shield className="w-4 h-4 mr-2" />
                    Security Scan
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Radar className="w-5 h-5" />
                  Emergency Controls
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button className="w-full" variant="destructive">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Emergency Shutdown
                  </Button>
                  <Button className="w-full" variant="destructive">
                    <Lock className="w-4 h-4 mr-2" />
                    Lockdown Mode
                  </Button>
                  <Button className="w-full" variant="destructive">
                    <Shield className="w-4 h-4 mr-2" />
                    Activate Firewall
                  </Button>
                  <Button className="w-full" variant="destructive">
                    <Satellite className="w-4 h-4 mr-2" />
                    Failover Systems
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}