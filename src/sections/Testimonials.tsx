import { useEffect, useRef, useState } from 'react';
import { testimonials } from '@/data/products';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.testimonial-header',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        '.testimonial-card',
        { y: 60, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const navigate = (direction: 'prev' | 'next') => {
    if (isAnimating) return;
    setIsAnimating(true);

    const newIndex =
      direction === 'next'
        ? (currentIndex + 1) % testimonials.length
        : (currentIndex - 1 + testimonials.length) % testimonials.length;

    setCurrentIndex(newIndex);
    setTimeout(() => setIsAnimating(false), 500);
  };

  // Auto-rotate
  useEffect(() => {
    const timer = setInterval(() => {
      navigate('next');
    }, 5000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  return (
    <section ref={sectionRef} className="relative py-20 lg:py-32 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Header */}
        <div className="testimonial-header text-center mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            WHAT THEY <span className="text-gradient">SAY</span>
          </h2>
          <p className="text-white/50 text-lg max-w-md mx-auto">
            Join thousands of satisfied customers
          </p>
        </div>

        {/* Testimonial Card */}
        <div className="testimonial-card relative max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl glass-strong p-8 lg:p-12">
            {/* Quote icon */}
            <div className="absolute top-8 right-8 w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center">
              <Quote className="w-8 h-8 text-purple-400" />
            </div>

            {/* Content */}
            <div className="relative z-10">
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < testimonials[currentIndex].rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-white/20'
                    }`}
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-xl lg:text-2xl text-white/90 mb-8 leading-relaxed">
                "{testimonials[currentIndex].content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {testimonials[currentIndex].avatar}
                  </span>
                </div>
                <div>
                  <div className="text-white font-semibold text-lg">
                    {testimonials[currentIndex].name}
                  </div>
                  <div className="text-white/50">
                    {testimonials[currentIndex].role}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="absolute bottom-8 right-8 flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigate('prev')}
                className="border-white/20 text-white hover:bg-white/10"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigate('next')}
                className="border-white/20 text-white hover:bg-white/10"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  if (!isAnimating) {
                    setIsAnimating(true);
                    setCurrentIndex(i);
                    setTimeout(() => setIsAnimating(false), 500);
                  }
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? 'w-8 bg-gradient-to-r from-purple-500 to-cyan-500'
                    : 'bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-8 mt-16">
          {[
            { value: '50K+', label: 'Happy Customers' },
            { value: '4.9', label: 'Average Rating' },
            { value: '99%', label: 'Satisfaction' },
            { value: '24/7', label: 'Support' },
          ].map((badge) => (
            <div key={badge.label} className="text-center">
              <div className="text-2xl lg:text-3xl font-bold text-gradient">
                {badge.value}
              </div>
              <div className="text-sm text-white/50">{badge.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
