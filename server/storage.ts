import { 
  users, players, guilds, quests, playerQuests, items, tokenTransactions, 
  stakingPositions, farmingPositions, nftCollections, daoProposals, daoVotes,
  type User, type InsertUser, type Player, type InsertPlayer, type Guild, type InsertGuild,
  type Quest, type InsertQuest, type Item, type InsertItem, type TokenTransaction, 
  type InsertTokenTransaction, type StakingPosition, type InsertStakingPosition,
  type FarmingPosition, type InsertFarmingPosition, type NftCollection, 
  type InsertNftCollection, type DaoProposal, type InsertDaoProposal,
  type DaoVote, type InsertDaoVote
} from "../shared/schema.js";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByWallet(walletAddress: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Player operations
  getPlayer(walletAddress: string): Promise<Player | undefined>;
  getPlayerById(id: number): Promise<Player | undefined>;
  createPlayer(player: InsertPlayer): Promise<Player>;
  updatePlayer(id: number, updates: Partial<InsertPlayer>): Promise<Player>;
  
  // Guild operations
  getGuild(id: number): Promise<Guild | undefined>;
  getGuildByName(name: string): Promise<Guild | undefined>;
  createGuild(guild: InsertGuild): Promise<Guild>;
  getPlayerGuilds(playerId: number): Promise<Guild[]>;
  
  // Quest operations
  getActiveQuests(): Promise<Quest[]>;
  getPlayerQuests(playerId: number): Promise<any[]>;
  completeQuest(playerId: number, questId: number): Promise<void>;
  
  // Item operations
  getItems(): Promise<Item[]>;
  getItem(id: number): Promise<Item | undefined>;
  createItem(item: InsertItem): Promise<Item>;
  
  // Transaction tracking
  createTokenTransaction(transaction: InsertTokenTransaction): Promise<TokenTransaction>;
  getTokenTransactions(walletAddress: string): Promise<TokenTransaction[]>;
  updateTransactionStatus(txHash: string, status: string, blockNumber?: number): Promise<void>;
  
  // Staking operations
  createStakingPosition(position: InsertStakingPosition): Promise<StakingPosition>;
  getStakingPositions(walletAddress: string): Promise<StakingPosition[]>;
  updateStakingPosition(id: number, updates: Partial<InsertStakingPosition>): Promise<StakingPosition>;
  
  // Farming operations
  createFarmingPosition(position: InsertFarmingPosition): Promise<FarmingPosition>;
  getFarmingPositions(walletAddress: string): Promise<FarmingPosition[]>;
  updateFarmingPosition(id: number, updates: Partial<InsertFarmingPosition>): Promise<FarmingPosition>;
  
  // NFT operations
  createNftCollection(nft: InsertNftCollection): Promise<NftCollection>;
  getNftCollections(walletAddress: string): Promise<NftCollection[]>;
  
  // DAO operations
  createDaoProposal(proposal: InsertDaoProposal): Promise<DaoProposal>;
  getDaoProposals(): Promise<DaoProposal[]>;
  createDaoVote(vote: InsertDaoVote): Promise<DaoVote>;
  getDaoVotes(proposalId: number): Promise<DaoVote[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByWallet(walletAddress: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.walletAddress, walletAddress));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Player operations
  async getPlayer(walletAddress: string): Promise<Player | undefined> {
    const [player] = await db.select().from(players).where(eq(players.walletAddress, walletAddress));
    return player || undefined;
  }

  async getPlayerById(id: number): Promise<Player | undefined> {
    const [player] = await db.select().from(players).where(eq(players.id, id));
    return player || undefined;
  }

  async createPlayer(insertPlayer: InsertPlayer): Promise<Player> {
    const [player] = await db
      .insert(players)
      .values(insertPlayer as any)
      .returning();
    return player;
  }

  async updatePlayer(id: number, updates: Partial<InsertPlayer>): Promise<Player> {
    const [player] = await db
      .update(players)
      .set({ ...updates, updatedAt: new Date() } as any)
      .where(eq(players.id, id))
      .returning();
    return player;
  }

  // Guild operations
  async getGuild(id: number): Promise<Guild | undefined> {
    const [guild] = await db.select().from(guilds).where(eq(guilds.id, id));
    return guild || undefined;
  }

  async getGuildByName(name: string): Promise<Guild | undefined> {
    const [guild] = await db.select().from(guilds).where(eq(guilds.name, name));
    return guild || undefined;
  }

  async createGuild(insertGuild: InsertGuild): Promise<Guild> {
    const [guild] = await db
      .insert(guilds)
      .values(insertGuild)
      .returning();
    return guild;
  }

  async getPlayerGuilds(playerId: number): Promise<Guild[]> {
    const result = await db
      .select()
      .from(guilds)
      .innerJoin(players, eq(players.guildId, guilds.id))
      .where(eq(players.id, playerId));
    return result.map(r => r.guilds);
  }

  // Quest operations
  async getActiveQuests(): Promise<Quest[]> {
    return await db.select().from(quests).where(eq(quests.isActive, true));
  }

  async getPlayerQuests(playerId: number): Promise<any[]> {
    const result = await db
      .select()
      .from(playerQuests)
      .innerJoin(quests, eq(playerQuests.questId, quests.id))
      .where(eq(playerQuests.playerId, playerId));
    return result;
  }

  async completeQuest(playerId: number, questId: number): Promise<void> {
    await db
      .update(playerQuests)
      .set({ completed: true, completedAt: new Date() })
      .where(and(
        eq(playerQuests.playerId, playerId),
        eq(playerQuests.questId, questId)
      ));
  }

  // Item operations
  async getItems(): Promise<Item[]> {
    return await db.select().from(items);
  }

  async getItem(id: number): Promise<Item | undefined> {
    const [item] = await db.select().from(items).where(eq(items.id, id));
    return item || undefined;
  }

  async createItem(insertItem: InsertItem): Promise<Item> {
    const [item] = await db
      .insert(items)
      .values(insertItem)
      .returning();
    return item;
  }

  // Transaction tracking
  async createTokenTransaction(insertTransaction: InsertTokenTransaction): Promise<TokenTransaction> {
    const [transaction] = await db
      .insert(tokenTransactions)
      .values(insertTransaction)
      .returning();
    return transaction;
  }

  async getTokenTransactions(walletAddress: string): Promise<TokenTransaction[]> {
    return await db
      .select()
      .from(tokenTransactions)
      .where(eq(tokenTransactions.walletAddress, walletAddress))
      .orderBy(desc(tokenTransactions.createdAt));
  }

  async updateTransactionStatus(txHash: string, status: string, blockNumber?: number): Promise<void> {
    await db
      .update(tokenTransactions)
      .set({ status, blockNumber })
      .where(eq(tokenTransactions.txHash, txHash));
  }

  // Staking operations
  async createStakingPosition(insertPosition: InsertStakingPosition): Promise<StakingPosition> {
    const [position] = await db
      .insert(stakingPositions)
      .values(insertPosition)
      .returning();
    return position;
  }

  async getStakingPositions(walletAddress: string): Promise<StakingPosition[]> {
    return await db
      .select()
      .from(stakingPositions)
      .where(and(
        eq(stakingPositions.walletAddress, walletAddress),
        eq(stakingPositions.isActive, true)
      ));
  }

  async updateStakingPosition(id: number, updates: Partial<InsertStakingPosition>): Promise<StakingPosition> {
    const [position] = await db
      .update(stakingPositions)
      .set(updates)
      .where(eq(stakingPositions.id, id))
      .returning();
    return position;
  }

  // Farming operations
  async createFarmingPosition(insertPosition: InsertFarmingPosition): Promise<FarmingPosition> {
    const [position] = await db
      .insert(farmingPositions)
      .values(insertPosition)
      .returning();
    return position;
  }

  async getFarmingPositions(walletAddress: string): Promise<FarmingPosition[]> {
    return await db
      .select()
      .from(farmingPositions)
      .where(and(
        eq(farmingPositions.walletAddress, walletAddress),
        eq(farmingPositions.isActive, true)
      ));
  }

  async updateFarmingPosition(id: number, updates: Partial<InsertFarmingPosition>): Promise<FarmingPosition> {
    const [position] = await db
      .update(farmingPositions)
      .set(updates)
      .where(eq(farmingPositions.id, id))
      .returning();
    return position;
  }

  // NFT operations
  async createNftCollection(insertNft: InsertNftCollection): Promise<NftCollection> {
    const [nft] = await db
      .insert(nftCollections)
      .values([insertNft] as any)
      .returning();
    return nft;
  }

  async getNftCollections(walletAddress: string): Promise<NftCollection[]> {
    return await db
      .select()
      .from(nftCollections)
      .where(eq(nftCollections.walletAddress, walletAddress))
      .orderBy(desc(nftCollections.mintedAt));
  }

  // DAO operations
  async createDaoProposal(insertProposal: InsertDaoProposal): Promise<DaoProposal> {
    const [proposal] = await db
      .insert(daoProposals)
      .values([insertProposal] as any)
      .returning();
    return proposal;
  }

  async getDaoProposals(): Promise<DaoProposal[]> {
    return await db
      .select()
      .from(daoProposals)
      .orderBy(desc(daoProposals.createdAt));
  }

  async createDaoVote(insertVote: InsertDaoVote): Promise<DaoVote> {
    const [vote] = await db
      .insert(daoVotes)
      .values(insertVote)
      .returning();
    return vote;
  }

  async getDaoVotes(proposalId: number): Promise<DaoVote[]> {
    return await db
      .select()
      .from(daoVotes)
      .where(eq(daoVotes.proposalId, proposalId))
      .orderBy(desc(daoVotes.votedAt));
  }
}

export const storage = new DatabaseStorage();
