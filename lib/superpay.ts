import { Coinbase, Wallet } from "@coinbase/coinbase-sdk";

export interface Invoice {
  id: string;
  amount: number;
  currency: string;
  recipient: string;
  description: string;
  status: 'pending' | 'paid' | 'expired' | 'cancelled';
  createdAt: Date;
  expiresAt: Date;
  paymentHash?: string;
}

export interface PaymentRequest {
  to: string;
  amount: number;
  currency: string;
  description?: string;
  memo?: string;
}

export interface SuperPayConfig {
  apiKey: string;
  webhookUrl?: string;
  defaultCurrency: string;
  network: string;
}

export class SuperPayService {
  private wallet: Wallet | null = null;
  private coinbase: Coinbase | null = null;
  private config: SuperPayConfig;
  private invoices: Map<string, Invoice> = new Map();

  constructor(config: SuperPayConfig) {
    this.config = config;
  }

  async initialize() {
    try {
      // Initialize Coinbase SDK
      this.coinbase = Coinbase.configureFromJson({
        filePath: process.env.CDP_API_KEY_NAME || 'cdp_api_key.json',
      });

      // Create or load wallet
      this.wallet = await this.createOrLoadWallet();
      
      console.log('SuperPay service initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize SuperPay:', error);
      return false;
    }
  }

  private async createOrLoadWallet(): Promise<Wallet> {
    if (!this.coinbase) {
      throw new Error('Coinbase SDK not initialized');
    }

    try {
      // Try to load existing wallet
      const wallets = await this.coinbase.listWallets();
      if (wallets.length > 0) {
        return wallets[0];
      }

      // Create new wallet if none exists
      const wallet = await this.coinbase.createWallet();
      await wallet.createAddress();
      return wallet;
    } catch (error) {
      console.error('Wallet creation failed:', error);
      throw error;
    }
  }

  async createInvoice(params: {
    amount: number;
    currency: string;
    recipient: string;
    description: string;
    expiresIn?: number; // minutes
  }): Promise<Invoice> {
    const invoice: Invoice = {
      id: this.generateInvoiceId(),
      amount: params.amount,
      currency: params.currency,
      recipient: params.recipient,
      description: params.description,
      status: 'pending',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + (params.expiresIn || 30) * 60 * 1000)
    };

    this.invoices.set(invoice.id, invoice);
    
    // Trigger webhook if configured
    if (this.config.webhookUrl) {
      await this.triggerWebhook('invoice.created', invoice);
    }

    return invoice;
  }

  async payInvoice(invoiceId: string, payerAddress: string): Promise<{
    success: boolean;
    transactionHash?: string;
    error?: string;
  }> {
    const invoice = this.invoices.get(invoiceId);
    if (!invoice) {
      return { success: false, error: 'Invoice not found' };
    }

    if (invoice.status !== 'pending') {
      return { success: false, error: 'Invoice is not payable' };
    }

    if (new Date() > invoice.expiresAt) {
      invoice.status = 'expired';
      return { success: false, error: 'Invoice has expired' };
    }

    try {
      if (!this.wallet) {
        throw new Error('Wallet not initialized');
      }

      const transfer = await this.wallet.createTransfer({
        amount: invoice.amount,
        assetId: invoice.currency,
        destination: invoice.recipient
      });

      await transfer.wait();
      
      invoice.status = 'paid';
      invoice.paymentHash = transfer.getTransactionHash();

      // Trigger webhook
      if (this.config.webhookUrl) {
        await this.triggerWebhook('invoice.paid', invoice);
      }

      return {
        success: true,
        transactionHash: transfer.getTransactionHash()
      };
    } catch (error) {
      console.error('Payment failed:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Payment failed' };
    }
  }

  async sendPayment(request: PaymentRequest): Promise<{
    success: boolean;
    transactionHash?: string;
    error?: string;
  }> {
    try {
      if (!this.wallet) {
        throw new Error('Wallet not initialized');
      }

      const transfer = await this.wallet.createTransfer({
        amount: request.amount,
        assetId: request.currency,
        destination: request.to
      });

      await transfer.wait();

      return {
        success: true,
        transactionHash: transfer.getTransactionHash()
      };
    } catch (error) {
      console.error('Payment failed:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Payment failed' };
    }
  }

  async getBalance(currency: string): Promise<{
    balance: string;
    currency: string;
    address: string;
  }> {
    if (!this.wallet) {
      throw new Error('Wallet not initialized');
    }

    const balance = await this.wallet.getBalance(currency);
    const address = await this.wallet.getDefaultAddress();

    return {
      balance: balance.toString(),
      currency,
      address: address.getId()
    };
  }

  async getInvoice(invoiceId: string): Promise<Invoice | null> {
    return this.invoices.get(invoiceId) || null;
  }

  async getAllInvoices(): Promise<Invoice[]> {
    return Array.from(this.invoices.values());
  }

  async cancelInvoice(invoiceId: string): Promise<boolean> {
    const invoice = this.invoices.get(invoiceId);
    if (!invoice || invoice.status !== 'pending') {
      return false;
    }

    invoice.status = 'cancelled';
    
    // Trigger webhook
    if (this.config.webhookUrl) {
      await this.triggerWebhook('invoice.cancelled', invoice);
    }

    return true;
  }

  private generateInvoiceId(): string {
    return 'inv_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  private async triggerWebhook(event: string, data: any) {
    if (!this.config.webhookUrl) return;

    try {
      const response = await fetch(this.config.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-SuperPay-Event': event
        },
        body: JSON.stringify({
          event,
          data,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        console.error('Webhook failed:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Webhook error:', error);
    }
  }

  // Gaming-specific payment methods
  async purchaseGameItem(params: {
    itemId: string;
    playerId: string;
    amount: number;
    currency: string;
  }): Promise<{
    success: boolean;
    transactionHash?: string;
    itemId?: string;
    error?: string;
  }> {
    try {
      const paymentResult = await this.sendPayment({
        to: process.env.GAME_TREASURY_ADDRESS || '0x0000000000000000000000000000000000000000',
        amount: params.amount,
        currency: params.currency,
        description: `Purchase item ${params.itemId} for player ${params.playerId}`
      });

      if (paymentResult.success) {
        return {
          success: true,
          transactionHash: paymentResult.transactionHash,
          itemId: params.itemId
        };
      } else {
        return {
          success: false,
          error: paymentResult.error
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Purchase failed'
      };
    }
  }

  async purchaseGuildMembership(params: {
    guildId: string;
    playerId: string;
    membershipFee: number;
    currency: string;
  }): Promise<{
    success: boolean;
    transactionHash?: string;
    guildId?: string;
    error?: string;
  }> {
    try {
      const paymentResult = await this.sendPayment({
        to: process.env.GUILD_TREASURY_ADDRESS || '0x0000000000000000000000000000000000000000',
        amount: params.membershipFee,
        currency: params.currency,
        description: `Guild membership for ${params.guildId} by player ${params.playerId}`
      });

      if (paymentResult.success) {
        return {
          success: true,
          transactionHash: paymentResult.transactionHash,
          guildId: params.guildId
        };
      } else {
        return {
          success: false,
          error: paymentResult.error
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Guild membership purchase failed'
      };
    }
  }
}

// Export singleton instance
export const superPayService = new SuperPayService({
  apiKey: process.env.CDP_API_KEY_NAME || '',
  webhookUrl: process.env.SUPERPAY_WEBHOOK_URL,
  defaultCurrency: 'ETH',
  network: 'base'
});