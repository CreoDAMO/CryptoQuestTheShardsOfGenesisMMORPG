import React, { useState, useEffect } from 'react';
import { ReadyPlayerMe } from '@/components/ReadyPlayerMe';
import { ConsoleIntegration } from '@/components/ConsoleIntegration';
import { AdvancedGameEngine } from '@/components/gaming/AdvancedGameEngine';
import { CloudGamingInterface } from '@/components/gaming/CloudGamingInterface';
import { SocialGamingHub } from '@/components/gaming/SocialGamingHub';
import { AIGamingAssistant } from '@/components/gaming/AIGamingAssistant';
import { ARVRInterface } from '@/components/metaverse/ARVRInterface';
import { LanguageWrappers } from '@/components/metaverse/LanguageWrappers';
import { CoinbaseIntegration } from '@/components/coinbase/CoinbaseIntegration';
import { CoinbaseWagmiProvider } from '@/components/coinbase/WagmiProvider';
import { AggLayerIntegration } from '@/components/agglayer/AggLayerIntegration';
import { GrantProposal } from '@/components/GrantProposal';
import { NFTBookMarketplace } from '@/components/NFTBookMarketplace';
import { AdminPanel } from '@/components/AdminPanel';
import { EnhancedAdminPanel } from '@/components/EnhancedAdminPanel';

// Extend Window interface for ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, Sword, Shield, Zap, Heart, Star, Package, Scroll, 
  Hammer, DollarSign, Clock, TrendingUp, Award, Vote, Timer, 
  Image, User, Wallet, CheckCircle, XCircle, AlertTriangle,
  PlusCircle, Plus, ArrowUpDown, Layers, Coins, TrendingDown, Gamepad2
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

// Contract addresses - All live and verified on Polygon (POL)
const CONTRACT_ADDRESSES = {
  MMORPG: "0x251ace49f2b106e0746702986e879e404a76f290",
  TOKEN_SALE: "0x126d0a70e6413ec44d977c41024a76d84cedb4a4",
  TOKEN: "0x94ef57abfb1a1a3753b7c5cc3f6d6969b4731665",
  DAO: "0x7c3dddd47c29d213458abf9eb23fe50d95fa5205",
  TIMELOCK: "0x2b5949f0540884c67c1f169b9f535571656e6695",
  NFT: "0xc641573148e62d88a2374ffe97391f849cea8ff5",
  SWAP: "0x9d1075B41cd80Ab08179F36bc17a7Ff8708748ba",
  WALLET: "0xcB393B9Cb94ac7F35F05E001C4b0d512fc590Eb2",
  STAKING: "0x4915363b9524D103C8910E3C7D5516b9b4D0F333",
  FARMING: "0x95e2091ec85D20253a9cc7f37b1308bD56E8732f"
};

const POLYGON_CHAIN_ID = "0x89"; // 137 in decimal

// Comprehensive ABIs for all contracts
const MMORPG_ABI = [
  "function createPlayer() external",
  "function players(address) external view returns (uint level, uint experience, uint health, uint mana, uint attackDamage, uint defense, uint agility, uint luck, uint[] inventory, uint[] skills)",
  "function completeQuest(string memory questTitle) external",
  "function joinGuild(string memory guildName) external",
  "function craftItem(uint recipeId) external",
  "function items(uint) external view returns (uint id, string name, uint attackBonus, uint defenseBonus, uint manaBonus, uint healthBonus)",
  "function playerQuests(address, uint) external view returns (string title, string description, uint rewardXP, bool completed)",
  "function guilds(address) external view returns (string name, address leader, address[] members)",
  "function recipes(uint) external view returns (uint[] itemIds, uint resultItemId)",
  "event PlayerCreated(address indexed player)",
  "event QuestCompleted(address indexed player, string questTitle)",
  "event ItemAdded(uint itemId, string itemName)",
  "event GuildCreated(string name, address leader)"
];

const TOKEN_SALE_ABI = [
  "function buyTokens(uint256 _amount) external payable",
  "function releaseTokens() external",
  "function purchasedAmount(address) external view returns (uint256)",
  "function vestedAmount(address) external view returns (uint256)",
  "function whitelistedAddresses(address) external view returns (bool)",
  "function tokenPriceInvestor() external view returns (uint256)",
  "function tokenPriceCommunity() external view returns (uint256)",
  "function tokenPricePublic() external view returns (uint256)",
  "function totalCap() external view returns (uint256)",
  "function releaseTime() external view returns (uint256)",
  "function hasRole(bytes32 role, address account) external view returns (bool)",
  "event TokensPurchased(address indexed purchaser, uint256 amount)",
  "event TokensReleased(address beneficiary, uint256 amount)"
];

