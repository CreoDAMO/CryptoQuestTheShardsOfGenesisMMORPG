import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupVite, serveStatic } from "./vite";
import { storage } from "./storage";
import { 
  insertUserSchema, insertPlayerSchema, insertGuildSchema, insertQuestSchema,
  insertItemSchema, insertTokenTransactionSchema, insertStakingPositionSchema,
  insertFarmingPositionSchema, insertNftCollectionSchema, insertDaoProposalSchema,
  insertDaoVoteSchema
} from "../shared/schema.js";

// Service imports - these need to be adjusted based on actual lib structure
interface ArbitrageOpportunity {
  id: string;
  tokenPair: string;
  fromChain: string;
  toChain: string;
  priceDifference: number;
  profitPercentage: number;
  volume: number;
  gasEstimate: number;
  executionTime: number;
  confidence: number;
}

interface MiningMetrics {
  gpuUtilization: number;
  hashrate: number;
  powerConsumption: number;
  temperature: number;
  efficiency: number;
}

interface GamingAIMetrics {
  modelAccuracy: number;
  responseTime: number;
  predictionScore: number;
  adaptiveOptimization: number;
}

interface CloudResourceUsage {
  creditsUsed: number;
  creditsRemaining: number;
  apiCallsToday: number;
  activeInstances: number;
  totalComputeHours: number;
}

// Mock services for now - will be replaced with actual service implementations
const mockNvidiaCloudService = {
  async getMiningMetrics(): Promise<MiningMetrics> {
    return {
      gpuUtilization: 78.5,
      hashrate: 245.7,
      powerConsumption: 1250,
      temperature: 65,
      efficiency: 87.3
    };
  },

  async getGamingAIMetrics(): Promise<GamingAIMetrics> {
    return {
      modelAccuracy: 96.2,
      responseTime: 15,
      predictionScore: 89.4,
      adaptiveOptimization: 94.1
    };
  },

  async getCloudResourceUsage(): Promise<CloudResourceUsage> {
    return {
      creditsUsed: 875,
      creditsRemaining: 1250,
      apiCallsToday: 15240,
      activeInstances: 4,
      totalComputeHours: 156.7
    };
  },

  async initializeGPUMining() {
    return { success: true, message: 'GPU mining initialized' };
  },

  async scaleMiningOperations(targetHashrate: number) {
    return { success: true, newHashrate: targetHashrate, message: 'Mining scaled successfully' };
  },

  async enhanceGameplayAI(playerData: any) {
    return { success: true, optimizations: ['difficulty_adjustment', 'reward_multiplier'], message: 'AI enhanced' };
  },

  async predictMarketTrends(data: any[]) {
    return { success: true, predictions: { trend: 'bullish', confidence: 85.2 }, message: 'Predictions generated' };
  },

  async optimizeArbitrageStrategy(params: any) {
    return { success: true, strategy: 'high_frequency', expectedProfit: 12.5 };
  }
};

const mockAgentService = {
  async getAgentStatus() {
    return { initialized: true, status: 'active', lastAction: new Date() };
  },

  async initialize() {
    return { success: true, message: 'Agent initialized' };
  },

  async executeAction(action: string, params: any) {
    return { success: true, action, result: `Executed ${action}`, params };
  }
};

const mockSuperPayService = {
  async initialize() {
    return { success: true, message: 'SuperPay initialized' };
  },

  async getAllInvoices() {
    return [];
  },

  async getBalance(currency: string) {
    return { currency, balance: 1000.50 };
  },

  async sendPayment(params: any) {
    return { success: true, transactionId: `tx_${Math.random().toString(36).substring(7)}` };
  },

  async createInvoice(params: any) {
    return { success: true, invoiceId: `inv_${Math.random().toString(36).substring(7)}`, ...params };
  },

  async payInvoice(invoiceId: string, payerAddress: string) {
    return { success: true, invoiceId, payerAddress, status: 'paid' };
  },

  async purchaseGameItem(params: any) {
    return { success: true, itemId: params.itemId, transactionId: `tx_${Math.random().toString(36).substring(7)}` };
  },

  async purchaseGuildMembership(params: any) {
    return { success: true, guildId: params.guildId, transactionId: `tx_${Math.random().toString(36).substring(7)}` };
  }
};

