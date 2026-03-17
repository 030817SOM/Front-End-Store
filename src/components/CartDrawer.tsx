import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/store/cartStore';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';


export function CartDrawer() {
  const { items, isOpen, setCartOpen, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();
  const totalPrice = getTotalPrice();

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    toast.success('Checkout coming soon!', {
      description: 'This is a demo store. Thank you for testing!',
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={setCartOpen}>
      <SheetContent className="w-full sm:max-w-lg bg-[#0F0F0F] border-l border-white/10 flex flex-col">
        <SheetHeader className="space-y-2.5 pb-4">
          <SheetTitle className="text-white text-2xl font-semibold flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-purple-500" />
            Your Cart
            <span className="text-sm font-normal text-white/50 ml-auto">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </span>
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <ShoppingBag className="w-12 h-12 text-white/30" />
            </div>
            <h3 className="text-white text-xl font-semibold mb-2">Your cart is empty</h3>
            <p className="text-white/50 mb-6">Add some items to get started</p>
            <Button
              onClick={() => setCartOpen(false)}
              className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white hover:opacity-90"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-colors"
                  >
                    <div className="w-20 h-20 rounded-lg bg-white/5 flex items-center justify-center overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain p-2"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium truncate">{item.name}</h4>
                      <p className="text-white/50 text-sm">{item.category}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-cyan-400 font-semibold">R{item.price}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                          >
                            <Minus className="w-3 h-3 text-white" />
                          </button>
                          <span className="text-white text-sm w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                          >
                            <Plus className="w-3 h-3 text-white" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        removeItem(item.id);
                        toast.success('Item removed from cart');
                      }}
                      className="text-white/30 hover:text-red-500 transition-colors self-start"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="pt-4 mt-4 border-t border-white/10 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/50">Subtotal</span>
                <span className="text-white">R{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/50">Shipping</span>
                <span className="text-cyan-400">Free</span>
              </div>
              <Separator className="bg-white/10" />
              <div className="flex items-center justify-between">
                <span className="text-white font-semibold">Total</span>
                <span className="text-2xl font-bold text-gradient">R{totalPrice.toFixed(2)}</span>
              </div>
              <Button
                onClick={handleCheckout}
                className="w-full h-12 bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500 text-white font-semibold text-lg hover:opacity-90 transition-opacity"
              >
                Checkout
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCartOpen(false)}
                  className="flex-1 border-white/20 text-white hover:bg-white/10"
                >
                  Continue Shopping
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    clearCart();
                    toast.success('Cart cleared');
                  }}
                  className="border-white/20 text-red-400 hover:bg-red-500/10 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
