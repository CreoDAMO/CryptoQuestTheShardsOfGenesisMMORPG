import { useState, useEffect } from 'react';
import { 
  Avatar,
  Name,
  Badge,
  Identity,
  EthBalance,
  Address
} from '@coinbase/onchainkit/identity';
import {
  Transaction,
  TransactionButton,
  TransactionSponsor,
  TransactionStatus,
  TransactionStatusAction,
  TransactionStatusLabel,
} from '@coinbase/onchainkit/transaction';
import { Wallet, ConnectWallet } from '@coinbase/onchainkit/wallet';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge as UIBadge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

// CQT Token Contract on BASE Network
const CQT_CONTRACT_ADDRESS = '0x9d1075b41cd80ab08179f36bc17a7ff8708748ba';
const BASE_CHAIN_ID = 8453;

// ERC20 ABI for CQT token interactions
const ERC20_ABI = [
  {
    "inputs": [{"name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "to", "type": "address"},
      {"name": "amount", "type": "uint256"}
    ],
    "name": "transfer",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "spender", "type": "address"},
      {"name": "amount", "type": "uint256"}
    ],
    "name": "approve",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

interface GamePayment {
  type: 'character_upgrade' | 'item_purchase' | 'guild_membership' | 'quest_unlock';
  amount: string;
  description: string;
  recipient: string;
}

export function CoinbaseIntegration() {
  const { address, isConnected } = useAccount();
  const { toast } = useToast();
  const [paymentAmount, setPaymentAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<GamePayment | null>(null);

  // Read CQT token balance
  const { data: cqtBalance, refetch: refetchBalance } = useReadContract({
    address: CQT_CONTRACT_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: BASE_CHAIN_ID,
  });

  // Gaming payment options
  const gamePayments: GamePayment[] = [
    {
      type: 'character_upgrade',
      amount: '100',
      description: 'Character Level Boost Package',
      recipient: '0x1234567890123456789012345678901234567890'
    },
    {
      type: 'item_purchase',
      amount: '50',
      description: 'Legendary Weapon - Shard of Genesis',
      recipient: '0x1234567890123456789012345678901234567890'
    },
    {
      type: 'guild_membership',
      amount: '200',
      description: 'Premium Guild Membership (1 Year)',
      recipient: '0x1234567890123456789012345678901234567890'
    },
    {
      type: 'quest_unlock',
      amount: '75',
      description: 'Elite Quest Line Access',
      recipient: '0x1234567890123456789012345678901234567890'
    }
  ];

  const formatCQTBalance = (balance: bigint | undefined) => {
    if (!balance) return '0';
    return formatEther(balance);
  };

  const handleGamePayment = (payment: GamePayment) => {
    setSelectedPayment(payment);
    setPaymentAmount(payment.amount);
    setRecipient(payment.recipient);
  };

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case 'character_upgrade': return '⚡';
      case 'item_purchase': return '⚔️';
      case 'guild_membership': return '🏰';
      case 'quest_unlock': return '🗺️';
      default: return '💎';
    }
  };

  return (
    <div className="space-y-6">
      {/* Coinbase Wallet Connection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">C</span>
            </div>
            Coinbase Integration - BASE Network
          </CardTitle>
          <CardDescription>
            Connect your wallet to use CQT tokens for gaming payments on BASE network
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!isConnected ? (
              <ConnectWallet>
                <Avatar className="h-6 w-6" />
                <Name />
              </ConnectWallet>
            ) : (
              <div className="space-y-4">
                {/* User Identity */}
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg">
                  <Identity
                    address={address}
                    schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
                  >
                    <Avatar className="w-12 h-12" />
                    <div className="flex flex-col">
                      <Name />
                      <Address />
                    </div>
                    <Badge />
                  </Identity>
                </div>

                {/* Balances */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400">ETH Balance</div>
                    <EthBalance address={address} />
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400">CQT Balance</div>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {formatCQTBalance(cqtBalance)} CQT
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Gaming Payments */}
      {isConnected && (
        <Card>
          <CardHeader>
            <CardTitle>Gaming Payments with CQT</CardTitle>
            <CardDescription>
              Use your CQT tokens for in-game purchases and upgrades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="quick-pay" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="quick-pay">Quick Payments</TabsTrigger>
                <TabsTrigger value="custom-pay">Custom Payment</TabsTrigger>
              </TabsList>

              <TabsContent value="quick-pay" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {gamePayments.map((payment, index) => (
                    <Card 
                      key={index} 
                      className={`cursor-pointer transition-all hover:scale-105 ${
                        selectedPayment?.type === payment.type 
                          ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950' 
                          : ''
                      }`}
                      onClick={() => handleGamePayment(payment)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{getPaymentIcon(payment.type)}</div>
                          <div className="flex-1">
                            <div className="font-semibold">{payment.description}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {payment.amount} CQT
                            </div>
                          </div>
                          <UIBadge variant="secondary">
                            {payment.amount} CQT
                          </UIBadge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {selectedPayment && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="font-semibold">Selected: {selectedPayment.description}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Amount: {selectedPayment.amount} CQT
                        </div>
                      </div>
                    </div>

                    <Transaction
                      contracts={[
                        {
                          address: CQT_CONTRACT_ADDRESS,
                          abi: ERC20_ABI,
                          functionName: 'transfer',
                          args: [selectedPayment.recipient, parseEther(selectedPayment.amount)],
                        },
                      ]}
                      onSuccess={(response) => {
                        toast({
                          title: "Payment Successful!",
                          description: `${selectedPayment.description} purchased with CQT`,
                        });
                        refetchBalance();
                      }}
                      onError={(error) => {
                        toast({
                          title: "Payment Failed",
                          description: error.message,
                          variant: "destructive",
                        });
                      }}
                    >
                      <TransactionButton className="w-full" />
                      <TransactionSponsor />
                      <TransactionStatus>
                        <TransactionStatusLabel />
                        <TransactionStatusAction />
                      </TransactionStatus>
                    </Transaction>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="custom-pay" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Recipient Address</label>
                    <Input
                      placeholder="0x..."
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Amount (CQT)</label>
                    <Input
                      type="number"
                      placeholder="0.0"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                    />
                  </div>

                  {paymentAmount && recipient && (
                    <Transaction
                      contracts={[
                        {
                          address: CQT_CONTRACT_ADDRESS,
                          abi: ERC20_ABI,
                          functionName: 'transfer',
                          args: [recipient as `0x${string}`, parseEther(paymentAmount)],
                        },
                      ]}
                      onSuccess={(response) => {
                        toast({
                          title: "Transfer Successful!",
                          description: `${paymentAmount} CQT sent to ${recipient}`,
                        });
                        refetchBalance();
                        setPaymentAmount('');
                        setRecipient('');
                      }}
                      onError={(error) => {
                        toast({
                          title: "Transfer Failed",
                          description: error.message,
                          variant: "destructive",
                        });
                      }}
                    >
                      <TransactionButton className="w-full" />
                      <TransactionSponsor />
                      <TransactionStatus>
                        <TransactionStatusLabel />
                        <TransactionStatusAction />
                      </TransactionStatus>
                    </Transaction>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* BASE Network Info */}
      <Card>
        <CardHeader>
          <CardTitle>BASE Network Integration</CardTitle>
          <CardDescription>
            Leveraging Coinbase's L2 solution for fast, low-cost gaming transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">Network</div>
              <div className="font-semibold">BASE Mainnet</div>
              <div className="text-xs text-gray-500">Chain ID: 8453</div>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">CQT Contract</div>
              <div className="font-mono text-xs break-all">{CQT_CONTRACT_ADDRESS}</div>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">Features</div>
              <div className="text-sm">
                <div>✓ Gasless transactions</div>
                <div>✓ Smart wallet support</div>
                <div>✓ OnchainKit integration</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}