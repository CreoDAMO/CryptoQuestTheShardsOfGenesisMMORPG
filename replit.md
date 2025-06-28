# CryptoQuest: The Shards of Genesis - Blockchain MMORPG

## Overview

CryptoQuest is a full-stack blockchain MMORPG built on the Polygon network. The application combines traditional MMORPG elements with Web3 functionality, featuring character progression, guild systems, DAO governance, NFT collection, and token economics. The system is designed as a modern React frontend communicating with Ethereum smart contracts through Web3 integration.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack React Query for server state
- **Web3 Integration**: ethers.js for blockchain interactions
- **Build Tool**: Vite with custom configuration for development and production

### Backend Architecture
- **Server**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: PostgreSQL-backed sessions using connect-pg-simple
- **API Design**: RESTful API structure with /api prefix routing

### Blockchain Integration
- **Network**: Polygon (Chain ID: 0x89)
- **Database Provider**: Neon Database for PostgreSQL hosting
- **Smart Contracts**: Six main contracts covering MMORPG mechanics, token sales, governance, and NFTs

## Key Components

### Smart Contract Integration
1. **MMORPG Contract**: Core game mechanics including character creation, quests, guilds, and item crafting
2. **Token Sale Contract**: Handles token purchases with vesting and whitelist functionality
3. **Token Contract**: ERC-20 implementation for the game's native token
4. **DAO Contract**: Governance system for community decision-making
5. **Timelock Controller**: Delayed execution system for governance proposals
6. **NFT Contract**: ERC-721 implementation for in-game collectibles

### Database Schema
- **Users Table**: Basic user authentication and identification
- **Drizzle Integration**: Type-safe database operations with automatic migrations
- **PostgreSQL**: Primary data store with connection pooling and session management

### UI Components
- **Shadcn/ui**: Comprehensive component library with dark mode support
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Form Handling**: React Hook Form with Zod validation
- **Toast Notifications**: User feedback system for blockchain transactions

## Data Flow

### Web3 Interaction Flow
1. User connects wallet (MetaMask or compatible)
2. Frontend validates network (Polygon mainnet)
3. Smart contract calls through ethers.js providers
4. Transaction status tracked through toast notifications
5. UI updates reflect blockchain state changes

### Database Operations
1. User authentication through PostgreSQL sessions
2. Drizzle ORM handles type-safe database queries
3. Memory storage fallback for development environments
4. Connection pooling for production scalability

### API Structure
- All API routes prefixed with `/api`
- Express middleware for request logging and error handling
- Session-based authentication with PostgreSQL storage
- JSON response format with comprehensive error handling

## External Dependencies

### Blockchain Dependencies
- **ethers.js**: Ethereum library for smart contract interactions
- **@neondatabase/serverless**: PostgreSQL database hosting
- **Polygon Network**: Layer 2 scaling solution for Ethereum

### Development Dependencies
- **Vite**: Fast build tool with hot module replacement
- **TypeScript**: Type safety across frontend and backend
- **Drizzle Kit**: Database migration and schema management
- **ESBuild**: Production bundling for server code

### UI Dependencies
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon system
- **TanStack React Query**: Data fetching and caching

## Deployment Strategy

### Development Environment
- Vite dev server for frontend with hot reload
- tsx for TypeScript execution in development
- Replit-specific plugins for cloud development
- Environment variables for contract addresses and database URLs

### Production Build
- Frontend: Vite build to static assets in `dist/public`
- Backend: ESBuild bundle to `dist/index.js`
- Database: Drizzle migrations applied via `db:push` command
- Deployment: Node.js server serving both API and static assets

### Environment Configuration
- Database URL required for PostgreSQL connection
- Contract addresses configurable via environment variables
- Fallback addresses provided for development convenience
- Production builds exclude development-only plugins

## Changelog
- June 28, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.