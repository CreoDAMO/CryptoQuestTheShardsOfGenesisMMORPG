# 🔌 CryptoQuest API Documentation

## Base URL
```
Production: https://cryptoquestmmorpg.nftgaming/api
Development: http://localhost:5000/api
```

## Authentication
Most endpoints require MetaMask wallet connection. Include wallet address in headers:
```http
Authorization: Bearer <wallet-address>
X-Wallet-Address: <wallet-address>
```

## Core Gaming API

### Player Management

#### Get Player Profile
```http
GET /api/players/:walletAddress
```

**Response:**
```json
{
  "id": 1,
  "walletAddress": "0x123...abc",
  "level": 25,
  "experience": 15000,
  "health": 100,
  "mana": 80,
  "attackDamage": 45,
  "defense": 30,
  "agility": 35,
  "luck": 20,
  "inventory": [1, 2, 3],
  "skills": [1, 5, 8],
  "createdAt": "2024-01-01T00:00:00Z"
}
```

#### Create Player
```http
POST /api/players
Content-Type: application/json

{
  "walletAddress": "0x123...abc",
  "level": 1,
  "experience": 0,
  "health": 100,
  "mana": 50
}
```

#### Update Player Stats
```http
PATCH /api/players/:id
Content-Type: application/json

{
  "level": 26,
  "experience": 16000,
  "health": 100
}
```

### Guild System

#### Get Guild Information
```http
GET /api/guilds/:id
```

#### Create Guild
```http
POST /api/guilds
Content-Type: application/json

{
  "name": "Dragon Slayers",
  "description": "Elite guild for experienced players",
  "leaderId": 1,
  "maxMembers": 50
}
```

#### Join Guild
```http
POST /api/guilds/:id/join
Content-Type: application/json

{
  "playerId": 2
}
```

### Quest System

#### Get Active Quests
```http
GET /api/quests/active
```

#### Complete Quest
```http
POST /api/quests/:questId/complete
Content-Type: application/json

{
  "playerId": 1,
  "evidence": "completion_hash"
}
```

## Blockchain Intelligence API

### Portfolio Analysis

#### Comprehensive Portfolio Analysis
```http
GET /api/moralis/portfolio/:address?chain=polygon
```

**Response:**
```json
{
  "address": "0x123...abc",
  "totalTokens": 5,
  "totalNFTs": 12,
  "totalValue": "1250.50",
  "tokens": [
    {
      "symbol": "CQT",
      "balance": "1000.0",
      "usdValue": "500.0",
      "contractAddress": "0x9d1075b41cd80ab08179f36bc17a7ff8708748ba"
    }
  ],
  "nfts": [
    {
      "tokenId": "1",
      "name": "Genesis Warrior",
      "collection": "CryptoQuest Heroes"
    }
  ],
  "securityScore": 92,
  "riskFactors": ["Low liquidity warning"],
  "recommendations": ["Diversify token holdings"]
}
```

#### Token Analytics
```http
GET /api/moralis/token-analytics/:address?chain=polygon
```

**Response:**
```json
{
  "token": {
    "symbol": "CQT",
    "name": "CryptoQuest Token",
    "price": "0.50",
    "marketCap": "50000000",
    "holders": 12500
  },
  "recentActivity": [
    {
      "type": "transfer",
      "amount": "100.0",
      "timestamp": "2024-01-01T12:00:00Z"
    }
  ],
  "trustScore": 92,
  "liquidityScore": 85,
  "securityChecks": {
    "honeypot": false,
    "verified": true,
    "audit": true
  }
}
```

## AI-Powered Analytics

### Smart Contract Analysis

#### Security Audit
```http
POST /api/ai/contract-analysis
Content-Type: application/json

{
  "contractCode": "pragma solidity ^0.8.0;...",
  "contractAddress": "0x123...abc"
}
```

**Response:**
```json
{
  "securityScore": 94,
  "gasEfficiency": 87,
  "performance": 91,
  "codeQuality": 92,
  "vulnerabilities": [],
  "recommendations": [
    "Consider adding reentrancy protection",
    "Optimize gas usage in mint function"
  ],
  "riskLevel": "Low",
  "auditSummary": "Contract demonstrates excellent security practices..."
}
```

### Market Intelligence

#### Market Insights
```http
POST /api/ai/market-insights
Content-Type: application/json

{
  "tokenData": {
    "symbol": "CQT",
    "price": "0.50",
    "volume": "1000000"
  },
  "priceHistory": [
    {"date": "2024-01-01", "price": "0.45"},
    {"date": "2024-01-02", "price": "0.50"}
  ]
}
```

