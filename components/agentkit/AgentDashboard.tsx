'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Bot, Zap, Coins, Users, Shield, ChevronRight } from 'lucide-react';

interface AgentStatus {
  name: string;
  description: string;
  walletAddress: string;
  availableActions: string[];
  network: string;
  initialized: boolean;
}

interface ActionResult {
  success: boolean;
  data?: any;
  error?: string;
}

export function AgentDashboard() {
  const [agentStatus, setAgentStatus] = useState<AgentStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionResult, setActionResult] = useState<ActionResult | null>(null);
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [actionParams, setActionParams] = useState<Record<string, any>>({});

  // Mock data for demonstration
  const mockAgentStatus: AgentStatus = {
    name: 'CryptoQuest AI Agent',
    description: 'AI-powered blockchain gaming assistant',
    walletAddress: '0x742d35Cc6634C0532925a3b8D75C9f4e2f2d1234',
    availableActions: ['transfer', 'getBalance', 'deployContract', 'stake', 'createGuild'],
    network: 'base',
    initialized: true
  };

  useEffect(() => {
    initializeAgent();
  }, []);

  const initializeAgent = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAgentStatus(mockAgentStatus);
    } catch (error) {
      console.error('Failed to initialize agent:', error);
    } finally {
      setLoading(false);
    }
  };

  const executeAction = async () => {
    if (!selectedAction) return;

    setActionLoading(true);
    setActionResult(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful response
      const mockResult: ActionResult = {
        success: true,
        data: {
          action: selectedAction,
          parameters: actionParams,
          result: `Successfully executed ${selectedAction}`,
          timestamp: new Date().toISOString()
        }
      };
      
      setActionResult(mockResult);
    } catch (error) {
      setActionResult({
        success: false,
        error: error instanceof Error ? error.message : 'Action failed'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const renderActionForm = () => {
    const actionConfigs = {
      transfer: {
        fields: [
          { name: 'to', label: 'Recipient Address', type: 'text', placeholder: '0x...' },
          { name: 'amount', label: 'Amount', type: 'number', placeholder: '0.1' },
          { name: 'asset', label: 'Asset', type: 'text', placeholder: 'ETH' }
        ]
      },
      getBalance: {
        fields: [
          { name: 'asset', label: 'Asset', type: 'text', placeholder: 'ETH' }
        ]
      },
      deployContract: {
        fields: [
          { name: 'contractCode', label: 'Contract Code', type: 'textarea', placeholder: 'pragma solidity...' },
          { name: 'constructorArgs', label: 'Constructor Args (JSON)', type: 'text', placeholder: '[]' }
        ]
      },
      stake: {
        fields: [
          { name: 'amount', label: 'Amount to Stake', type: 'number', placeholder: '100' },
          { name: 'duration', label: 'Duration (days)', type: 'number', placeholder: '30' }
        ]
      },
      createGuild: {
        fields: [
          { name: 'name', label: 'Guild Name', type: 'text', placeholder: 'Dragon Slayers' },
          { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Elite guild for...' },
          { name: 'membershipFee', label: 'Membership Fee', type: 'number', placeholder: '10' }
        ]
      }
    };

    const config = actionConfigs[selectedAction as keyof typeof actionConfigs];
    if (!config) return null;

    return (
      <div className="space-y-4">
        {config.fields.map((field) => (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>{field.label}</Label>
            {field.type === 'textarea' ? (
              <Textarea
                id={field.name}
                placeholder={field.placeholder}
                value={actionParams[field.name] || ''}
                onChange={(e) => setActionParams(prev => ({ ...prev, [field.name]: e.target.value }))}
              />
            ) : (
              <Input
                id={field.name}
                type={field.type}
                placeholder={field.placeholder}
                value={actionParams[field.name] || ''}
                onChange={(e) => setActionParams(prev => ({ 
                  ...prev, 
                  [field.name]: field.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value 
                }))}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Initializing AI Agent...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            CryptoQuest AI Agent
          </h1>
          <p className="text-xl text-gray-300">
            Your AI-powered blockchain gaming assistant
          </p>
        </div>

        {/* Agent Status */}
        {agentStatus && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Shield className="w-5 h-5" />
                Agent Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-300">Status</Label>
                  <Badge variant={agentStatus.initialized ? "default" : "destructive"} className="w-fit">
                    {agentStatus.initialized ? "Online" : "Offline"}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-300">Network</Label>
                  <Badge variant="outline" className="w-fit border-blue-500 text-blue-400">
                    {agentStatus.network.toUpperCase()}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-300">Wallet</Label>
                  <p className="text-sm text-white font-mono bg-slate-700 px-2 py-1 rounded">
                    {agentStatus.walletAddress}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <Tabs defaultValue="actions" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800 border-slate-700">
            <TabsTrigger value="actions" className="text-white">AI Actions</TabsTrigger>
            <TabsTrigger value="results" className="text-white">Results</TabsTrigger>
            <TabsTrigger value="analytics" className="text-white">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="actions" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Zap className="w-5 h-5" />
                  Execute Agent Actions
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Select an action for your AI agent to perform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-white">Available Actions</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {agentStatus?.availableActions.map((action) => (
                      <Button
                        key={action}
                        variant={selectedAction === action ? "default" : "outline"}
                        className={`justify-start ${
                          selectedAction === action 
                            ? "bg-purple-600 hover:bg-purple-700" 
                            : "border-slate-600 text-gray-300 hover:bg-slate-700"
                        }`}
                        onClick={() => {
                          setSelectedAction(action);
                          setActionParams({});
                          setActionResult(null);
                        }}
                      >
                        {action === 'transfer' && <Coins className="w-4 h-4 mr-2" />}
                        {action === 'createGuild' && <Users className="w-4 h-4 mr-2" />}
                        {action === 'stake' && <Zap className="w-4 h-4 mr-2" />}
                        {action === 'getBalance' && <Shield className="w-4 h-4 mr-2" />}
                        {action === 'deployContract' && <Bot className="w-4 h-4 mr-2" />}
                        {action.charAt(0).toUpperCase() + action.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>

                {selectedAction && (
                  <div className="space-y-4 p-4 bg-slate-700/50 rounded-lg">
                    <h3 className="font-semibold text-white">Action Parameters</h3>
                    {renderActionForm()}
                    <Button
                      onClick={executeAction}
                      disabled={actionLoading}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      {actionLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Executing...
                        </>
                      ) : (
                        <>
                          Execute {selectedAction}
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Action Results</CardTitle>
              </CardHeader>
              <CardContent>
                {actionResult ? (
                  <Alert className={`${actionResult.success ? 'border-green-500' : 'border-red-500'}`}>
                    <AlertDescription className="text-white">
                      {actionResult.success ? (
                        <div className="space-y-2">
                          <p className="text-green-400 font-medium">Action executed successfully!</p>
                          <pre className="text-sm bg-slate-900 p-2 rounded overflow-x-auto">
                            {JSON.stringify(actionResult.data, null, 2)}
                          </pre>
                        </div>
                      ) : (
                        <p className="text-red-400">Error: {actionResult.error}</p>
                      )}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <p className="text-gray-400">No results yet. Execute an action to see results here.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Agent Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-400">247</div>
                    <div className="text-sm text-gray-300">Actions Executed</div>
                  </div>
                  <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">98.5%</div>
                    <div className="text-sm text-gray-300">Success Rate</div>
                  </div>
                  <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-400">1.2s</div>
                    <div className="text-sm text-gray-300">Avg Response Time</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}