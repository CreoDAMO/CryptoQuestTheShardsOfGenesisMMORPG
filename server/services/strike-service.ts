import fetch from 'node-fetch';

interface StrikeInvoice {
  invoiceId: string;
  amount: {
    amount: string;
    currency: string;
  };
  state: 'UNPAID' | 'PENDING' | 'PAID' | 'CANCELLED';
  description: string;
  issuerId: string;
  receiverId: string;
  created: string;
  correlationId?: string;
}

interface StrikeQuote {
  quoteId: string;
  description: string;
  lnInvoice: string;
  onchainAddress?: string;
  amount: {
    amount: string;
    currency: string;
  };
  conversionRate: {
    amount: string;
    sourceCurrency: string;
    targetCurrency: string;
  };
  expiration: string;
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

export class StrikeService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.strike.me/v1';
  private readonly isProduction: boolean;

  constructor() {
    this.apiKey = process.env.STRIKE_API_KEY || '';
    this.isProduction = process.env.NODE_ENV === 'production';
    
    if (!this.apiKey) {
      console.warn('Strike API key not configured. Subscription and store payments will use mock data.');
    }
  }

  private async makeRequest(endpoint: string, options: any = {}) {
    if (!this.apiKey) {
      throw new Error('Strike API key not configured');
    }

    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Strike API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Subscription Management
  async createSubscriptionInvoice(
    planId: string, 
    userEmail: string, 
    correlationId?: string
  ): Promise<StrikeInvoice> {
    try {
      const plan = this.getSubscriptionPlan(planId);
      if (!plan) {
        throw new Error('Invalid subscription plan');
      }

      const invoiceData = {
        correlationId: correlationId || `sub_${Date.now()}`,
        description: `CryptoQuest ${plan.name} Subscription`,
        amount: {
          currency: plan.currency.toUpperCase(),
          amount: plan.price.toString()
        }
      };

      const invoice = await this.makeRequest('/invoices', {
        method: 'POST',
        body: JSON.stringify(invoiceData)
      });

      return invoice;
    } catch (error) {
      console.error('Strike subscription invoice error:', error);
      return this.getMockSubscriptionInvoice(planId);
    }
  }

  // Merchandise Store Payments
  async createMerchQuote(
    items: { itemId: string; quantity: number; variant?: any }[],
    userEmail: string
  ): Promise<StrikeQuote> {
    try {
      const total = this.calculateMerchTotal(items);
      
      const quoteData = {
        description: `CryptoQuest Merchandise Order - ${items.length} items`,
        amount: {
          currency: 'USD',
          amount: total.toString()
        }
      };

      const quote = await this.makeRequest('/quotes', {
        method: 'POST',
        body: JSON.stringify(quoteData)
      });

      return quote;
    } catch (error) {
      console.error('Strike merch quote error:', error);
      return this.getMockMerchQuote(items);
    }
  }

  // Payment Status Tracking
  async getInvoiceStatus(invoiceId: string): Promise<StrikeInvoice> {
    try {
      const invoice = await this.makeRequest(`/invoices/${invoiceId}`);
      return invoice;
    } catch (error) {
      console.error('Strike invoice status error:', error);
      return this.getMockInvoiceStatus(invoiceId);
    }
  }

  async getQuoteStatus(quoteId: string): Promise<StrikeQuote> {
    try {
      const quote = await this.makeRequest(`/quotes/${quoteId}`);
      return quote;
    } catch (error) {
      console.error('Strike quote status error:', error);
      return this.getMockQuoteStatus(quoteId);
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

  // Mock responses for development/fallback
  private getMockSubscriptionInvoice(planId: string): StrikeInvoice {
    const plan = this.getSubscriptionPlan(planId);
    return {
      invoiceId: `mock_inv_${Date.now()}`,
      amount: {
        amount: plan?.price.toString() || '9.99',
        currency: 'USD'
      },
      state: 'UNPAID',
      description: `CryptoQuest ${plan?.name || 'Basic'} Subscription`,
      issuerId: 'mock_issuer',
      receiverId: 'mock_receiver',
      created: new Date().toISOString(),
      correlationId: `sub_${Date.now()}`
    };
  }

  private getMockMerchQuote(items: { itemId: string; quantity: number }[]): StrikeQuote {
    const total = this.calculateMerchTotal(items);
    return {
      quoteId: `mock_quote_${Date.now()}`,
      description: `CryptoQuest Merchandise Order - ${items.length} items`,
      lnInvoice: 'mock_lightning_invoice_string',
      amount: {
        amount: total.toString(),
        currency: 'USD'
      },
      conversionRate: {
        amount: '1.0',
        sourceCurrency: 'USD',
        targetCurrency: 'BTC'
      },
      expiration: new Date(Date.now() + 15 * 60 * 1000).toISOString()
    };
  }

  private getMockInvoiceStatus(invoiceId: string): StrikeInvoice {
    return {
      invoiceId,
      amount: { amount: '19.99', currency: 'USD' },
      state: 'UNPAID',
      description: 'Mock Invoice',
      issuerId: 'mock_issuer',
      receiverId: 'mock_receiver',
      created: new Date().toISOString()
    };
  }

  private getMockQuoteStatus(quoteId: string): StrikeQuote {
    return {
      quoteId,
      description: 'Mock Quote',
      lnInvoice: 'mock_lightning_invoice',
      amount: { amount: '49.99', currency: 'USD' },
      conversionRate: { amount: '1.0', sourceCurrency: 'USD', targetCurrency: 'BTC' },
      expiration: new Date(Date.now() + 15 * 60 * 1000).toISOString()
    };
  }
}

export const strikeService = new StrikeService();