// TypeScript Type Definitions for CryptoQuest Arbitrage Bot
export interface PoolInfo {
  address: string;
  network: 'polygon' | 'base';
  token0: string;
  token1: string;
  token0Address: string;
  token1Address: string;
  feeTier: number;
  price: number;
  liquidity: string;
  lastUpdate: Date;
}

export interface ArbitrageOpportunity {
  id: string;
  sourcePool: PoolInfo;
  targetPool: PoolInfo;
  profitPotential: number;
  requiredAmount: number;
  executionCost: number;
  netProfit: number;
  confidence: number;
  timestamp: Date;
  status: 'pending' | 'executing' | 'completed' | 'failed';
}

export interface BridgeTransaction {
  txHash: string;
  sourceNetwork: string;
  targetNetwork: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: Date;
  gasUsed: number;
  confirmationTime?: number;
}

export interface SystemMetrics {
  totalArbitrages: number;
  successfulArbitrages: number;
  totalProfit: number;
  gasSpent: number;
  uptime: string;
  uptimeStart: Date;
  successRate: number;
  aiMinerMetrics: {
    totalStaked: number;
    totalRewards: number;
    stakingAPR: number;
    optimizationScore: number;
  };
  liquidityMetrics: {
    totalProvided: number;
    totalFees: number;
    poolCount: number;
    averageAPR: number;
  };
}

export interface DashboardState {
  currentSection: string;
  isAutoRefreshEnabled: boolean;
  refreshInterval: number;
  opportunities: ArbitrageOpportunity[];
  metrics: SystemMetrics;
  pools: Record<string, PoolInfo>;
  isConnected: boolean;
  autoExecuteEnabled: boolean;
  securityMode: 'standard' | 'high' | 'maximum';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}

export interface WebSocketMessage {
  type: 'opportunity' | 'execution' | 'metrics' | 'status' | 'ai_decision' | 'security_alert';
  data: any;
  timestamp: Date;
}

export interface SecurityConfig {
  maxSlippage: number;
  gasLimitMultiplier: number;
  maxGasPrice: string;
  minProfitThreshold: number;
  maxPositionSize: number;
  cooldownPeriod: number;
  zkProofEnabled: boolean;
  postQuantumEnabled: boolean;
  rustSecurityLayer: boolean;
}

export interface CrossChainConfig {
  enabled: boolean;
  bridgeProvider: 'agglayer' | 'layerzero';
  bridgeContracts: Record<string, string>;
  estimatedBridgeTime: Record<string, number>;
  bridgeFees: Record<string, number>;
  aggLayerEnabled: boolean;
  unifiedLiquidity: number;
}

export interface MLPrediction {
  confidence: number;
  predictedPrice: number;
  timeHorizon: number;
  factors: Record<string, number>;
  timestamp: Date;
  modelType: 'lstm' | 'transformer' | 'ensemble';
  accuracyScore: number;
}

export interface AgentDecision {
  id: string;
  type: 'arbitrage' | 'liquidity' | 'risk_management' | 'optimization';
  action: string;
  reasoning: string;
  confidence: number;
  executed: boolean;
  result?: string;
  timestamp: Date;
  profitImpact: number;
}

export interface LiquidityPosition {
  poolAddress: string;
  network: string;
  token0Amount: string;
  token1Amount: string;
  lpTokens: string;
  rewards: string;
  apy: number;
  lastUpdate: Date;
  impermanentLoss: number;
}

export interface StakingReward {
  amount: string;
  token: string;
  network: string;
  blockNumber: number;
  timestamp: Date;
  claimed: boolean;
  stakingContract: string;
  validator?: string;
}

export interface AIMinerConfig {
  enabled: boolean;
  networks: string[];
  stakingConfig: Record<string, {
    minStakeAmount: number;
    expectedAPY: number;
    stakingContract: string;
  }>;
  optimization: {
    cycleInterval: number;
    minRewardThreshold: number;
    maxRiskScore: number;
  };
}

export interface LiquidityProviderConfig {
  enabled: boolean;
  profitAllocationPercentage: number;
  injectionThresholds: {
    minReserveBalance: number;
    minInjectionInterval: number;
  };
  poolPriorities: Record<string, number>;
  autoInjection: boolean;
}

export interface ZKProofConfig {
  enabled: boolean;
  proofType: 'agglayer_pessimistic' | 'optimistic' | 'zk_stark';
  verificationTimeout: number;
  proofValidityPeriod: number;
}

export interface PostQuantumConfig {
  enabled: boolean;
  algorithm: 'dilithium' | 'falcon' | 'sphincs';
  keySize: number;
  signatureValidityPeriod: number;
}

// Enhanced API Client Interface
export interface ApiClient {
  // Basic endpoints
  getStatus(): Promise<ApiResponse<{ status: string; timestamp: Date }>>;
  getMetrics(): Promise<ApiResponse<SystemMetrics>>;
  getOpportunities(): Promise<ApiResponse<ArbitrageOpportunity[]>>;
  getPools(): Promise<ApiResponse<Record<string, PoolInfo>>>;
  
  // Arbitrage operations
  executeArbitrage(opportunityId: string): Promise<ApiResponse<{ txHash: string }>>;
  validateOpportunity(opportunityId: string): Promise<ApiResponse<{ valid: boolean; reason?: string }>>;
  
