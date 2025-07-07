import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Send, 
  Receipt, 
  Wallet, 
  DollarSign, 
  Clock, 
  CheckCircle,
  Plus
} from 'lucide-react';

interface Balance {
  balance: string;
  currency: string;
  address: string;
}

export function SuperPayDashboard() {
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState<Balance | null>(null);

  const mockBalance: Balance = {
    balance: '2.456',
    currency: 'ETH',
    address: '0x742d35Cc6634C0532925a3b8D75C9f4e2f2d1234'
  };

  useEffect(() => {
    setBalance(mockBalance);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            SuperPay Dashboard
          </h1>
          <p className="text-xl text-gray-300">Seamless crypto payments for gaming</p>
        </div>

        {balance && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
              <div className="text-2xl font-bold text-blue-400">{balance.balance} {balance.currency}</div>
              <div className="text-sm text-gray-300">Wallet Balance</div>
            </div>
            <div className="text-center p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
              <div className="text-2xl font-bold text-green-400">$6,140</div>
              <div className="text-sm text-gray-300">USD Value</div>
            </div>
            <div className="text-center p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
              <div className="text-2xl font-bold text-purple-400">0x742d...1234</div>
              <div className="text-sm text-gray-300">Address</div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">Send Payment</h3>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Recipient Address (0x...)" 
                className="w-full p-3 bg-slate-700 border border-slate-600 rounded text-white"
              />
              <div className="flex gap-2">
                <input 
                  type="number" 
                  placeholder="Amount" 
                  className="flex-1 p-3 bg-slate-700 border border-slate-600 rounded text-white"
                />
                <select className="p-3 bg-slate-700 border border-slate-600 rounded text-white">
                  <option>ETH</option>
                  <option>USDC</option>
                  <option>CQT</option>
                </select>
              </div>
              <button className="w-full p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded text-white font-medium hover:from-blue-600 hover:to-purple-600 transition-colors">
                Send Payment
              </button>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">Gaming Payments</h3>
            <div className="space-y-3">
              <button className="w-full p-3 bg-slate-700 hover:bg-slate-600 rounded text-white text-left transition-colors">
                <span className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded mr-3 inline-block"></span>
                Legendary Sword - 0.5 ETH
              </button>
              <button className="w-full p-3 bg-slate-700 hover:bg-slate-600 rounded text-white text-left transition-colors">
                <span className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded mr-3 inline-block"></span>
                Magic Armor Set - 100 CQT
              </button>
              <button className="w-full p-3 bg-slate-700 hover:bg-slate-600 rounded text-white text-left transition-colors">
                <span className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-500 rounded mr-3 inline-block"></span>
                Guild Membership - 0.2 ETH
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}