**Response:**
```json
{
  "sentiment": "Bullish",
  "priceTarget": "$0.75 within 30 days",
  "riskLevel": "Moderate",
  "recommendation": "Hold with potential for growth",
  "keyFactors": [
    "Strong community engagement",
    "Increasing trading volume",
    "Upcoming platform features"
  ],
  "confidenceScore": 78
}
```

## Enhanced Scanner API

### Comprehensive Token Analysis
```http
GET /api/enhanced-scanner/:tokenAddress?chain=polygon
Headers: wallet-address: 0x123...abc
```

**Response:**
```json
{
  "tokenAnalytics": {
    "token": {...},
    "trustScore": 92,
    "recentActivity": [...]
  },
  "marketInsights": {
    "sentiment": "Bullish",
    "priceTarget": "$0.75",
    "recommendation": "Hold"
  },
  "userPortfolio": {
    "totalValue": "1250.50",
    "tokens": [...],
    "nfts": [...]
  },
  "enhancedTrustScore": 98,
  "timestamp": "2024-01-01T12:00:00Z"
}
```

## Gaming Intelligence API

### Player Optimization
```http
GET /api/gaming-intelligence/:playerAddress?chain=polygon
```

**Response:**
```json
{
  "player": {
    "level": 25,
    "experience": 15000,
    "walletAddress": "0x123...abc"
  },
  "portfolio": {
    "totalTokens": 5,
    "totalNFTs": 12,
    "securityScore": 92
  },
  "strategy": {
    "expectedROI": 85,
    "recommendations": [
      "Focus on rare item collection",
      "Participate in guild tournaments"
    ],
    "optimizations": [
      "Upgrade weapon to legendary tier",
      "Invest in defense skills"
    ]
  },
  "performance": {
    "totalTokens": 5,
    "totalNFTs": 12,
    "securityScore": 92,
    "optimizationScore": 85
  }
}
```

## Transaction Tracking

### Token Transactions
```http
GET /api/transactions/:walletAddress
POST /api/transactions
PATCH /api/transactions/:txHash
```

### Staking Operations
```http
GET /api/staking/:walletAddress
POST /api/staking
PATCH /api/staking/:id
```

### Farming Positions
```http
GET /api/farming/:walletAddress
POST /api/farming
PATCH /api/farming/:id
```

## NFT Operations

### NFT Collections
```http
GET /api/nfts/:walletAddress
POST /api/nfts
```

**Create NFT Response:**
```json
{
  "id": 1,
  "walletAddress": "0x123...abc",
  "tokenId": "1",
  "contractAddress": "0x545ace061a1b64b14641b50cfe317017b01a667b",
  "metadata": {
    "name": "Genesis Warrior",
    "description": "Legendary character NFT",
    "image": "ipfs://...",
    "attributes": [
      {"trait_type": "Rarity", "value": "Legendary"},
      {"trait_type": "Power", "value": 95}
    ]
  }
}
```

## DAO Governance

### Proposals
```http
GET /api/dao/proposals
POST /api/dao/proposals
```

### Voting
```http
GET /api/dao/votes/:proposalId
POST /api/dao/votes
```

## System Health

### Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00Z",
  "services": {
    "database": "connected",
    "storage": "operational",
    "moralis": "configured",
    "deepseek": "configured"
  }
}
```

## Error Handling

### Standard Error Response
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "timestamp": "2024-01-01T12:00:00Z",
  "details": {
    "field": "Validation error details"
  }
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (wallet not connected)
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

### Limits
- Standard endpoints: 100 requests/minute
- AI analysis: 10 requests/minute
- Blockchain queries: 50 requests/minute

### Headers
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## WebSocket Events

### Real-Time Gaming
```javascript
// Connect to WebSocket
const ws = new WebSocket('wss://cryptoquestmmorpg.nftgaming/ws');

// Listen for events
ws.on('player-update', (data) => {
  console.log('Player stats updated:', data);
});

ws.on('quest-completed', (data) => {
  console.log('Quest completed:', data);
});

ws.on('guild-activity', (data) => {
  console.log('Guild activity:', data);
});
```

## SDK Integration

### JavaScript SDK
```javascript
import { CryptoQuestAPI } from '@cryptoquest/sdk';

const api = new CryptoQuestAPI({
  baseURL: 'https://cryptoquestmmorpg.nftgaming/api',
  walletAddress: '0x123...abc'
});

// Get player data
const player = await api.players.get('0x123...abc');

// Analyze portfolio
const portfolio = await api.moralis.analyzePortfolio('0x123...abc');

// AI market insights
const insights = await api.ai.getMarketInsights(tokenData);
```

---

**API Version**: v1.0  
**Last Updated**: June 28, 2025  
**Support**: api-support@cryptoquestmmorpg.nftgaming