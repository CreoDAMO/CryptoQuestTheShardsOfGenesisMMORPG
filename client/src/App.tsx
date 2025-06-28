import React, { useState, useEffect } from 'react';
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
  PlusCircle, Plus
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

// Contract ABIs and addresses (using environment variables with fallbacks)
const MMORPG_CONTRACT_ADDRESS = import.meta.env.VITE_MMORPG_CONTRACT_ADDRESS || "0x251ace49f2b106e0746702986e879e404a76f290";
const TOKEN_SALE_CONTRACT_ADDRESS = import.meta.env.VITE_TOKEN_SALE_CONTRACT_ADDRESS || "0x126d0a70e6413ec44d977c41024a76d84cedb4a4";
const TOKEN_CONTRACT_ADDRESS = import.meta.env.VITE_TOKEN_CONTRACT_ADDRESS || "0x94ef57abfb1a1a3753b7c5cc3f6d6969b4731665";
const DAO_CONTRACT_ADDRESS = import.meta.env.VITE_DAO_CONTRACT_ADDRESS || "0x7c3dddd47c29d213458abf9eb23fe50d95fa5205";
const TIMELOCK_CONTRACT_ADDRESS = import.meta.env.VITE_TIMELOCK_CONTRACT_ADDRESS || "0x2b5949f0540884c67c1f169b9f535571656e6695";
const NFT_CONTRACT_ADDRESS = import.meta.env.VITE_NFT_CONTRACT_ADDRESS || "0xc641573148e62d88a2374ffe97391f849cea8ff5";

const POLYGON_CHAIN_ID = "0x89"; // 137 in decimal

// Contract ABIs
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
  "event Transfer(address indexed from, address indexed to, uint256 value)"
];

