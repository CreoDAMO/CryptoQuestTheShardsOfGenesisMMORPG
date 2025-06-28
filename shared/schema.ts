import { pgTable, text, serial, integer, boolean, timestamp, decimal, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  walletAddress: text("wallet_address").unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  walletAddress: text("wallet_address").notNull().unique(),
  level: integer("level").default(1),
  experience: integer("experience").default(0),
  health: integer("health").default(100),
  mana: integer("mana").default(100),
  attackDamage: integer("attack_damage").default(10),
  defense: integer("defense").default(5),
  agility: integer("agility").default(5),
  luck: integer("luck").default(5),
  inventory: json("inventory").$type<number[]>().default([]),
  skills: json("skills").$type<number[]>().default([]),
  guildId: integer("guild_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const guilds = pgTable("guilds", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  leaderId: integer("leader_id").references(() => players.id),
  description: text("description"),
  memberCount: integer("member_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const quests = pgTable("quests", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  rewardXP: integer("reward_xp").default(100),
  rewardTokens: decimal("reward_tokens", { precision: 18, scale: 8 }).default("0"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const playerQuests = pgTable("player_quests", {
  id: serial("id").primaryKey(),
  playerId: integer("player_id").references(() => players.id),
  questId: integer("quest_id").references(() => quests.id),
  completed: boolean("completed").default(false),
  completedAt: timestamp("completed_at"),
});

export const items = pgTable("items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // weapon, armor, consumable, etc.
  attackBonus: integer("attack_bonus").default(0),
  defenseBonus: integer("defense_bonus").default(0),
  manaBonus: integer("mana_bonus").default(0),
  healthBonus: integer("health_bonus").default(0),
  rarity: text("rarity").default("common"), // common, rare, epic, legendary
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tokenTransactions = pgTable("token_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  walletAddress: text("wallet_address").notNull(),
  transactionType: text("transaction_type").notNull(), // purchase, stake, swap, farming
  amount: decimal("amount", { precision: 18, scale: 8 }).notNull(),
  tokenAddress: text("token_address").notNull(),
  txHash: text("tx_hash").notNull().unique(),
  blockNumber: integer("block_number"),
  status: text("status").default("pending"), // pending, confirmed, failed
  createdAt: timestamp("created_at").defaultNow(),
});

export const stakingPositions = pgTable("staking_positions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  walletAddress: text("wallet_address").notNull(),
  stakedAmount: decimal("staked_amount", { precision: 18, scale: 8 }).notNull(),
  rewardsEarned: decimal("rewards_earned", { precision: 18, scale: 8 }).default("0"),
  poolId: integer("pool_id").default(0),
  startTime: timestamp("start_time").defaultNow(),
  lastClaimTime: timestamp("last_claim_time"),
  isActive: boolean("is_active").default(true),
});

export const farmingPositions = pgTable("farming_positions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  walletAddress: text("wallet_address").notNull(),
  poolId: integer("pool_id").notNull(),
  lpTokenAmount: decimal("lp_token_amount", { precision: 18, scale: 8 }).notNull(),
  rewardsEarned: decimal("rewards_earned", { precision: 18, scale: 8 }).default("0"),
  depositTime: timestamp("deposit_time").defaultNow(),
  lastHarvestTime: timestamp("last_harvest_time"),
  isActive: boolean("is_active").default(true),
});

export const nftCollections = pgTable("nft_collections", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  walletAddress: text("wallet_address").notNull(),
  tokenId: text("token_id").notNull(),
  nftType: text("nft_type").notNull(), // character, item, guild, land
  metadata: json("metadata").$type<{
    name?: string;
    description?: string;
    image?: string;
    attributes?: Array<{trait_type: string; value: string | number}>;
  }>(),
  tokenUri: text("token_uri"),
  contractAddress: text("contract_address").notNull(),
  mintedAt: timestamp("minted_at").defaultNow(),
});

export const daoProposals = pgTable("dao_proposals", {
  id: serial("id").primaryKey(),
  proposalId: integer("proposal_id").notNull().unique(),
  proposer: text("proposer").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  targets: json("targets").$type<string[]>(),
  values: json("values").$type<string[]>(),
  calldatas: json("calldatas").$type<string[]>(),
  voteStart: timestamp("vote_start"),
  voteEnd: timestamp("vote_end"),
  forVotes: decimal("for_votes", { precision: 18, scale: 8 }).default("0"),
  againstVotes: decimal("against_votes", { precision: 18, scale: 8 }).default("0"),
  status: text("status").default("pending"), // pending, active, defeated, succeeded, executed
  createdAt: timestamp("created_at").defaultNow(),
});

export const daoVotes = pgTable("dao_votes", {
  id: serial("id").primaryKey(),
  proposalId: integer("proposal_id").references(() => daoProposals.proposalId),
  voter: text("voter").notNull(),
  support: boolean("support").notNull(),
  weight: decimal("weight", { precision: 18, scale: 8 }).notNull(),
  reason: text("reason"),
  votedAt: timestamp("voted_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  player: one(players),
  tokenTransactions: many(tokenTransactions),
  stakingPositions: many(stakingPositions),
  farmingPositions: many(farmingPositions),
  nftCollections: many(nftCollections),
}));

export const playersRelations = relations(players, ({ one, many }) => ({
  user: one(users, {
    fields: [players.userId],
    references: [users.id],
  }),
  guild: one(guilds, {
    fields: [players.guildId],
    references: [guilds.id],
  }),
  playerQuests: many(playerQuests),
}));

export const guildsRelations = relations(guilds, ({ one, many }) => ({
  leader: one(players, {
    fields: [guilds.leaderId],
    references: [players.id],
  }),
  members: many(players),
}));

export const questsRelations = relations(quests, ({ many }) => ({
  playerQuests: many(playerQuests),
}));

export const playerQuestsRelations = relations(playerQuests, ({ one }) => ({
  player: one(players, {
    fields: [playerQuests.playerId],
    references: [players.id],
  }),
  quest: one(quests, {
    fields: [playerQuests.questId],
    references: [quests.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  walletAddress: true,
});

export const insertPlayerSchema = createInsertSchema(players).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGuildSchema = createInsertSchema(guilds).omit({
  id: true,
  createdAt: true,
  memberCount: true,
});

export const insertQuestSchema = createInsertSchema(quests).omit({
  id: true,
  createdAt: true,
});

export const insertItemSchema = createInsertSchema(items).omit({
  id: true,
  createdAt: true,
});

export const insertTokenTransactionSchema = createInsertSchema(tokenTransactions).omit({
  id: true,
  createdAt: true,
});

export const insertStakingPositionSchema = createInsertSchema(stakingPositions).omit({
  id: true,
  startTime: true,
});

export const insertFarmingPositionSchema = createInsertSchema(farmingPositions).omit({
  id: true,
  depositTime: true,
});

export const insertNftCollectionSchema = createInsertSchema(nftCollections).omit({
  id: true,
  mintedAt: true,
});

export const insertDaoProposalSchema = createInsertSchema(daoProposals).omit({
  id: true,
  createdAt: true,
});

export const insertDaoVoteSchema = createInsertSchema(daoVotes).omit({
  id: true,
  votedAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Player = typeof players.$inferSelect;
export type Guild = typeof guilds.$inferSelect;
export type Quest = typeof quests.$inferSelect;
export type Item = typeof items.$inferSelect;
export type TokenTransaction = typeof tokenTransactions.$inferSelect;
export type StakingPosition = typeof stakingPositions.$inferSelect;
export type FarmingPosition = typeof farmingPositions.$inferSelect;
export type NftCollection = typeof nftCollections.$inferSelect;
export type DaoProposal = typeof daoProposals.$inferSelect;
export type DaoVote = typeof daoVotes.$inferSelect;

export type InsertPlayer = z.infer<typeof insertPlayerSchema>;
export type InsertGuild = z.infer<typeof insertGuildSchema>;
export type InsertQuest = z.infer<typeof insertQuestSchema>;
export type InsertItem = z.infer<typeof insertItemSchema>;
export type InsertTokenTransaction = z.infer<typeof insertTokenTransactionSchema>;
export type InsertStakingPosition = z.infer<typeof insertStakingPositionSchema>;
export type InsertFarmingPosition = z.infer<typeof insertFarmingPositionSchema>;
export type InsertNftCollection = z.infer<typeof insertNftCollectionSchema>;
export type InsertDaoProposal = z.infer<typeof insertDaoProposalSchema>;
export type InsertDaoVote = z.infer<typeof insertDaoVoteSchema>;
