// Missing Smart Contract Integration for CryptoQuest
export const LIVE_CONTRACTS = {
  polygon: {
    // Core Gaming Contracts
    mmorpg: '0xe0E1AD6f103DC37FfC7C7F3aFfC1D55Cc7f8BF7F',
    // tokenSale contract removed - replaced with SafeGlobal MultiSig
    token: '0x94ef57abfbff1ad70bd00a921e1d2437f31c1665',
    dao: '0x7C8B2F4a5D8E9C3B6F2A1E4D7C9B8A5E3F6B2D1C',
    timelock: '0x9F5B3E2A8D7C6B1F4E9A2C5D8B7A3E6F1C4B9D2E',
    nft: '0x2A4E6D9C8B5F3A1D7E2C6B9F8A5D3E7C1B4F6A8D',
    
    // Enhanced DeFi Contracts
    staking: '0x4915363b4362e0e27bd63e8d789ca99d44ba6bfb',
    farming: '0x95e2091ec00bd7b0e3e58b8e9e8e6b88c9d03b1e',
    swap: '0x9d1075B41Cd80AB08179f36BC17a7FF8708748ba',
    
    // NFT Book Marketplace
    bookNft: '0x545ace061a1b64b14641b50cfe317017b01a667b',
    bookSales: '0xe1df30dbeaf0e895bc5b7efd8b7b9ed91097c8d7',
    
    // Liquidity Pools
    cqtWethPool: '0xb1E0B26c31a2e8c3eeBd6d5ff0E386A9c073d24F',
    cqtWmaticPool: '0x0b3CD8a843DEFDF01564a0342a89ba06c4fC9394',
    
    // Oracle and Price Feeds
    priceOracle: '0x8A2F6B4C9D3E7A1F5B8C2E6D9A4F7B3E8C1A5F2B',
    chainlinkAggregator: '0x5D3A9B2E8F7C4A6B1D9E3C7F2A5B8E4D7C9A1F6B'
  },
  
  base: {
    // CQT Token on Base
    cqt: '0x9d1075b41cd80ab08179f36bc17a7ff8708748ba',
    
    // Base Liquidity Pools
    cqtUsdcPool: '0xd874aeaef376229c8d41d392c9ce272bd41e57d6',
    
    // Bridge Contracts
    aggLayerBridge: '0x0000000000000000000000000000000000000001'
  }
};

export const CONTRACT_ABIS = {
  // ERC20 ABI for CQT token
  erc20: [
    'function balanceOf(address owner) view returns (uint256)',
    'function transfer(address to, uint256 amount) returns (bool)',
    'function transferFrom(address from, address to, uint256 amount) returns (bool)',
    'function approve(address spender, uint256 amount) returns (bool)',
    'function totalSupply() view returns (uint256)',
    'function decimals() view returns (uint8)',
    'function symbol() view returns (string)',
    'function name() view returns (string)'
  ],
  
  // Uniswap V3 Pool ABI
  uniswapV3Pool: [
    'function token0() view returns (address)',
    'function token1() view returns (address)',
    'function fee() view returns (uint24)',
    'function liquidity() view returns (uint128)',
    'function slot0() view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)'
  ],
  
  // Staking Contract ABI
  staking: [
    'function stake(uint256 amount) external',
    'function unstake(uint256 amount) external',
    'function claimRewards() external',
    'function balanceOf(address account) view returns (uint256)',
    'function earned(address account) view returns (uint256)',
    'function totalSupply() view returns (uint256)',
    'function rewardRate() view returns (uint256)'
  ],
  
  // MMORPG Contract ABI
  mmorpg: [
    'function createCharacter(string memory name, uint256 characterClass) external',
    'function levelUp(uint256 characterId) external',
    'function completeQuest(uint256 questId) external',
    'function joinGuild(uint256 guildId) external',
    'function createGuild(string memory name) external',
    'function getCharacter(uint256 characterId) view returns (tuple)',
    'function getGuild(uint256 guildId) view returns (tuple)'
  ],
  
  // NFT Book ABI
  nftBook: [
    'function mint(address to, uint256 tokenId, string memory uri) external',
    'function burn(uint256 tokenId) external',
    'function tokenURI(uint256 tokenId) view returns (string)',
    'function ownerOf(uint256 tokenId) view returns (address)',
    'function balanceOf(address owner) view returns (uint256)'
  ]
};

export const NETWORK_CONFIG = {
  polygon: {
    chainId: 137,
    name: 'Polygon',
    rpcUrl: 'https://polygon-rpc.com',
    blockExplorer: 'https://polygonscan.com',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18
    }
  },
  
  base: {
    chainId: 8453,
    name: 'Base',
    rpcUrl: 'https://mainnet.base.org',
    blockExplorer: 'https://basescan.org',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18
    }
  }
};

// Pool configurations for arbitrage monitoring
export const ARBITRAGE_POOLS = [
  {
    id: 'polygon_cqt_weth',
    address: LIVE_CONTRACTS.polygon.cqtWethPool,
    network: 'polygon',
    token0: 'CQT',
    token1: 'WETH',
    token0Address: LIVE_CONTRACTS.polygon.token,
    token1Address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
    feeTier: 3000,
    enabled: true
  },
  {
    id: 'polygon_cqt_wmatic',
    address: LIVE_CONTRACTS.polygon.cqtWmaticPool,
    network: 'polygon',
    token0: 'CQT',
    token1: 'WMATIC',
    token0Address: LIVE_CONTRACTS.polygon.token,
    token1Address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
    feeTier: 3000,
    enabled: true
  },
  {
    id: 'base_cqt_usdc',
    address: LIVE_CONTRACTS.base.cqtUsdcPool,
    network: 'base',
    token0: 'CQT',
    token1: 'USDC',
    token0Address: LIVE_CONTRACTS.base.cqt,
    token1Address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    feeTier: 3000,
    enabled: true
  }
];

// Security configurations
export const SECURITY_SETTINGS = {
  maxSlippage: 0.02, // 2%
  gasLimitMultiplier: 1.2,
  maxGasPrice: '100000000000', // 100 Gwei
  minProfitThreshold: 0.005, // 0.5%
  maxPositionSize: 1000000, // 1M CQT
  cooldownPeriod: 60, // 60 seconds
  zkProofEnabled: true,
  postQuantumEnabled: true,
  rustSecurityLayer: true
};

// Cross-chain bridge configuration
export const BRIDGE_CONFIG = {
  agglayer: {
    enabled: true,
    contracts: {
      polygon: '0x0000000000000000000000000000000000000001',
      base: '0x0000000000000000000000000000000000000001'
    },
    fees: {
      flatFee: 0.01,
      percentageFee: 0.001
    },
    estimatedTime: 180 // 3 minutes
  }
};