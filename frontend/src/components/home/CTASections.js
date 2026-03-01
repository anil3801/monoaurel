import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import axios from 'axios';
import { toast } from 'sonner';

gsap.registerPlugin(ScrollTrigger);

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const CustomCTA = () => {
  const { t } = useLanguage();
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.cta-content', {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-testid="custom-cta-section"
      className="py-24 md:py-32 bg-mono-black relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-mono-accent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-mono-accent rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        <div className="cta-content max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl italic font-light text-mono-cream mb-6">
            {t('customCTA.title')}
          </h2>
          <p className="font-sans text-base md:text-lg text-mono-secondary mb-10 max-w-xl mx-auto">
            {t('customCTA.description')}
          </p>
          <Link
            to="/contact"
            data-testid="custom-cta-btn"
            className="group inline-flex items-center gap-3 px-8 py-4 border border-mono-accent text-mono-accent rounded-full hover:bg-mono-accent hover:text-mono-black transition-all duration-500"
          >
            <span className="font-sans text-sm uppercase tracking-widest">{t('customCTA.btn')}</span>
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export const Newsletter = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      await axios.post(`${API}/newsletter?email=${encodeURIComponent(email)}`);
      setIsSubscribed(true);
      setEmail('');
      toast.success(t('newsletter.success'));
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error('Bu e-posta zaten kayıtlı.');
      } else {
        toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      data-testid="newsletter-section"
      className="py-20 md:py-24 bg-mono-surface border-t border-mono-border"
    >
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="font-serif text-3xl md:text-4xl italic text-mono-cream mb-4">
            {t('newsletter.title')}
          </h3>
          <p className="font-sans text-mono-secondary mb-8">
            {t('newsletter.description')}
          </p>

          {isSubscribed ? (
            <p className="font-sans text-mono-accent">{t('newsletter.success')}</p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('newsletter.placeholder')}
                data-testid="newsletter-email-input"
                className="flex-1 bg-transparent border-b border-mono-border px-4 py-3 font-sans text-mono-cream placeholder:text-mono-secondary/50 focus:border-mono-accent transition-colors"
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                data-testid="newsletter-submit-btn"
                className="px-8 py-3 font-sans text-sm uppercase tracking-widest bg-mono-accent text-mono-black rounded-full hover:bg-mono-highlight transition-colors disabled:opacity-50"
              >
                {isLoading ? '...' : t('newsletter.btn')}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
