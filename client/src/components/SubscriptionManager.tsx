import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Crown, Star, Zap, Check, Lightning } from 'lucide-react';

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  features: string[];
}

interface StrikeInvoice {
  invoiceId: string;
  amount: {
    amount: string;
    currency: string;
  };
  state: 'UNPAID' | 'PENDING' | 'PAID' | 'CANCELLED';
  description: string;
  created: string;
}

export function SubscriptionManager() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [activeInvoice, setActiveInvoice] = useState<StrikeInvoice | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'completed' | 'failed'>('idle');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch subscription plans
  const { data: plans = [], isLoading: plansLoading } = useQuery({
    queryKey: ['/api/strike/plans'],
    queryFn: async () => {
      const response = await fetch('/api/strike/plans');
      if (!response.ok) throw new Error('Failed to fetch plans');
      return response.json();
    }
  });

  // Create subscription invoice
  const createInvoiceMutation = useMutation({
    mutationFn: async (planId: string) => {
      const response = await fetch('/api/strike/subscription/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          planId,
          userEmail: 'user@cryptoquest.com' // Replace with actual user email
        })
      });
      if (!response.ok) throw new Error('Failed to create invoice');
      return response.json();
    },
    onSuccess: (invoice) => {
      setActiveInvoice(invoice);
      setPaymentStatus('processing');
      toast({
        title: "Payment Created",
        description: "Lightning invoice generated. Complete payment to activate subscription.",
      });
      
      // Start polling for payment status
      pollPaymentStatus(invoice.invoiceId);
    },
    onError: () => {
      toast({
        title: "Payment Error",
        description: "Failed to create payment invoice",
        variant: "destructive",
      });
    }
  });

  // Poll payment status
  const pollPaymentStatus = async (invoiceId: string) => {
    const maxAttempts = 60; // 5 minutes with 5-second intervals
    let attempts = 0;

    const poll = async () => {
      try {
        const response = await fetch(`/api/strike/invoice/${invoiceId}/status`);
        const invoice = await response.json();
        
        if (invoice.state === 'PAID') {
          setPaymentStatus('completed');
          setActiveInvoice(null);
          queryClient.invalidateQueries({ queryKey: ['/api/user/subscription'] });
          toast({
            title: "Payment Successful",
            description: "Your subscription has been activated!",
          });
          return;
        }
        
        if (invoice.state === 'CANCELLED' || attempts >= maxAttempts) {
          setPaymentStatus('failed');
          setActiveInvoice(null);
          toast({
            title: "Payment Timeout",
            description: "Payment was not completed in time",
            variant: "destructive",
          });
          return;
        }
        
        attempts++;
        setTimeout(poll, 5000);
      } catch (error) {
        console.error('Payment status polling error:', error);
      }
    };

    poll();
  };

  const handleSubscribe = (planId: string) => {
    setSelectedPlan(planId);
    createInvoiceMutation.mutate(planId);
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'basic': return <Star className="w-6 h-6 text-blue-400" />;
      case 'premium': case 'annual_premium': return <Crown className="w-6 h-6 text-purple-400" />;
      case 'ultimate': return <Zap className="w-6 h-6 text-yellow-400" />;
      default: return <Star className="w-6 h-6 text-gray-400" />;
    }
  };

  const getPlanColor = (planId: string) => {
    switch (planId) {
      case 'basic': return 'border-blue-500/50 bg-blue-500/10';
      case 'premium': case 'annual_premium': return 'border-purple-500/50 bg-purple-500/10';
      case 'ultimate': return 'border-yellow-500/50 bg-yellow-500/10';
      default: return 'border-gray-500/50 bg-gray-500/10';
    }
  };

  if (plansLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Subscription Plans</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-card/60 backdrop-blur border-border/50">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-6 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-8 bg-gray-300 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Choose Your Quest</h2>
        <p className="text-muted-foreground">
          Unlock premium features with Lightning-fast Bitcoin payments
        </p>
      </div>

      {/* Active Payment Status */}
      {activeInvoice && paymentStatus === 'processing' && (
        <Card className="border-yellow-500/50 bg-yellow-500/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightning className="w-5 h-5 text-yellow-400" />
              Payment Processing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm">
                Lightning invoice created for ${activeInvoice.amount.amount}
              </p>
              <Progress value={33} className="w-full" />
              <p className="text-xs text-muted-foreground">
                Waiting for payment confirmation... This may take up to 5 minutes.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Subscription Plans Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan: SubscriptionPlan) => (
          <Card 
            key={plan.id} 
            className={`relative ${getPlanColor(plan.id)} transition-all duration-300 hover:scale-105`}
          >
            {plan.id === 'premium' && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-purple-500 text-white">Most Popular</Badge>
              </div>
            )}
            
            <CardHeader className="text-center">
              <div className="flex justify-center mb-2">
                {getPlanIcon(plan.id)}
              </div>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{plan.description}</p>
              
              <div className="mt-4">
                <span className="text-3xl font-bold">${plan.price}</span>
                <span className="text-muted-foreground">/{plan.interval}</span>
                {plan.id === 'annual_premium' && (
                  <Badge className="ml-2 bg-green-500">Save 20%</Badge>
                )}
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              
              <Button 
                className="w-full"
                onClick={() => handleSubscribe(plan.id)}
                disabled={createInvoiceMutation.isPending || paymentStatus === 'processing'}
              >
                {createInvoiceMutation.isPending && selectedPlan === plan.id 
                  ? 'Creating Payment...' 
                  : 'Subscribe with Lightning ⚡'
                }
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payment Success */}
      {paymentStatus === 'completed' && (
        <Card className="border-green-500/50 bg-green-500/10">
          <CardContent className="p-6 text-center">
            <Check className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-green-400 mb-2">
              Subscription Activated!
            </h3>
            <p className="text-muted-foreground">
              Your premium features are now available. Welcome to the next level of CryptoQuest!
            </p>
          </CardContent>
        </Card>
      )}

      {/* Lightning Network Benefits */}
      <Card className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border-orange-500/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightning className="w-5 h-5 text-orange-400" />
            Lightning Network Payments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">⚡</div>
              <div className="text-sm font-medium">Instant</div>
              <div className="text-xs text-muted-foreground">Payments in seconds</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">💰</div>
              <div className="text-sm font-medium">Low Fees</div>
              <div className="text-xs text-muted-foreground">Minimal transaction costs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">🔒</div>
              <div className="text-sm font-medium">Secure</div>
              <div className="text-xs text-muted-foreground">Bitcoin-level security</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}