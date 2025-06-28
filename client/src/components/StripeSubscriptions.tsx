import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Crown, Star, Zap, Check, CreditCard } from 'lucide-react';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  features: string[];
}

interface StripeSubscription {
  subscriptionId: string;
  customerId: string;
  status: 'active' | 'inactive' | 'canceled' | 'past_due';
  currentPeriodEnd: string;
  planId: string;
  clientSecret?: string;
}

function SubscriptionForm({ plan }: { plan: SubscriptionPlan }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState<StripeSubscription | null>(null);
  const { toast } = useToast();

  const createSubscriptionMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/stripe/subscription/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          planId: plan.id,
          userEmail: 'user@cryptoquest.com' // Replace with actual user email
        })
      });
      if (!response.ok) throw new Error('Failed to create subscription');
      return response.json();
    },
    onSuccess: (data) => {
      setSubscriptionData(data);
    },
    onError: () => {
      toast({
        title: "Subscription Error",
        description: "Failed to create subscription",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (!subscriptionData) {
      // Create subscription first
      createSubscriptionMutation.mutate();
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmCardPayment(subscriptionData.clientSecret!, {
      payment_method: {
        card: elements.getElement(CardElement)!,
        billing_details: {
          email: 'user@cryptoquest.com',
        },
      }
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Subscription Activated!",
        description: `Your ${plan.name} subscription is now active`,
      });
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!subscriptionData ? (
        <Button 
          type="submit" 
          className="w-full"
          disabled={createSubscriptionMutation.isPending}
        >
          {createSubscriptionMutation.isPending ? 'Creating...' : `Subscribe to ${plan.name}`}
        </Button>
      ) : (
        <>
          <div className="p-4 border rounded-lg">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                },
              }}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full"
            disabled={!stripe || isProcessing}
          >
            {isProcessing ? 'Processing...' : `Pay $${plan.price}/${plan.interval}`}
          </Button>
        </>
      )}
    </form>
  );
}

function SubscriptionPlanCard({ plan }: { plan: SubscriptionPlan }) {
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

  return (
    <Card className={`relative ${getPlanColor(plan.id)} transition-all duration-300 hover:scale-105`}>
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
        
        <Elements stripe={stripePromise}>
          <SubscriptionForm plan={plan} />
        </Elements>
      </CardContent>
    </Card>
  );
}

export function StripeSubscriptions() {
  const { data: plans = [], isLoading: plansLoading } = useQuery({
    queryKey: ['/api/stripe/plans'],
    queryFn: async () => {
      const response = await fetch('/api/stripe/plans');
      if (!response.ok) throw new Error('Failed to fetch plans');
      return response.json();
    }
  });

  if (plansLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Premium Subscriptions</h2>
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
        <h2 className="text-3xl font-bold">Premium Gaming Experience</h2>
        <p className="text-muted-foreground">
          Unlock exclusive features with secure Stripe payments
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan: SubscriptionPlan) => (
          <SubscriptionPlanCard key={plan.id} plan={plan} />
        ))}
      </div>

      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-400" />
            Secure Stripe Payments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">🔒</div>
              <div className="text-sm font-medium">Bank-Level Security</div>
              <div className="text-xs text-muted-foreground">PCI DSS compliant</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">💳</div>
              <div className="text-sm font-medium">All Payment Methods</div>
              <div className="text-xs text-muted-foreground">Cards, wallets, bank transfers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">⚡</div>
              <div className="text-sm font-medium">Instant Activation</div>
              <div className="text-xs text-muted-foreground">Features unlock immediately</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}