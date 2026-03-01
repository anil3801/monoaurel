import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import axios from 'axios';

gsap.registerPlugin(ScrollTrigger);

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const FeaturedWorks = () => {
  const { t, language } = useLanguage();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const sectionRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API}/products?limit=3`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!sectionRef.current || products.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.from('.featured-item', {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [products]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat(language === 'tr' ? 'tr-TR' : 'en-US', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStockBadge = (status) => {
    const badges = {
      in_stock: { text: t('featured.inStock'), class: 'bg-mono-accent/20 text-mono-accent' },
      made_to_order: { text: t('featured.madeToOrder'), class: 'bg-mono-highlight/20 text-mono-highlight' },
      sold_out: { text: t('featured.soldOut'), class: 'bg-mono-error/20 text-mono-error' },
    };
    return badges[status] || badges.in_stock;
  };

  return (
    <section
      ref={sectionRef}
      data-testid="featured-works-section"
      className="py-24 md:py-32 lg:py-40 bg-mono-cream"
    >
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <h2 className="font-serif text-4xl md:text-6xl italic font-light text-mono-primary">
            {t('featured.title')}
          </h2>
          <Link
            to="/shop"
            data-testid="view-all-works-link"
            className="group flex items-center gap-2 font-sans text-sm uppercase tracking-widest text-mono-accent hover:text-mono-primary transition-colors"
          >
            {t('featured.viewAll')}
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`${i === 0 ? 'md:col-span-8 md:row-span-2' : 'md:col-span-4'} h-[400px] md:h-auto bg-mono-surface animate-pulse rounded-lg`}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 auto-rows-[300px] md:auto-rows-[350px]">
            {products.map((product, index) => {
              const badge = getStockBadge(product.stock_status);
              return (
                <Link
                  key={product.id}
                  to={`/shop/${product.handle}`}
                  data-testid={`featured-product-${product.id}`}
                  data-cursor-view
                  className={`featured-item group relative overflow-hidden rounded-lg ${
                    index === 0 ? 'md:col-span-8 md:row-span-2' : 'md:col-span-4'
                  }`}
                >
                  {/* Image */}
                  <div className="absolute inset-0 bg-mono-surface">
                    {product.images?.[0] && (
                      <img
                        src={product.images[0].src}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-mono-black/80 via-mono-black/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Badge */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className={`px-3 py-1 font-sans text-xs uppercase tracking-wider rounded-full ${badge.class}`}>
                      {badge.text}
                    </span>
                    {product.custom_available && (
                      <span className="px-3 py-1 font-sans text-xs uppercase tracking-wider rounded-full bg-mono-accent-light/20 text-mono-accent-light">
                        {t('featured.customAvailable')}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="font-serif text-2xl md:text-3xl italic text-mono-cream mb-2">
                      {language === 'tr' && product.title_tr ? product.title_tr : product.title}
                    </h3>
                    <p className="font-sans text-mono-accent-light">
                      {product.price_min
                        ? `${formatPrice(product.price_min)} ${t('featured.from')}`
                        : formatPrice(product.price)}
                    </p>
                    <span className="inline-flex items-center gap-2 mt-4 font-sans text-xs uppercase tracking-widest text-mono-cream/60 group-hover:text-mono-accent-light transition-colors">
                      {t('featured.viewPiece')}
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
