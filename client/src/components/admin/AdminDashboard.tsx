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
  Lock, Unlock, UserCheck, UserX, Monitor
} from 'lucide-react';

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

  // Real-time metrics updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        activeUsers: prev.activeUsers + Math.floor((Math.random() - 0.5) * 20),
        transactionVolume: prev.transactionVolume + Math.floor(Math.random() * 1000),
        errorRate: Math.max(0, prev.errorRate + (Math.random() - 0.5) * 0.001)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full mb-4">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
            CryptoQuest Admin Dashboard
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Dual-access administrative control panel with founder and developer permissions,
            real-time monitoring, and comprehensive security management
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <Badge variant="outline" className={`${isFounderMode ? 'bg-red-500/20 text-red-400 border-red-400' : 'bg-blue-500/20 text-blue-400 border-blue-400'}`}>
              <Shield className="w-4 h-4 mr-2" />
              {isFounderMode ? 'Founder Access' : 'Developer Access'}
            </Badge>
            <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-400">
              <CheckCircle className="w-4 h-4 mr-2" />
              Security Score: {metrics.securityScore}%
            </Badge>
            <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border-purple-400">
              <Activity className="w-4 h-4 mr-2" />
              Uptime: {metrics.systemUptime}
            </Badge>
          </div>
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6 mx-auto mb-2 text-blue-400" />
              <div className="text-2xl font-bold text-white">{metrics.totalUsers.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Total Users</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4 text-center">
              <Activity className="w-6 h-6 mx-auto mb-2 text-green-400" />
              <div className="text-2xl font-bold text-white">{metrics.activeUsers.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Active Users</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-purple-400" />
              <div className="text-2xl font-bold text-white">{metrics.transactionVolume.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Transactions</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4 text-center">
              <Shield className="w-6 h-6 mx-auto mb-2 text-red-400" />
              <div className="text-2xl font-bold text-white">{metrics.securityScore}%</div>
              <div className="text-sm text-gray-400">Security</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4 text-center">
              <Monitor className="w-6 h-6 mx-auto mb-2 text-cyan-400" />
              <div className="text-2xl font-bold text-white">{metrics.systemUptime}</div>
              <div className="text-sm text-gray-400">Uptime</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4 text-center">
              <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
              <div className="text-2xl font-bold text-white">{(metrics.errorRate * 100).toFixed(3)}%</div>
              <div className="text-sm text-gray-400">Error Rate</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800/50">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="system">System Status</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Users className="w-5 h-5 text-blue-400" />
                    User List
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {users.map((user) => (
                    <div 
                      key={user.id} 
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedUser === user.id 
                          ? 'border-blue-500 bg-blue-500/10' 
                          : 'border-slate-600 bg-slate-700/50'
                      }`}
                      onClick={() => setSelectedUser(user.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            user.status === 'active' ? 'bg-green-400' :
                            user.status === 'suspended' ? 'bg-red-400' : 'bg-yellow-400'
                          }`} />
                          <div>
                            <div className="text-white font-semibold">{user.role.toUpperCase()}</div>
                            <div className="text-sm text-gray-400 font-mono">{user.address}</div>
                          </div>
                        </div>
                        <Badge variant="outline" className={`${
                          user.role === 'founder' ? 'bg-red-500/20 text-red-400 border-red-400' :
                          user.role === 'developer' ? 'bg-blue-500/20 text-blue-400 border-blue-400' :
                          'bg-gray-500/20 text-gray-400 border-gray-400'
                        }`}>
                          Level {user.accessLevel}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-400">
                        Last active: {user.lastActive.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {selectedUser && (
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Settings className="w-5 h-5 text-purple-400" />
                      User Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {(() => {
                      const user = users.find(u => u.id === selectedUser);
                      if (!user) return null;

                      return (
                        <>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Address:</span>
                              <span className="text-white font-mono text-sm">{user.address}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Role:</span>
                              <span className="text-white">{user.role}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Access Level:</span>
                              <span className="text-white">{user.accessLevel}/10</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Status:</span>
                              <Badge variant="outline" className={`${
                                user.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-400' :
                                user.status === 'suspended' ? 'bg-red-500/20 text-red-400 border-red-400' :
                                'bg-yellow-500/20 text-yellow-400 border-yellow-400'
                              }`}>
                                {user.status}
                              </Badge>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h4 className="text-white font-semibold">Permissions</h4>
                            <div className="flex flex-wrap gap-2">
                              {user.permissions.map((permission) => (
                                <Badge key={permission} variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-400">
                                  {permission}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {isFounderMode && (
                            <div className="space-y-2">
                              <h4 className="text-white font-semibold">Actions</h4>
                              <div className="grid grid-cols-2 gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => updateUserStatus(user.id, user.status === 'active' ? 'suspended' : 'active')}
                                  className={user.status === 'active' ? 'border-red-400 text-red-400' : 'border-green-400 text-green-400'}
                                >
                                  {user.status === 'active' ? <Lock className="w-4 h-4 mr-2" /> : <Unlock className="w-4 h-4 mr-2" />}
                                  {user.status === 'active' ? 'Suspend' : 'Activate'}
                                </Button>
                                <Button size="sm" variant="outline" className="border-blue-400 text-blue-400">
                                  <Key className="w-4 h-4 mr-2" />
                                  Edit Permissions
                                </Button>
                              </div>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    Security Events
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                  {securityEvents.map((event) => (
                    <div 
                      key={event.id} 
                      className={`p-3 rounded-lg border ${
                        event.severity === 'critical' ? 'border-red-500 bg-red-500/10' :
                        event.severity === 'high' ? 'border-orange-500 bg-orange-500/10' :
                        event.severity === 'medium' ? 'border-yellow-500 bg-yellow-500/10' :
                        'border-slate-600 bg-slate-700/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            event.severity === 'critical' ? 'bg-red-400' :
                            event.severity === 'high' ? 'bg-orange-400' :
                            event.severity === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                          }`} />
                          <span className="text-white font-semibold">{event.type.replace('_', ' ').toUpperCase()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">{event.timestamp.toLocaleTimeString()}</span>
                          {event.resolved ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => resolveSecurityEvent(event.id)}
                              className="h-6 px-2 text-xs border-green-400 text-green-400"
                            >
                              Resolve
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-gray-300">{event.description}</div>
                      <div className="text-xs text-gray-400 mt-1">User: {event.user}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Shield className="w-5 h-5 text-green-400" />
                    Security Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Overall Security Score</span>
                      <span className="text-green-400">{metrics.securityScore}%</span>
                    </div>
                    <Progress value={metrics.securityScore} className="h-3" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Failed Login Attempts</span>
                      <span className="text-yellow-400">7</span>
                    </div>
                    <Progress value={15} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Active Security Events</span>
                      <span className="text-red-400">{securityEvents.filter(e => !e.resolved).length}</span>
                    </div>
                    <Progress value={securityEvents.filter(e => !e.resolved).length * 10} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Two-Factor Authentication</span>
                      <span className="text-green-400">98.7%</span>
                    </div>
                    <Progress value={98.7} className="h-2" />
                  </div>

                  <div className="pt-4 border-t border-slate-600">
                    <h4 className="text-white font-semibold mb-3">Quick Actions</h4>
                    <div className="space-y-2">
                      <Button className="w-full bg-red-600 hover:bg-red-700" size="sm">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Emergency Lockdown
                      </Button>
                      <Button variant="outline" className="w-full border-yellow-400 text-yellow-400" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Audit Logs
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Server className="w-5 h-5 text-blue-400" />
                    Server Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">CPU Usage:</span>
                      <span className="text-white">23.4%</span>
                    </div>
                    <Progress value={23.4} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Memory:</span>
                      <span className="text-white">67.8%</span>
                    </div>
                    <Progress value={67.8} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Storage:</span>
                      <span className="text-white">45.2%</span>
                    </div>
                    <Progress value={45.2} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Database className="w-5 h-5 text-green-400" />
                    Database Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Connection Pool:</span>
                    <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-400">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Healthy
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Replication:</span>
                    <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-400">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Synced
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Backup Status:</span>
                    <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-400">
                      <Clock className="w-3 h-3 mr-1" />
                      2h ago
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Code className="w-5 h-5 text-purple-400" />
                    Application Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Build Version:</span>
                    <span className="text-white">v2.4.1</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Environment:</span>
                    <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-400">
                      Production
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Last Deploy:</span>
                    <span className="text-white">1h ago</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="permissions" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Key className="w-5 h-5 text-yellow-400" />
                  Permission Matrix
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-600">
                        <th className="text-left p-2 text-gray-400">Permission</th>
                        <th className="text-center p-2 text-red-400">Founder</th>
                        <th className="text-center p-2 text-blue-400">Developer</th>
                        <th className="text-center p-2 text-gray-400">Admin</th>
                      </tr>
                    </thead>
                    <tbody className="space-y-2">
                      {[
                        'System Administration',
                        'User Management',
                        'Security Configuration',
                        'Database Access',
                        'Code Deployment',
                        'Financial Operations',
                        'Contract Management',
                        'Emergency Actions'
                      ].map((permission) => (
                        <tr key={permission} className="border-b border-slate-700">
                          <td className="p-2 text-white">{permission}</td>
                          <td className="text-center p-2">
                            <CheckCircle className="w-4 h-4 text-green-400 mx-auto" />
                          </td>
                          <td className="text-center p-2">
                            {['Code Deployment', 'Database Access', 'System Administration'].includes(permission) ? (
                              <CheckCircle className="w-4 h-4 text-green-400 mx-auto" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-400 mx-auto" />
                            )}
                          </td>
                          <td className="text-center p-2">
                            {['User Management', 'Security Configuration'].includes(permission) ? (
                              <CheckCircle className="w-4 h-4 text-green-400 mx-auto" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-400 mx-auto" />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Activity className="w-5 h-5 text-green-400" />
                    Real-time Monitoring
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400">{metrics.activeUsers.toLocaleString()}</div>
                    <div className="text-sm text-gray-400">Active Users Right Now</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-xl font-bold text-blue-400">847</div>
                      <div className="text-gray-400">API Calls/min</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-purple-400">23ms</div>
                      <div className="text-gray-400">Avg Response</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Monitor className="w-5 h-5 text-cyan-400" />
                    System Health
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">API Endpoint</span>
                      <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-400">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Operational
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Database</span>
                      <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-400">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Operational
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Blockchain RPC</span>
                      <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-400">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Operational
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">CDN</span>
                      <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-400">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Degraded
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}