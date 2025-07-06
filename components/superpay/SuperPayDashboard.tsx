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
import { 
  Loader2, 
  CreditCard, 
  Send, 
  Receipt, 
  Wallet, 
  DollarSign, 
  Clock, 
  CheckCircle,
  XCircle,
  Plus,
  Eye,
  Copy
} from 'lucide-react';

interface Invoice {
  id: string;
  amount: number;
  currency: string;
  recipient: string;
  description: string;
  status: 'pending' | 'paid' | 'expired' | 'cancelled';
  createdAt: string;
  expiresAt: string;
  paymentHash?: string;
}

interface Balance {
  balance: string;
  currency: string;
  address: string;
}

export function SuperPayDashboard() {
  const [loading, setLoading] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [balance, setBalance] = useState<Balance | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [invoiceLoading, setInvoiceLoading] = useState(false);

  // Form states
  const [paymentForm, setPaymentForm] = useState({
    to: '',
    amount: '',
    currency: 'ETH',
    description: ''
  });

  const [invoiceForm, setInvoiceForm] = useState({
    amount: '',
    currency: 'ETH',
    recipient: '',
    description: '',
    expiresIn: '30'
  });

  // Mock data
  const mockInvoices: Invoice[] = [
    {
      id: 'inv_abc123def456',
      amount: 0.5,
      currency: 'ETH',
      recipient: '0x742d35Cc6634C0532925a3b8D75C9f4e2f2d1234',
      description: 'Premium Guild Membership',
      status: 'paid',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
      paymentHash: '0xabc123def456...'
    },
    {
      id: 'inv_def456ghi789',
      amount: 100,
      currency: 'USDC',
      recipient: '0x857d35Cc6634C0532925a3b8D75C9f4e2f2d5678',
      description: 'Legendary Sword NFT',
      status: 'pending',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      expiresAt: new Date(Date.now() + 82800000).toISOString()
    },
    {
      id: 'inv_ghi789jkl012',
      amount: 25,
      currency: 'CQT',
      recipient: '0x963d35Cc6634C0532925a3b8D75C9f4e2f2d9012',
      description: 'Quest Completion Reward',
      status: 'expired',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      expiresAt: new Date(Date.now() - 86400000).toISOString()
    }
  ];

  const mockBalance: Balance = {
    balance: '2.456',
    currency: 'ETH',
    address: '0x742d35Cc6634C0532925a3b8D75C9f4e2f2d1234'
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      setInvoices(mockInvoices);
      setBalance(mockBalance);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendPayment = async () => {
    if (!paymentForm.to || !paymentForm.amount) return;

    setPaymentLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reset form
      setPaymentForm({
        to: '',
        amount: '',
        currency: 'ETH',
        description: ''
      });
      
      // Refresh data
      await loadData();
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setPaymentLoading(false);
    }
  };

  const createInvoice = async () => {
    if (!invoiceForm.amount || !invoiceForm.recipient) return;

    setInvoiceLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newInvoice: Invoice = {
        id: 'inv_' + Math.random().toString(36).substr(2, 9),
        amount: parseFloat(invoiceForm.amount),
        currency: invoiceForm.currency,
        recipient: invoiceForm.recipient,
        description: invoiceForm.description,
        status: 'pending',
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + parseInt(invoiceForm.expiresIn) * 60 * 1000).toISOString()
      };

      setInvoices(prev => [newInvoice, ...prev]);
      
      // Reset form
      setInvoiceForm({
        amount: '',
        currency: 'ETH',
        recipient: '',
        description: '',
        expiresIn: '30'
      });
    } catch (error) {
      console.error('Invoice creation failed:', error);
    } finally {
      setInvoiceLoading(false);
    }
  };

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'paid': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'expired': return 'text-red-400';
      case 'cancelled': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: Invoice['status']) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'expired': return <XCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading SuperPay...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            SuperPay
          </h1>
          <p className="text-xl text-gray-300">
            Seamless crypto payments for gaming
          </p>
        </div>

        {/* Balance Card */}
        {balance && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Wallet className="w-5 h-5" />
                Wallet Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400">{balance.balance}</div>
                  <div className="text-sm text-gray-300">{balance.currency}</div>
                </div>
                <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-400">${(parseFloat(balance.balance) * 2500).toFixed(2)}</div>
                  <div className="text-sm text-gray-300">USD Value</div>
                </div>
                <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                  <div className="text-sm text-gray-300 font-mono bg-slate-600 px-2 py-1 rounded">
                    {balance.address.slice(0, 6)}...{balance.address.slice(-4)}
                    <Button variant="ghost" size="sm" className="ml-1 h-auto p-1">
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="text-sm text-gray-300">Address</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Interface */}
        <Tabs defaultValue="send" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800 border-slate-700">
            <TabsTrigger value="send" className="text-white">Send Payment</TabsTrigger>
            <TabsTrigger value="invoice" className="text-white">Create Invoice</TabsTrigger>
            <TabsTrigger value="invoices" className="text-white">My Invoices</TabsTrigger>
            <TabsTrigger value="gaming" className="text-white">Gaming Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="send" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Send className="w-5 h-5" />
                  Send Payment
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Send crypto payments instantly
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Recipient Address</Label>
                    <Input
                      placeholder="0x..."
                      value={paymentForm.to}
                      onChange={(e) => setPaymentForm(prev => ({ ...prev, to: e.target.value }))}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Amount</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="0.0"
                        value={paymentForm.amount}
                        onChange={(e) => setPaymentForm(prev => ({ ...prev, amount: e.target.value }))}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                      <select
                        value={paymentForm.currency}
                        onChange={(e) => setPaymentForm(prev => ({ ...prev, currency: e.target.value }))}
                        className="bg-slate-700 border-slate-600 text-white rounded px-3"
                      >
                        <option value="ETH">ETH</option>
                        <option value="USDC">USDC</option>
                        <option value="CQT">CQT</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Description (Optional)</Label>
                  <Input
                    placeholder="Payment for..."
                    value={paymentForm.description}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <Button
                  onClick={sendPayment}
                  disabled={paymentLoading || !paymentForm.to || !paymentForm.amount}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  {paymentLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Payment
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoice" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Receipt className="w-5 h-5" />
                  Create Invoice
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Request payments from other players
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Recipient Address</Label>
                    <Input
                      placeholder="0x..."
                      value={invoiceForm.recipient}
                      onChange={(e) => setInvoiceForm(prev => ({ ...prev, recipient: e.target.value }))}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Amount</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="0.0"
                        value={invoiceForm.amount}
                        onChange={(e) => setInvoiceForm(prev => ({ ...prev, amount: e.target.value }))}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                      <select
                        value={invoiceForm.currency}
                        onChange={(e) => setInvoiceForm(prev => ({ ...prev, currency: e.target.value }))}
                        className="bg-slate-700 border-slate-600 text-white rounded px-3"
                      >
                        <option value="ETH">ETH</option>
                        <option value="USDC">USDC</option>
                        <option value="CQT">CQT</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Description</Label>
                    <Input
                      placeholder="Invoice for..."
                      value={invoiceForm.description}
                      onChange={(e) => setInvoiceForm(prev => ({ ...prev, description: e.target.value }))}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Expires in (minutes)</Label>
                    <Input
                      type="number"
                      value={invoiceForm.expiresIn}
                      onChange={(e) => setInvoiceForm(prev => ({ ...prev, expiresIn: e.target.value }))}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>
                <Button
                  onClick={createInvoice}
                  disabled={invoiceLoading || !invoiceForm.amount || !invoiceForm.recipient}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  {invoiceLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Invoice
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoices" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Receipt className="w-5 h-5" />
                  Invoice History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {invoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`${getStatusColor(invoice.status)}`}>
                          {getStatusIcon(invoice.status)}
                        </div>
                        <div>
                          <div className="text-white font-medium">{invoice.description}</div>
                          <div className="text-sm text-gray-300">
                            {invoice.amount} {invoice.currency} • {new Date(invoice.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className={`${getStatusColor(invoice.status)} border-current`}>
                          {invoice.status.toUpperCase()}
                        </Badge>
                        {invoice.paymentHash && (
                          <div className="text-xs text-gray-400 mt-1 font-mono">
                            {invoice.paymentHash.slice(0, 10)}...
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gaming" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <DollarSign className="w-5 h-5" />
                    Purchase Game Items
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start bg-slate-700 hover:bg-slate-600 text-white">
                    <span className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded mr-3"></span>
                    Legendary Sword - 0.5 ETH
                  </Button>
                  <Button className="w-full justify-start bg-slate-700 hover:bg-slate-600 text-white">
                    <span className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded mr-3"></span>
                    Magic Armor Set - 100 CQT
                  </Button>
                  <Button className="w-full justify-start bg-slate-700 hover:bg-slate-600 text-white">
                    <span className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-500 rounded mr-3"></span>
                    Healing Potions (x10) - 25 USDC
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Users className="w-5 h-5" />
                    Guild Memberships
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start bg-slate-700 hover:bg-slate-600 text-white">
                    <span className="w-8 h-8 bg-gradient-to-br from-red-400 to-pink-500 rounded mr-3"></span>
                    Dragon Slayers - 0.2 ETH
                  </Button>
                  <Button className="w-full justify-start bg-slate-700 hover:bg-slate-600 text-white">
                    <span className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded mr-3"></span>
                    Shadow Warriors - 150 CQT
                  </Button>
                  <Button className="w-full justify-start bg-slate-700 hover:bg-slate-600 text-white">
                    <span className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded mr-3"></span>
                    Mystic Mages - 75 USDC
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}