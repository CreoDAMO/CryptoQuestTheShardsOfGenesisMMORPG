import { Request, Response } from 'express';

interface MoralisTokenData {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logo: string;
  thumbnail: string;
  possible_spam: boolean;
  verified_contract: boolean;
}

interface MoralisBalanceData {
  token_address: string;
  name: string;
  symbol: string;
  logo: string;
  thumbnail: string;
  decimals: number;
  balance: string;
  possible_spam: boolean;
}

interface MoralisNFTData {
  token_address: string;
  token_id: string;
  owner_of: string;
  block_number: string;
  block_number_minted: string;
  token_hash: string;
  amount: string;
  contract_type: string;
  name: string;
  symbol: string;
  token_uri: string;
  metadata: any;
  last_token_uri_sync: string;
  last_metadata_sync: string;
  minter_address: string;
}

export class MoralisService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://deep-index.moralis.io/api/v2.2';

  constructor() {
    this.apiKey = process.env.MORALIS_API || '';
    if (!this.apiKey) {
      console.warn('MORALIS_API key not found');
    }
  }

  private async makeRequest(endpoint: string, params: Record<string, string> = {}) {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    const response = await fetch(url.toString(), {
      headers: {
        'X-API-Key': this.apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Moralis API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getTokenBalances(address: string, chain: string = 'polygon'): Promise<MoralisBalanceData[]> {
    return this.makeRequest(`/${address}/erc20`, { chain });
  }

  async getNFTBalances(address: string, chain: string = 'polygon'): Promise<MoralisNFTData[]> {
    return this.makeRequest(`/${address}/nft`, { chain, limit: '100' });
  }

  async getTokenMetadata(addresses: string[], chain: string = 'polygon'): Promise<MoralisTokenData[]> {
    return this.makeRequest('/erc20/metadata', { 
      chain, 
      addresses: addresses.join(',') 
    });
  }

  async getWalletHistory(address: string, chain: string = 'polygon') {
    return this.makeRequest(`/${address}`, { chain });
  }

  async getTokenPrice(address: string, chain: string = 'polygon') {
    return this.makeRequest(`/erc20/${address}/price`, { chain });
  }

  async getContractEvents(address: string, chain: string = 'polygon') {
    return this.makeRequest(`/${address}/events`, { 
      chain,
      limit: '100'
    });
  }

  async analyzePortfolio(address: string, chain: string = 'polygon') {
    try {
      const [tokens, nfts, history] = await Promise.all([
        this.getTokenBalances(address, chain),
        this.getNFTBalances(address, chain),
        this.getWalletHistory(address, chain)
      ]);

      const totalTokens = tokens.length;
      const totalNFTs = nfts.length;
      const verifiedTokens = tokens.filter(token => token.verified_contract).length;
      const spamTokens = tokens.filter(token => token.possible_spam).length;

      return {
        totalTokens,
        totalNFTs,
        verifiedTokens,
        spamTokens,
        securityScore: Math.round(((verifiedTokens / totalTokens) * 100) || 0),
        tokens: tokens.slice(0, 10), // Top 10 tokens
        nfts: nfts.slice(0, 10), // Top 10 NFTs
        walletAge: history?.first_transaction || 'Unknown'
      };
    } catch (error) {
      console.error('Portfolio analysis error:', error);
      throw error;
    }
  }

  async getGameTokenAnalytics(tokenAddress: string, chain: string = 'polygon') {
    try {
      const [metadata, price, events] = await Promise.all([
        this.getTokenMetadata([tokenAddress], chain),
        this.getTokenPrice(tokenAddress, chain),
        this.getContractEvents(tokenAddress, chain)
      ]);

      return {
        token: metadata[0],
        currentPrice: price,
        recentActivity: events,
        liquidityHealth: this.calculateLiquidityHealth(events),
        trustScore: this.calculateTrustScore(metadata[0], events)
      };
    } catch (error) {
      console.error('Game token analytics error:', error);
      throw error;
    }
  }

  private calculateLiquidityHealth(events: any[]): string {
    const recentEvents = events.filter(event => 
      Date.now() - new Date(event.block_timestamp).getTime() < 24 * 60 * 60 * 1000
    );
    
    if (recentEvents.length > 50) return 'Excellent';
    if (recentEvents.length > 20) return 'Good';
    if (recentEvents.length > 5) return 'Moderate';
    return 'Low';
  }

  private calculateTrustScore(token: MoralisTokenData, events: any[]): number {
    let score = 0;
    
    if (token.verified_contract) score += 30;
    if (!token.possible_spam) score += 25;
    if (events.length > 100) score += 20;
    if (token.logo) score += 15;
    if (token.decimals === 18) score += 10;
    
    return Math.min(score, 100);
  }
}

export const moralisService = new MoralisService();