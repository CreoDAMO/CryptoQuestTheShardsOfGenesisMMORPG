import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Coins, 
  GamepadIcon, 
  TrendingUp, 
  Lock, 
  Users, 
  Trophy, 
  Zap,
  ExternalLink,
  CheckCircle,
  Activity,
  DollarSign,
  Wallet,
  Timer,
  BarChart3
} from 'lucide-react';

// Live CryptoQuest Smart Contracts on Polygon
export const CRYPTOQUEST_CONTRACTS = {
  CQT_PROXY: {
    address: '0x94ef57abfBff1AD70bD00a921e1d2437f31C1665',
    name: 'CQT Proxy',
    type: 'Token',
    description: 'Main CQT token proxy contract',
    polygonscan: 'https://polygonscan.com/address/0x94ef57abfbff1ad70bd00a921e1d2437f31c1665'
  },
  CQT_NFT: {
    address: '0x74cF604C8C235Eb1F520B47bF7106C46be815A30',
    name: 'CQT NFT',
    type: 'NFT',
    description: 'CryptoQuest NFT collection contract',
    polygonscan: 'https://polygonscan.com/address/0x74cf604c8c235eb1f520b47bf7106c46be815a30'
  },
  CQT_COLLECTIBLE: {
    address: '0x486F191e833a371F49F1500515997f583A2523f4',
    name: 'CQT Collectible NFT',
    type: 'NFT',
    description: 'Special collectible NFTs for CryptoQuest',
    polygonscan: 'https://polygonscan.com/address/0x486f191e833a371f49f1500515997f583a2523f4'
  },
  TIMELOCK: {
    address: '0x2b5949F0540884c67c1F169B9F535571656E6695',
    name: 'Timelock Controller',
    type: 'Governance',
    description: 'Timelock controller for delayed governance execution',
    polygonscan: 'https://polygonscan.com/address/0x2b5949f0540884c67c1f169b9f535571656e6695'
  },
  CQT_DAO: {
    address: '0xC44187f4EAE5ddB4edA465dDEdf8b9A6dFEB073c',
    name: 'CQT DAO',
    type: 'Governance',
    description: 'Decentralized Autonomous Organization for CryptoQuest',
    polygonscan: 'https://polygonscan.com/address/0xc44187f4eae5ddb4eda465ddedf8b9a6dfeb073c'
  },
  CQT_MARKETPLACE: {
    address: '0x7E59e3fC320AcfAe0fbd20789348016729B00Edc',
    name: 'CQT Marketplace',
    type: 'Marketplace',
    description: 'Official CryptoQuest NFT marketplace',
    polygonscan: 'https://polygonscan.com/address/0x7e59e3fc320acfae0fbd20789348016729b00edc'
  },
  CQT_STAKING: {
    address: '0x4915363b9524D103C8910E3C7D5516b9b4D0F333',
    name: 'CQT Staking',
    type: 'DeFi',
    description: 'Staking contract for CQT tokens',
    polygonscan: 'https://polygonscan.com/address/0x4915363b9524d103c8910e3c7d5516b9b4d0f333'
  },
  CQT_FARMING: {
    address: '0x95e2091ec85D20253a9cc7f37b1308bD56E8732f',
    name: 'CQT Farming',
    type: 'DeFi',
    description: 'Yield farming contract for CQT',
    polygonscan: 'https://polygonscan.com/address/0x95e2091ec85d20253a9cc7f37b1308bd56e8732f'
  },
  CQTSOG_MMORPG: {
    address: '0xC233e56015c1BBCD7fbD58415D11084E7f98f488',
    name: 'CQTSOG MMORPG',
    type: 'Gaming',
    description: 'Main MMORPG contract for CryptoQuest: The Shards of Genesis',
    polygonscan: 'https://polygonscan.com/address/0xc233e56015c1bbcd7fbd58415d11084e7f98f488'
  },
  CQT_WALLET: {
    address: '0xcB393B9Cb94ac7F35F05E001C4b0d512fc590Eb2',
    name: 'CQT Wallet',
    type: 'Gaming',
    description: 'Game wallet builder for CryptoQuest',
    polygonscan: 'https://polygonscan.com/address/0xcb393b9cb94ac7f35f05e001c4b0d512fc590eb2'
  },
  CQT_SWAP: {
    address: '0x9d1075B41cd80Ab08179F36bc17a7Ff8708748ba',
    name: 'CQT Swap',
    type: 'DeFi',
    description: 'Token swap contract for CQT',
    polygonscan: 'https://polygonscan.com/address/0x9d1075b41cd80ab08179f36bc17a7ff8708748ba'
  },
  CQT_TOKENSALE: {
    address: '0x8206b3a98dBd4e3cd767e0e5CAbA6C6aF68044C8',
    name: 'CQT Token Sales',
    type: 'ICO',
    description: 'Token sales contract for CQT',
    polygonscan: 'https://polygonscan.com/address/0x8206b3a98dbd4e3cd767e0e5caba6c6af68044c8'
  }
};

interface ContractMetrics {
  totalValue: number;
  transactionCount: number;
  activeUsers: number;
  contractHealth: number;
}

