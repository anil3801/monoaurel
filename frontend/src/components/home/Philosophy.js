import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

export const Philosophy = () => {
  const { t } = useLanguage();
  const sectionRef = useRef(null);
  const [counters, setCounters] = useState({ pieces: 0, years: 0, projects: 0 });

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Quote animation
      gsap.from('.philosophy-quote', {
        x: -100,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      });

      // Counter animation
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 60%',
        onEnter: () => {
          gsap.to({ val: 0 }, {
            val: 200,
            duration: 2,
            ease: 'power2.out',
            onUpdate: function() {
              setCounters(prev => ({ ...prev, pieces: Math.floor(this.targets()[0].val) }));
            }
          });
          gsap.to({ val: 0 }, {
            val: 8,
            duration: 2,
            ease: 'power2.out',
            onUpdate: function() {
              setCounters(prev => ({ ...prev, years: Math.floor(this.targets()[0].val) }));
            }
          });
          gsap.to({ val: 0 }, {
            val: 50,
            duration: 2,
            ease: 'power2.out',
            onUpdate: function() {
              setCounters(prev => ({ ...prev, projects: Math.floor(this.targets()[0].val) }));
            }
          });
        },
        once: true,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-testid="philosophy-section"
      className="py-24 md:py-32 lg:py-40 bg-mono-surface"
    >
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Quote Side */}
          <div className="philosophy-quote">
            <p className="font-serif text-3xl md:text-4xl lg:text-5xl italic text-mono-secondary/60 leading-tight">
              "{t('philosophy.quote')}"
            </p>
          </div>

          {/* Content Side */}
          <div>
            <p className="font-sans text-base md:text-lg text-mono-secondary leading-relaxed mb-12">
              {t('philosophy.description')}
            </p>

            {/* Counters */}
            <div className="grid grid-cols-3 gap-8">
              <div data-testid="counter-pieces">
                <span className="block font-serif text-4xl md:text-5xl italic text-mono-accent">
                  +{counters.pieces}
                </span>
                <span className="font-sans text-xs uppercase tracking-widest text-mono-secondary mt-2 block">
                  {t('philosophy.uniquePieces')}
                </span>
              </div>
              <div data-testid="counter-years">
                <span className="block font-serif text-4xl md:text-5xl italic text-mono-accent">
                  +{counters.years}
                </span>
                <span className="font-sans text-xs uppercase tracking-widest text-mono-secondary mt-2 block">
                  {t('philosophy.yearsOfCraft')}
                </span>
              </div>
              <div data-testid="counter-projects">
                <span className="block font-serif text-4xl md:text-5xl italic text-mono-accent">
                  +{counters.projects}
                </span>
                <span className="font-sans text-xs uppercase tracking-widest text-mono-secondary mt-2 block">
                  {t('philosophy.customProjects')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
