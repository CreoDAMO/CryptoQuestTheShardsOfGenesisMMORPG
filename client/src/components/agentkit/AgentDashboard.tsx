import React, { useState, useEffect } from 'react';
import { Bot, Zap, Coins, Users, Shield, ChevronRight } from 'lucide-react';

interface AgentStatus {
  name: string;
  description: string;
  walletAddress: string;
  availableActions: string[];
  network: string;
  initialized: boolean;
}

export function AgentDashboard() {
  const [agentStatus, setAgentStatus] = useState<AgentStatus | null>(null);
  const [loading, setLoading] = useState(false);

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
    setAgentStatus(mockAgentStatus);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            AgentKit Dashboard
          </h1>
          <p className="text-xl text-gray-300">AI-powered blockchain gaming assistant</p>
        </div>

        {agentStatus && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4">Agent Status</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">Status:</span>
                  <span className={`${agentStatus.initialized ? 'text-green-400' : 'text-red-400'}`}>
                    {agentStatus.initialized ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Network:</span>
                  <span className="text-blue-400">{agentStatus.network}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Actions:</span>
                  <span className="text-purple-400">{agentStatus.availableActions.length}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4">Wallet Info</h3>
              <div className="space-y-2">
                <div className="text-sm text-gray-300">Address:</div>
                <div className="text-xs text-blue-400 font-mono break-all">
                  {agentStatus.walletAddress}
                </div>
                <button className="w-full mt-3 px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white text-sm transition-colors">
                  View on Explorer
                </button>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
              <div className="space-y-2">
                {agentStatus.availableActions.slice(0, 3).map((action, index) => (
                  <button
                    key={index}
                    className="w-full px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded text-white text-sm text-left transition-colors"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
            <div className="text-2xl font-bold text-purple-400">247</div>
            <div className="text-sm text-gray-300">Actions Executed</div>
          </div>
          <div className="text-center p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
            <div className="text-2xl font-bold text-green-400">98.5%</div>
            <div className="text-sm text-gray-300">Success Rate</div>
          </div>
          <div className="text-center p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
            <div className="text-2xl font-bold text-blue-400">1.2s</div>
            <div className="text-sm text-gray-300">Avg Response Time</div>
          </div>
        </div>
      </div>
    </div>
  );
}