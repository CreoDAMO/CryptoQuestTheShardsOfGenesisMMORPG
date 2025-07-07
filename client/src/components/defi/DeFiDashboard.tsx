import React, { useState, useEffect } from 'react';
import { 
  Coins, 
  TrendingUp, 
  Layers, 
  Zap, 
  BarChart3, 
  PieChart, 
  ArrowUpDown, 
  Gift,
  Lock,
  Unlock,
  BookOpen,
  ShoppingCart,
  Wallet,
  DollarSign,
  Timer,
  Award,
  Activity
} from 'lucide-react';

interface DeFiMetrics {
  staking: {
    totalStaked: number;
    userStaked: number;
    pendingRewards: number;
    stakingAPR: number;
    totalParticipants: number;
  };
  farming: {
    totalDeposited: number;
    userDeposited: number;
    pendingHarvest: number;
    farmingAPR: number;
    poolAllocation: number;
  };
  liquidity: {
    matic_cqt_tvl: number;
    weth_cqt_tvl: number;
    base_cqt_usdc_tvl: number;
    total_liquidity: number;
    trading_volume_24h: number;
  };
  nftBooks: {
    totalBooks: number;
    userBooks: number;
    availableTiers: Array<{
      tierId: number;
      price: number;
      supply: number;
      sold: number;
      format: string;
    }>;
  };
}