const DAO_ABI = [
  "function submitProposal(address[] targets, uint256[] values, bytes[] calldatas, string description) external returns (uint256)",
  "function voteOnProposal(uint256 proposalId, bool support) external",
  "function state(uint256 proposalId) external view returns (uint256)",
  "function viewTreasuryReport() external view returns (string)",
  "function viewGameMetrics() external view returns (string)"
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

interface NFTMintData {
  character: {
    tokenId: string;
    race: string;
    armor: string;
    appearance: string;
    uri: string;
  };
  item: {
    itemId: string;
    uri: string;
    attackBonus: string;
    defenseBonus: string;
    manaBonus: string;
    healthBonus: string;
  };
  guild: {
    guildId: string;
    name: string;
    heraldry: string;
    uri: string;
  };
  land: {
    landId: string;
    location: string;
    landType: string;
    uri: string;
  };
}

interface TimelockRoles {
  proposer: boolean;
  executor: boolean;
  canceller: boolean;
}

function CryptoQuestDApp() {
  const { toast } = useToast();
  
  // State management
  const [account, setAccount] = useState<string>('');
  const [provider, setProvider] = useState<any>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [tokenBalance, setTokenBalance] = useState<string>('0');
  const [nftBalance, setNftBalance] = useState<string>('0');
  const [stakedBalance, setStakedBalance] = useState<string>('0');
  const [timelockRoles, setTimelockRoles] = useState<TimelockRoles>({ proposer: false, executor: false, canceller: false });
  const [nftMinterRole, setNftMinterRole] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('character');
  
  // Form states
  const [questTitle, setQuestTitle] = useState<string>('');
  const [guildName, setGuildName] = useState<string>('');
  const [recipeId, setRecipeId] = useState<string>('');
  const [tokenAmount, setTokenAmount] = useState<string>('');
  const [stakeAmount, setStakeAmount] = useState<string>('');
  const [proposalDescription, setProposalDescription] = useState<string>('');
  const [operationId, setOperationId] = useState<string>('');
  const [nftMintData, setNftMintData] = useState<NFTMintData>({
    character: { tokenId: '', race: '', armor: '', appearance: '', uri: '' },
    item: { itemId: '', uri: '', attackBonus: '', defenseBonus: '', manaBonus: '', healthBonus: '' },
    guild: { guildId: '', name: '', heraldry: '', uri: '' },
    land: { landId: '', location: '', landType: '', uri: '' }
  });
  
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

  // Contracts state
  const [contracts, setContracts] = useState<{
    mmorpg: any;
    tokenSale: any;
    token: any;
    dao: any;
    timelock: any;
    nft: any;
  } | null>(null);

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
        description: "Successfully connected to MetaMask",
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

      const mmorpgContract = new ethers.Contract(MMORPG_CONTRACT_ADDRESS, MMORPG_ABI, signer);
      const tokenSaleContract = new ethers.Contract(TOKEN_SALE_CONTRACT_ADDRESS, TOKEN_SALE_ABI, signer);
      const tokenContract = new ethers.Contract(TOKEN_CONTRACT_ADDRESS, TOKEN_ABI, signer);
      const daoContract = new ethers.Contract(DAO_CONTRACT_ADDRESS, DAO_ABI, signer);
      const timelockContract = new ethers.Contract(TIMELOCK_CONTRACT_ADDRESS, TIMELOCK_ABI, signer);
      const nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, signer);

      setContracts({
        mmorpg: mmorpgContract,
        tokenSale: tokenSaleContract,
        token: tokenContract,
        dao: daoContract,
        timelock: timelockContract,
        nft: nftContract
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

      // Load token sale data
      try {
        const purchased = await contracts.tokenSale.purchasedAmount(account);
        const vested = await contracts.tokenSale.vestedAmount(account);
        const isWhitelisted = await contracts.tokenSale.whitelistedAddresses(account);
        
        setTokenSaleData(prev => ({
          ...prev,
          purchased: Number(ethers.formatUnits(purchased, 18)),
          vested: Number(ethers.formatUnits(vested, 18)),
          isWhitelisted
        }));
      } catch (error) {
        console.error('Error loading token sale data:', error);
      }

      // Load timelock roles
      try {
        const PROPOSER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("PROPOSER_ROLE"));
        const EXECUTOR_ROLE = ethers.keccak256(ethers.toUtf8Bytes("EXECUTOR_ROLE"));
        const CANCELLER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("CANCELLER_ROLE"));
        
        const proposer = await contracts.timelock.hasRole(PROPOSER_ROLE, account);
        const executor = await contracts.timelock.hasRole(EXECUTOR_ROLE, account);
        const canceller = await contracts.timelock.hasRole(CANCELLER_ROLE, account);
        
        setTimelockRoles({ proposer, executor, canceller });
      } catch (error) {
        console.error('Error loading timelock roles:', error);
      }

    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const createPlayer = async () => {
    try {
      if (!contracts) return;
      
      setLoading(true);
      const tx = await contracts.mmorpg.createPlayer();
      await tx.wait();
      
      toast({
        title: "Player Created",
        description: "Your character has been successfully created!",
      });
      
      await loadUserData();
    } catch (error) {
      console.error('Error creating player:', error);
      toast({
        title: "Creation Error",
        description: "Failed to create player",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const completeQuest = async () => {
    try {
      if (!contracts || !questTitle) return;
      
      setLoading(true);
      const tx = await contracts.mmorpg.completeQuest(questTitle);
      await tx.wait();
      
      toast({
        title: "Quest Completed",
        description: `Quest "${questTitle}" completed successfully!`,
      });
      
      setQuestTitle('');
      await loadUserData();
    } catch (error) {
      console.error('Error completing quest:', error);
      toast({
        title: "Quest Error",
        description: "Failed to complete quest",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const joinGuild = async () => {
    try {
      if (!contracts || !guildName) return;
      
      setLoading(true);
      const tx = await contracts.mmorpg.joinGuild(guildName);
      await tx.wait();
      
      toast({
        title: "Guild Joined",
        description: `Successfully joined guild "${guildName}"!`,
      });
      
      setGuildName('');
      await loadUserData();
    } catch (error) {
      console.error('Error joining guild:', error);
      toast({
        title: "Guild Error",
        description: "Failed to join guild",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const craftItem = async () => {
    try {
      if (!contracts || !recipeId) return;
      
      setLoading(true);
      const tx = await contracts.mmorpg.craftItem(parseInt(recipeId));
      await tx.wait();
      
      toast({
        title: "Item Crafted",
        description: "Item successfully crafted!",
      });
      
      setRecipeId('');
      await loadUserData();
    } catch (error) {
      console.error('Error crafting item:', error);
      toast({
        title: "Crafting Error",
        description: "Failed to craft item",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const buyTokens = async (tier: 'investor' | 'community' | 'public') => {
    try {
      if (!contracts || !tokenAmount) return;
      
      // @ts-ignore
      const ethers = (await import('ethers')).ethers;
      
      setLoading(true);
      
      // Calculate required ETH based on tier pricing
      let pricePerToken;
      switch (tier) {
        case 'investor':
          pricePerToken = await contracts.tokenSale.tokenPriceInvestor();
          break;
        case 'community':
          pricePerToken = await contracts.tokenSale.tokenPriceCommunity();
          break;
        case 'public':
          pricePerToken = await contracts.tokenSale.tokenPricePublic();
          break;
      }
      
      const totalCost = pricePerToken * BigInt(tokenAmount);
      
      const tx = await contracts.tokenSale.buyTokens(tokenAmount, { value: totalCost });
      await tx.wait();
      
      toast({
        title: "Tokens Purchased",
        description: `Successfully purchased ${tokenAmount} CQT tokens!`,
      });
      
      setTokenAmount('');
      await loadUserData();
    } catch (error) {
      console.error('Error buying tokens:', error);
      toast({
        title: "Purchase Error",
        description: "Failed to purchase tokens",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const releaseTokens = async () => {
    try {
      if (!contracts) return;
      
      setLoading(true);
      const tx = await contracts.tokenSale.releaseTokens();
      await tx.wait();
      
      toast({
        title: "Tokens Released",
        description: "Your vested tokens have been released!",
      });
      
      await loadUserData();
    } catch (error) {
      console.error('Error releasing tokens:', error);
      toast({
        title: "Release Error",
        description: "Failed to release tokens",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const stakeTokens = async () => {
    try {
      if (!contracts || !stakeAmount) return;
      
      // @ts-ignore
      const ethers = (await import('ethers')).ethers;
      
      setLoading(true);
      
      // First approve the tokens
      const amount = ethers.parseUnits(stakeAmount, 18);
      const approveTx = await contracts.token.approve(TOKEN_CONTRACT_ADDRESS, amount);
      await approveTx.wait();
      
      // Then stake
      const tx = await contracts.token.stakeTokens(amount);
      await tx.wait();
      
      toast({
        title: "Tokens Staked",
        description: `Successfully staked ${stakeAmount} CQT tokens!`,
      });
      
      setStakeAmount('');
      await loadUserData();
    } catch (error) {
      console.error('Error staking tokens:', error);
      toast({
        title: "Staking Error",
        description: "Failed to stake tokens",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const submitProposal = async () => {
    try {
      if (!contracts || !proposalDescription) return;
      
      setLoading(true);
      
      // Example proposal targets (can be customized)
      const targets = [MMORPG_CONTRACT_ADDRESS];
      const values = [0];
      const calldatas = ["0x"];
      
      const tx = await contracts.dao.submitProposal(targets, values, calldatas, proposalDescription);
      await tx.wait();
      
      toast({
        title: "Proposal Submitted",
        description: "Your proposal has been submitted for voting!",
      });
      
      setProposalDescription('');
    } catch (error) {
      console.error('Error submitting proposal:', error);
      toast({
        title: "Proposal Error",
        description: "Failed to submit proposal",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const mintNFT = async (type: 'character' | 'item' | 'guild' | 'land') => {
    try {
      if (!contracts) return;
      
      setLoading(true);
      let tx;
      
      switch (type) {
        case 'character':
          const charData = nftMintData.character;
          if (!charData.tokenId || !charData.race || !charData.armor || !charData.appearance || !charData.uri) {
            toast({
              title: "Validation Error",
              description: "Please fill in all character fields",
              variant: "destructive",
            });
            return;
          }
          tx = await contracts.nft.mintCharacter(
            account, 
            parseInt(charData.tokenId), 
            charData.race, 
            charData.armor, 
            charData.appearance, 
            charData.uri
          );
          break;
          
        case 'item':
          const itemData = nftMintData.item;
          if (!itemData.itemId || !itemData.uri) {
            toast({
              title: "Validation Error",
              description: "Please fill in required item fields",
              variant: "destructive",
            });
            return;
          }
          tx = await contracts.nft.mintItem(
            account,
            parseInt(itemData.itemId),
            itemData.uri,
            parseInt(itemData.attackBonus || '0'),
            parseInt(itemData.defenseBonus || '0'),
            parseInt(itemData.manaBonus || '0'),
            parseInt(itemData.healthBonus || '0')
          );
          break;
          
        case 'guild':
          const guildData = nftMintData.guild;
          if (!guildData.guildId || !guildData.name || !guildData.heraldry || !guildData.uri) {
            toast({
              title: "Validation Error",
              description: "Please fill in all guild fields",
              variant: "destructive",
            });
            return;
          }
          tx = await contracts.nft.mintGuild(
            account,
            parseInt(guildData.guildId),
            guildData.name,
            guildData.heraldry,
            guildData.uri
          );
          break;
          
        case 'land':
          const landData = nftMintData.land;
          if (!landData.landId || !landData.location || !landData.landType || !landData.uri) {
            toast({
              title: "Validation Error",
              description: "Please fill in all land fields",
              variant: "destructive",
            });
            return;
          }
          tx = await contracts.nft.mintLand(
            account,
            parseInt(landData.landId),
            landData.location,
            landData.landType,
            landData.uri
          );
          break;
      }
      
      await tx.wait();
      
      toast({
        title: "NFT Minted",
        description: `Successfully minted ${type} NFT!`,
      });
      
      // Reset form data
      setNftMintData(prev => ({
        ...prev,
        [type]: type === 'character' 
          ? { tokenId: '', race: '', armor: '', appearance: '', uri: '' }
          : type === 'item'
          ? { itemId: '', uri: '', attackBonus: '', defenseBonus: '', manaBonus: '', healthBonus: '' }
          : type === 'guild'
          ? { guildId: '', name: '', heraldry: '', uri: '' }
          : { landId: '', location: '', landType: '', uri: '' }
      }));
      
      await loadUserData();
    } catch (error) {
      console.error('Error minting NFT:', error);
      toast({
        title: "Minting Error",
        description: "Failed to mint NFT",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-gray-100 font-inter">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center glow-effect">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  CryptoQuest
                </h1>
                <p className="text-xs text-gray-400">The Shards of Genesis</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-secondary rounded-full pulse-glow"></div>
                <span className="text-gray-300">Polygon</span>
              </div>
              
              <Button 
                onClick={connectWallet}
                className="bg-primary hover:bg-primary/90"
                disabled={loading}
              >
                <Wallet className="w-4 h-4 mr-2" />
                {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Connect Wallet'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-8 mb-8 border border-slate-600">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Enter the Genesis Realm
              </h2>
              <p className="text-gray-300 mb-6 text-lg">
                Embark on an epic blockchain adventure. Create your character, join guilds, complete quests, and shape the future through DAO governance.
              </p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-3">
                    <div className="text-2xl font-bold text-primary">{player?.level || 0}</div>
                    <div className="text-xs text-gray-400">Level</div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-3">
                    <div className="text-2xl font-bold text-secondary">{parseFloat(tokenBalance).toFixed(0)}</div>
                    <div className="text-xs text-gray-400">CQT Tokens</div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-3">
                    <div className="text-2xl font-bold text-accent">{nftBalance}</div>
                    <div className="text-xs text-gray-400">NFTs Owned</div>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="Mystical fantasy landscape with floating islands and magical energy" 
                className="rounded-xl shadow-2xl w-full" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent rounded-xl"></div>
            </div>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-slate-800 border border-slate-700 mb-8">
            <TabsTrigger value="character" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-purple-600">
              <User className="w-4 h-4 mr-2" />
              Character
            </TabsTrigger>
            <TabsTrigger value="token-sale">
              <DollarSign className="w-4 h-4 mr-2" />
              Token Sale
            </TabsTrigger>
            <TabsTrigger value="governance">
              <Vote className="w-4 h-4 mr-2" />
              Governance
            </TabsTrigger>
            <TabsTrigger value="nft-collection">
              <Image className="w-4 h-4 mr-2" />
              NFT Collection
            </TabsTrigger>
            <TabsTrigger value="timelock">
              <Clock className="w-4 h-4 mr-2" />
              Timelock
            </TabsTrigger>
            <TabsTrigger value="staking">
              <TrendingUp className="w-4 h-4 mr-2" />
              Staking
            </TabsTrigger>
          </TabsList>

          {/* Character Tab */}
          <TabsContent value="character">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-slate-800 border-slate-700 card-hover">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-primary" />
                    <span>Character Profile</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!player ? (
                    <div className="text-center py-8">
                      <p className="text-gray-400 mb-4">No character found. Create your player to begin your adventure!</p>
                      <Button onClick={createPlayer} disabled={loading} className="bg-primary hover:bg-primary/90">
                        {loading ? 'Creating...' : 'Create Player'}
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center space-x-4 p-4 bg-slate-700 rounded-lg">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                          <Sword className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg">Genesis Warrior</h4>
                          <p className="text-gray-400">Level {player.level} Adventurer</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <Card className="bg-slate-700 border-slate-600">
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-gray-400">Health</span>
                              <span className="text-sm font-medium">{player.health}/1000</span>
                            </div>
                            <Progress value={(player.health / 1000) * 100} className="h-2" />
                          </CardContent>
                        </Card>
                        <Card className="bg-slate-700 border-slate-600">
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-gray-400">Mana</span>
                              <span className="text-sm font-medium">{player.mana}/400</span>
                            </div>
                            <Progress value={(player.mana / 400) * 100} className="h-2" />
                          </CardContent>
                        </Card>
                        <Card className="bg-slate-700 border-slate-600">
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-gray-400">Attack</span>
                              <span className="text-sm font-medium">{player.attackDamage}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Sword className="w-4 h-4 text-destructive" />
                              <span className="text-destructive font-medium">{player.attackDamage}</span>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="bg-slate-700 border-slate-600">
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-gray-400">Defense</span>
                              <span className="text-sm font-medium">{player.defense}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Shield className="w-4 h-4 text-blue-400" />
                              <span className="text-blue-400 font-medium">{player.defense}</span>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <Card className="bg-slate-700 border-slate-600">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-400">Experience</span>
                            <span className="text-sm font-medium">{player.experience}/3000 XP</span>
                          </div>
                          <Progress value={(player.experience / 3000) * 100} className="h-3" />
                        </CardContent>
                      </Card>
                    </>
                  )}
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="bg-slate-800 border-slate-700 card-hover">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Scroll className="w-5 h-5 text-accent" />
                      <span>Quest Management</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      placeholder="Enter quest title"
                      value={questTitle}
                      onChange={(e) => setQuestTitle(e.target.value)}
                      className="bg-slate-700 border-slate-600"
                    />
                    <Button 
                      onClick={completeQuest} 
                      disabled={loading || !questTitle}
                      className="w-full bg-accent hover:bg-accent/90"
                    >
                      {loading ? 'Completing...' : 'Complete Quest'}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700 card-hover">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="w-5 h-5 text-secondary" />
                      <span>Guild System</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Card className="bg-slate-700 border-slate-600">
                      <CardContent className="p-3">
                        <div className="font-medium">Dragon Slayers</div>
                        <div className="text-sm text-gray-400">15 Members • Level 8 Guild</div>
                      </CardContent>
                    </Card>
                    <Input
                      placeholder="Enter guild name to join"
                      value={guildName}
                      onChange={(e) => setGuildName(e.target.value)}
                      className="bg-slate-700 border-slate-600"
                    />
                    <Button 
                      onClick={joinGuild} 
                      disabled={loading || !guildName}
                      className="w-full bg-secondary hover:bg-secondary/90"
                    >
                      {loading ? 'Joining...' : 'Join Guild'}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700 card-hover">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Hammer className="w-5 h-5 text-orange-500" />
                      <span>Item Crafting</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Select value={recipeId} onValueChange={setRecipeId}>
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue placeholder="Select recipe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Iron Sword Recipe</SelectItem>
                        <SelectItem value="2">Mystic Shield Recipe</SelectItem>
                        <SelectItem value="3">Health Potion Recipe</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button 
                      onClick={craftItem} 
                      disabled={loading || !recipeId}
                      className="w-full bg-orange-500 hover:bg-orange-600"
                    >
                      {loading ? 'Crafting...' : 'Craft Item'}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Token Sale Tab */}
          <TabsContent value="token-sale">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <h3 className="text-2xl font-bold mb-6">CQT Token Sale</h3>
                
                {/* Investor Tier */}
                <Card className="bg-gradient-to-r from-purple-900 to-purple-800 border-purple-600 card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-xl font-bold text-purple-200">Investor Tier</h4>
                        <p className="text-purple-300">Early access with maximum benefits</p>
                      </div>
                      <Badge className="bg-purple-700">VIP Access</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-2xl font-bold text-purple-200">$0.05</div>
                        <div className="text-sm text-purple-300">per CQT</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-200">50%</div>
                        <div className="text-sm text-purple-300">Bonus Tokens</div>
                      </div>
                    </div>
                    <Input
                      type="number"
                      placeholder="Enter CQT amount"
                      value={tokenAmount}
                      onChange={(e) => setTokenAmount(e.target.value)}
                      className="bg-purple-800 border-purple-600 mb-4"
                    />
                    <Button 
                      onClick={() => buyTokens('investor')} 
                      disabled={loading || !tokenAmount}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      {loading ? 'Purchasing...' : 'Purchase Tokens'}
                    </Button>
                  </CardContent>
                </Card>

                {/* Community Tier */}
                <Card className="bg-gradient-to-r from-emerald-900 to-emerald-800 border-emerald-600 card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-xl font-bold text-emerald-200">Community Tier</h4>
                        <p className="text-emerald-300">For active community members</p>
                      </div>
                      <Badge className="bg-emerald-700">Community</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-2xl font-bold text-emerald-200">$0.08</div>
                        <div className="text-sm text-emerald-300">per CQT</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-emerald-200">25%</div>
                        <div className="text-sm text-emerald-300">Bonus Tokens</div>
                      </div>
                    </div>
                    <Input
                      type="number"
                      placeholder="Enter CQT amount"
                      value={tokenAmount}
                      onChange={(e) => setTokenAmount(e.target.value)}
                      className="bg-emerald-800 border-emerald-600 mb-4"
                    />
                    <Button 
                      onClick={() => buyTokens('community')} 
                      disabled={loading || !tokenAmount}
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                    >
                      {loading ? 'Purchasing...' : 'Purchase Tokens'}
                    </Button>
                  </CardContent>
                </Card>

                {/* Public Tier */}
                <Card className="bg-gradient-to-r from-blue-900 to-blue-800 border-blue-600 card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-xl font-bold text-blue-200">Public Tier</h4>
                        <p className="text-blue-300">Open to everyone</p>
                      </div>
                      <Badge className="bg-blue-700">Public</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-2xl font-bold text-blue-200">$0.10</div>
                        <div className="text-sm text-blue-300">per CQT</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-200">10%</div>
                        <div className="text-sm text-blue-300">Bonus Tokens</div>
                      </div>
                    </div>
                    <Input
                      type="number"
                      placeholder="Enter CQT amount"
                      value={tokenAmount}
                      onChange={(e) => setTokenAmount(e.target.value)}
                      className="bg-blue-800 border-blue-600 mb-4"
                    />
                    <Button 
                      onClick={() => buyTokens('public')} 
                      disabled={loading || !tokenAmount}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      {loading ? 'Purchasing...' : 'Purchase Tokens'}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle>Sale Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Your Purchased</span>
                      <span className="font-medium">{tokenSaleData.purchased.toFixed(0)} CQT</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Vested Amount</span>
                      <span className="font-medium">{tokenSaleData.vested.toFixed(0)} CQT</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Cap</span>
                      <span className="font-medium">10M CQT</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Release Time</span>
                      <span className="font-medium">Mar 15, 2024</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle>Token Release</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-400 text-sm">
                      Your vested tokens will be released according to the vesting schedule.
                    </p>
                    <Button 
                      onClick={releaseTokens} 
                      disabled={loading}
                      className="w-full bg-primary hover:bg-primary/90"
                    >
                      {loading ? 'Releasing...' : 'Release Tokens'}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle>Your Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${tokenSaleData.isWhitelisted ? 'bg-secondary' : 'bg-gray-500'}`}></div>
                      <span className="text-sm">Whitelisted</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${tokenSaleData.isInvestor ? 'bg-purple-500' : 'bg-gray-500'}`}></div>
                      <span className="text-sm">Investor Role</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${tokenSaleData.isCommunityMember ? 'bg-emerald-500' : 'bg-gray-500'}`}></div>
                      <span className="text-sm">Community Member</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Governance Tab */}
          <TabsContent value="governance">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-slate-800 border-slate-700 card-hover">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <PlusCircle className="w-5 h-5 text-primary" />
                    <span>Create Proposal</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Proposal Title</label>
                    <Input placeholder="Enter proposal title" className="bg-slate-700 border-slate-600" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                    <Textarea 
                      rows={4} 
                      placeholder="Describe your proposal in detail..."
                      value={proposalDescription}
                      onChange={(e) => setProposalDescription(e.target.value)}
                      className="bg-slate-700 border-slate-600 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Target Contract</label>
                    <Select>
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue placeholder="Select contract" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mmorpg">MMORPG Contract</SelectItem>
                        <SelectItem value="token">Token Contract</SelectItem>
                        <SelectItem value="nft">NFT Contract</SelectItem>
                        <SelectItem value="treasury">Treasury</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    onClick={submitProposal} 
                    disabled={loading || !proposalDescription}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    {loading ? 'Submitting...' : 'Submit Proposal'}
                  </Button>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle>DAO Treasury</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="bg-slate-700 border-slate-600">
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-secondary">250K</div>
                          <div className="text-sm text-gray-400">CQT Tokens</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-slate-700 border-slate-600">
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-primary">15.8</div>
                          <div className="text-sm text-gray-400">MATIC</div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle>Game Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Active Players</span>
                      <span className="font-medium">1,247</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Guilds</span>
                      <span className="font-medium">89</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Quests Completed</span>
                      <span className="font-medium">5,432</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Items Crafted</span>
                      <span className="font-medium">2,156</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-2xl font-bold mb-6">Active Proposals</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-slate-800 border-slate-700 card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-bold text-lg">Increase Quest Rewards</h4>
                        <p className="text-gray-400 text-sm">Proposed by 0x742d...a88f</p>
                      </div>
                      <Badge className="bg-accent">Active</Badge>
                    </div>
                    <p className="text-gray-300 text-sm mb-4">
                      Increase experience rewards for completing epic quests to improve player engagement and progression.
                    </p>
                    
                    <div className="grid grid-cols-3 gap-2 mb-4 text-center text-sm">
                      <div>
                        <div className="font-bold text-secondary">156</div>
                        <div className="text-gray-400">For</div>
                      </div>
                      <div>
                        <div className="font-bold text-destructive">23</div>
                        <div className="text-gray-400">Against</div>
                      </div>
                      <div>
                        <div className="font-bold text-gray-400">12</div>
                        <div className="text-gray-400">Abstain</div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button className="flex-1 bg-secondary hover:bg-secondary/90 text-sm">
                        Vote For
                      </Button>
                      <Button className="flex-1 bg-destructive hover:bg-destructive/90 text-sm">
                        Vote Against
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700 card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-bold text-lg">New Guild Features</h4>
                        <p className="text-gray-400 text-sm">Proposed by 0x1a3b...cd45</p>
                      </div>
                      <Badge className="bg-primary">Voting</Badge>
                    </div>
                    <p className="text-gray-300 text-sm mb-4">
                      Add guild treasury and shared inventory systems to enhance cooperative gameplay.
                    </p>
                    
                    <div className="grid grid-cols-3 gap-2 mb-4 text-center text-sm">
                      <div>
                        <div className="font-bold text-secondary">89</div>
                        <div className="text-gray-400">For</div>
                      </div>
                      <div>
                        <div className="font-bold text-destructive">45</div>
                        <div className="text-gray-400">Against</div>
                      </div>
                      <div>
                        <div className="font-bold text-gray-400">8</div>
                        <div className="text-gray-400">Abstain</div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button className="flex-1 bg-secondary hover:bg-secondary/90 text-sm">
                        Vote For
                      </Button>
                      <Button className="flex-1 bg-destructive hover:bg-destructive/90 text-sm">
                        Vote Against
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* NFT Collection Tab */}
          <TabsContent value="nft-collection">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="bg-slate-800 border-slate-700 card-hover">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Plus className="w-5 h-5 text-primary" />
                    <span>Mint NFT</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">NFT Type</label>
                    <Select>
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="character">Character</SelectItem>
                        <SelectItem value="item">Item</SelectItem>
                        <SelectItem value="guild">Guild</SelectItem>
                        <SelectItem value="land">Land</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Token ID</label>
                    <Input 
                      type="number" 
                      placeholder="Enter token ID" 
                      className="bg-slate-700 border-slate-600"
                      value={nftMintData.character.tokenId}
                      onChange={(e) => setNftMintData(prev => ({
                        ...prev,
                        character: { ...prev.character, tokenId: e.target.value }
                      }))}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Metadata URI</label>
                    <Input 
                      placeholder="Enter metadata URI" 
                      className="bg-slate-700 border-slate-600"
                      value={nftMintData.character.uri}
                      onChange={(e) => setNftMintData(prev => ({
                        ...prev,
                        character: { ...prev.character, uri: e.target.value }
                      }))}
                    />
                  </div>
                  
                  <Button 
                    onClick={() => mintNFT('character')} 
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    {loading ? 'Minting...' : 'Mint NFT'}
                  </Button>
                </CardContent>
              </Card>

              <div className="lg:col-span-2">
                <h3 className="text-2xl font-bold mb-6">Your NFT Collection</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="nft-card card-hover">
                    <CardContent className="p-4">
                      <img 
                        src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=300" 
                        alt="Fantasy character with magical armor and glowing weapons" 
                        className="w-full h-48 object-cover rounded-lg mb-3" 
                      />
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold">Mystic Warrior #123</span>
                          <Badge className="bg-purple-600">Character</Badge>
                        </div>
                        <div className="text-sm text-gray-400">Elite • Fire Affinity • Legendary</div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <Card className="bg-slate-700 border-slate-600">
                            <CardContent className="p-2">
                              <div className="text-gray-400">Attack</div>
                              <div className="font-bold text-destructive">245</div>
                            </CardContent>
                          </Card>
                          <Card className="bg-slate-700 border-slate-600">
                            <CardContent className="p-2">
                              <div className="text-gray-400">Defense</div>
                              <div className="font-bold text-blue-400">189</div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="nft-card card-hover">
                    <CardContent className="p-4">
                      <img 
                        src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=300" 
                        alt="Ornate medieval sword with intricate engravings and mystical glow" 
                        className="w-full h-48 object-cover rounded-lg mb-3" 
                      />
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold">Dragonbane Sword</span>
                          <Badge className="bg-orange-600">Item</Badge>
                        </div>
                        <div className="text-sm text-gray-400">Legendary • +50 ATK • Dragon Slayer</div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <Card className="bg-slate-700 border-slate-600">
                            <CardContent className="p-2">
                              <div className="text-gray-400">Attack Bonus</div>
                              <div className="font-bold text-destructive">+50</div>
                            </CardContent>
                          </Card>
                          <Card className="bg-slate-700 border-slate-600">
                            <CardContent className="p-2">
                              <div className="text-gray-400">Mana Bonus</div>
                              <div className="font-bold text-primary">+25</div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="nft-card card-hover">
                    <CardContent className="p-4">
                      <img 
                        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=300" 
                        alt="Ethereal floating islands with waterfalls and magical energy" 
                        className="w-full h-48 object-cover rounded-lg mb-3" 
                      />
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold">Ethereal Islands</span>
                          <Badge className="bg-blue-600">Land</Badge>
                        </div>
                        <div className="text-sm text-gray-400">Mystic Realm • Resource Rich • Prime Location</div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <Card className="bg-slate-700 border-slate-600">
                            <CardContent className="p-2">
                              <div className="text-gray-400">Location</div>
                              <div className="font-bold text-primary">Sky Realm</div>
                            </CardContent>
                          </Card>
                          <Card className="bg-slate-700 border-slate-600">
                            <CardContent className="p-2">
                              <div className="text-gray-400">Type</div>
                              <div className="font-bold text-blue-400">Mystic</div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Timelock Tab */}
          <TabsContent value="timelock">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-slate-800 border-slate-700 card-hover">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-primary" />
                    <span>Timelock Operations</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Card className="bg-slate-700 border-slate-600">
                    <CardContent className="p-4">
                      <h4 className="font-bold mb-3">Schedule Operation</h4>
                      <div className="space-y-3">
                        <Input placeholder="Target contract address" className="bg-slate-600 border-slate-500 text-sm" />
                        <Input type="number" placeholder="Value (in wei)" className="bg-slate-600 border-slate-500 text-sm" />
                        <Input placeholder="Delay (in seconds)" className="bg-slate-600 border-slate-500 text-sm" />
                        <Button className="w-full bg-primary hover:bg-primary/90 text-sm">
                          Schedule Operation
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-700 border-slate-600">
                    <CardContent className="p-4">
                      <h4 className="font-bold mb-3">Execute Operation</h4>
                      <div className="space-y-3">
                        <Input 
                          placeholder="Operation ID" 
                          value={operationId}
                          onChange={(e) => setOperationId(e.target.value)}
                          className="bg-slate-600 border-slate-500 text-sm" 
                        />
                        <Button 
                          disabled={loading || !operationId}
                          className="w-full bg-secondary hover:bg-secondary/90 text-sm"
                        >
                          {loading ? 'Executing...' : 'Execute Operation'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-700 border-slate-600">
                    <CardContent className="p-4">
                      <h4 className="font-bold mb-3">Cancel Operation</h4>
                      <div className="space-y-3">
                        <Input placeholder="Operation ID" className="bg-slate-600 border-slate-500 text-sm" />
                        <Button className="w-full bg-destructive hover:bg-destructive/90 text-sm">
                          Cancel Operation
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle>Your Roles</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Proposer Role</span>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${timelockRoles.proposer ? 'bg-secondary' : 'bg-gray-500'}`}></div>
                        <span className={`text-sm font-medium ${timelockRoles.proposer ? 'text-secondary' : 'text-gray-500'}`}>
                          {timelockRoles.proposer ? 'Granted' : 'Not Granted'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Executor Role</span>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${timelockRoles.executor ? 'bg-secondary' : 'bg-gray-500'}`}></div>
                        <span className={`text-sm font-medium ${timelockRoles.executor ? 'text-secondary' : 'text-gray-500'}`}>
                          {timelockRoles.executor ? 'Granted' : 'Not Granted'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Canceller Role</span>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${timelockRoles.canceller ? 'bg-secondary' : 'bg-gray-500'}`}></div>
                        <span className={`text-sm font-medium ${timelockRoles.canceller ? 'text-secondary' : 'text-gray-500'}`}>
                          {timelockRoles.canceller ? 'Granted' : 'Not Granted'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle>Pending Operations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Card className="bg-slate-700 border-slate-600">
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="font-medium text-sm">0x1a2b...c3d4</div>
                          <Badge className="bg-accent">Pending</Badge>
                        </div>
                        <div className="text-xs text-gray-400 mb-1">Target: 0x251a...290f</div>
                        <div className="text-xs text-gray-400">Ready: Mar 20, 2024 10:30 AM</div>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-700 border-slate-600">
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="font-medium text-sm">0x5e6f...g7h8</div>
                          <Badge className="bg-secondary">Ready</Badge>
                        </div>
                        <div className="text-xs text-gray-400 mb-1">Target: 0x126d...4a4e</div>
                        <div className="text-xs text-gray-400">Ready: Now</div>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Staking Tab */}
          <TabsContent value="staking">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-slate-800 border-slate-700 card-hover">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-secondary" />
                    <span>Stake CQT Tokens</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Card className="bg-slate-700 border-slate-600">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400">Your CQT Balance</span>
                        <span className="font-bold text-lg">{parseFloat(tokenBalance).toFixed(0)} CQT</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Currently Staked</span>
                        <span className="font-bold text-secondary">{stakedBalance} CQT</span>
                      </div>
                    </CardContent>
                  </Card>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Amount to Stake</label>
                    <div className="relative">
                      <Input 
                        type="number" 
                        placeholder="Enter amount" 
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(e.target.value)}
                        className="bg-slate-700 border-slate-600 pr-16" 
                      />
                      <Button 
                        onClick={() => setStakeAmount(tokenBalance)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary px-3 py-1 h-auto text-xs font-medium"
                      >
                        MAX
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      onClick={stakeTokens} 
                      disabled={loading || !stakeAmount}
                      className="bg-secondary hover:bg-secondary/90"
                    >
                      {loading ? 'Staking...' : 'Stake Tokens'}
                    </Button>
                    <Button className="bg-slate-600 hover:bg-slate-500">
                      Unstake
                    </Button>
                  </div>

                  <Card className="bg-slate-700 border-slate-600">
                    <CardContent className="p-4">
                      <h4 className="font-bold mb-2">Staking Rewards</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">APY</span>
                          <span className="font-medium text-secondary">12.5%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Pending Rewards</span>
                          <span className="font-medium">23.4 CQT</span>
                        </div>
                        <Button className="w-full bg-accent hover:bg-accent/90 text-sm mt-3">
                          Claim Rewards
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle>Staking Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="bg-slate-700 border-slate-600">
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-secondary">2.5M</div>
                          <div className="text-sm text-gray-400">Total Staked</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-slate-700 border-slate-600">
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-primary">1,247</div>
                          <div className="text-sm text-gray-400">Total Stakers</div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle>Your Staking History</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-slate-700 last:border-b-0">
                      <div>
                        <div className="font-medium text-sm">Staked</div>
                        <div className="text-xs text-gray-400">Mar 15, 2024</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-secondary">+500 CQT</div>
                        <div className="text-xs text-gray-400">0x1a2b...c3d4</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-slate-700 last:border-b-0">
                      <div>
                        <div className="font-medium text-sm">Rewards Claimed</div>
                        <div className="text-xs text-gray-400">Mar 10, 2024</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-accent">+15.2 CQT</div>
                        <div className="text-xs text-gray-400">0x5e6f...g7h8</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-slate-700 last:border-b-0">
                      <div>
                        <div className="font-medium text-sm">Staked</div>
                        <div className="text-xs text-gray-400">Mar 5, 2024</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-secondary">+250 CQT</div>
                        <div className="text-xs text-gray-400">0x9i0j...k1l2</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <Toaster />
    </div>
  );
}

export default CryptoQuestDApp;
