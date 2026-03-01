import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Send } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer data-testid="footer" className="bg-mono-black border-t border-mono-border">
      <div className="container mx-auto px-6 md:px-12 lg:px-24 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="font-serif text-2xl tracking-[0.3em] text-mono-cream">
              MONO AUREL
            </Link>
            <p className="mt-4 font-sans text-sm text-mono-cream/60 leading-relaxed">
              {t('footer.tagline')}
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="social-instagram"
                className="text-mono-cream/60 hover:text-mono-accent-light transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="social-pinterest"
                className="text-mono-cream/60 hover:text-mono-accent-light transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
                </svg>
              </a>
              <a
                href="https://behance.net"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="social-behance"
                className="text-mono-cream/60 hover:text-mono-accent-light transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988H0V5.021h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zM3 11h3.584c2.508 0 2.906-3-.312-3H3v3zm3.391 3H3v3.016h3.341c3.055 0 2.868-3.016.05-3.016z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-mono-accent-light mb-6">
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/shop" className="font-sans text-sm text-mono-cream/60 hover:text-mono-cream transition-colors">
                  {t('nav.shop')}
                </Link>
              </li>
              <li>
                <Link to="/marquee-letters" className="font-sans text-sm text-mono-cream/60 hover:text-mono-cream transition-colors">
                  {t('nav.marqueeLetters')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="font-sans text-sm text-mono-cream/60 hover:text-mono-cream transition-colors">
                  {t('customCTA.btn')}
                </Link>
              </li>
              <li>
                <Link to="/inspiration" className="font-sans text-sm text-mono-cream/60 hover:text-mono-cream transition-colors">
                  {t('nav.inspiration')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-mono-accent-light mb-6">
              {t('footer.info')}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="font-sans text-sm text-mono-cream/60 hover:text-mono-cream transition-colors">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link to="/journal" className="font-sans text-sm text-mono-cream/60 hover:text-mono-cream transition-colors">
                  {t('nav.journal')}
                </Link>
              </li>
              <li>
                <Link to="/faq" className="font-sans text-sm text-mono-cream/60 hover:text-mono-cream transition-colors">
                  {t('nav.faq')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-mono-accent-light mb-6">
              {t('footer.legal')}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy" className="font-sans text-sm text-mono-cream/60 hover:text-mono-cream transition-colors">
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="font-sans text-sm text-mono-cream/60 hover:text-mono-cream transition-colors">
                  {t('footer.terms')}
                </Link>
              </li>
              <li>
                <Link to="/returns" className="font-sans text-sm text-mono-cream/60 hover:text-mono-cream transition-colors">
                  {t('footer.returns')}
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="font-sans text-sm text-mono-cream/60 hover:text-mono-cream transition-colors">
                  {t('footer.shipping')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-mono-cream/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-sans text-xs text-mono-cream/50">
            © 2025 Mono Aurel. {t('footer.rights')}
          </p>
          <div className="flex items-center gap-4">
            {/* Payment Icons */}
            <div className="flex items-center gap-2 opacity-50">
              <svg width="32" height="20" viewBox="0 0 32 20" fill="currentColor" className="text-mono-cream/60">
                <rect width="32" height="20" rx="2" fill="#2a2520"/>
                <text x="16" y="13" textAnchor="middle" fontSize="8" fill="#c4a882">VISA</text>
              </svg>
              <svg width="32" height="20" viewBox="0 0 32 20" fill="currentColor" className="text-mono-cream/60">
                <rect width="32" height="20" rx="2" fill="#2a2520"/>
                <circle cx="12" cy="10" r="6" fill="#c4a882" opacity="0.6"/>
                <circle cx="20" cy="10" r="6" fill="#c4a882" opacity="0.8"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