const TOKEN_ABI = [
  "function balanceOf(address account) external view returns (uint256)",
  "function stakeTokens(uint256 amount) external",
  "function airdrop(address[] recipients, uint256 amount) external",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function transfer(address to, uint256 amount) external returns (bool)",
  "function totalSupply() external view returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)"
];

const SWAP_ABI = [
  "function swapTokens(address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOutMin) external",
  "function getAmountOut(uint256 amountIn, address tokenIn, address tokenOut) external view returns (uint256)",
  "function addLiquidity(address tokenA, address tokenB, uint256 amountA, uint256 amountB) external",
  "function removeLiquidity(address tokenA, address tokenB, uint256 liquidity) external",
  "function liquidityPools(address, address) external view returns (uint256 reserveA, uint256 reserveB, uint256 totalLiquidity)",
  "event Swap(address indexed user, address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOut)",
  "event LiquidityAdded(address indexed user, address tokenA, address tokenB, uint256 amountA, uint256 amountB)"
];

const STAKING_ABI = [
  "function stake(uint256 amount) external",
  "function unstake(uint256 amount) external",
  "function claimRewards() external",
  "function stakedAmount(address) external view returns (uint256)",
  "function pendingRewards(address) external view returns (uint256)",
  "function stakingPools(uint256) external view returns (address token, uint256 rewardRate, uint256 totalStaked, bool active)",
  "function userStakes(address, uint256) external view returns (uint256 amount, uint256 rewardDebt, uint256 lastStakeTime)",
  "event Staked(address indexed user, uint256 amount)",
  "event Unstaked(address indexed user, uint256 amount)",
  "event RewardsClaimed(address indexed user, uint256 amount)"
];

const FARMING_ABI = [
  "function deposit(uint256 poolId, uint256 amount) external",
  "function withdraw(uint256 poolId, uint256 amount) external",
  "function harvest(uint256 poolId) external",
  "function poolInfo(uint256) external view returns (address lpToken, uint256 allocPoint, uint256 lastRewardBlock, uint256 accRewardPerShare)",
  "function userInfo(uint256, address) external view returns (uint256 amount, uint256 rewardDebt)",
  "function pendingReward(uint256 poolId, address user) external view returns (uint256)",
  "function totalAllocPoint() external view returns (uint256)",
  "event Deposit(address indexed user, uint256 indexed poolId, uint256 amount)",
  "event Withdraw(address indexed user, uint256 indexed poolId, uint256 amount)",
  "event Harvest(address indexed user, uint256 indexed poolId, uint256 amount)"
];

const DAO_ABI = [
  "function submitProposal(address[] targets, uint256[] values, bytes[] calldatas, string description) external returns (uint256)",
  "function voteOnProposal(uint256 proposalId, bool support) external",
  "function state(uint256 proposalId) external view returns (uint256)",
  "function viewTreasuryReport() external view returns (string)",
  "function viewGameMetrics() external view returns (string)",
  "function proposals(uint256) external view returns (address proposer, uint256 voteStart, uint256 voteEnd, bool executed)",
  "function getVotes(address account, uint256 blockNumber) external view returns (uint256)",
  "event ProposalCreated(uint256 proposalId, address proposer, string description)",
  "event VoteCast(address indexed voter, uint256 proposalId, bool support, uint256 weight)"
];

const TIMELOCK_ABI = [
  "function hasRole(bytes32 role, address account) external view returns (bool)",
  "function schedule(address target, uint256 value, bytes data, bytes32 predecessor, bytes32 salt, uint256 delay) external",
  "function execute(address target, uint256 value, bytes data, bytes32 predecessor, bytes32 salt) external payable",
  "function cancel(bytes32 id) external",
  "function getOperationState(bytes32 id) external view returns (uint8)",
  "function hashOperation(address target, uint256 value, bytes data, bytes32 predecessor, bytes32 salt) external pure returns (bytes32)",
  "event CallScheduled(bytes32 indexed id, uint256 indexed index, address target, uint256 value, bytes data, bytes32 predecessor, uint256 delay)",
  "event CallExecuted(bytes32 indexed id, uint256 indexed index, address target, uint256 value, bytes data)",
  "event Cancelled(bytes32 indexed id)"
];

