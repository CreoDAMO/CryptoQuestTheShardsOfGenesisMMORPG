import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Plus, Minus, CreditCard, Package, Shirt, Coffee } from 'lucide-react';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

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

interface StripePaymentIntent {
  paymentIntentId: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'requires_capture' | 'canceled' | 'succeeded';
  clientSecret: string;
  description: string;
}

function CheckoutForm({ cartItems, total }: { cartItems: CartItem[]; total: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentIntent, setPaymentIntent] = useState<StripePaymentIntent | null>(null);
  const { toast } = useToast();

  const createPaymentMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/stripe/merch/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          items: cartItems,
          userEmail: 'user@cryptoquest.com' // Replace with actual user email
        })
      });
      if (!response.ok) throw new Error('Failed to create payment');
      return response.json();
    },
    onSuccess: (data) => {
      setPaymentIntent(data);
    },
    onError: () => {
      toast({
        title: "Payment Error",
        description: "Failed to create payment",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (!paymentIntent) {
      createPaymentMutation.mutate();
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmCardPayment(paymentIntent.clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)!,
        billing_details: {
          email: 'user@cryptoquest.com',
        },
      }
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Order Confirmed!",
        description: "Your CryptoQuest merchandise is on the way",
      });
      // Clear cart on success
      window.location.reload();
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Order Summary</h3>
        <div className="text-2xl font-bold">${total.toFixed(2)}</div>
        <div className="text-sm text-muted-foreground">
          {cartItems.reduce((sum, item) => sum + item.quantity, 0)} items
        </div>
      </div>

      {!paymentIntent ? (
        <Button 
          type="submit" 
          className="w-full"
          disabled={createPaymentMutation.isPending || cartItems.length === 0}
        >
          {createPaymentMutation.isPending ? 'Creating Payment...' : 'Proceed to Payment'}
        </Button>
      ) : (
        <>
          <div className="p-4 border rounded-lg bg-background">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                },
              }}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full"
            disabled={!stripe || isProcessing}
          >
            {isProcessing ? 'Processing Payment...' : `Pay $${total.toFixed(2)}`}
          </Button>
        </>
      )}
    </form>
  );
}

function MerchItemCard({ 
  item, 
  onAddToCart, 
  cartItem, 
  onUpdateQuantity 
}: { 
  item: MerchItem;
  onAddToCart: (itemId: string, variant?: any) => void;
  cartItem?: CartItem;
  onUpdateQuantity: (itemId: string, variant: any, quantity: number) => void;
}) {
  const [selectedVariants, setSelectedVariants] = useState<any>({});

  const handleAddToCart = () => {
    onAddToCart(item.id, selectedVariants);
  };

  const isInCart = cartItem && JSON.stringify(cartItem.variant) === JSON.stringify(selectedVariants);
  const cartQuantity = isInCart ? cartItem.quantity : 0;

  return (
    <Card className="bg-card/60 backdrop-blur border-border/50 transition-all duration-300 hover:scale-105">
      <div className="aspect-square bg-gradient-to-br from-purple-400 to-blue-400 rounded-t-lg flex items-center justify-center">
        <span className="text-white text-4xl font-bold">CQ</span>
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
        {item.variants && (
          <div className="space-y-3 mb-4">
            {item.variants.size && (
              <div>
                <label className="text-sm font-medium">Size</label>
                <Select 
                  value={selectedVariants.size || ''} 
                  onValueChange={(value) => setSelectedVariants((prev: any) => ({ ...prev, size: value }))}
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
                  onValueChange={(value) => setSelectedVariants((prev: any) => ({ ...prev, color: value }))}
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

export function StripeMerchStore() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCheckout, setShowCheckout] = useState(false);
  const { toast } = useToast();

  const { data: merchItems = [], isLoading: itemsLoading } = useQuery({
    queryKey: ['/api/stripe/merch'],
    queryFn: async () => {
      const response = await fetch('/api/stripe/merch');
      if (!response.ok) throw new Error('Failed to fetch merchandise');
      return response.json();
    }
  });

  const addToCart = (itemId: string, variant?: { size?: string; color?: string }) => {
    setCart((prev: CartItem[]) => {
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
      setCart((prev: CartItem[]) => prev.filter(item => 
        !(item.itemId === itemId && JSON.stringify(item.variant) === JSON.stringify(variant))
      ));
    } else {
      setCart((prev: CartItem[]) => prev.map(item =>
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

  if (showCheckout) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setShowCheckout(false)}>
            ← Back to Store
          </Button>
          <h2 className="text-2xl font-bold">Checkout</h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="bg-card/60 backdrop-blur border-border/50">
            <CardHeader>
              <CardTitle>Your Order</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cart.map((cartItem, index) => {
                  const item = merchItems.find((m: MerchItem) => m.id === cartItem.itemId);
                  if (!item) return null;
                  
                  return (
                    <div key={index} className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Qty: {cartItem.quantity} × ${item.price}
                        </div>
                        {cartItem.variant && (
                          <div className="text-xs text-muted-foreground">
                            {Object.entries(cartItem.variant).map(([key, value]) => 
                              `${key}: ${value}`
                            ).join(', ')}
                          </div>
                        )}
                      </div>
                      <div className="font-bold">
                        ${(item.price * cartItem.quantity).toFixed(2)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/60 backdrop-blur border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Elements stripe={stripePromise}>
                <CheckoutForm cartItems={cart} total={getCartTotal()} />
              </Elements>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">CryptoQuest Store</h2>
          <p className="text-muted-foreground">
            Premium merchandise with secure Stripe payments
          </p>
        </div>
        
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
                onClick={() => setShowCheckout(true)}
                disabled={cart.length === 0}
              >
                Checkout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

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

      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-400" />
            Secure Stripe Checkout
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">🔒</div>
              <div className="text-sm font-medium">Secure Payment</div>
              <div className="text-xs text-muted-foreground">Bank-level security</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">🌍</div>
              <div className="text-sm font-medium">Global Shipping</div>
              <div className="text-xs text-muted-foreground">Worldwide delivery</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">💳</div>
              <div className="text-sm font-medium">All Cards Accepted</div>
              <div className="text-xs text-muted-foreground">Visa, Mastercard, Amex</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">⚡</div>
              <div className="text-sm font-medium">Fast Processing</div>
              <div className="text-xs text-muted-foreground">Instant confirmation</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}