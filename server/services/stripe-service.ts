import Stripe from 'stripe';

interface StripeSubscription {
  subscriptionId: string;
  customerId: string;
  status: 'active' | 'inactive' | 'canceled' | 'past_due';
  currentPeriodEnd: string;
  planId: string;
  clientSecret?: string;
}

interface StripePaymentIntent {
  paymentIntentId: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'requires_capture' | 'canceled' | 'succeeded';
  clientSecret: string;
  description: string;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  features: string[];
}

interface MerchItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: 'apparel' | 'accessories' | 'collectibles' | 'digital';
  imageUrl: string;
  inStock: boolean;
  variants?: {
    size?: string[];
    color?: string[];
  };
}

export class StripeService {
  private readonly stripe: Stripe;

  constructor() {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY environment variable is required');
    }
    
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20',
    });
  }

  // Subscription Management
  async createSubscription(
    planId: string, 
    userEmail: string, 
    paymentMethodId?: string
  ): Promise<StripeSubscription> {
    try {
      const plan = this.getSubscriptionPlan(planId);
      if (!plan) {
        throw new Error('Invalid subscription plan');
      }

      // Create or retrieve customer
      let customer = await this.stripe.customers.list({
        email: userEmail,
        limit: 1
      });

      let customerId: string;
      if (customer.data.length === 0) {
        const newCustomer = await this.stripe.customers.create({
          email: userEmail,
          name: userEmail.split('@')[0]
        });
        customerId = newCustomer.id;
      } else {
        customerId = customer.data[0].id;
      }

      // Create subscription
      const subscription = await this.stripe.subscriptions.create({
        customer: customerId,
        items: [{
          price_data: {
            currency: plan.currency,
            product_data: {
              name: plan.name,
              description: plan.description
            },
            unit_amount: Math.round(plan.price * 100), // Convert to cents
            recurring: {
              interval: plan.interval === 'yearly' ? 'year' : 'month'
            }
          }
        }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent']
      });

      const invoice = subscription.latest_invoice as Stripe.Invoice;
      const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

      return {
        subscriptionId: subscription.id,
        customerId: customerId,
        status: subscription.status as any,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
        planId: planId,
        clientSecret: paymentIntent.client_secret || undefined
      };
    } catch (error) {
      console.error('Stripe subscription error:', error);
      throw error;
    }
  }

  // Merchandise Store Payments
  async createMerchPayment(
    items: { itemId: string; quantity: number; variant?: any }[],
    userEmail: string
  ): Promise<StripePaymentIntent> {
    try {
      const total = this.calculateMerchTotal(items);
      
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(total * 100), // Convert to cents
        currency: 'usd',
        description: `CryptoQuest Merchandise Order - ${items.length} items`,
        metadata: {
          userEmail,
          items: JSON.stringify(items)
        }
      });

      return {
        paymentIntentId: paymentIntent.id,
        amount: total,
        currency: 'usd',
        status: paymentIntent.status as any,
        clientSecret: paymentIntent.client_secret!,
        description: paymentIntent.description || ''
      };
    } catch (error) {
      console.error('Stripe merch payment error:', error);
      throw error;
    }
  }

  // Payment Status Tracking
  async getSubscriptionStatus(subscriptionId: string): Promise<StripeSubscription> {
    try {
      const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
      
      return {
        subscriptionId: subscription.id,
        customerId: subscription.customer as string,
        status: subscription.status as any,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
        planId: subscription.metadata?.planId || 'unknown'
      };
    } catch (error) {
      console.error('Stripe subscription status error:', error);
      throw error;
    }
  }

  async getPaymentIntentStatus(paymentIntentId: string): Promise<StripePaymentIntent> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      
      return {
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount / 100, // Convert from cents
        currency: paymentIntent.currency,
        status: paymentIntent.status as any,
        clientSecret: paymentIntent.client_secret!,
        description: paymentIntent.description || ''
      };
    } catch (error) {
      console.error('Stripe payment intent status error:', error);
      throw error;
    }
  }

  // Subscription Plans
  getSubscriptionPlans(): SubscriptionPlan[] {
    return [
      {
        id: 'basic',
        name: 'Basic Hero',
        description: 'Essential CryptoQuest features',
        price: 9.99,
        currency: 'usd',
        interval: 'monthly',
        features: [
          'Basic character progression',
          'Standard quests access',
          'Community guild participation',
          'Mobile app access'
        ]
      },
      {
        id: 'premium',
        name: 'Legendary Warrior',
        description: 'Advanced gaming with exclusive content',
        price: 19.99,
        currency: 'usd',
        interval: 'monthly',
        features: [
          'Enhanced character abilities',
          'Exclusive quest lines',
          'Premium guild features',
          'Cross-platform sync',
          'NFT trading privileges',
          'Priority customer support'
        ]
      },
      {
        id: 'ultimate',
        name: 'Mythic Champion',
        description: 'Ultimate CryptoQuest experience',
        price: 39.99,
        currency: 'usd',
        interval: 'monthly',
        features: [
          'All premium features',
          'Early access to new content',
          'Exclusive mythic items',
          'Private server access',
          'Direct developer communication',
          'Custom avatar creation',
          'Advanced analytics dashboard'
        ]
      },
      {
        id: 'annual_premium',
        name: 'Legendary Warrior (Annual)',
        description: 'Annual subscription with 2 months free',
        price: 199.99,
        currency: 'usd',
        interval: 'yearly',
        features: [
          'All Legendary Warrior features',
          '2 months free (20% savings)',
          'Annual exclusive NFT drop',
          'Priority event access'
        ]
      }
    ];
  }

  getSubscriptionPlan(planId: string): SubscriptionPlan | null {
    return this.getSubscriptionPlans().find(plan => plan.id === planId) || null;
  }

  // Merchandise Catalog
  getMerchCatalog(): MerchItem[] {
    return [
      {
        id: 'tshirt_hero',
        name: 'CryptoQuest Hero T-Shirt',
        description: 'Premium cotton t-shirt with exclusive Hero design',
        price: 24.99,
        currency: 'usd',
        category: 'apparel',
        imageUrl: '/merch/tshirt-hero.jpg',
        inStock: true,
        variants: {
          size: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
          color: ['Black', 'Navy', 'Forest Green']
        }
      },
      {
        id: 'hoodie_guild',
        name: 'Guild Master Hoodie',
        description: 'Premium hoodie with embroidered guild crest',
        price: 49.99,
        currency: 'usd',
        category: 'apparel',
        imageUrl: '/merch/hoodie-guild.jpg',
        inStock: true,
        variants: {
          size: ['S', 'M', 'L', 'XL', 'XXL'],
          color: ['Black', 'Charcoal', 'Burgundy']
        }
      },
      {
        id: 'mug_shards',
        name: 'Shards of Genesis Mug',
        description: 'Ceramic mug with color-changing Shards design',
        price: 14.99,
        currency: 'usd',
        category: 'accessories',
        imageUrl: '/merch/mug-shards.jpg',
        inStock: true
      },
      {
        id: 'poster_map',
        name: 'CryptoQuest World Map Poster',
        description: 'High-quality print of the complete game world',
        price: 19.99,
        currency: 'usd',
        category: 'collectibles',
        imageUrl: '/merch/poster-map.jpg',
        inStock: true,
        variants: {
          size: ['18x24', '24x36']
        }
      },
      {
        id: 'keychain_token',
        name: 'CQT Token Keychain',
        description: 'Metal keychain replica of the CQT token',
        price: 9.99,
        currency: 'usd',
        category: 'accessories',
        imageUrl: '/merch/keychain-token.jpg',
        inStock: true
      },
      {
        id: 'artbook_digital',
        name: 'Digital Art Book Collection',
        description: 'Complete digital art collection with concept art',
        price: 29.99,
        currency: 'usd',
        category: 'digital',
        imageUrl: '/merch/artbook-digital.jpg',
        inStock: true
      }
    ];
  }

  getMerchItem(itemId: string): MerchItem | null {
    return this.getMerchCatalog().find(item => item.id === itemId) || null;
  }

  private calculateMerchTotal(items: { itemId: string; quantity: number; variant?: any }[]): number {
    return items.reduce((total, item) => {
      const merchItem = this.getMerchItem(item.itemId);
      if (merchItem) {
        return total + (merchItem.price * item.quantity);
      }
      return total;
    }, 0);
  }

  // Webhook handling
  constructWebhookEvent(body: string, signature: string, endpointSecret: string) {
    return this.stripe.webhooks.constructEvent(body, signature, endpointSecret);
  }
}

export const stripeService = new StripeService();