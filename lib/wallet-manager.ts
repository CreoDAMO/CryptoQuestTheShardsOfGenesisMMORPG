import { ethers } from 'ethers';

export interface WalletConfig {
  address: string;
  name: string;
  type: 'creator' | 'owner' | 'multisig';
  chainId?: number;
}

export class WalletManager {
  private wallets: Map<string, WalletConfig> = new Map();

  constructor() {
    this.initializeWallets();
  }

  private initializeWallets() {
    // Creator Wallet (Original)
    this.wallets.set('creator', {
      address: '0x1234567890123456789012345678901234567890', // Replace with actual creator address
      name: 'Creator Wallet',
      type: 'creator'
    });

    // Current Owner Wallet (holds CQT)
    this.wallets.set('owner', {
      address: '0x9876543210987654321098765432109876543210', // Replace with actual owner address  
      name: 'Current Owner',
      type: 'owner'
    });

    // Safe Multisig
    this.wallets.set('multisig', {
      address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd', // Replace with actual Safe address
      name: 'Safe Multisig',
      type: 'multisig'
    });
  }

  getWallet(key: string): WalletConfig | undefined {
    return this.wallets.get(key);
  }

  getAllWallets(): WalletConfig[] {
    return Array.from(this.wallets.values());
  }

  getCreatorWallet(): WalletConfig | undefined {
    return this.wallets.get('creator');
  }

  getOwnerWallet(): WalletConfig | undefined {
    return this.wallets.get('owner');
  }

  getMultisigWallet(): WalletConfig | undefined {
    return this.wallets.get('multisig');
  }
}

export const walletManager = new WalletManager();