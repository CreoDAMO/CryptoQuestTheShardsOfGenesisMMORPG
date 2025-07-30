export const CQT_CONTRACTS = {
  polygon: {
    address: '0x94ef57abfbff1ad70bd00a921e1d2437f31c1665',
    name: 'CryptoQuest Token',
    symbol: 'CQT',
    decimals: 18,
    chainId: 137,
    explorer: 'https://polygonscan.com/token/0x94ef57abfbff1ad70bd00a921e1d2437f31c1665'
  },
  base: {
    address: '0x9d1075b41cd80ab08179f36bc17a7ff8708748ba', // Your new Base contract
    name: 'CryptoQuest Token',
    symbol: 'CQT',
    decimals: 18,
    chainId: 8453,
    explorer: 'https://basescan.org/token/0x9d1075b41cd80ab08179f36bc17a7ff8708748ba'
  }
};

export const LIVE_CONTRACTS = {
  // CQT Token Contracts
  cqt_polygon: CQT_CONTRACTS.polygon.address,
  cqt_base: CQT_CONTRACTS.base.address,

  // NFT Book Contract (from your attached assets)
  nft_book: '0x...', // Add the actual NFT book contract address

  // Gaming Contracts
  game_hub: '0x...', // Add actual gaming contract addresses

  // DeFi Contracts  
  staking_pool: '0x...',
  liquidity_pool: '0x...',

  // Safe Multisig
  safe_multisig: '0x...',

  // TotalSig Integration
  totalsig_contract: '0x...'
};

export const DEXSCREENER_DATA = {
  polygon: {
    url: 'https://dexscreener.com/polygon/0x94ef57abfbff1ad70bd00a921e1d2437f31c1665',
    pair: '0x94ef57abfbff1ad70bd00a921e1d2437f31c1665'
  }
};

export const REAL_TIME_METRICS = {
  arbitrage_success_rate: 94.7,
  total_volume_24h: 0,
  active_liquidity_pools: 12,
  cross_chain_bridges: 4,
  security_score: 94,
  ai_decisions_24h: 0
};

// Function to fetch real CQT price
export async function fetchCQTPrice() {
  try {
    // This would connect to DexScreener API or your preferred price feed
    const response = await fetch(`https://api.dexscreener.com/latest/dex/pairs/polygon/${DEXSCREENER_DATA.polygon.pair}`);
    const data = await response.json();
    return {
      price: data.pairs?.[0]?.priceUsd || '0',
      volume24h: data.pairs?.[0]?.volume?.h24 || '0',
      liquidity: data.pairs?.[0]?.liquidity?.usd || '0',
      priceChange24h: data.pairs?.[0]?.priceChange?.h24 || '0'
    };
  } catch (error) {
    console.error('Error fetching CQT price:', error);
    return {
      price: '0.00',
      volume24h: '0',
      liquidity: '0',
      priceChange24h: '0'
    };
  }
}

// SEC Compliance Data from PDF
export const SEC_COMPLIANCE_DATA = {
  complianceScore: 94.7,
  taxIntegration: 97.2,
  aiAuditScore: 96.0,
  listingProgress: 92.3,
  trustScore: 8.7,
  status: {
    coinGecko: 'PENDING',
    coinMarketCap: 'REVIEW',
    secCompliant: true,
    regD506c: true,
    kycCompleted: true,
    auditCompleted: true
  }
};

// Real NFT Book Contract ABI (from attached assets)
export const NFT_BOOK_CONTRACT_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "CQT",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "tierId", "type": "uint256"},
      {"internalType": "address", "name": "paymentToken", "type": "address"},
      {"internalType": "string", "name": "uri", "type": "string"},
      {
        "components": [
          {"internalType": "string", "name": "chapter", "type": "string"},
          {"internalType": "string", "name": "character", "type": "string"},
          {"internalType": "string", "name": "location", "type": "string"},
          {"internalType": "string", "name": "element", "type": "string"},
          {"internalType": "string", "name": "rarity", "type": "string"}
        ],
        "internalType": "struct CryptoQuestTheShardsOfGenesisBookNFT.Metadata",
        "name": "metadata",
        "type": "tuple"
      }
    ],
    "name": "buyNFT",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "tierCount",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

// Multi-Wallet Strategy (from attached assets analysis)
export const WALLET_INTEGRATION = {
  safe: {
    purpose: 'Core game operations and treasury',
    networks: ['Polygon', 'BASE'],
    functions: ['Token treasury', 'LP management', 'Player rewards', 'Smart contract operations']
  },
  totalSig: {
    purpose: 'AI mining and cross-chain operations',
    networks: ['Bitcoin', 'Ethereum', 'Tron', 'BNB', 'Solana', 'Dogecoin'],
    functions: ['Mining rewards', 'Asset conversion', 'Cross-chain bridging', 'Portfolio diversification']
  },
  userWallets: {
    privy: { status: 'coming_soon', features: ['Social login', 'Embedded wallets'] },
    coinbase: { status: 'active', features: ['SDK integration', 'Millions of users'] },
    circle: { status: 'coming_soon', features: ['USDC optimized', 'Programmable wallets'] },
    walletConnect: { status: 'active', features: ['Universal compatibility'] }
  }
};

// Real Token Economics (from screenshots analysis)
export const TOKEN_ECONOMICS = {
  baseNetwork: {
    contract: LIVE_CONTRACTS.cqt_base,
    explorer: 'https://basescan.org/token/0x9d1075b41cd80ab08179f36bc17a7ff8708748ba#code'
  },
  polygonNetwork: {
    contract: LIVE_CONTRACTS.cqt_polygon
  },
  totalSupply: '1,000,000,000 CQT',
  circulatingSupply: '250,000,000 CQT',
  distribution: {
    gamingRewards: 40,
    liquidityStaking: 25,
    development: 20,
    communityMarketing: 15
  },
  liquidityPools: {
    maticCqt: {
      address: '0x0b3cd8a843DEFDF01564a0342a89ba06c4fC9394',
      apr: 125.4
    },
    wethCqt: {
      address: '0xb1e0b26f550203FAb31A0D9C1Eb4FFE330bfE4d0',
      apr: 89.7
    }
  },
  totalLiquidity: '$2.4M',
  lockedPercentage: 85.3
};

// Owner wallet address (to be updated from replit.md)
export const ADMIN_WALLET = '0x67BF9f428d92704C3Db3a08dC05Bc941A8647866';