// Helper function to generate arbitrage opportunities
const generateArbitrageOpportunities = (): ArbitrageOpportunity[] => {
  const pairs = ['CQT/WETH', 'CQT/USDC', 'CQT/WMATIC'];
  const chains = [
    { name: 'Polygon', gasPrice: 30 },
    { name: 'Base', gasPrice: 0.5 },
    { name: 'Ethereum', gasPrice: 50 }
  ];

  return pairs.flatMap(pair => 
    chains.flatMap(fromChain =>
      chains
        .filter(toChain => toChain.name !== fromChain.name)
        .map(toChain => ({
          id: `${pair}-${fromChain.name}-${toChain.name}-${Date.now()}`,
          tokenPair: pair,
          fromChain: fromChain.name,
          toChain: toChain.name,
          priceDifference: Math.random() * 0.05 + 0.01,
          profitPercentage: Math.random() * 15 + 3,
          volume: Math.floor(Math.random() * 500000 + 50000),
          gasEstimate: fromChain.gasPrice + toChain.gasPrice,
          executionTime: Math.floor(Math.random() * 30 + 15),
          confidence: Math.random() * 20 + 75
        }))
    )
  ).filter(opp => opp.profitPercentage > 5);
};

export async function registerRoutes(app: Express, server: Server): Promise<void> {
  
  // ============================================
  // GAMING API ROUTES
  // ============================================

  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/users/wallet/:address", async (req, res) => {
    try {
      const { address } = req.params;
      const user = await storage.getUserByWallet(address);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Player routes
  app.get("/api/players/:address", async (req, res) => {
    try {
      const { address } = req.params;
      const player = await storage.getPlayer(address);
      
      if (!player) {
        return res.status(404).json({ error: "Player not found" });
      }
      
      res.json(player);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/players", async (req, res) => {
    try {
      const playerData = insertPlayerSchema.parse(req.body);
      const player = await storage.createPlayer(playerData);
      res.status(201).json(player);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/players/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const updates = req.body;
      const player = await storage.updatePlayer(id, updates);
      res.json(player);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Guild routes
  app.get("/api/guilds", async (req, res) => {
    try {
      // For now, return empty array - would need to implement storage method
      res.json([]);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/guilds", async (req, res) => {
    try {
      const guildData = insertGuildSchema.parse(req.body);
      const guild = await storage.createGuild(guildData);
      res.status(201).json(guild);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Quest routes
  app.get("/api/quests", async (req, res) => {
    try {
      const quests = await storage.getActiveQuests();
      res.json(quests);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/players/:id/quests", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const quests = await storage.getPlayerQuests(id);
      res.json(quests);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Items routes
  app.get("/api/items", async (req, res) => {
    try {
      const items = await storage.getItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/items", async (req, res) => {
    try {
      const itemData = insertItemSchema.parse(req.body);
      const item = await storage.createItem(itemData);
      res.status(201).json(item);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // ============================================
  // AGENTKIT API ROUTES
  // ============================================

  app.get("/api/agentkit", async (req, res) => {
    try {
      const status = await mockAgentService.getAgentStatus();
      res.json({
        success: true,
        data: status
      });
    } catch (error) {
      console.error('AgentKit status error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get agent status'
      });
    }
  });

  app.post("/api/agentkit", async (req, res) => {
    try {
      const { action, params } = req.body;

      if (!action) {
        return res.status(400).json({
          success: false,
          error: 'Action is required'
        });
      }

      // Initialize agent if not already done
      const status = await mockAgentService.getAgentStatus();
      if (!status.initialized) {
        await mockAgentService.initialize();
      }

      const result = await mockAgentService.executeAction(action, params);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('AgentKit action error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Action failed'
      });
    }
  });

  // ============================================
  // ARBITRAGE API ROUTES
  // ============================================

  app.get("/api/arbitrage", async (req, res) => {
    try {
      const action = req.query.action as string || 'scan';

      switch (action) {
        case 'scan':
          const opportunities = generateArbitrageOpportunities();
          
          const aiRecommendations = await mockNvidiaCloudService.optimizeArbitrageStrategy({
            opportunities,
            currentMarket: 'bullish'
          });

          res.json({
            success: true,
            data: {
              opportunities: opportunities.slice(0, 5),
              aiRecommendations,
              scanTime: new Date().toISOString(),
              totalOpportunities: opportunities.length
            }
          });
          break;

        case 'status':
          const [miningMetrics, gamingMetrics, cloudUsage] = await Promise.all([
            mockNvidiaCloudService.getMiningMetrics(),
            mockNvidiaCloudService.getGamingAIMetrics(),
            mockNvidiaCloudService.getCloudResourceUsage()
          ]);

          res.json({
            success: true,
            data: {
              arbitrage: {
                totalProfit: 15420.85,
                activeOpportunities: opportunities.length,
                successRate: 94.7,
                liquidityProvided: 7500000000000,
                gasOptimization: 87.3
              },
              mining: miningMetrics,
              gaming: gamingMetrics,
              cloud: cloudUsage
            }
          });
          break;

        default:
          res.status(400).json({
            success: false,
            error: 'Invalid action parameter'
          });
      }
    } catch (error) {
      console.error('Arbitrage API error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  });

  app.post("/api/arbitrage", async (req, res) => {
    try {
      const { action, opportunityId, ...params } = req.body;

      switch (action) {
        case 'execute':
          if (!opportunityId) {
            return res.status(400).json({
              success: false,
              error: 'Opportunity ID required for execution'
            });
          }

          const executionResult = {
            transactionId: `0x${Math.random().toString(16).slice(2, 66)}`,
            status: 'pending',
            estimatedProfit: Math.random() * 5000 + 1000,
            gasUsed: Math.floor(Math.random() * 100000 + 200000),
            executionTime: Math.floor(Math.random() * 30 + 15)
          };

          res.json({
            success: true,
            data: executionResult
          });
          break;

        case 'optimize':
          const optimizedStrategy = await mockNvidiaCloudService.optimizeArbitrageStrategy({
            currentPositions: params,
            marketConditions: 'volatile'
          });

          res.json({
            success: true,
            data: optimizedStrategy
          });
          break;

        default:
          res.status(400).json({
            success: false,
            error: 'Invalid action'
          });
      }
    } catch (error) {
      console.error('Arbitrage POST error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  });

  // ============================================
  // NVIDIA CLOUD API ROUTES
  // ============================================

  app.get("/api/nvidia", async (req, res) => {
    try {
      const action = req.query.action as string || 'status';

      switch (action) {
        case 'status':
          const [miningMetrics, gamingMetrics, cloudUsage] = await Promise.all([
            mockNvidiaCloudService.getMiningMetrics(),
            mockNvidiaCloudService.getGamingAIMetrics(),
            mockNvidiaCloudService.getCloudResourceUsage()
          ]);

          res.json({
            success: true,
            data: {
              mining: miningMetrics,
              gaming: gamingMetrics,
              cloud: cloudUsage,
              timestamp: new Date().toISOString()
            }
          });
          break;

        case 'mining':
          const miningData = await mockNvidiaCloudService.getMiningMetrics();
          res.json({
            success: true,
            data: miningData
          });
          break;

        case 'gaming':
          const gamingData = await mockNvidiaCloudService.getGamingAIMetrics();
          res.json({
            success: true,
            data: gamingData
          });
          break;

        case 'cloud':
          const cloudData = await mockNvidiaCloudService.getCloudResourceUsage();
          res.json({
            success: true,
            data: cloudData
          });
          break;

        default:
          res.status(400).json({
            success: false,
            error: 'Invalid action parameter'
          });
      }
    } catch (error) {
      console.error('Nvidia API error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  });

  app.post("/api/nvidia", async (req, res) => {
    try {
      const { action, targetHashrate, playerData, historicalData } = req.body;

      switch (action) {
        case 'mining':
          const initResult = await mockNvidiaCloudService.initializeGPUMining();
          res.json({
            success: true,
            data: initResult
          });
          break;

        case 'scale':
          if (!targetHashrate) {
            return res.status(400).json({
              success: false,
              error: 'Target hashrate required for scaling'
            });
          }

          const scaleResult = await mockNvidiaCloudService.scaleMiningOperations(targetHashrate);
          res.json({
            success: true,
            data: scaleResult
          });
          break;

        case 'gaming':
          const enhanceResult = await mockNvidiaCloudService.enhanceGameplayAI(playerData || {});
          res.json({
            success: true,
            data: enhanceResult
          });
          break;

        case 'predict':
          const predictions = await mockNvidiaCloudService.predictMarketTrends(historicalData || []);
          res.json({
            success: true,
            data: predictions
          });
          break;

        case 'optimize':
          const optimization = await mockNvidiaCloudService.optimizeArbitrageStrategy(req.body);
          res.json({
            success: true,
            data: optimization
          });
          break;

        default:
          res.status(400).json({
            success: false,
            error: 'Invalid action'
          });
      }
    } catch (error) {
      console.error('Nvidia POST error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  });

  // ============================================
  // SUPERPAY API ROUTES
  // ============================================

  app.get("/api/superpay", async (req, res) => {
    try {
      const [invoices, balance] = await Promise.all([
        mockSuperPayService.getAllInvoices(),
        mockSuperPayService.getBalance('ETH')
      ]);

      res.json({
        success: true,
        data: {
          invoices,
          balance
        }
      });
    } catch (error) {
      console.error('SuperPay data error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get SuperPay data'
      });
    }
  });

  app.post("/api/superpay", async (req, res) => {
    try {
      const { action, ...params } = req.body;

      if (!action) {
        return res.status(400).json({
          success: false,
          error: 'Action is required'
        });
      }

      // Initialize SuperPay if not already done
      await mockSuperPayService.initialize();

      let result;

      switch (action) {
        case 'sendPayment':
          result = await mockSuperPayService.sendPayment(params);
          break;
        
        case 'createInvoice':
          result = await mockSuperPayService.createInvoice(params);
          break;
        
        case 'payInvoice':
          result = await mockSuperPayService.payInvoice(params.invoiceId, params.payerAddress);
          break;
        
        case 'getBalance':
          result = await mockSuperPayService.getBalance(params.currency || 'ETH');
          break;
        
        case 'purchaseGameItem':
          result = await mockSuperPayService.purchaseGameItem(params);
          break;
        
        case 'purchaseGuildMembership':
          result = await mockSuperPayService.purchaseGuildMembership(params);
          break;
        
        default:
          return res.status(400).json({
            success: false,
            error: 'Unknown action'
          });
      }
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('SuperPay action error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Action failed'
      });
    }
  });

  // ============================================
  // BLOCKCHAIN ROUTES
  // ============================================

  // Token transaction routes
  app.post("/api/transactions", async (req, res) => {
    try {
      const transactionData = insertTokenTransactionSchema.parse(req.body);
      const transaction = await storage.createTokenTransaction(transactionData);
      res.status(201).json(transaction);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/transactions/:walletAddress", async (req, res) => {
    try {
      const { walletAddress } = req.params;
      const transactions = await storage.getTokenTransactions(walletAddress);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Staking routes
  app.post("/api/staking", async (req, res) => {
    try {
      const stakingData = insertStakingPositionSchema.parse(req.body);
      const position = await storage.createStakingPosition(stakingData);
      res.status(201).json(position);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/staking/:walletAddress", async (req, res) => {
    try {
      const { walletAddress } = req.params;
      const positions = await storage.getStakingPositions(walletAddress);
      res.json(positions);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // DAO routes
  app.post("/api/dao/proposals", async (req, res) => {
    try {
      const proposalData = insertDaoProposalSchema.parse(req.body);
      const proposal = await storage.createDaoProposal(proposalData);
      res.status(201).json(proposal);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/dao/proposals", async (req, res) => {
    try {
      const proposals = await storage.getDaoProposals();
      res.json(proposals);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/dao/votes", async (req, res) => {
    try {
      const voteData = insertDaoVoteSchema.parse(req.body);
      const vote = await storage.createDaoVote(voteData);
      res.status(201).json(vote);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });
}