const NFT_ABI = [
  "function hasRole(bytes32 role, address account) external view returns (bool)",
  "function safeMint(address to, string uri) external",
  "function mintCharacter(address to, uint256 tokenId, string race, string armor, string appearance, string tokenURI_) external",
  "function mintItem(address to, uint256 itemId, string tokenURI_, uint256 attackBonus, uint256 defenseBonus, uint256 manaBonus, uint256 healthBonus) external",
  "function mintGuild(address to, uint256 guildId, string name, string heraldry, string tokenURI_) external",
  "function mintLand(address to, uint256 newLandId, string location, string landType, string tokenURI_) external",
  "function balanceOf(address owner) external view returns (uint256)",
  "function tokenURI(uint256 tokenId) external view returns (string)",
  "function characterTraits(uint256 tokenId) external view returns (string race, string armor, string appearance)",
  "function itemTraits(uint256 tokenId) external view returns (uint256 attackBonus, uint256 defenseBonus, uint256 manaBonus, uint256 healthBonus)",
  "function guildDetails(uint256 tokenId) external view returns (string name, string heraldry)",
  "function landDetails(uint256 tokenId) external view returns (string location, string landType)",
  "event CharacterMinted(uint256 indexed tokenId, address indexed owner, string race, string armor, string appearance)",
  "event ItemMinted(uint256 indexed itemId, address indexed owner, string tokenURI, uint256 attackBonus, uint256 defenseBonus, uint256 manaBonus, uint256 healthBonus)",
  "event GuildCreated(uint256 indexed guildId, address indexed owner, string name, string heraldry)",
  "event LandMinted(uint256 indexed landId, address indexed owner, string location, string landType)"
];

interface Player {
  level: number;
  experience: number;
  health: number;
  mana: number;
  attackDamage: number;
  defense: number;
  agility: number;
  luck: number;
  inventory: number[];
  skills: number[];
}

interface TokenSaleData {
  purchased: number;
  vested: number;
  isWhitelisted: boolean;
  isInvestor: boolean;
  isCommunityMember: boolean;
  investorPrice: number;
  communityPrice: number;
  publicPrice: number;
  totalCap: number;
  releaseTime: number;
}

interface StakingData {
  stakedAmount: number;
  pendingRewards: number;
  totalStaked: number;
  rewardRate: number;
}

interface FarmingData {
  userAmount: number;
  pendingReward: number;
  poolInfo: {
    lpToken: string;
    allocPoint: number;
    totalStaked: number;
  };
}

interface SwapData {
  tokenBalance: number;
  liquidityBalance: number;
  reserves: {
    tokenA: number;
    tokenB: number;
  };
}

