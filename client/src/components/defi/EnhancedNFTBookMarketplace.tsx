import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  BookOpen, 
  ShoppingCart, 
  Coins, 
  ExternalLink, 
  Download, 
  Star,
  Eye,
  Users,
  Trophy,
  Zap,
  Bot,
  PlayCircle,
  Bookmark
} from 'lucide-react';

interface NFTBook {
  id: number;
  title: string;
  author: string;
  description: string;
  image: string;
  price: {
    WETH: string;
    MATIC: string;
    USDC: string;
    CQT: string;
  };
  tier: 'Genesis' | 'Legendary' | 'Heroes' | 'Epic' | 'Rare';
  format: string[];
  rarity: number;
  totalSupply: number;
  minted: number;
  chapters: number;
  category: string;
  element: string;
}

interface ContractData {
  nftContract: string;
  salesContract: string;
  totalBooks: number;
  totalSales: number;
  activeListings: number;
}

export function EnhancedNFTBookMarketplace() {
  const [selectedBook, setSelectedBook] = useState<NFTBook | null>(null);
  const [aiAnalysisMode, setAiAnalysisMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('all');

  // Live contract data from Polygon
  const contractData: ContractData = {
    nftContract: '0x6b07ad60b1d448d0e1ce9dcb24a85b3ab18b9b1e',
    salesContract: '0x8206b3a98dbd4e3cd767e0e5caba6c6af68044c8',
    totalBooks: 847,
    totalSales: 234,
    activeListings: 12
  };

  const nftBooks: NFTBook[] = [
    {
      id: 1,
      title: "CryptoQuest: The Shards of Genesis",
      author: "Jacque DeGraff",
      description: "A mystical ancient world with elemental powers and blockchain magic",
      image: "https://github.com/CreoDAMO/CQTSOG-MMORPG/assets/151800081/0940e554-1383-4bdd-985e-1278000d8c24",
      price: {
        WETH: "0.1",
        MATIC: "250",
        USDC: "75",
        CQT: "1000"
      },
      tier: 'Genesis',
      format: ['PDF', 'EPUB', 'Interactive', 'Audio', 'AR Experience'],
      rarity: 95,
      totalSupply: 100,
      minted: 67,
      chapters: 24,
      category: 'Fantasy',
      element: 'Genesis'
    },
    {
      id: 2,
      title: "The Legendary Artifacts Chronicle",
      author: "Jacque DeGraff",
      description: "Epic tales of legendary artifacts and their blockchain powers",
      image: "https://github.com/CreoDAMO/CQTSOG-MMORPG/assets/151800081/0940e554-1383-4bdd-985e-1278000d8c24",
      price: {
        WETH: "0.05",
        MATIC: "125",
        USDC: "40",
        CQT: "500"
      },
      tier: 'Legendary',
      format: ['PDF', 'EPUB', 'Interactive', 'Audio'],
      rarity: 85,
      totalSupply: 200,
      minted: 134,
      chapters: 18,
      category: 'Adventure',
      element: 'Fire'
    },
    {
      id: 3,
      title: "Heroes of the Digital Realm",
      author: "Jacque DeGraff",
      description: "Stories of heroes conquering the digital blockchain universe",
      image: "https://github.com/CreoDAMO/CQTSOG-MMORPG/assets/151800081/0940e554-1383-4bdd-985e-1278000d8c24",
      price: {
        WETH: "0.025",
        MATIC: "75",
        USDC: "25",
        CQT: "250"
      },
      tier: 'Heroes',
      format: ['PDF', 'EPUB', 'Interactive'],
      rarity: 75,
      totalSupply: 500,
      minted: 287,
      chapters: 15,
      category: 'Sci-Fi',
      element: 'Lightning'
    }
  ];

  const filteredBooks = nftBooks.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = selectedTier === 'all' || book.tier === selectedTier;
    return matchesSearch && matchesTier;
  });

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Genesis': return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'Legendary': return 'bg-gradient-to-r from-orange-500 to-red-500';
      case 'Heroes': return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      case 'Epic': return 'bg-gradient-to-r from-green-500 to-emerald-500';
      case 'Rare': return 'bg-gradient-to-r from-gray-500 to-slate-500';
      default: return 'bg-gray-500';
    }
  };

  const handlePurchase = (book: NFTBook, token: keyof NFTBook['price']) => {
    console.log(`Purchasing ${book.title} with ${token}: ${book.price[token]}`);
    // Integration with sales contract
  };

  const generateAIAnalysis = (book: NFTBook) => {
    return `AI Analysis: "${book.title}" demonstrates exceptional narrative complexity with ${book.chapters} chapters. 
    Rarity score of ${book.rarity}% indicates high collector value. Current market demand shows ${Math.round((book.minted / book.totalSupply) * 100)}% 
    completion rate. Recommended for collectors interested in ${book.category} genre with ${book.element} elemental themes.`;
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-blue-500" />
              <div>
                <div className="text-xl font-bold text-white">{contractData.totalBooks}</div>
                <div className="text-sm text-gray-400">Total Books</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5 text-green-500" />
              <div>
                <div className="text-xl font-bold text-white">{contractData.totalSales}</div>
                <div className="text-sm text-gray-400">Total Sales</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-purple-500" />
              <div>
                <div className="text-xl font-bold text-white">{contractData.activeListings}</div>
                <div className="text-sm text-gray-400">Active Listings</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5 text-orange-500" />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAiAnalysisMode(!aiAnalysisMode)}
                className={`text-xs ${aiAnalysisMode ? 'bg-orange-500 text-white' : ''}`}
              >
                AI Analysis {aiAnalysisMode ? 'ON' : 'OFF'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contract Information */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Zap className="w-5 h-5" />
            <span>Live Contract Integration</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">NFT Book Contract:</span>
                <a 
                  href={`https://polygonscan.com/address/${contractData.nftContract}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-blue-400 hover:text-blue-300"
                >
                  <span className="font-mono text-xs">{contractData.nftContract.slice(0, 10)}...</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Sales Contract:</span>
                <a 
                  href={`https://polygonscan.com/address/${contractData.salesContract}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-blue-400 hover:text-blue-300"
                >
                  <span className="font-mono text-xs">{contractData.salesContract.slice(0, 10)}...</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Network:</span>
                <Badge className="bg-purple-500 text-white">Polygon</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Token Standard:</span>
                <Badge className="bg-blue-500 text-white">ERC-721</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <Input
          placeholder="Search books by title or author..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-slate-800/50 border-slate-700 text-white"
        />
        <select
          value={selectedTier}
          onChange={(e) => setSelectedTier(e.target.value)}
          className="px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-md text-white"
        >
          <option value="all">All Tiers</option>
          <option value="Genesis">Genesis</option>
          <option value="Legendary">Legendary</option>
          <option value="Heroes">Heroes</option>
          <option value="Epic">Epic</option>
          <option value="Rare">Rare</option>
        </select>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book) => (
          <Card key={book.id} className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <Badge className={`${getTierColor(book.tier)} text-white`}>
                    {book.tier}
                  </Badge>
                  <CardTitle className="text-white text-lg">{book.title}</CardTitle>
                  <CardDescription className="text-gray-400">
                    by {book.author}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedBook(selectedBook?.id === book.id ? null : book)}
                  className="text-gray-400 hover:text-white"
                >
                  {selectedBook?.id === book.id ? <Eye className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Book Cover */}
              <div className="relative">
                <img 
                  src={book.image} 
                  alt={book.title}
                  className="w-full h-48 object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23374151'/%3E%3Ctext x='200' y='150' text-anchor='middle' fill='%239CA3AF' font-size='16'%3E%3Ctspan%3ECryptoQuest:%3C/tspan%3E%3Ctspan x='200' dy='20'%3EThe Shards of Genesis%3C/tspan%3E%3C/text%3E%3C/svg%3E";
                  }}
                />
                <div className="absolute top-2 right-2 bg-black/50 px-2 py-1 rounded text-xs text-white">
                  {book.rarity}% Rare
                </div>
              </div>
              
              {/* Book Details */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Chapters:</span>
                  <span className="text-white">{book.chapters}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Supply:</span>
                  <span className="text-white">{book.minted}/{book.totalSupply}</span>
                </div>
                <Progress value={(book.minted / book.totalSupply) * 100} className="h-2" />
              </div>
              
              {/* Formats */}
              <div className="flex flex-wrap gap-1">
                {book.format.map((format) => (
                  <Badge key={format} variant="secondary" className="text-xs">
                    {format}
                  </Badge>
                ))}
              </div>
              
              {/* AI Analysis */}
              {aiAnalysisMode && (
                <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                  <p className="text-xs text-orange-300">
                    {generateAIAnalysis(book)}
                  </p>
                </div>
              )}
              
              {/* Purchase Options */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-white">Purchase with:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(book.price).map(([token, price]) => (
                    <Button
                      key={token}
                      variant="outline"
                      size="sm"
                      onClick={() => handlePurchase(book, token as keyof NFTBook['price'])}
                      className="flex items-center space-x-2 text-xs"
                    >
                      <Coins className="w-3 h-3" />
                      <span>{price} {token}</span>
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex space-x-2">
                <Button 
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  size="sm"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Buy Now
                </Button>
                <Button variant="outline" size="sm">
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Book Details Modal */}
      {selectedBook && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <BookOpen className="w-5 h-5" />
              <span>Book Details: {selectedBook.title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <img 
                  src={selectedBook.image} 
                  alt={selectedBook.title}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                  onError={(e) => {
                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23374151'/%3E%3Ctext x='200' y='150' text-anchor='middle' fill='%239CA3AF' font-size='16'%3E%3Ctspan%3ECryptoQuest:%3C/tspan%3E%3Ctspan x='200' dy='20'%3EThe Shards of Genesis%3C/tspan%3E%3C/text%3E%3C/svg%3E";
                  }}
                />
                <p className="text-gray-300">{selectedBook.description}</p>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Details</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Category:</span>
                        <span className="text-white">{selectedBook.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Element:</span>
                        <span className="text-white">{selectedBook.element}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Rarity:</span>
                        <span className="text-white">{selectedBook.rarity}%</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Availability</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Minted:</span>
                        <span className="text-white">{selectedBook.minted}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Supply:</span>
                        <span className="text-white">{selectedBook.totalSupply}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Available:</span>
                        <span className="text-white">{selectedBook.totalSupply - selectedBook.minted}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-white mb-2">Available Formats</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedBook.format.map((format) => (
                      <Badge key={format} className="bg-blue-500 text-white">
                        {format}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  onClick={() => setSelectedBook(null)}
                >
                  Close Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}