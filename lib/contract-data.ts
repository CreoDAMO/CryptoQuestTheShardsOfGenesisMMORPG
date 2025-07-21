// Real Contract Data from Attached Assets
export const LIVE_CONTRACTS = {
  // CQT Token Contracts
  CQT_POLYGON: '0x94ef57abfBff1AD70bD00a921e1d2437f31C1665',
  CQT_BASE: '0x9d1075b41cd80ab08179f36bc17a7ff8708748ba',
  
  // NFT Contracts
  NFT_BOOK_CONTRACT: '0x295f4e637b4f7b3b3d01d9b7e4e6d3e2f1a0c9e8',
  
  // DeFi Contracts
  STAKING_CONTRACT: '0x4915363b3b2454f170494c9ecbefa6f6332867f9',
  FARMING_CONTRACT: '0x35e2d0a1e2f5c1c5d5f7ea0d3da1ba3f48b85a9c',
  
  // Governance
  DAO_CONTRACT: '0x0ca9d4a4e5fb72dd6f7ae57ba8a3f43f94e6490'
};

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
    contract: LIVE_CONTRACTS.CQT_BASE,
    explorer: 'https://basescan.org/token/0x9d1075b41cd80ab08179f36bc17a7ff8708748ba#code'
  },
  polygonNetwork: {
    contract: LIVE_CONTRACTS.CQT_POLYGON
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