function CryptoQuestDApp() {
  const { toast } = useToast();
  
  // State management
  const [account, setAccount] = useState<string>('');
  const [provider, setProvider] = useState<any>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [tokenBalance, setTokenBalance] = useState<string>('0');
  const [nftBalance, setNftBalance] = useState<string>('0');
  const [stakingData, setStakingData] = useState<StakingData>({ stakedAmount: 0, pendingRewards: 0, totalStaked: 0, rewardRate: 0 });
  const [farmingData, setFarmingData] = useState<FarmingData>({ userAmount: 0, pendingReward: 0, poolInfo: { lpToken: '', allocPoint: 0, totalStaked: 0 } });
  const [swapData, setSwapData] = useState<SwapData>({ tokenBalance: 0, liquidityBalance: 0, reserves: { tokenA: 0, tokenB: 0 } });
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('character');
  
  // Form states
  const [questTitle, setQuestTitle] = useState<string>('');
  const [guildName, setGuildName] = useState<string>('');
  const [recipeId, setRecipeId] = useState<string>('');
  const [tokenAmount, setTokenAmount] = useState<string>('');
  const [stakeAmount, setStakeAmount] = useState<string>('');
  const [swapAmount, setSwapAmount] = useState<string>('');
  const [farmAmount, setFarmAmount] = useState<string>('');
  const [proposalDescription, setProposalDescription] = useState<string>('');

  const [contracts, setContracts] = useState<{
    mmorpg: any;
    tokenSale: any;
    token: any;
    dao: any;
    timelock: any;
    nft: any;
    swap: any;
    staking: any;
    farming: any;
  } | null>(null);

  const [tokenSaleData, setTokenSaleData] = useState<TokenSaleData>({
    purchased: 0,
    vested: 0,
    isWhitelisted: false,
    isInvestor: false,
    isCommunityMember: false,
    investorPrice: 0,
    communityPrice: 0,
    publicPrice: 0,
    totalCap: 0,
    releaseTime: 0
  });

  // Check for wallet connection on component mount
  useEffect(() => {
    checkConnection();
  }, []);

  // Initialize contracts when account changes
  useEffect(() => {
    if (account && provider) {
      initializeContracts();
    }
  }, [account, provider]);

  // Load user data when contracts are ready
  useEffect(() => {
    if (contracts && account) {
      loadUserData();
    }
  }, [contracts, account]);

  const checkConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          await connectWallet();
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    }
  };

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum === 'undefined') {
        toast({
          title: "Wallet Error",
          description: "Please install MetaMask!",
          variant: "destructive",
        });
        return;
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      
      if (chainId !== POLYGON_CHAIN_ID) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: POLYGON_CHAIN_ID }],
          });
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: POLYGON_CHAIN_ID,
                chainName: 'Polygon Mainnet',
                nativeCurrency: {
                  name: 'MATIC',
                  symbol: 'MATIC',
                  decimals: 18
                },
                rpcUrls: ['https://polygon-rpc.com/'],
                blockExplorerUrls: ['https://polygonscan.com/']
              }]
            });
          }
        }
      }

      // @ts-ignore
      const ethers = (await import('ethers')).ethers;
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      
      setAccount(accounts[0]);
      setProvider(web3Provider);
      
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to MetaMask on Polygon",
      });

    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect wallet",
        variant: "destructive",
      });
    }
  };

  const initializeContracts = async () => {
    try {
      if (!provider) return;
      
      // @ts-ignore
      const ethers = (await import('ethers')).ethers;
      const signer = await provider.getSigner();

      const mmorpgContract = new ethers.Contract(CONTRACT_ADDRESSES.MMORPG, MMORPG_ABI, signer);
      const tokenSaleContract = new ethers.Contract(CONTRACT_ADDRESSES.TOKEN_SALE, TOKEN_SALE_ABI, signer);
      const tokenContract = new ethers.Contract(CONTRACT_ADDRESSES.TOKEN, TOKEN_ABI, signer);
      const daoContract = new ethers.Contract(CONTRACT_ADDRESSES.DAO, DAO_ABI, signer);
      const timelockContract = new ethers.Contract(CONTRACT_ADDRESSES.TIMELOCK, TIMELOCK_ABI, signer);
      const nftContract = new ethers.Contract(CONTRACT_ADDRESSES.NFT, NFT_ABI, signer);
      const swapContract = new ethers.Contract(CONTRACT_ADDRESSES.SWAP, SWAP_ABI, signer);
      const stakingContract = new ethers.Contract(CONTRACT_ADDRESSES.STAKING, STAKING_ABI, signer);
      const farmingContract = new ethers.Contract(CONTRACT_ADDRESSES.FARMING, FARMING_ABI, signer);

      setContracts({
        mmorpg: mmorpgContract,
        tokenSale: tokenSaleContract,
        token: tokenContract,
        dao: daoContract,
        timelock: timelockContract,
        nft: nftContract,
        swap: swapContract,
        staking: stakingContract,
        farming: farmingContract
      });

    } catch (error) {
      console.error('Error initializing contracts:', error);
      toast({
        title: "Contract Error",
        description: "Failed to initialize contracts",
        variant: "destructive",
      });
    }
  };

  const loadUserData = async () => {
    try {
      if (!contracts || !account) return;
      
      // @ts-ignore
      const ethers = (await import('ethers')).ethers;
      
      // Load player data
      try {
        const playerData = await contracts.mmorpg.players(account);
        setPlayer({
          level: Number(playerData.level),
          experience: Number(playerData.experience),
          health: Number(playerData.health),
          mana: Number(playerData.mana),
          attackDamage: Number(playerData.attackDamage),
          defense: Number(playerData.defense),
          agility: Number(playerData.agility),
          luck: Number(playerData.luck),
          inventory: playerData.inventory.map((item: any) => Number(item)),
          skills: playerData.skills.map((skill: any) => Number(skill))
        });
      } catch (error) {
        console.log('Player not created yet');
      }

      // Load token balance
      try {
        const balance = await contracts.token.balanceOf(account);
        setTokenBalance(ethers.formatUnits(balance, 18));
      } catch (error) {
        console.error('Error loading token balance:', error);
      }

      // Load NFT balance
      try {
        const nftBal = await contracts.nft.balanceOf(account);
        setNftBalance(nftBal.toString());
      } catch (error) {
        console.error('Error loading NFT balance:', error);
      }

      // Load staking data
      try {
        const stakedAmount = await contracts.staking.stakedAmount(account);
        const pendingRewards = await contracts.staking.pendingRewards(account);
        setStakingData({
          stakedAmount: Number(ethers.formatUnits(stakedAmount, 18)),
          pendingRewards: Number(ethers.formatUnits(pendingRewards, 18)),
          totalStaked: 0,
          rewardRate: 0
        });
      } catch (error) {
        console.error('Error loading staking data:', error);
      }

      // Load farming data
      try {
        const userInfo = await contracts.farming.userInfo(0, account);
        const pendingReward = await contracts.farming.pendingReward(0, account);
        setFarmingData({
          userAmount: Number(ethers.formatUnits(userInfo.amount, 18)),
          pendingReward: Number(ethers.formatUnits(pendingReward, 18)),
          poolInfo: { lpToken: '', allocPoint: 0, totalStaked: 0 }
        });
      } catch (error) {
        console.error('Error loading farming data:', error);
      }

    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const createPlayer = async () => {
    if (!contracts) return;
    
    setLoading(true);
    try {
      const tx = await contracts.mmorpg.createPlayer();
      await tx.wait();
      
      toast({
        title: "Character Created",
        description: "Your CryptoQuest character has been created!",
      });
      
      await loadUserData();
    } catch (error: any) {
      toast({
        title: "Creation Failed",
        description: error.reason || "Failed to create character",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const completeQuest = async () => {
    if (!contracts || !questTitle) return;
    
    setLoading(true);
    try {
      const tx = await contracts.mmorpg.completeQuest(questTitle);
      await tx.wait();
      
      toast({
        title: "Quest Completed",
        description: `Quest "${questTitle}" completed successfully!`,
      });
      
      setQuestTitle('');
      await loadUserData();
    } catch (error: any) {
      toast({
        title: "Quest Failed",
        description: error.reason || "Failed to complete quest",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const buyTokens = async () => {
    if (!contracts || !tokenAmount) return;
    
    setLoading(true);
    try {
      // @ts-ignore
      const ethers = (await import('ethers')).ethers;
      const amount = ethers.parseUnits(tokenAmount, 18);
      const tx = await contracts.tokenSale.buyTokens(amount, { value: amount });
      await tx.wait();
      
      toast({
        title: "Tokens Purchased",
        description: `Successfully purchased ${tokenAmount} CQT tokens!`,
      });
      
      setTokenAmount('');
      await loadUserData();
    } catch (error: any) {
      toast({
        title: "Purchase Failed",
        description: error.reason || "Failed to purchase tokens",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const stakeTokens = async () => {
    if (!contracts || !stakeAmount) return;
    
    setLoading(true);
    try {
      // @ts-ignore
      const ethers = (await import('ethers')).ethers;
      const amount = ethers.parseUnits(stakeAmount, 18);
      
      // First approve the staking contract
      const approveTx = await contracts.token.approve(CONTRACT_ADDRESSES.STAKING, amount);
      await approveTx.wait();
      
      // Then stake
      const stakeTx = await contracts.staking.stake(amount);
      await stakeTx.wait();
      
      toast({
        title: "Tokens Staked",
        description: `Successfully staked ${stakeAmount} CQT tokens!`,
      });
      
      setStakeAmount('');
      await loadUserData();
    } catch (error: any) {
      toast({
        title: "Staking Failed",
        description: error.reason || "Failed to stake tokens",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const swapTokens = async () => {
    if (!contracts || !swapAmount) return;
    
    setLoading(true);
    try {
      // @ts-ignore
      const ethers = (await import('ethers')).ethers;
      const amount = ethers.parseUnits(swapAmount, 18);
      
      // Approve swap contract
      const approveTx = await contracts.token.approve(CONTRACT_ADDRESSES.SWAP, amount);
      await approveTx.wait();
      
      // Perform swap (example: CQT to MATIC)
      const swapTx = await contracts.swap.swapTokens(
        CONTRACT_ADDRESSES.TOKEN,
        "0x0000000000000000000000000000000000001010", // MATIC
        amount,
        0 // min amount out
      );
      await swapTx.wait();
      
      toast({
        title: "Swap Completed",
        description: `Successfully swapped ${swapAmount} tokens!`,
      });
      
      setSwapAmount('');
      await loadUserData();
    } catch (error: any) {
      toast({
        title: "Swap Failed",
        description: error.reason || "Failed to swap tokens",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const renderCharacterTab = () => (
    <div className="space-y-6">
      <Card className="bg-card/60 backdrop-blur border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Character Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!player ? (
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">No character found. Create your CryptoQuest character to begin!</p>
              <Button onClick={createPlayer} disabled={loading} className="w-full">
                {loading ? "Creating..." : "Create Character"}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium">Level</span>
                </div>
                <div className="text-2xl font-bold">{player.level}</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium">Experience</span>
                </div>
                <div className="text-2xl font-bold">{player.experience}</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium">Health</span>
                </div>
                <div className="text-2xl font-bold">{player.health}</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium">Mana</span>
                </div>
                <div className="text-2xl font-bold">{player.mana}</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sword className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-medium">Attack</span>
                </div>
                <div className="text-2xl font-bold">{player.attackDamage}</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">Defense</span>
                </div>
                <div className="text-2xl font-bold">{player.defense}</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-cyan-500" />
                  <span className="text-sm font-medium">Agility</span>
                </div>
                <div className="text-2xl font-bold">{player.agility}</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-pink-500" />
                  <span className="text-sm font-medium">Luck</span>
                </div>
                <div className="text-2xl font-bold">{player.luck}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {player && (
        <Card className="bg-card/60 backdrop-blur border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scroll className="w-5 h-5" />
              Quest Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter quest title"
                value={questTitle}
                onChange={(e) => setQuestTitle(e.target.value)}
                className="flex-1"
              />
              <Button onClick={completeQuest} disabled={loading || !questTitle}>
                {loading ? "Completing..." : "Complete Quest"}
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Input
                placeholder="Enter guild name"
                value={guildName}
                onChange={(e) => setGuildName(e.target.value)}
                className="flex-1"
              />
              <Button onClick={() => {}} disabled={loading || !guildName}>
                Join Guild
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderTokenSaleTab = () => (
    <div className="space-y-6">
      <Card className="bg-card/60 backdrop-blur border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Token Sale
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Current Balance</div>
              <div className="text-2xl font-bold">{parseFloat(tokenBalance).toFixed(4)} CQT</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">NFTs Owned</div>
              <div className="text-2xl font-bold">{nftBalance}</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Wallet</div>
              <div className="text-sm font-mono">{account.slice(0, 6)}...{account.slice(-4)}</div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Amount of tokens to buy"
              value={tokenAmount}
              onChange={(e) => setTokenAmount(e.target.value)}
              className="flex-1"
            />
            <Button onClick={buyTokens} disabled={loading || !tokenAmount}>
              {loading ? "Buying..." : "Buy Tokens"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStakingTab = () => (
    <div className="space-y-6">
      <Card className="bg-card/60 backdrop-blur border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="w-5 h-5" />
            Staking Pool
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Staked Amount</div>
              <div className="text-2xl font-bold">{stakingData.stakedAmount.toFixed(4)} CQT</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Pending Rewards</div>
              <div className="text-2xl font-bold text-green-400">{stakingData.pendingRewards.toFixed(4)} CQT</div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Amount to stake"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              className="flex-1"
            />
            <Button onClick={stakeTokens} disabled={loading || !stakeAmount}>
              {loading ? "Staking..." : "Stake Tokens"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSwapTab = () => (
    <div className="space-y-6">
      <Card className="bg-card/60 backdrop-blur border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowUpDown className="w-5 h-5" />
            Token Swap
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center p-4 border rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Available Balance</div>
            <div className="text-2xl font-bold">{parseFloat(tokenBalance).toFixed(4)} CQT</div>
          </div>
          
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Amount to swap"
              value={swapAmount}
              onChange={(e) => setSwapAmount(e.target.value)}
              className="flex-1"
            />
            <Button onClick={swapTokens} disabled={loading || !swapAmount}>
              {loading ? "Swapping..." : "Swap to MATIC"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderFarmingTab = () => (
    <div className="space-y-6">
      <Card className="bg-card/60 backdrop-blur border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5" />
            Yield Farming
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Deposited Amount</div>
              <div className="text-2xl font-bold">{farmingData.userAmount.toFixed(4)} LP</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Pending Rewards</div>
              <div className="text-2xl font-bold text-green-400">{farmingData.pendingReward.toFixed(4)} CQT</div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Amount to farm"
              value={farmAmount}
              onChange={(e) => setFarmAmount(e.target.value)}
              className="flex-1"
            />
            <Button onClick={() => {}} disabled={loading || !farmAmount}>
              {loading ? "Depositing..." : "Deposit to Farm"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const tabs = [
    { id: 'character', label: 'Character', icon: User },
    { id: 'avatar', label: 'Avatar Creator', icon: Users },
    { id: 'console', label: 'Console Gaming', icon: Zap },
    { id: 'gaming', label: 'Gaming Hub', icon: Gamepad2 },
    { id: 'tokensale', label: 'Token Sale', icon: DollarSign },
    { id: 'staking', label: 'Staking', icon: Layers },
    { id: 'swap', label: 'Swap', icon: ArrowUpDown },
    { id: 'farming', label: 'Farming', icon: TrendingDown },
    { id: 'dao', label: 'DAO', icon: Vote },
    { id: 'nft', label: 'NFTs', icon: Image }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Logo and Header */}
        <Card className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur border-border/50 mb-8">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <img 
                src="https://github.com/CreoDAMO/CQTSOG-MMORPG/assets/151800081/23d874f2-d5a2-4c34-ae37-44df67c66e9e"
                alt="CryptoQuest Logo"
                className="w-16 h-16 mr-4 rounded-lg"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                CryptoQuest: The Shards of Genesis
              </h1>
            </div>
            <p className="text-lg text-muted-foreground mb-6">Complete MMORPG DApp Ecosystem on Polygon</p>
            
            {!account ? (
              <Button onClick={connectWallet} size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                <Wallet className="w-5 h-5 mr-2" />
                Connect Wallet
              </Button>
            ) : (
              <div className="inline-flex items-center gap-2 bg-green-900/30 px-4 py-2 rounded-lg border border-green-500/30">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-green-400">Connected: {account.slice(0, 6)}...{account.slice(-4)}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {account && (
          <>
            {/* Navigation Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 md:grid-cols-9 gap-1 mb-8 bg-card/60 backdrop-blur">
                {tabs.map(({ id, label, icon: Icon }) => (
                  <TabsTrigger 
                    key={id} 
                    value={id}
                    className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="character">{renderCharacterTab()}</TabsContent>
              
              <TabsContent value="avatar">
                <div className="space-y-6">
                  <Card className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Ready Player Me Avatar Creator
                        <Badge className="ml-2 bg-green-500">Cross-Platform</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ReadyPlayerMe 
                        onAvatarCreated={(avatarUrl) => {
                          toast({
                            title: "Avatar Created!",
                            description: "Your avatar is ready for PS5, Xbox, and PC platforms."
                          });
                        }}
                        isLoading={loading}
                      />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="console">
                <div className="space-y-6">
                  <Card className="bg-gradient-to-r from-green-600/20 to-blue-600/20 backdrop-blur border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        Console Gaming Integration
                        <Badge className="ml-2 bg-blue-500">Production Ready</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ConsoleIntegration 
                        onAccountLinked={(account) => {
                          toast({
                            title: `${account.platform.toUpperCase()} Account Linked!`,
                            description: `Custodial wallet created: ${account.walletAddress.slice(0, 6)}...${account.walletAddress.slice(-4)}`
                          });
                        }}
                      />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="gaming">
                <div className="space-y-6">
                  <Card className="bg-gradient-to-r from-purple-600/20 to-cyan-600/20 backdrop-blur border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Gamepad2 className="w-5 h-5" />
                        Revolutionary Gaming Hub
                        <Badge className="ml-2 bg-gradient-to-r from-purple-500 to-cyan-500">Industry Disruption</Badge>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-2">
                        Advanced gaming features that combine PS5, Xbox, PC, and mobile capabilities in React
                      </p>
                    </CardHeader>
                  </Card>

                  <Tabs defaultValue="engine" className="w-full">
                    <TabsList className="grid w-full grid-cols-11">
                      <TabsTrigger value="engine">Game Engine</TabsTrigger>
                      <TabsTrigger value="cloud">Cloud Gaming</TabsTrigger>
                      <TabsTrigger value="social">Social Hub</TabsTrigger>
                      <TabsTrigger value="ai">AI Assistant</TabsTrigger>
                      <TabsTrigger value="metaverse">AR/VR/XR</TabsTrigger>
                      <TabsTrigger value="languages">Multi-Language</TabsTrigger>
                      <TabsTrigger value="payments">CQT Payments</TabsTrigger>
                      <TabsTrigger value="agglayer">AggLayer</TabsTrigger>
                      <TabsTrigger value="grants">Grant Strategy</TabsTrigger>
                      <TabsTrigger value="nftbooks">NFT Books</TabsTrigger>
                      <TabsTrigger value="admin">Admin Control</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="engine" className="space-y-6">
                      <AdvancedGameEngine 
                        onPerformanceUpdate={(metrics) => {
                          if (metrics.fps < 30) {
                            toast({
                              title: "Performance Alert",
                              description: "Frame rate dropped below 30 FPS. Consider optimizing settings.",
                              variant: "destructive"
                            });
                          }
                        }}
                        onHapticFeedback={(intensity, duration) => {
                          console.log(`Haptic feedback: ${intensity} intensity for ${duration}ms`);
                        }}
                      />
                    </TabsContent>
                    
                    <TabsContent value="cloud" className="space-y-6">
                      <CloudGamingInterface 
                        onStreamingStateChange={(state) => {
                          if (state.isStreaming) {
                            toast({
                              title: "Cloud Gaming Active",
                              description: `Streaming at ${state.quality} with ${state.frameRate}fps`
                            });
                          }
                        }}
                      />
                    </TabsContent>
                    
                    <TabsContent value="social" className="space-y-6">
                      <SocialGamingHub />
                    </TabsContent>
                    
                    <TabsContent value="ai" className="space-y-6">
                      <AIGamingAssistant 
                        onOptimizationApplied={(optimization) => {
                          toast({
                            title: "AI Optimization Applied",
                            description: optimization.title,
                            duration: 3000
                          });
                        }}
                        onInsightGenerated={(insight) => {
                          if (insight.priority === 'high') {
                            toast({
                              title: "AI Insight",
                              description: insight.title,
                              duration: 5000
                            });
                          }
                        }}
                      />
                    </TabsContent>
                    
                    <TabsContent value="metaverse" className="space-y-6">
                      <ARVRInterface />
                    </TabsContent>
                    
                    <TabsContent value="languages" className="space-y-6">
                      <LanguageWrappers />
                    </TabsContent>
                    
                    <TabsContent value="payments" className="space-y-6">
                      <CoinbaseWagmiProvider>
                        <CoinbaseIntegration />
                      </CoinbaseWagmiProvider>
                    </TabsContent>
                    
                    <TabsContent value="agglayer" className="space-y-6">
                      <AggLayerIntegration />
                    </TabsContent>
                    
                    <TabsContent value="grants" className="space-y-6">
                      <GrantProposal />
                    </TabsContent>
                    
                    <TabsContent value="nftbooks" className="space-y-6">
                      <NFTBookMarketplace />
                    </TabsContent>
                    
                    <TabsContent value="admin" className="space-y-6">
                      <AdminPanel />
                    </TabsContent>
                  </Tabs>
                </div>
              </TabsContent>

              <TabsContent value="tokensale">{renderTokenSaleTab()}</TabsContent>
              <TabsContent value="staking">{renderStakingTab()}</TabsContent>
              <TabsContent value="swap">{renderSwapTab()}</TabsContent>
              <TabsContent value="farming">{renderFarmingTab()}</TabsContent>
              
              <TabsContent value="dao">
                <Card className="bg-card/60 backdrop-blur border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Vote className="w-5 h-5" />
                      DAO Governance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">DAO governance features coming soon. Participate in community decisions and proposal voting.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="nft">
                <Card className="bg-card/60 backdrop-blur border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Image className="w-5 h-5" />
                      NFT Collection
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center p-8">
                      <div className="text-4xl font-bold text-purple-400 mb-2">{nftBalance}</div>
                      <div className="text-muted-foreground">NFTs Owned</div>
                      <p className="text-sm text-muted-foreground mt-4">Character, item, guild, and land NFTs will be displayed here.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
      
      <Toaster />
    </div>
  );
}

export default CryptoQuestDApp;