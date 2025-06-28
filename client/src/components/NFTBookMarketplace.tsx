import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BookOpen, ShoppingCart, Coins, TrendingUp, Star, 
  FileText, Download, Eye, Zap, Wallet, ExternalLink
} from "lucide-react";

// Smart Contract Addresses from verified contracts
const CONTRACTS = {
  NFT_BOOK: "0x545ace061a1b64b14641b50cfe317017b01a667b", // CryptoQuestTheShardsOfGenesisNFTBook
  BOOK_SALES: "0xe1df30dbeaf0e895bc5b7efd8b7b9ed91097c8d7", // CryptoQuestTheShardsOfGenesisBookNFTSalesContract
  CQT_TOKEN: "0x94ef57abfBff1AD70bD00a921e1d2437f31C1665", // CQT Token
  LIQUIDITY_POOLS: {
    MATIC_CQT: "0x0b3CD8a843DEFDF01564a0342a89ba06c4fC9394",
    WETH_CQT: "0xb1E0B26f550203FAb31A0D9C1Eb4FFE330bfE4d0"
  }
};

// Payment tokens supported by the sales contract
const PAYMENT_TOKENS = [
  {
    symbol: "WETH",
    name: "Wrapped Ethereum",
    address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
    decimals: 18,
    icon: "💎"
  },
  {
    symbol: "MATIC",
    name: "Polygon Native Token",
    address: "0x0000000000000000000000000000000000001010", 
    decimals: 18,
    icon: "🔷"
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    decimals: 6,
    icon: "💵"
  },
  {
    symbol: "CQT",
    name: "CryptoQuest Token",
    address: "0x94ef57abfBff1AD70bD00a921e1d2437f31C1665",
    decimals: 18,
    icon: "⚔️"
  }
];

// Sample NFT Book data with tiers
const BOOK_TIERS = [
  {
    id: 0,
    name: "Genesis Chronicles - Digital Edition",
    description: "The foundational lore of CryptoQuest with exclusive digital content",
    price: "0.1",
    priceToken: "WETH",
    supply: 1000,
    sold: 234,
    rarity: "Common",
    chapter: "Genesis",
    character: "The Ancient Ones",
    location: "The First Realm",
    element: "Creation",
    formats: ["PDF", "EPUB"],
    benefits: ["Digital Access", "Character Insights", "Lore Expansion"],
    image: "/api/placeholder/300/400"
  },
  {
    id: 1,
    name: "Legendary Artifacts Compendium",
    description: "Rare collection of legendary items and their histories",
    price: "50",
    priceToken: "CQT",
    supply: 500,
    sold: 89,
    rarity: "Rare",
    chapter: "Artifacts",
    character: "Master Craftsmen",
    location: "The Forge Realms",
    element: "Creation",
    formats: ["PDF", "EPUB", "Interactive"],
    benefits: ["Digital Access", "3D Models", "Crafting Recipes", "Exclusive NFTs"],
    image: "/api/placeholder/300/400"
  },
  {
    id: 2,
    name: "Heroes of the Shards - Collector's Edition",
    description: "Limited edition featuring the greatest heroes and their legendary quests",
    price: "0.5",
    priceToken: "WETH",
    supply: 100,
    sold: 45,
    rarity: "Legendary",
    chapter: "Heroes",
    character: "The Champions",
    location: "All Realms",
    element: "Valor",
    formats: ["Premium PDF", "EPUB", "Audio", "AR Experience"],
    benefits: ["All Formats", "AR Integration", "Voice Acting", "Exclusive Character NFTs", "Beta Access"],
    image: "/api/placeholder/300/400"
  }
];

const LIQUIDITY_METRICS = {
  totalValueLocked: "$4.25M",
  maticCqtApr: "125.4%",
  wethCqtApr: "89.7%",
  totalVolume24h: "$892K",
  cqtPrice: "$0.0847",
  priceChange24h: "+12.3%"
};

