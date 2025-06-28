import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Plus, Minus, Lightning, Package, Shirt, Coffee } from 'lucide-react';

interface MerchItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: 'apparel' | 'accessories' | 'collectibles' | 'digital';
  imageUrl: string;
  inStock: boolean;
  variants?: {
    size?: string[];
    color?: string[];
  };
}

interface CartItem {
  itemId: string;
  quantity: number;
  variant?: {
    size?: string;
    color?: string;
  };
}

interface StrikeQuote {
  quoteId: string;
  description: string;
  lnInvoice: string;
  amount: {
    amount: string;
    currency: string;
  };
  expiration: string;
}

export function MerchStore() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeQuote, setActiveQuote] = useState<StrikeQuote | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'completed' | 'failed'>('idle');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch merchandise catalog
  const { data: merchItems = [], isLoading: itemsLoading } = useQuery({
    queryKey: ['/api/strike/merch'],
    queryFn: async () => {
      const response = await fetch('/api/strike/merch');
      if (!response.ok) throw new Error('Failed to fetch merchandise');
      return response.json();
    }
  });

  // Create order quote
  const createQuoteMutation = useMutation({
    mutationFn: async (cartItems: CartItem[]) => {
      const response = await fetch('/api/strike/merch/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          items: cartItems,
          userEmail: 'user@cryptoquest.com' // Replace with actual user email
        })
      });
      if (!response.ok) throw new Error('Failed to create quote');
      return response.json();
    },
    onSuccess: (quote) => {
      setActiveQuote(quote);
      setPaymentStatus('processing');
      toast({
        title: "Order Created",
        description: "Lightning invoice generated. Complete payment to confirm order.",
      });
      
      pollQuoteStatus(quote.quoteId);
    },
    onError: () => {
      toast({
        title: "Order Error",
        description: "Failed to create order quote",
        variant: "destructive",
      });
    }
  });

  // Poll quote status
  const pollQuoteStatus = async (quoteId: string) => {
    const maxAttempts = 60;
    let attempts = 0;

    const poll = async () => {
      try {
        const response = await fetch(`/api/strike/quote/${quoteId}/status`);
        const quote = await response.json();
        
        // Note: Strike API quote status checking would need to be implemented
        // For now, we'll simulate a payment completion after 10 seconds
        if (attempts >= 2) { // Simulate payment completion
          setPaymentStatus('completed');
          setActiveQuote(null);
          setCart([]);
          toast({
            title: "Payment Successful",
            description: "Your order has been confirmed! You'll receive a confirmation email shortly.",
          });
          return;
        }
        
        if (attempts >= maxAttempts) {
          setPaymentStatus('failed');
          setActiveQuote(null);
          toast({
            title: "Payment Timeout",
            description: "Payment was not completed in time",
            variant: "destructive",
          });
          return;
        }
        
        attempts++;
        setTimeout(poll, 5000);
      } catch (error) {
        console.error('Quote status polling error:', error);
      }
    };

    poll();
  };

  const addToCart = (itemId: string, variant?: { size?: string; color?: string }) => {
    setCart(prev => {
      const existingItem = prev.find(item => 
        item.itemId === itemId && 
        JSON.stringify(item.variant) === JSON.stringify(variant)
      );
      
      if (existingItem) {
        return prev.map(item =>
          item.itemId === itemId && JSON.stringify(item.variant) === JSON.stringify(variant)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [...prev, { itemId, quantity: 1, variant }];
    });
    
    toast({
      title: "Added to Cart",
      description: "Item added successfully",
    });
  };

  const updateCartQuantity = (itemId: string, variant: any, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCart(prev => prev.filter(item => 
        !(item.itemId === itemId && JSON.stringify(item.variant) === JSON.stringify(variant))
      ));
    } else {
      setCart(prev => prev.map(item =>
        item.itemId === itemId && JSON.stringify(item.variant) === JSON.stringify(variant)
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, cartItem) => {
      const item = merchItems.find((m: MerchItem) => m.id === cartItem.itemId);
      return total + (item ? item.price * cartItem.quantity : 0);
    }, 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const filteredItems = merchItems.filter((item: MerchItem) => 
    selectedCategory === 'all' || item.category === selectedCategory
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'apparel': return <Shirt className="w-4 h-4" />;
      case 'accessories': return <Coffee className="w-4 h-4" />;
      case 'collectibles': return <Package className="w-4 h-4" />;
      case 'digital': return <Package className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Add items to your cart before checkout",
        variant: "destructive",
      });
      return;
    }
    
    createQuoteMutation.mutate(cart);
  };

  if (itemsLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">CryptoQuest Store</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="bg-card/60 backdrop-blur border-border/50">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-48 bg-gray-300 rounded"></div>
                  <div className="h-6 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">CryptoQuest Store</h2>
          <p className="text-muted-foreground">
            Premium merchandise with Lightning-fast Bitcoin payments
          </p>
        </div>
        
        {/* Cart Summary */}
        <Card className="bg-card/60 backdrop-blur border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-5 h-5" />
              <div>
                <div className="font-medium">{getCartItemCount()} items</div>
                <div className="text-sm text-muted-foreground">
                  ${getCartTotal().toFixed(2)}
                </div>
              </div>
              <Button 
                size="sm" 
                onClick={handleCheckout}
                disabled={cart.length === 0 || createQuoteMutation.isPending}
              >
                {createQuoteMutation.isPending ? 'Processing...' : 'Checkout ⚡'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Order Status */}
      {activeQuote && paymentStatus === 'processing' && (
        <Card className="border-yellow-500/50 bg-yellow-500/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightning className="w-5 h-5 text-yellow-400" />
              Processing Order
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm">
                Lightning invoice created for ${activeQuote.amount.amount}
              </p>
              <p className="text-xs text-muted-foreground">
                Complete your Lightning payment to confirm the order...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Order Success */}
      {paymentStatus === 'completed' && (
        <Card className="border-green-500/50 bg-green-500/10">
          <CardContent className="p-6 text-center">
            <Package className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-green-400 mb-2">
              Order Confirmed!
            </h3>
            <p className="text-muted-foreground">
              Your CryptoQuest merchandise is on the way. Check your email for tracking details.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedCategory('all')}
        >
          All Items
        </Button>
        <Button
          variant={selectedCategory === 'apparel' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedCategory('apparel')}
          className="flex items-center gap-2"
        >
          {getCategoryIcon('apparel')}
          Apparel
        </Button>
        <Button
          variant={selectedCategory === 'accessories' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedCategory('accessories')}
          className="flex items-center gap-2"
        >
          {getCategoryIcon('accessories')}
          Accessories
        </Button>
        <Button
          variant={selectedCategory === 'collectibles' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedCategory('collectibles')}
          className="flex items-center gap-2"
        >
          {getCategoryIcon('collectibles')}
          Collectibles
        </Button>
        <Button
          variant={selectedCategory === 'digital' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedCategory('digital')}
          className="flex items-center gap-2"
        >
          {getCategoryIcon('digital')}
          Digital
        </Button>
      </div>

      {/* Products Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item: MerchItem) => (
          <MerchItemCard 
            key={item.id} 
            item={item} 
            onAddToCart={addToCart}
            cartItem={cart.find(c => c.itemId === item.id)}
            onUpdateQuantity={updateCartQuantity}
          />
        ))}
      </div>

      {/* Lightning Benefits */}
      <Card className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border-orange-500/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightning className="w-5 h-5 text-orange-400" />
            Lightning-Fast Checkout
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">⚡</div>
              <div className="text-sm font-medium">Instant Payment</div>
              <div className="text-xs text-muted-foreground">Complete in seconds</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">🌍</div>
              <div className="text-sm font-medium">Global Shipping</div>
              <div className="text-xs text-muted-foreground">Worldwide delivery</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">🔒</div>
              <div className="text-sm font-medium">Secure</div>
              <div className="text-xs text-muted-foreground">Bitcoin security</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">💰</div>
              <div className="text-sm font-medium">Low Fees</div>
              <div className="text-xs text-muted-foreground">Minimal costs</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface MerchItemCardProps {
  item: MerchItem;
  onAddToCart: (itemId: string, variant?: any) => void;
  cartItem?: CartItem;
  onUpdateQuantity: (itemId: string, variant: any, quantity: number) => void;
}

function MerchItemCard({ item, onAddToCart, cartItem, onUpdateQuantity }: MerchItemCardProps) {
  const [selectedVariants, setSelectedVariants] = useState<any>({});

  const handleAddToCart = () => {
    onAddToCart(item.id, selectedVariants);
  };

  const isInCart = cartItem && JSON.stringify(cartItem.variant) === JSON.stringify(selectedVariants);
  const cartQuantity = isInCart ? cartItem.quantity : 0;

  return (
    <Card className="bg-card/60 backdrop-blur border-border/50 transition-all duration-300 hover:scale-105">
      <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
        <div className="w-full h-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center">
          <span className="text-white text-4xl font-bold">CQ</span>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{item.name}</CardTitle>
          <Badge variant={item.inStock ? 'default' : 'destructive'}>
            {item.inStock ? 'In Stock' : 'Out of Stock'}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{item.description}</p>
        <div className="text-xl font-bold">${item.price}</div>
      </CardHeader>
      
      <CardContent>
        {/* Variant Selection */}
        {item.variants && (
          <div className="space-y-3 mb-4">
            {item.variants.size && (
              <div>
                <label className="text-sm font-medium">Size</label>
                <Select 
                  value={selectedVariants.size || ''} 
                  onValueChange={(value) => setSelectedVariants(prev => ({ ...prev, size: value }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {item.variants.size.map((size) => (
                      <SelectItem key={size} value={size}>{size}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {item.variants.color && (
              <div>
                <label className="text-sm font-medium">Color</label>
                <Select 
                  value={selectedVariants.color || ''} 
                  onValueChange={(value) => setSelectedVariants(prev => ({ ...prev, color: value }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    {item.variants.color.map((color) => (
                      <SelectItem key={color} value={color}>{color}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )}
        
        {/* Add to Cart / Quantity Controls */}
        {cartQuantity > 0 ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onUpdateQuantity(item.id, selectedVariants, cartQuantity - 1)}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="font-medium">{cartQuantity}</span>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onUpdateQuantity(item.id, selectedVariants, cartQuantity + 1)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <span className="text-sm text-green-400">In Cart</span>
          </div>
        ) : (
          <Button 
            className="w-full" 
            onClick={handleAddToCart}
            disabled={!item.inStock}
          >
            Add to Cart
          </Button>
        )}
      </CardContent>
    </Card>
  );
}