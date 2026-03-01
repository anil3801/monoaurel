import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

export const Hero = () => {
  const { t } = useLanguage();
  const heroRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax effect on image
      gsap.to(imageRef.current, {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Fade in content
      gsap.from(contentRef.current.children, {
        y: 60,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power3.out',
        delay: 0.3,
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      data-testid="hero-section"
      className="relative h-screen min-h-[700px] overflow-hidden"
    >
      {/* Background Image */}
      <div ref={imageRef} className="absolute inset-0 -top-20 scale-110">
        <img
          src="https://images.unsplash.com/photo-1696694138288-d3c14bdd35f1?crop=entropy&cs=srgb&fm=jpg&q=85"
          alt="Mono Aurel Gallery"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-mono-cream/30 via-mono-cream/10 to-mono-cream" />
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 container mx-auto px-6 md:px-12 lg:px-24 h-full flex flex-col justify-center items-center text-center"
      >
        <span className="font-sans text-xs uppercase tracking-[0.4em] text-mono-accent mb-8">
          MONO AUREL — {t('hero.subtitle')}
        </span>

        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl italic font-light text-mono-primary leading-[0.95] max-w-5xl">
          {t('hero.tagline')}
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 mt-12">
          <Link
            to="/shop"
            data-testid="hero-explore-btn"
            className="group flex items-center gap-3 px-8 py-4 bg-mono-accent text-mono-cream rounded-full hover:bg-mono-highlight transition-all duration-500"
          >
            <span className="font-sans text-sm uppercase tracking-widest">{t('hero.exploreBtn')}</span>
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            to="/contact"
            data-testid="hero-custom-btn"
            className="px-8 py-4 font-sans text-sm uppercase tracking-widest text-mono-primary underline underline-offset-8 decoration-1 hover:text-mono-accent transition-colors"
          >
            {t('hero.customBtn')}
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="text-mono-accent/60"
        >
          <ArrowDown size={24} />
        </motion.div>
      </motion.div>
    </section>
  );
};

export const MarqueeBanner = () => {
  const { t } = useLanguage();
  const text = t('marquee.text');

  return (
    <div
      data-testid="marquee-banner"
      className="py-6 bg-mono-surface border-y border-mono-border overflow-hidden"
    >
      <div className="flex animate-marquee whitespace-nowrap">
        {[...Array(4)].map((_, i) => (
          <span
            key={i}
            className="font-sans text-sm md:text-base tracking-[0.3em] text-mono-accent mx-4"
          >
            {text} {text}
          </span>
        ))}
      </div>
    </div>
  );
};
