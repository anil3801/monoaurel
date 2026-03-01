import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, language, toggleLanguage } = useLanguage();
  const { cartCount, setIsCartOpen } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/shop', label: t('nav.shop') },
    { path: '/marquee-letters', label: t('nav.marqueeLetters') },
    { path: '/inspiration', label: t('nav.inspiration') },
    { path: '/about', label: t('nav.about') },
    { path: '/journal', label: t('nav.journal') },
    { path: '/faq', label: t('nav.faq') },
    { path: '/contact', label: t('nav.contact') },
  ];

  return (
    <>
      <nav
        data-testid="navbar"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? 'bg-mono-surface shadow-sm py-4' : 'bg-transparent py-6'
        }`}
      >
        <div className="container mx-auto px-6 md:px-12 lg:px-24">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              data-testid="logo-link"
              className="font-serif text-xl md:text-2xl tracking-[0.3em] text-mono-primary hover:text-mono-accent transition-colors"
            >
              MONO AUREL
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  data-testid={`nav-link-${link.path.replace('/', '') || 'home'}`}
                  className={`font-sans text-xs uppercase tracking-[0.2em] transition-colors ${
                    location.pathname === link.path
                      ? 'text-mono-accent'
                      : 'text-mono-secondary hover:text-mono-accent'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                data-testid="language-toggle"
                className="font-sans text-xs uppercase tracking-[0.2em] text-mono-secondary hover:text-mono-accent transition-colors px-2 py-1 border border-mono-accent/30 rounded"
              >
                {language === 'en' ? 'TR' : 'EN'}
              </button>

              {/* Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                data-testid="cart-button"
                className="relative p-2 text-mono-primary hover:text-mono-accent transition-colors"
              >
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-mono-accent text-mono-cream text-xs font-sans font-medium rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                data-testid="mobile-menu-toggle"
                className="lg:hidden p-2 text-mono-primary hover:text-mono-accent transition-colors"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-mono-cream lg:hidden"
            data-testid="mobile-menu"
          >
            <div className="flex flex-col items-center justify-center min-h-screen gap-8 px-6">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={link.path}
                    data-testid={`mobile-nav-link-${link.path.replace('/', '') || 'home'}`}
                    className={`font-serif text-3xl italic tracking-wide transition-colors ${
                      location.pathname === link.path
                        ? 'text-mono-accent'
                        : 'text-mono-primary hover:text-mono-accent'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