export function DeFiDashboard() {
  const [activeSection, setActiveSection] = useState<'staking' | 'farming' | 'liquidity' | 'nftbooks'>('staking');
  const [loading, setLoading] = useState(false);
  
  const [metrics, setMetrics] = useState<DeFiMetrics>({
    staking: {
      totalStaked: 1250000,
      userStaked: 5000,
      pendingRewards: 125.5,
      stakingAPR: 85.3,
      totalParticipants: 3250
    },
    farming: {
      totalDeposited: 2750000,
      userDeposited: 10000,
      pendingHarvest: 245.8,
      farmingAPR: 125.4,
      poolAllocation: 15
    },
    liquidity: {
      matic_cqt_tvl: 2400000,
      weth_cqt_tvl: 1850000,
      base_cqt_usdc_tvl: 950000,
      total_liquidity: 5200000,
      trading_volume_24h: 340000
    },
    nftBooks: {
      totalBooks: 12500,
      userBooks: 3,
      availableTiers: [
        { tierId: 1, price: 0.1, supply: 1000, sold: 750, format: 'PDF + EPUB' },
        { tierId: 2, price: 50, supply: 500, sold: 320, format: 'Interactive' },
        { tierId: 3, price: 0.5, supply: 100, sold: 85, format: 'AR Experience' }
      ]
    }
  });

  const [stakingForm, setStakingForm] = useState({
    action: 'stake',
    tokenId: '',
    amount: ''
  });

  const [farmingForm, setFarmingForm] = useState({
    action: 'deposit',
    amount: ''
  });

  const [swapForm, setSwapForm] = useState({
    tokenIn: 'CQT',
    tokenOut: 'MATIC',
    amountIn: '',
    slippage: '1'
  });

  const formatNumber = (num: number, decimals = 2) => {
    if (num >= 1e6) return (num / 1e6).toFixed(decimals) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(decimals) + 'K';
    return num.toFixed(decimals);
  };

  const handleStakingAction = async () => {
    setLoading(true);
    try {
      // Mock staking action
      console.log('Staking action:', stakingForm);
      setTimeout(() => {
        setMetrics(prev => ({
          ...prev,
          staking: {
            ...prev.staking,
            pendingRewards: prev.staking.pendingRewards + 10
          }
        }));
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Staking failed:', error);
      setLoading(false);
    }
  };

  const handleFarmingAction = async () => {
    setLoading(true);
    try {
      // Mock farming action
      console.log('Farming action:', farmingForm);
      setTimeout(() => {
        setMetrics(prev => ({
          ...prev,
          farming: {
            ...prev.farming,
            pendingHarvest: prev.farming.pendingHarvest + 25
          }
        }));
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Farming failed:', error);
      setLoading(false);
    }
  };

  const handleSwap = async () => {
    setLoading(true);
    try {
      // Mock swap action
      console.log('Swap action:', swapForm);
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Swap failed:', error);
      setLoading(false);
    }
  };

  const renderStaking = () => (
    <div className="space-y-6">
      {/* Staking Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-white">Total Staked</h3>
            <Lock className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-purple-400">{formatNumber(metrics.staking.totalStaked)} CQT</div>
          <div className="text-sm text-gray-300">{metrics.staking.totalParticipants} participants</div>
        </div>

        <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-white">Your Staked</h3>
            <Coins className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-green-400">{formatNumber(metrics.staking.userStaked)} CQT</div>
          <div className="text-sm text-gray-300">Your contribution</div>
        </div>

        <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-white">Pending Rewards</h3>
            <Gift className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-blue-400">{metrics.staking.pendingRewards.toFixed(2)} CQT</div>
          <div className="text-sm text-gray-300">Ready to claim</div>
        </div>

        <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 border border-orange-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-white">APR</h3>
            <TrendingUp className="w-5 h-5 text-orange-400" />
          </div>
          <div className="text-2xl font-bold text-orange-400">{metrics.staking.stakingAPR}%</div>
          <div className="text-sm text-gray-300">Annual return</div>
        </div>
      </div>

      {/* Staking Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Stake NFTs</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">NFT Token ID</label>
              <input 
                type="text" 
                value={stakingForm.tokenId}
                onChange={(e) => setStakingForm({...stakingForm, tokenId: e.target.value})}
                placeholder="Enter NFT Token ID" 
                className="w-full p-3 bg-slate-700 border border-slate-600 rounded text-white"
              />
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleStakingAction}
                disabled={loading || !stakingForm.tokenId}
                className="flex-1 p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded text-white font-medium hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Processing...' : 'Stake NFT'}
              </button>
              <button 
                onClick={() => setStakingForm({...stakingForm, action: 'unstake'})}
                className="flex-1 p-3 bg-gradient-to-r from-gray-500 to-gray-600 rounded text-white font-medium hover:from-gray-600 hover:to-gray-700 transition-colors"
              >
                Unstake NFT
              </button>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Claim Rewards</h3>
          <div className="space-y-4">
            <div className="p-4 bg-slate-700/50 rounded-lg">
              <div className="text-2xl font-bold text-green-400 mb-1">{metrics.staking.pendingRewards.toFixed(2)} CQT</div>
              <div className="text-sm text-gray-300">Available to claim</div>
            </div>
            <button 
              onClick={() => {/* claim rewards */}}
              disabled={loading || metrics.staking.pendingRewards === 0}
              className="w-full p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded text-white font-medium hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Claiming...' : 'Claim Rewards'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFarming = () => (
    <div className="space-y-6">
      {/* Farming Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-white">Total Deposited</h3>
            <Layers className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-green-400">{formatNumber(metrics.farming.totalDeposited)} CQT</div>
          <div className="text-sm text-gray-300">Pool allocation: {metrics.farming.poolAllocation}%</div>
        </div>

        <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-white">Your Deposit</h3>
            <Coins className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-blue-400">{formatNumber(metrics.farming.userDeposited)} CQT</div>
          <div className="text-sm text-gray-300">Your share</div>
        </div>

        <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-white">Pending Harvest</h3>
            <Gift className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-purple-400">{metrics.farming.pendingHarvest.toFixed(2)} CQT</div>
          <div className="text-sm text-gray-300">Ready to harvest</div>
        </div>

        <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 border border-orange-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-white">Farming APR</h3>
            <TrendingUp className="w-5 h-5 text-orange-400" />
          </div>
          <div className="text-2xl font-bold text-orange-400">{metrics.farming.farmingAPR}%</div>
          <div className="text-sm text-gray-300">Annual yield</div>
        </div>
      </div>

      {/* Farming Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Deposit & Withdraw</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Amount (CQT)</label>
              <input 
                type="number" 
                value={farmingForm.amount}
                onChange={(e) => setFarmingForm({...farmingForm, amount: e.target.value})}
                placeholder="Enter amount" 
                className="w-full p-3 bg-slate-700 border border-slate-600 rounded text-white"
              />
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleFarmingAction}
                disabled={loading || !farmingForm.amount}
                className="flex-1 p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded text-white font-medium hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Processing...' : 'Deposit'}
              </button>
              <button 
                onClick={() => setFarmingForm({...farmingForm, action: 'withdraw'})}
                className="flex-1 p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded text-white font-medium hover:from-red-600 hover:to-pink-600 transition-colors"
              >
                Withdraw
              </button>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Harvest Rewards</h3>
          <div className="space-y-4">
            <div className="p-4 bg-slate-700/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-400 mb-1">{metrics.farming.pendingHarvest.toFixed(2)} CQT</div>
              <div className="text-sm text-gray-300">Ready to harvest</div>
            </div>
            <button 
              disabled={loading || metrics.farming.pendingHarvest === 0}
              className="w-full p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded text-white font-medium hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Harvesting...' : 'Harvest Rewards'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLiquidity = () => (
    <div className="space-y-6">
      {/* Liquidity Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-white">MATIC/CQT Pool</h3>
            <BarChart3 className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-blue-400">${formatNumber(metrics.liquidity.matic_cqt_tvl)}</div>
          <div className="text-sm text-gray-300">TVL • 125.4% APR</div>
        </div>

        <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-white">WETH/CQT Pool</h3>
            <PieChart className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-purple-400">${formatNumber(metrics.liquidity.weth_cqt_tvl)}</div>
          <div className="text-sm text-gray-300">TVL • 89.7% APR</div>
        </div>

        <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-white">Base USDC/CQT</h3>
            <Zap className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-green-400">${formatNumber(metrics.liquidity.base_cqt_usdc_tvl)}</div>
          <div className="text-sm text-gray-300">TVL • 67.2% APR</div>
        </div>
      </div>

      {/* Swap Interface */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Token Swap</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">From</label>
              <div className="flex gap-2">
                <select 
                  value={swapForm.tokenIn}
                  onChange={(e) => setSwapForm({...swapForm, tokenIn: e.target.value})}
                  className="w-24 p-3 bg-slate-700 border border-slate-600 rounded text-white"
                >
                  <option>CQT</option>
                  <option>MATIC</option>
                  <option>WETH</option>
                  <option>USDC</option>
                </select>
                <input 
                  type="number" 
                  value={swapForm.amountIn}
                  onChange={(e) => setSwapForm({...swapForm, amountIn: e.target.value})}
                  placeholder="0.0" 
                  className="flex-1 p-3 bg-slate-700 border border-slate-600 rounded text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">To</label>
              <div className="flex gap-2">
                <select 
                  value={swapForm.tokenOut}
                  onChange={(e) => setSwapForm({...swapForm, tokenOut: e.target.value})}
                  className="w-24 p-3 bg-slate-700 border border-slate-600 rounded text-white"
                >
                  <option>MATIC</option>
                  <option>CQT</option>
                  <option>WETH</option>
                  <option>USDC</option>
                </select>
                <input 
                  type="number" 
                  placeholder="0.0" 
                  readOnly
                  className="flex-1 p-3 bg-slate-600 border border-slate-600 rounded text-gray-400"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowUpDown className="w-6 h-6 text-gray-400" />
          </div>

          <button 
            onClick={handleSwap}
            disabled={loading || !swapForm.amountIn}
            className="w-full p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded text-white font-medium hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Swapping...' : 'Swap Tokens'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderNFTBooks = () => (
    <div className="space-y-6">
      {/* NFT Books Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-indigo-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-white">Total Books</h3>
            <BookOpen className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-indigo-400">{formatNumber(metrics.nftBooks.totalBooks)}</div>
          <div className="text-sm text-gray-300">Minted worldwide</div>
        </div>

        <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-white">Your Collection</h3>
            <Award className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-green-400">{metrics.nftBooks.userBooks}</div>
          <div className="text-sm text-gray-300">Books owned</div>
        </div>

        <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 border border-orange-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-white">Available Tiers</h3>
            <Layers className="w-5 h-5 text-orange-400" />
          </div>
          <div className="text-2xl font-bold text-orange-400">{metrics.nftBooks.availableTiers.length}</div>
          <div className="text-sm text-gray-300">Purchase options</div>
        </div>
      </div>

      {/* Available Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.nftBooks.availableTiers.map((tier, index) => (
          <div key={index} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Tier {tier.tierId}</h3>
              <ShoppingCart className="w-5 h-5 text-blue-400" />
            </div>
            <div className="space-y-3">
              <div className="text-2xl font-bold text-blue-400">
                {tier.price < 1 ? `${tier.price} WETH` : `${tier.price} CQT`}
              </div>
              <div className="text-sm text-gray-300">{tier.format}</div>
              <div className="text-sm text-gray-400">
                {tier.sold}/{tier.supply} sold ({Math.round((tier.sold/tier.supply)*100)}%)
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                  style={{ width: `${(tier.sold/tier.supply)*100}%` }}
                />
              </div>
              <button 
                disabled={loading || tier.sold >= tier.supply}
                className="w-full p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded text-white font-medium hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 transition-colors"
              >
                {tier.sold >= tier.supply ? 'Sold Out' : 'Purchase'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full">
            <Coins className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            DeFi Gaming Hub
          </h1>
          <p className="text-xl text-gray-300">Complete DeFi ecosystem for CryptoQuest</p>
        </div>

        {/* Navigation */}
        <div className="flex justify-center">
          <div className="flex bg-slate-800/50 border border-slate-700 rounded-lg p-1">
            {[
              { id: 'staking', label: 'NFT Staking', icon: Lock },
              { id: 'farming', label: 'Yield Farming', icon: Layers },
              { id: 'liquidity', label: 'Liquidity Pools', icon: BarChart3 },
              { id: 'nftbooks', label: 'NFT Books', icon: BookOpen }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-colors ${
                  activeSection === id
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="mt-8">
          {activeSection === 'staking' && renderStaking()}
          {activeSection === 'farming' && renderFarming()}
          {activeSection === 'liquidity' && renderLiquidity()}
          {activeSection === 'nftbooks' && renderNFTBooks()}
        </div>

        {/* Total Value Stats */}
        <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center justify-center space-x-8 text-sm">
            <div className="text-gray-300">
              Total Liquidity: <span className="text-indigo-400">${formatNumber(metrics.liquidity.total_liquidity)}</span>
            </div>
            <div className="text-gray-300">
              24h Volume: <span className="text-green-400">${formatNumber(metrics.liquidity.trading_volume_24h)}</span>
            </div>
            <div className="text-gray-300">
              Staking TVL: <span className="text-purple-400">${formatNumber(metrics.staking.totalStaked * 0.82)}</span>
            </div>
            <div className="text-gray-300">
              Farming TVL: <span className="text-orange-400">${formatNumber(metrics.farming.totalDeposited * 0.82)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}