import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { products } from '@/data/products';
import { useCartStore } from '@/store/cartStore';
import { toast } from 'sonner';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function FeaturedProducts() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  const featuredProducts = products.slice(0, 6);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title reveal animation
      gsap.fromTo(
        titleRef.current,
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Cards deal animation
      const cards = scrollContainerRef.current?.querySelectorAll('.product-card');
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 100, opacity: 0, rotateZ: (i) => (i % 2 === 0 ? -5 : 5) },
          {
            y: 0,
            opacity: 1,
            rotateZ: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'back.out(1.2)',
            scrollTrigger: {
              trigger: scrollContainerRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const checkScrollButtons = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', checkScrollButtons, { passive: true });
    checkScrollButtons();

    return () => container.removeEventListener('scroll', checkScrollButtons);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 320;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const handleAddToCart = (product: typeof products[0]) => {
    addItem(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <section
      id="products"
      ref={sectionRef}
      className="relative py-20 lg:py-32 w-full"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2
              ref={titleRef}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4"
            >
              TRENDING <span className="text-gradient">NOW</span>
            </h2>
            <p className="text-white/50 text-lg max-w-md">
              Discover our most popular cyber-fashion pieces
            </p>
          </div>

          {/* Scroll buttons */}
          <div className="hidden sm:flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="border-white/20 text-white hover:bg-white/10 disabled:opacity-30"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="border-white/20 text-white hover:bg-white/10 disabled:opacity-30"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Products scroll container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="product-card flex-shrink-0 w-72 snap-start group"
            >
              <div className="relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-500 hover-lift">
                {/* Image */}
                <div className="relative h-64 bg-gradient-to-b from-white/5 to-transparent flex items-center justify-center p-6">
                  {product.badge && (
                    <Badge className="absolute top-4 left-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                      {product.badge}
                    </Badge>
                  )}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Quick add button */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-purple-500"
                  >
                    <ShoppingCart className="w-5 h-5 text-white" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-white/70 text-sm">{product.rating}</span>
                    <span className="text-white/40 text-sm">({product.reviews})</span>
                  </div>
                  
                  <h3 className="text-white font-semibold text-lg mb-1 truncate">
                    {product.name}
                  </h3>
                  <p className="text-white/50 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-400 font-bold text-xl">
                        R{product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-white/40 line-through text-sm">
                          R{product.originalPrice}
                        </span>
                      )}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAddToCart(product)}
                      className="bg-white/10 hover:bg-purple-500 text-white border-0"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile scroll indicator */}
        <div className="flex justify-center gap-2 mt-6 sm:hidden">
          {featuredProducts.map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-white/20"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
