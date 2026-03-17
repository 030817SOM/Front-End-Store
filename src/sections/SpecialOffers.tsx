import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, ArrowRight } from 'lucide-react';
import { products } from '@/data/products';
import { useCartStore } from '@/store/cartStore';
import { toast } from 'sonner';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function SpecialOffers() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59,
  });
  const addItem = useCartStore((state) => state.addItem);

  const flashSaleProduct = products[0]; // Nexus X1 Sneakers

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.offer-card',
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleAddToCart = () => {
    addItem(flashSaleProduct);
    toast.success(`${flashSaleProduct.name} added to cart!`);
  };

  return (
    <section ref={sectionRef} className="relative py-20 lg:py-32 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Flash Sale Card */}
          <div className="offer-card relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-500/30 p-8 lg:p-12">
            {/* Background effects */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-500/20 rounded-full blur-[60px]" />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/50">
                  Flash Sale
                </Badge>
              </div>

              <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                {flashSaleProduct.name}
              </h3>

              <p className="text-white/60 mb-6 max-w-md">
                Limited time offer on our bestselling futuristic sneakers. Don't miss out!
              </p>

              {/* Countdown */}
              <div className="flex gap-4 mb-8">
                {[
                  { value: timeLeft.hours, label: 'Hours' },
                  { value: timeLeft.minutes, label: 'Mins' },
                  { value: timeLeft.seconds, label: 'Secs' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="w-16 h-16 lg:w-20 lg:h-20 rounded-xl bg-black/40 border border-white/10 flex flex-col items-center justify-center"
                  >
                    <span className="text-2xl lg:text-3xl font-bold text-white">
                      {item.value.toString().padStart(2, '0')}
                    </span>
                    <span className="text-xs text-white/50">{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Price */}
              <div className="flex items-center gap-4 mb-8">
                <span className="text-4xl lg:text-5xl font-bold text-gradient">
                  R{flashSaleProduct.price}
                </span>
                <span className="text-2xl text-white/40 line-through">
                  R{flashSaleProduct.originalPrice}
                </span>
                <Badge className="bg-red-500/20 text-red-300 border-red-500/50">
                  -15%
                </Badge>
              </div>

              <Button
                size="lg"
                onClick={handleAddToCart}
                className="h-14 px-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 group"
              >
                Grab the Deal
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Product image */}
            <div className="absolute -right-8 -bottom-8 w-64 h-64 lg:w-80 lg:h-80 opacity-80">
              <img
                src={flashSaleProduct.image}
                alt={flashSaleProduct.name}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Bundle Offer Card */}
          <div className="offer-card relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-900/50 to-blue-900/50 border border-cyan-500/30 p-8 lg:p-12">
            {/* Background effects */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-500/20 rounded-full blur-[60px]" />

            <div className="relative z-10">
              <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/50 mb-6">
                Bundle Deal
              </Badge>

              <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Cyber Starter Pack
              </h3>

              <p className="text-white/60 mb-8 max-w-md">
                Get the complete cyberpunk look with our exclusive bundle. Save big on glasses, watch, and earbuds.
              </p>

              {/* Bundle items */}
              <div className="flex gap-4 mb-8">
                {[products[1], products[3], products[4]].map((product) => (
                  <div
                    key={product.id}
                    className="w-20 h-20 lg:w-24 lg:h-24 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center p-2"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ))}
              </div>

              {/* Price */}
              <div className="flex items-center gap-4 mb-8">
                <span className="text-4xl lg:text-5xl font-bold text-gradient">
                  R499
                </span>
                <span className="text-2xl text-white/40 line-through">
                  R597
                </span>
                <Badge className="bg-green-500/20 text-green-300 border-green-500/50">
                  Save R98
                </Badge>
              </div>

              <Button
                size="lg"
                onClick={() => {
                  [products[1], products[3], products[4]].forEach((p) => addItem(p));
                  toast.success('Bundle added to cart!');
                }}
                className="h-14 px-8 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold hover:opacity-90 group"
              >
                Get the Bundle
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