interface NFTMetadata {
  chapter: string;
  character: string;
  location: string;
  element: string;
  rarity: string;
}

export function NFTBookMarketplace() {
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [selectedPaymentToken, setSelectedPaymentToken] = useState<string>("WETH");
  const [purchaseAmount, setPurchaseAmount] = useState<string>("1");
  const [walletConnected, setWalletConnected] = useState<boolean>(false);
  const [userBalance, setUserBalance] = useState<string>("0");

  useEffect(() => {
    // Check wallet connection and balances
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        setWalletConnected(accounts.length > 0);
        if (accounts.length > 0) {
          // Get balance for selected payment token
          await updateUserBalance(accounts[0]);
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    }
  };

  const updateUserBalance = async (address: string) => {
    try {
      const token = PAYMENT_TOKENS.find(t => t.symbol === selectedPaymentToken);
      if (token) {
        // Simulate balance fetch - in real implementation, use web3 provider
        setUserBalance("10.5");
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletConnected(true);
        await checkWalletConnection();
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    } else {
      alert('Please install MetaMask to connect your wallet');
    }
  };

  const purchaseNFT = async (tierId: number) => {
    if (!walletConnected) {
      await connectWallet();
      return;
    }

    const tier = BOOK_TIERS[tierId];
    const paymentToken = PAYMENT_TOKENS.find(t => t.symbol === selectedPaymentToken);
    
    try {
      // In real implementation, interact with smart contract
      console.log('Purchasing NFT:', {
        tierId,
        tier: tier.name,
        price: tier.price,
        token: paymentToken?.symbol,
        amount: purchaseAmount
      });

      alert(`Purchase initiated for ${tier.name}! Check your wallet for transaction confirmation.`);
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('Purchase failed. Please try again.');
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common': return 'bg-gray-500';
      case 'rare': return 'bg-blue-500';
      case 'legendary': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const formatPrice = (price: string, token: string) => {
    const tokenInfo = PAYMENT_TOKENS.find(t => t.symbol === token);
    return `${price} ${tokenInfo?.icon} ${token}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            NFT Book Marketplace
            <Badge className="ml-2 bg-gradient-to-r from-purple-500 to-blue-500">Live on Polygon</Badge>
          </CardTitle>
          <CardDescription>
            Collect exclusive CryptoQuest lore books as NFTs with multiple payment options and liquidity rewards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Coins className="w-5 h-5 text-green-600" />
                <span className="font-semibold">Total Value Locked</span>
              </div>
              <div className="text-2xl font-bold text-green-600">{LIQUIDITY_METRICS.totalValueLocked}</div>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span className="font-semibold">CQT Price</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">{LIQUIDITY_METRICS.cqtPrice}</div>
              <div className="text-sm text-green-600">{LIQUIDITY_METRICS.priceChange24h}</div>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-purple-600" />
                <span className="font-semibold">MATIC/CQT APR</span>
              </div>
              <div className="text-2xl font-bold text-purple-600">{LIQUIDITY_METRICS.maticCqtApr}</div>
            </div>
            <div className="p-4 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-orange-600" />
                <span className="font-semibold">24h Volume</span>
              </div>
              <div className="text-2xl font-bold text-orange-600">{LIQUIDITY_METRICS.totalVolume24h}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wallet Connection */}
      {!walletConnected && (
        <Alert>
          <Wallet className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Connect your wallet to purchase NFT books and access exclusive content</span>
            <Button onClick={connectWallet} size="sm">
              Connect Wallet
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="marketplace" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="marketplace">Book Marketplace</TabsTrigger>
          <TabsTrigger value="liquidity">Liquidity Pools</TabsTrigger>
          <TabsTrigger value="collection">My Collection</TabsTrigger>
        </TabsList>

        <TabsContent value="marketplace" className="space-y-6">
          {/* Payment Token Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="w-5 h-5" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {PAYMENT_TOKENS.map((token) => (
                  <div
                    key={token.symbol}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedPaymentToken === token.symbol
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedPaymentToken(token.symbol)}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">{token.icon}</div>
                      <div className="font-semibold">{token.symbol}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{token.name}</div>
                      {walletConnected && selectedPaymentToken === token.symbol && (
                        <div className="text-sm text-green-600 mt-2">
                          Balance: {userBalance} {token.symbol}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* NFT Book Tiers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BOOK_TIERS.map((tier) => (
              <Card key={tier.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="relative">
                    <img 
                      src={tier.image} 
                      alt={tier.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <Badge className={`absolute top-2 right-2 ${getRarityColor(tier.rarity)}`}>
                      {tier.rarity}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{tier.name}</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Price and Supply */}
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {formatPrice(tier.price, tier.priceToken)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {tier.sold}/{tier.supply} sold
                        </div>
                      </div>
                      <div className="text-right">
                        <Progress 
                          value={(tier.sold / tier.supply) * 100} 
                          className="w-20 h-2 mb-1"
                        />
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {Math.round((tier.sold / tier.supply) * 100)}% sold
                        </div>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Chapter:</span>
                        <span className="font-medium">{tier.chapter}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Character:</span>
                        <span className="font-medium">{tier.character}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Location:</span>
                        <span className="font-medium">{tier.location}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Element:</span>
                        <span className="font-medium">{tier.element}</span>
                      </div>
                    </div>

                    {/* Formats */}
                    <div>
                      <div className="text-sm font-medium mb-2">Available Formats:</div>
                      <div className="flex flex-wrap gap-1">
                        {tier.formats.map((format) => (
                          <Badge key={format} variant="outline" className="text-xs">
                            {format}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Benefits */}
                    <div>
                      <div className="text-sm font-medium mb-2">Includes:</div>
                      <div className="flex flex-wrap gap-1">
                        {tier.benefits.map((benefit) => (
                          <Badge key={benefit} variant="secondary" className="text-xs">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Purchase Button */}
                    <Button 
                      className="w-full" 
                      onClick={() => purchaseNFT(tier.id)}
                      disabled={tier.sold >= tier.supply}
                    >
                      {tier.sold >= tier.supply ? (
                        'Sold Out'
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Purchase NFT Book
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="liquidity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="w-5 h-5" />
                CQT Liquidity Pools
              </CardTitle>
              <CardDescription>
                Provide liquidity to earn rewards and support the CryptoQuest ecosystem
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">MATIC/CQT Pool</h3>
                    <Badge className="bg-blue-500">Active</Badge>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>APR:</span>
                      <span className="text-green-600 font-bold">{LIQUIDITY_METRICS.maticCqtApr}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pool Address:</span>
                      <span className="font-mono text-xs">{CONTRACTS.LIQUIDITY_POOLS.MATIC_CQT.slice(0, 10)}...</span>
                    </div>
                    <Button className="w-full">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Add Liquidity
                    </Button>
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/30 dark:to-blue-900/30 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">WETH/CQT Pool</h3>
                    <Badge className="bg-green-500">Active</Badge>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>APR:</span>
                      <span className="text-green-600 font-bold">{LIQUIDITY_METRICS.wethCqtApr}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pool Address:</span>
                      <span className="font-mono text-xs">{CONTRACTS.LIQUIDITY_POOLS.WETH_CQT.slice(0, 10)}...</span>
                    </div>
                    <Button className="w-full">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Add Liquidity
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="collection" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                My NFT Book Collection
              </CardTitle>
              <CardDescription>
                Access your purchased NFT books and exclusive content
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!walletConnected ? (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Connect your wallet to view your NFT book collection
                  </p>
                  <Button onClick={connectWallet}>
                    <Wallet className="w-4 h-4 mr-2" />
                    Connect Wallet
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    No NFT books found in your collection
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Purchase NFT books from the marketplace to start your collection
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}