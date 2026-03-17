import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Check, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function Newsletter() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Grid lines animation
      gsap.fromTo(
        '.grid-line',
        { strokeDashoffset: 1000 },
        {
          strokeDashoffset: 0,
          duration: 1.5,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Card flip animation
      gsap.fromTo(
        cardRef.current,
        { rotateX: 90, opacity: 0 },
        {
          rotateX: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'back.out(1.2)',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubscribed(true);
    toast.success('Welcome to the collective!', {
      description: 'You\'ll receive exclusive offers and updates.',
    });
  };

  return (
    <section
      id="newsletter"
      ref={sectionRef}
      className="relative py-20 lg:py-32 w-full overflow-hidden"
    >
      {/* Grid background */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="grid"
            width="50"
            height="50"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 50 0 L 0 0 0 50"
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="1"
              className="grid-line"
              strokeDasharray="1000"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div
          ref={cardRef}
          className="max-w-2xl mx-auto"
          style={{ perspective: '1000px' }}
        >
          <div className="glass rounded-3xl p-8 lg:p-12 text-center">
            {/* Icon */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-purple-400" />
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              JOIN THE <span className="text-gradient">COLLECTIVE</span>
            </h2>

            <p className="text-white/60 text-lg mb-8 max-w-md mx-auto">
              Subscribe for exclusive drops, early access to new collections, and special member-only discounts.
            </p>

            {!isSubscribed ? (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <div className="flex-1 relative">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-purple-500 focus:ring-purple-500/20"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-14 px-8 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold hover:opacity-90 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Subscribe
                      <Send className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <div className="flex items-center justify-center gap-3 text-green-400">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Check className="w-5 h-5" />
                </div>
                <span className="text-lg font-semibold">You're in! Welcome aboard.</span>
              </div>
            )}

            {/* Benefits */}
            <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-white/50">
              {['Exclusive Drops', 'Early Access', 'Member Discounts', 'Free Shipping'].map(
                (benefit) => (
                  <div key={benefit} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    {benefit}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