export function ContractIntegration() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'defi' | 'gaming' | 'governance' | 'nft'>('all');
  const [contractMetrics, setContractMetrics] = useState<Record<string, ContractMetrics>>({});
  const [loading, setLoading] = useState(false);

  // Simulated contract metrics (in production, this would fetch from blockchain)
  useEffect(() => {
    const mockMetrics: Record<string, ContractMetrics> = {
      CQT_PROXY: { totalValue: 2450000, transactionCount: 15234, activeUsers: 3421, contractHealth: 98 },
      CQT_STAKING: { totalValue: 1250000, transactionCount: 8765, activeUsers: 2156, contractHealth: 95 },
      CQT_FARMING: { totalValue: 875000, transactionCount: 5432, activeUsers: 1876, contractHealth: 97 },
      CQT_MARKETPLACE: { totalValue: 340000, transactionCount: 12876, activeUsers: 4532, contractHealth: 93 },
      CQTSOG_MMORPG: { totalValue: 156000, transactionCount: 23456, activeUsers: 7890, contractHealth: 96 },
      CQT_DAO: { totalValue: 95000, transactionCount: 1234, activeUsers: 567, contractHealth: 99 },
      CQT_SWAP: { totalValue: 750000, transactionCount: 9876, activeUsers: 2345, contractHealth: 94 }
    };
    setContractMetrics(mockMetrics);
  }, []);

  const getContractIcon = (type: string) => {
    switch (type) {
      case 'Token': return <Coins className="w-6 h-6" />;
      case 'NFT': return <Trophy className="w-6 h-6" />;
      case 'DeFi': return <TrendingUp className="w-6 h-6" />;
      case 'Gaming': return <GamepadIcon className="w-6 h-6" />;
      case 'Governance': return <Users className="w-6 h-6" />;
      case 'Marketplace': return <BarChart3 className="w-6 h-6" />;
      default: return <Shield className="w-6 h-6" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Token': return 'from-blue-500 to-cyan-500';
      case 'NFT': return 'from-purple-500 to-pink-500';
      case 'DeFi': return 'from-green-500 to-emerald-500';
      case 'Gaming': return 'from-orange-500 to-red-500';
      case 'Governance': return 'from-indigo-500 to-blue-500';
      case 'Marketplace': return 'from-yellow-500 to-orange-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const filteredContracts = Object.entries(CRYPTOQUEST_CONTRACTS).filter(([_, contract]) => {
    if (activeCategory === 'all') return true;
    return contract.type.toLowerCase() === activeCategory;
  });

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Live Smart Contracts
        </h1>
        <p className="text-gray-300">Complete CryptoQuest ecosystem on Polygon</p>
      </div>

      {/* Contract Categories */}
      <div className="flex justify-center">
        <div className="flex bg-slate-800/50 border border-slate-700 rounded-lg p-1">
          {[
            { id: 'all', label: 'All Contracts', count: Object.keys(CRYPTOQUEST_CONTRACTS).length },
            { id: 'defi', label: 'DeFi', count: 3 },
            { id: 'gaming', label: 'Gaming', count: 2 },
            { id: 'governance', label: 'Governance', count: 2 },
            { id: 'nft', label: 'NFT', count: 2 }
          ].map(({ id, label, count }) => (
            <button
              key={id}
              onClick={() => setActiveCategory(id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-colors ${
                activeCategory === id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {label}
              <span className="text-xs bg-slate-600 px-2 py-1 rounded-full">{count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Contract Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-white">Total Value</h3>
            <DollarSign className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-blue-400">
            ${formatNumber(Object.values(contractMetrics).reduce((acc, metrics) => acc + metrics.totalValue, 0))}
          </div>
          <div className="text-sm text-gray-300">Across all contracts</div>
        </div>

        <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-white">Transactions</h3>
            <Activity className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-green-400">
            {formatNumber(Object.values(contractMetrics).reduce((acc, metrics) => acc + metrics.transactionCount, 0))}
          </div>
          <div className="text-sm text-gray-300">Total transactions</div>
        </div>

        <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibent text-white">Active Users</h3>
            <Users className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-purple-400">
            {formatNumber(Object.values(contractMetrics).reduce((acc, metrics) => acc + metrics.activeUsers, 0))}
          </div>
          <div className="text-sm text-gray-300">Unique addresses</div>
        </div>

        <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 border border-orange-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-white">Health Score</h3>
            <CheckCircle className="w-5 h-5 text-orange-400" />
          </div>
          <div className="text-2xl font-bold text-orange-400">
            {Math.round(Object.values(contractMetrics).reduce((acc, metrics) => acc + metrics.contractHealth, 0) / Object.values(contractMetrics).length)}%
          </div>
          <div className="text-sm text-gray-300">Average health</div>
        </div>
      </div>

      {/* Contract Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContracts.map(([key, contract]) => {
          const metrics = contractMetrics[key];
          return (
            <div key={key} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-blue-500/50 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${getTypeColor(contract.type)}`}>
                  {getContractIcon(contract.type)}
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${metrics?.contractHealth >= 95 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                  <span className="text-sm text-gray-400">{metrics?.contractHealth}%</span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <h3 className="text-lg font-bold text-white">{contract.name}</h3>
                <p className="text-sm text-gray-300">{contract.description}</p>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium bg-gradient-to-r ${getTypeColor(contract.type)} text-white`}>
                    {contract.type}
                  </span>
                </div>
              </div>

              {metrics && (
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Value:</span>
                    <span className="text-sm font-semibold text-white">${formatNumber(metrics.totalValue)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Transactions:</span>
                    <span className="text-sm font-semibold text-white">{formatNumber(metrics.transactionCount)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Users:</span>
                    <span className="text-sm font-semibold text-white">{formatNumber(metrics.activeUsers)}</span>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="text-xs text-gray-400 font-mono break-all">
                  {contract.address}
                </div>
                <a
                  href={contract.polygonscan}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 w-full p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded text-white text-sm font-medium hover:from-blue-600 hover:to-purple-600 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  View on Polygonscan
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}