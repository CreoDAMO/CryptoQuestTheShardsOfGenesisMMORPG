import { Coinbase } from '@coinbase/coinbase-sdk';

export class CoinbaseService {
  private coinbase: Coinbase | null = null;
  private initialized = false;

  async initialize() {
    if (this.initialized) return;
    
    try {
      const apiKey = process.env.COINBASE_API_KEY;
      if (!apiKey) {
        throw new Error('COINBASE_API_KEY environment variable is not set');
      }

      // Initialize Coinbase SDK
      this.coinbase = new Coinbase({
        apiKeyName: apiKey,
        privateKey: process.env.COINBASE_API_SECRET || '',
      });
      
      this.initialized = true;
      console.log('Coinbase service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Coinbase service:', error);
      throw error;
    }
  }

  async getExchangeRates() {
    await this.initialize();
    
    try {
      if (!this.coinbase) throw new Error('Coinbase not initialized');
      
      // Get current exchange rates
      const rates = await this.coinbase.getExchangeRates();
      return rates;
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      throw error;
    }
  }

  async getSpotPrice(currencyPair: string) {
    await this.initialize();
    
    try {
      if (!this.coinbase) throw new Error('Coinbase not initialized');
      
      const [base, quote] = currencyPair.split('-');
      const spotPrice = await this.coinbase.getSpotPrice({
        currencyPair: `${base}-${quote}`,
      });
      
      return spotPrice;
    } catch (error) {
      console.error('Error fetching spot price:', error);
      throw error;
    }
  }

  async createWallet(name: string) {
    await this.initialize();
    
    try {
      if (!this.coinbase) throw new Error('Coinbase not initialized');
      
      const wallet = await this.coinbase.createWallet({ name });
      return wallet;
    } catch (error) {
      console.error('Error creating wallet:', error);
      throw error;
    }
  }

  async getWalletBalance(walletId: string) {
    await this.initialize();
    
    try {
      if (!this.coinbase) throw new Error('Coinbase not initialized');
      
      const wallet = await this.coinbase.getWallet(walletId);
      const balance = await wallet.getBalance();
      
      return balance;
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      throw error;
    }
  }

  async listWallets() {
    await this.initialize();
    
    try {
      if (!this.coinbase) throw new Error('Coinbase not initialized');
      
      const wallets = await this.coinbase.listWallets();
      return wallets;
    } catch (error) {
      console.error('Error listing wallets:', error);
      throw error;
    }
  }

  async getAssets() {
    await this.initialize();
    
    try {
      if (!this.coinbase) throw new Error('Coinbase not initialized');
      
      const assets = await this.coinbase.getAssets();
      return assets;
    } catch (error) {
      console.error('Error fetching assets:', error);
      throw error;
    }
  }

  async getNetworks() {
    await this.initialize();
    
    try {
      if (!this.coinbase) throw new Error('Coinbase not initialized');
      
      const networks = await this.coinbase.getNetworks();
      return networks;
    } catch (error) {
      console.error('Error fetching networks:', error);
      throw error;
    }
  }

  async transfer(fromWalletId: string, toAddress: string, amount: number, asset: string) {
    await this.initialize();
    
    try {
      if (!this.coinbase) throw new Error('Coinbase not initialized');
      
      const wallet = await this.coinbase.getWallet(fromWalletId);
      const transfer = await wallet.createTransfer({
        amount: amount,
        assetId: asset,
        destination: toAddress,
      });
      
      return transfer;
    } catch (error) {
      console.error('Error creating transfer:', error);
      throw error;
    }
  }

  async getTransferHistory(walletId: string) {
    await this.initialize();
    
    try {
      if (!this.coinbase) throw new Error('Coinbase not initialized');
      
      const wallet = await this.coinbase.getWallet(walletId);
      const transfers = await wallet.listTransfers();
      
      return transfers;
    } catch (error) {
      console.error('Error fetching transfer history:', error);
      throw error;
    }
  }

  async createAddress(walletId: string) {
    await this.initialize();
    
    try {
      if (!this.coinbase) throw new Error('Coinbase not initialized');
      
      const wallet = await this.coinbase.getWallet(walletId);
      const address = await wallet.createAddress();
      
      return address;
    } catch (error) {
      console.error('Error creating address:', error);
      throw error;
    }
  }

  async faucetRequest(walletId: string, assetId: string) {
    await this.initialize();
    
    try {
      if (!this.coinbase) throw new Error('Coinbase not initialized');
      
      const wallet = await this.coinbase.getWallet(walletId);
      const faucetTransaction = await wallet.faucet(assetId);
      
      return faucetTransaction;
    } catch (error) {
      console.error('Error requesting faucet:', error);
      throw error;
    }
  }

  async deployContract(walletId: string, contractCode: string, constructorArgs: any[]) {
    await this.initialize();
    
    try {
      if (!this.coinbase) throw new Error('Coinbase not initialized');
      
      const wallet = await this.coinbase.getWallet(walletId);
      const contract = await wallet.deployContract({
        abi: contractCode,
        bytecode: contractCode,
        constructorArgs: constructorArgs,
      });
      
      return contract;
    } catch (error) {
      console.error('Error deploying contract:', error);
      throw error;
    }
  }

  async stakeAsset(walletId: string, amount: number, assetId: string, mode: string) {
    await this.initialize();
    
    try {
      if (!this.coinbase) throw new Error('Coinbase not initialized');
      
      const wallet = await this.coinbase.getWallet(walletId);
      const stakingOperation = await wallet.createStakingOperation({
        amount: amount,
        assetId: assetId,
        mode: mode,
        action: 'stake',
      });
      
      return stakingOperation;
    } catch (error) {
      console.error('Error staking asset:', error);
      throw error;
    }
  }

  async unstakeAsset(walletId: string, amount: number, assetId: string, mode: string) {
    await this.initialize();
    
    try {
      if (!this.coinbase) throw new Error('Coinbase not initialized');
      
      const wallet = await this.coinbase.getWallet(walletId);
      const stakingOperation = await wallet.createStakingOperation({
        amount: amount,
        assetId: assetId,
        mode: mode,
        action: 'unstake',
      });
      
      return stakingOperation;
    } catch (error) {
      console.error('Error unstaking asset:', error);
      throw error;
    }
  }

  async getStakingRewards(walletId: string, assetId: string) {
    await this.initialize();
    
    try {
      if (!this.coinbase) throw new Error('Coinbase not initialized');
      
      const wallet = await this.coinbase.getWallet(walletId);
      const rewards = await wallet.getStakingRewards(assetId);
      
      return rewards;
    } catch (error) {
      console.error('Error fetching staking rewards:', error);
      throw error;
    }
  }
}

export const coinbaseService = new CoinbaseService();