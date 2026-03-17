import { useEffect, useRef, useState } from 'react';
import { categories } from '@/data/products';
import { ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function Categories() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const panelsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const panels = panelsRef.current?.querySelectorAll('.category-panel');
      if (panels) {
        gsap.fromTo(
          panels,
          { y: '100%', opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="categories"
      ref={sectionRef}
      className="relative py-20 lg:py-32 w-full"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 mb-12">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
          SHOP BY <span className="text-gradient">CATEGORY</span>
        </h2>
        <p className="text-white/50 text-lg max-w-md">
          Explore our curated collections
        </p>
      </div>

      {/* Kinetic Accordion */}
      <div
        ref={panelsRef}
        className="flex h-[60vh] lg:h-[70vh] gap-2 px-4 sm:px-6 lg:px-8 xl:px-12"
      >
        {categories.map((category) => (
          <div
            key={category.id}
            className={`category-panel relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-700 ease-out ${
              activeCategory === category.id
                ? 'flex-[3]'
                : activeCategory
                ? 'flex-[0.5]'
                : 'flex-1'
            }`}
            onMouseEnter={() => setActiveCategory(category.id)}
            onMouseLeave={() => setActiveCategory(null)}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={category.image}
                alt={category.name}
                className={`w-full h-full object-cover transition-transform duration-700 ${
                  activeCategory === category.id ? 'scale-110' : 'scale-100'
                }`}
              />
              {/* Overlay */}
              <div
                className={`absolute inset-0 transition-opacity duration-500 ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-t from-black/80 via-black/40 to-transparent'
                    : 'bg-black/60'
                }`}
              />
            </div>

            {/* Content */}
            <div className="relative h-full flex flex-col justify-end p-6 lg:p-8">
              {/* Vertical text when compressed */}
              <div
                className={`transition-all duration-500 ${
                  activeCategory === category.id
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4'
                }`}
              >
                <div className="flex items-center gap-2 text-white/70 text-sm mb-2">
                  <span>{category.count} items</span>
                </div>
              </div>

              {/* Category Name */}
              <div className="flex items-center justify-between">
                <h3
                  className={`font-bold text-white transition-all duration-500 ${
                    activeCategory === category.id
                      ? 'text-3xl lg:text-5xl'
                      : 'text-xl lg:text-2xl writing-mode-vertical lg:writing-mode-horizontal'
                  }`}
                  style={{
                    writingMode:
                      activeCategory !== category.id && window.innerWidth >= 1024
                        ? 'vertical-rl'
                        : 'horizontal-tb',
                    textOrientation: 'mixed',
                  }}
                >
                  {category.name}
                </h3>

                {/* Arrow icon */}
                <div
                  className={`w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center transition-all duration-500 ${
                    activeCategory === category.id
                      ? 'opacity-100 scale-100'
                      : 'opacity-0 scale-75'
                  }`}
                >
                  <ArrowUpRight className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Shop Now button */}
              <button
                className={`mt-4 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold text-sm transition-all duration-500 ${
                  activeCategory === category.id
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4 pointer-events-none'
                }`}
              >
                Explore Collection
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
