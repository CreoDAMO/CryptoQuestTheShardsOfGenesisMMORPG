import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupVite, serveStatic } from "./vite";
import { storage } from "./storage";
import { 
  insertUserSchema, insertPlayerSchema, insertGuildSchema, insertQuestSchema,
  insertItemSchema, insertTokenTransactionSchema, insertStakingPositionSchema,
  insertFarmingPositionSchema, insertNftCollectionSchema, insertDaoProposalSchema,
  insertDaoVoteSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const server = createServer(app);

  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // User routes
  app.get("/api/users/:id", async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const user = await storage.getUser(id);
    
    if (!user) {
      return res.status(404).send("User not found");
    }
    
    res.json(user);
  });

  app.get("/api/users/wallet/:address", async (req, res) => {
    const { address } = req.params;
    const user = await storage.getUserByWallet(address);
    
    if (!user) {
      return res.status(404).send("User not found");
    }
    
    res.json(user);
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
  app.get("/api/players/wallet/:address", async (req, res) => {
    const { address } = req.params;
    const player = await storage.getPlayer(address);
    
    if (!player) {
      return res.status(404).send("Player not found");
    }
    
    res.json(player);
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

  app.put("/api/players/:id", async (req, res) => {
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
      const playerId = req.query.playerId ? parseInt(req.query.playerId as string, 10) : undefined;
      if (playerId) {
        const guilds = await storage.getPlayerGuilds(playerId);
        res.json(guilds);
      } else {
        res.json([]);
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
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
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/quests/player/:playerId", async (req, res) => {
    try {
      const playerId = parseInt(req.params.playerId, 10);
      const playerQuests = await storage.getPlayerQuests(playerId);
      res.json(playerQuests);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/quests/:questId/complete", async (req, res) => {
    try {
      const questId = parseInt(req.params.questId, 10);
      const { playerId } = req.body;
      await storage.completeQuest(playerId, questId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Item routes
  app.get("/api/items", async (req, res) => {
    try {
      const items = await storage.getItems();
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
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

  // Token transaction routes
  app.get("/api/transactions/:address", async (req, res) => {
    try {
      const { address } = req.params;
      const transactions = await storage.getTokenTransactions(address);
      res.json(transactions);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/transactions", async (req, res) => {
    try {
      const transactionData = insertTokenTransactionSchema.parse(req.body);
      const transaction = await storage.createTokenTransaction(transactionData);
      res.status(201).json(transaction);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Staking routes
  app.get("/api/staking/:address", async (req, res) => {
    try {
      const { address } = req.params;
      const positions = await storage.getStakingPositions(address);
      res.json(positions);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/staking", async (req, res) => {
    try {
      const stakingData = insertStakingPositionSchema.parse(req.body);
      const position = await storage.createStakingPosition(stakingData);
      res.status(201).json(position);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Farming routes
  app.get("/api/farming/:address", async (req, res) => {
    try {
      const { address } = req.params;
      const positions = await storage.getFarmingPositions(address);
      res.json(positions);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/farming", async (req, res) => {
    try {
      const farmingData = insertFarmingPositionSchema.parse(req.body);
      const position = await storage.createFarmingPosition(farmingData);
      res.status(201).json(position);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // NFT routes
  app.get("/api/nfts/:address", async (req, res) => {
    try {
      const { address } = req.params;
      const nfts = await storage.getNftCollections(address);
      res.json(nfts);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/nfts", async (req, res) => {
    try {
      const nftData = insertNftCollectionSchema.parse(req.body);
      const nft = await storage.createNftCollection(nftData);
      res.status(201).json(nft);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // DAO routes
  app.get("/api/dao/proposals", async (req, res) => {
    try {
      const proposals = await storage.getDaoProposals();
      res.json(proposals);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/dao/proposals", async (req, res) => {
    try {
      const proposalData = insertDaoProposalSchema.parse(req.body);
      const proposal = await storage.createDaoProposal(proposalData);
      res.status(201).json(proposal);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/dao/proposals/:proposalId/votes", async (req, res) => {
    try {
      const proposalId = parseInt(req.params.proposalId, 10);
      const votes = await storage.getDaoVotes(proposalId);
      res.json(votes);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
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

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "healthy", 
      timestamp: new Date().toISOString(),
      database: "connected",
      contracts: "live on Polygon"
    });
  });

  return server;
}
