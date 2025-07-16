import { Request, Response } from 'express';
import { walletManager } from '../../lib/wallet-manager.js';

export const walletRoutes = {
  // Get wallet provider information
  async getWalletProviders(req: Request, res: Response) {
    try {
      const providers = walletManager.getAllWalletProviders();
      res.json({ success: true, providers });
    } catch (error) {
      console.error('Failed to get wallet providers:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch wallet providers' });
    }
  },

  // Get integration status
  async getIntegrationStatus(req: Request, res: Response) {
    try {
      const status = walletManager.getIntegrationStatus();
      res.json({ success: true, status });
    } catch (error) {
      console.error('Failed to get integration status:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch integration status' });
    }
  },

  // Create user wallet
  async createUserWallet(req: Request, res: Response) {
    try {
      const { provider, userId } = req.body;
      
      if (!provider || !userId) {
        return res.status(400).json({ 
          success: false, 
          error: 'Provider and userId are required' 
        });
      }

      const wallet = await walletManager.createUserWallet(provider, userId);
      res.json({ success: true, wallet });
    } catch (error) {
      console.error('Failed to create user wallet:', error);
      res.status(500).json({ success: false, error: 'Failed to create wallet' });
    }
  },

  // Get user wallet
  async getUserWallet(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({ 
          success: false, 
          error: 'User ID is required' 
        });
      }

      const wallet = walletManager.getUserWallet(userId);
      if (!wallet) {
        return res.status(404).json({ 
          success: false, 
          error: 'Wallet not found' 
        });
      }

      res.json({ success: true, wallet });
    } catch (error) {
      console.error('Failed to get user wallet:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch wallet' });
    }
  },

  // Get admin wallets (restricted access)
  async getAdminWallets(req: Request, res: Response) {
    try {
      // Check if user has admin access
      const userAddress = req.headers['x-wallet-address'] as string;
      
      if (!userAddress || !walletManager.isAdminWallet(userAddress)) {
        return res.status(403).json({ 
          success: false, 
          error: 'Admin access required' 
        });
      }

      const adminWallets = walletManager.getAdminWallets();
      res.json({ success: true, adminWallets });
    } catch (error) {
      console.error('Failed to get admin wallets:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch admin wallets' });
    }
  },

  // Get treasury metrics (restricted access)
  async getTreasuryMetrics(req: Request, res: Response) {
    try {
      const userAddress = req.headers['x-wallet-address'] as string;
      
      if (!userAddress || !walletManager.isAdminWallet(userAddress)) {
        return res.status(403).json({ 
          success: false, 
          error: 'Admin access required' 
        });
      }

      // Mock treasury metrics - in production, this would fetch real data
      const metrics = {
        safeMultisig: {
          totalValue: '$2.45M',
          cqtBalance: '15.7M CQT',
          usdcBalance: '350K USDC',
          activeSigners: 4,
          pendingTransactions: 2,
          networks: ['polygon', 'base']
        },
        totalSig: {
          totalValue: '$1.82M',
          bitcoinBalance: '12.5 BTC',
          ethereumBalance: '245 ETH',
          activeChains: 6,
          miningRewards24h: '$8,450',
          networks: ['bitcoin', 'ethereum', 'tron', 'bnb', 'solana', 'dogecoin']
        },
        operations: {
          lpCreated24h: '$125K',
          bridgedAssets24h: '$67K',
          userWalletsCreated: 1247,
          gasSponsored: '$2,340'
        }
      };

      res.json({ success: true, metrics });
    } catch (error) {
      console.error('Failed to get treasury metrics:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch treasury metrics' });
    }
  },

  // Get operational flow
  async getOperationalFlow(req: Request, res: Response) {
    try {
      const flow = await walletManager.getOperationalFlow();
      res.json({ success: true, flow });
    } catch (error) {
      console.error('Failed to get operational flow:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch operational flow' });
    }
  },

  // Create Safe multisig (founder only)
  async createSafeMultisig(req: Request, res: Response) {
    try {
      const userAddress = req.headers['x-wallet-address'] as string;
      
      if (!userAddress || !walletManager.isFounderWallet(userAddress)) {
        return res.status(403).json({ 
          success: false, 
          error: 'Founder access required' 
        });
      }

      const { networkId } = req.body;
      if (!networkId) {
        return res.status(400).json({ 
          success: false, 
          error: 'Network ID is required' 
        });
      }

      const safeAddress = await walletManager.createSafeMultisig(networkId);
      res.json({ success: true, safeAddress });
    } catch (error) {
      console.error('Failed to create Safe multisig:', error);
      res.status(500).json({ success: false, error: 'Failed to create Safe multisig' });
    }
  },

  // Get TotalSig wallets (admin only)
  async getTotalSigWallets(req: Request, res: Response) {
    try {
      const userAddress = req.headers['x-wallet-address'] as string;
      
      if (!userAddress || !walletManager.isAdminWallet(userAddress)) {
        return res.status(403).json({ 
          success: false, 
          error: 'Admin access required' 
        });
      }

      const wallets = await walletManager.getTotalSigWallets();
      res.json({ success: true, wallets });
    } catch (error) {
      console.error('Failed to get TotalSig wallets:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch TotalSig wallets' });
    }
  }
};