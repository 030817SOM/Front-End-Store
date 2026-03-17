import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import gsap from 'gsap';

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation - split characters
      const titleChars = titleRef.current?.querySelectorAll('.char');
      if (titleChars) {
        gsap.fromTo(
          titleChars,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.03,
            ease: 'expo.out',
            delay: 0.2,
          }
        );
      }

      // Subtitle animation
      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, filter: 'blur(10px)' },
        {
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.8,
          ease: 'power2.out',
          delay: 0.6,
        }
      );

      // CTA animation
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          delay: 0.8,
        }
      );

      // Product image animation
      gsap.fromTo(
        imageRef.current,
        { z: -500, rotateX: 45, opacity: 0 },
        {
          z: 0,
          rotateX: 0,
          opacity: 1,
          duration: 1.5,
          ease: 'elastic.out(1, 0.5)',
          delay: 0.1,
        }
      );

      // Glow animation
      gsap.fromTo(
        glowRef.current,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 2,
          ease: 'power2.out',
        }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Mouse move effect for 3D tilt
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!imageRef.current) return;
      
      const rect = imageRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const rotateY = ((e.clientX - centerX) / rect.width) * 10;
      const rotateX = ((centerY - e.clientY) / rect.height) * 10;
      
      gsap.to(imageRef.current, {
        rotateY,
        rotateX,
        duration: 0.5,
        ease: 'power2.out',
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const titleText = 'FUTURE FASHION';

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Background gradient mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-cyan-900/20" />
      
      {/* Animated glow orbs */}
      <div
        ref={glowRef}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] animate-pulse-glow"
      />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-[150px] animate-pulse-glow" style={{ animationDelay: '2s' }} />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-7xl mx-auto">
          {/* Text Content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-white/70">New Collection 2026</span>
            </div>

            <h1
              ref={titleRef}
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-6 overflow-hidden"
              style={{ perspective: '1000px' }}
            >
              {titleText.split('').map((char, i) => (
                <span
                  key={i}
                  className="char inline-block"
                  style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </h1>

            <p
              ref={subtitleRef}
              className="text-lg sm:text-xl text-white/60 mb-8 max-w-lg mx-auto lg:mx-0"
            >
              Where cybernetics meet couture. Experience the next evolution of fashion with our cutting-edge techwear collection.
            </p>

            <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="h-14 px-8 bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500 text-white font-semibold text-lg hover:opacity-90 transition-all hover:scale-105 group"
                onClick={() => {
                  document.querySelector('#products')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Explore Collection
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 border-white/20 text-white hover:bg-white/10 font-semibold text-lg"
                onClick={() => {
                  document.querySelector('#categories')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                View Categories
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-12 justify-center lg:justify-start">
              {[
                { value: '50K+', label: 'Customers' },
                { value: '200+', label: 'Products' },
                { value: '4.9', label: 'Rating' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-gradient">{stat.value}</div>
                  <div className="text-sm text-white/50">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Product Image */}
          <div className="relative order-1 lg:order-2 flex items-center justify-center" style={{ perspective: '1000px' }}>
            <div
              ref={imageRef}
              className="relative w-full max-w-lg animate-float"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Glow effect behind product */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 via-cyan-500/30 to-pink-500/30 rounded-full blur-[80px] scale-75" />
              
              {/* Product image */}
              <img
                src="/hero-sneaker.png"
                alt="Nexus X1 Sneakers"
                className="relative z-10 w-full h-auto drop-shadow-2xl"
              />

              {/* Floating badges */}
              <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/50 backdrop-blur-sm">
                <span className="text-purple-300 text-sm font-medium">New</span>
              </div>
              
              <div className="absolute bottom-8 left-4 px-4 py-2 rounded-xl bg-black/60 border border-white/10 backdrop-blur-md">
                <div className="text-white font-semibold">Nexus X1</div>
                <div className="text-cyan-400 text-sm">R299</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0F0F0F] to-transparent" />
    </section>
  );
}