  // Bot control
  startBot(): Promise<ApiResponse<{ status: string }>>;
  stopBot(): Promise<ApiResponse<{ status: string }>>;
  emergencyStop(): Promise<ApiResponse<{ status: string }>>;
  
  // AI Miner
  getMinerMetrics(): Promise<ApiResponse<any>>;
  optimizeStaking(): Promise<ApiResponse<{ result: string }>>;
  
  // Liquidity Provider
  getLiquidityPositions(): Promise<ApiResponse<LiquidityPosition[]>>;
  addLiquidity(poolAddress: string, amount: number): Promise<ApiResponse<{ txHash: string }>>;
  removeLiquidity(poolAddress: string, percentage: number): Promise<ApiResponse<{ txHash: string }>>;
  
  // Cross-chain
  getBridgeStatus(): Promise<ApiResponse<any>>;
  bridgeTokens(fromNetwork: string, toNetwork: string, amount: number): Promise<ApiResponse<{ txHash: string }>>;
  
  // Security
  getSecurityScore(): Promise<ApiResponse<{ score: number; issues: string[] }>>;
  updateSecurityConfig(config: Partial<SecurityConfig>): Promise<ApiResponse<{ updated: boolean }>>;
  
  // Analytics
  getAnalytics(timeRange: string): Promise<ApiResponse<any>>;
  getProfitChart(timeRange: string): Promise<ApiResponse<any>>;
}

// Chart Data Types
export interface ChartDataPoint {
  timestamp: Date;
  value: number;
  label?: string;
}

export interface PriceHistoryData {
  poolAddress: string;
  network: string;
  prices: ChartDataPoint[];
  volume: ChartDataPoint[];
  liquidity: ChartDataPoint[];
}

export interface ProfitChartData {
  daily: ChartDataPoint[];
  cumulative: ChartDataPoint[];
  breakdown: {
    arbitrage: number;
    liquidity: number;
    staking: number;
    aiOptimization: number;
  };
}

// Error Types
export class ArbitrageError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ArbitrageError';
  }
}

export class NetworkError extends ArbitrageError {
  constructor(network: string, details?: any) {
    super(`Network error on ${network}`, 'NETWORK_ERROR', details);
  }
}

export class ValidationError extends ArbitrageError {
  constructor(field: string, value: any) {
    super(`Validation failed for ${field}: ${value}`, 'VALIDATION_ERROR', { field, value });
  }
}

export class SecurityError extends ArbitrageError {
  constructor(message: string, details?: any) {
    super(message, 'SECURITY_ERROR', details);
  }
}

// Utility Types
export type NetworkType = 'polygon' | 'base';
export type TransactionStatus = 'pending' | 'confirmed' | 'failed';
export type BotStatus = 'idle' | 'monitoring' | 'executing' | 'error' | 'emergency_stop';
export type SectionType = 'overview' | 'arbitrage' | 'ai-miner' | 'liquidity' | 'cross-chain' | 'analytics' | 'agent-kit' | 'security';

// Configuration Types
export interface AppConfig {
  apiBaseUrl: string;
  wsUrl: string;
  networks: Record<NetworkType, {
    rpcUrl: string;
    chainId: number;
    contracts: Record<string, string>;
  }>;
  security: SecurityConfig;
  crossChain: CrossChainConfig;
  aiMiner: AIMinerConfig;
  liquidityProvider: LiquidityProviderConfig;
  zkProof: ZKProofConfig;
  postQuantum: PostQuantumConfig;
  ui: {
    refreshInterval: number;
    enableAnimations: boolean;
    theme: 'light' | 'dark' | 'auto';
    voiceAlerts: boolean;
    advancedMode: boolean;
  };
}

// Enhanced Arbitrage Opportunity with ML Predictions
export interface EnhancedOpportunity extends ArbitrageOpportunity {
  mlPrediction: MLPrediction;
  riskScore: number;
  executionProbability: number;
  timeWindow: number;
  competitorAnalysis: {
    competitorCount: number;
    averageExecutionTime: number;
    successRate: number;
  };
  crossChainRoute?: {
    bridgeProvider: string;
    estimatedTime: number;
    bridgeFee: number;
  };
}

// AI Agent Decision Framework
export interface AIDecisionContext {
  marketConditions: {
    volatility: number;
    liquidity: number;
    gasPrice: number;
    networkCongestion: number;
  };
  portfolioState: {
    totalValue: number;
    diversification: number;
    riskExposure: number;
    availableCapital: number;
  };
  historicalPerformance: {
    recentSuccessRate: number;
    averageProfit: number;
    maxDrawdown: number;
  };
  externalFactors: {
    newsEvents: string[];
    marketSentiment: number;
    regulatoryChanges: string[];
  };
}

export interface AIDecisionResult {
  decision: 'execute' | 'skip' | 'monitor' | 'optimize';
  confidence: number;
  reasoning: string;
  expectedOutcome: {
    profit: number;
    risk: number;
    timeframe: number;
  };
  alternativeActions: string[];
  monitoring: {
    watchConditions: string[];
    alertThresholds: Record<string, number>;
  };
}