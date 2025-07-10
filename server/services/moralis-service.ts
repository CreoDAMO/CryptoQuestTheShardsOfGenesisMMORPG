import Moralis from 'moralis';

export class MoralisService {
  private initialized = false;

  async initialize() {
    if (this.initialized) return;
    
    try {
      const apiKey = process.env.MORALIS_API_KEY;
      if (!apiKey) {
        throw new Error('MORALIS_API_KEY environment variable is not set');
      }

      await Moralis.start({
        apiKey: apiKey,
      });
      
      this.initialized = true;
      console.log('Moralis service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Moralis service:', error);
      throw error;
    }
  }

  async getNFTsByWallet(walletAddress: string, chain: string = 'polygon') {
    await this.initialize();
    
    try {
      const response = await Moralis.EvmApi.nft.getWalletNFTs({
        address: walletAddress,
        chain: chain,
        format: 'decimal',
      });
      
      return response.toJSON();
    } catch (error) {
      console.error('Error fetching NFTs:', error);
      throw error;
    }
  }

  async getTokenBalances(walletAddress: string, chain: string = 'polygon') {
    await this.initialize();
    
    try {
      const response = await Moralis.EvmApi.token.getWalletTokenBalances({
        address: walletAddress,
        chain: chain,
      });
      
      return response.toJSON();
    } catch (error) {
      console.error('Error fetching token balances:', error);
      throw error;
    }
  }

  async getTokenPrice(tokenAddress: string, chain: string = 'polygon') {
    await this.initialize();
    
    try {
      const response = await Moralis.EvmApi.token.getTokenPrice({
        address: tokenAddress,
        chain: chain,
      });
      
      return response.toJSON();
    } catch (error) {
      console.error('Error fetching token price:', error);
      throw error;
    }
  }

  async getWalletTransactions(walletAddress: string, chain: string = 'polygon') {
    await this.initialize();
    
    try {
      const response = await Moralis.EvmApi.transaction.getWalletTransactions({
        address: walletAddress,
        chain: chain,
        limit: 100,
      });
      
      return response.toJSON();
    } catch (error) {
      console.error('Error fetching wallet transactions:', error);
      throw error;
    }
  }

  async getContractNFTs(contractAddress: string, chain: string = 'polygon') {
    await this.initialize();
    
    try {
      const response = await Moralis.EvmApi.nft.getContractNFTs({
        address: contractAddress,
        chain: chain,
        format: 'decimal',
      });
      
      return response.toJSON();
    } catch (error) {
      console.error('Error fetching contract NFTs:', error);
      throw error;
    }
  }

  async getTokenMetadata(tokenAddress: string, chain: string = 'polygon') {
    await this.initialize();
    
    try {
      const response = await Moralis.EvmApi.token.getTokenMetadata({
        addresses: [tokenAddress],
        chain: chain,
      });
      
      return response.toJSON();
    } catch (error) {
      console.error('Error fetching token metadata:', error);
      throw error;
    }
  }

  async getWalletDefiPositions(walletAddress: string, chain: string = 'polygon') {
    await this.initialize();
    
    try {
      const response = await Moralis.EvmApi.wallets.getDefiPositionsByWallet({
        address: walletAddress,
        chain: chain,
      });
      
      return response.toJSON();
    } catch (error) {
      console.error('Error fetching DeFi positions:', error);
      throw error;
    }
  }

  async getWalletNetWorth(walletAddress: string, chain: string = 'polygon') {
    await this.initialize();
    
    try {
      const response = await Moralis.EvmApi.wallets.getWalletNetWorth({
        address: walletAddress,
        chains: [chain],
      });
      
      return response.toJSON();
    } catch (error) {
      console.error('Error fetching wallet net worth:', error);
      throw error;
    }
  }

  async getWalletPnl(walletAddress: string, chain: string = 'polygon') {
    await this.initialize();
    
    try {
      const response = await Moralis.EvmApi.wallets.getWalletPnl({
        address: walletAddress,
        chains: [chain],
      });
      
      return response.toJSON();
    } catch (error) {
      console.error('Error fetching wallet PnL:', error);
      throw error;
    }
  }

  async getTokenTransfers(tokenAddress: string, chain: string = 'polygon') {
    await this.initialize();
    
    try {
      const response = await Moralis.EvmApi.token.getTokenTransfers({
        address: tokenAddress,
        chain: chain,
        limit: 100,
      });
      
      return response.toJSON();
    } catch (error) {
      console.error('Error fetching token transfers:', error);
      throw error;
    }
  }
}

export const moralisService = new MoralisService();