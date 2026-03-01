import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, Mail, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const ShopPage = () => {
  const { t, language } = useLanguage();
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, collectionsRes] = await Promise.all([
          axios.get(`${API}/products`),
          axios.get(`${API}/collections`),
        ]);
        setProducts(productsRes.data);
        setCollections(collectionsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = selectedCollection
    ? products.filter((p) => p.collection_ids?.includes(selectedCollection))
    : products;

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
    <main data-testid="shop-page" className="min-h-screen bg-mono-black pt-32 pb-24">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        {/* Header */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-5xl md:text-7xl italic font-light text-mono-cream mb-16"
        >
          {t('shop.title')}
        </motion.h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-12">
          <button
            onClick={() => setSelectedCollection(null)}
            data-testid="filter-all"
            className={`px-4 py-2 font-sans text-xs uppercase tracking-widest rounded-full border transition-colors ${
              selectedCollection === null
                ? 'border-mono-accent bg-mono-accent text-mono-black'
                : 'border-mono-border text-mono-secondary hover:border-mono-accent hover:text-mono-cream'
            }`}
          >
            {t('shop.all')}
          </button>
          {collections.map((col) => (
            <button
              key={col.id}
              onClick={() => setSelectedCollection(col.id)}
              data-testid={`filter-${col.handle}`}
              className={`px-4 py-2 font-sans text-xs uppercase tracking-widest rounded-full border transition-colors ${
                selectedCollection === col.id
                  ? 'border-mono-accent bg-mono-accent text-mono-black'
                  : 'border-mono-border text-mono-secondary hover:border-mono-accent hover:text-mono-cream'
              }`}
            >
              {language === 'tr' && col.title_tr ? col.title_tr : col.title}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-mono-surface animate-pulse rounded-lg" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <p className="text-center font-sans text-mono-secondary py-16">{t('shop.noProducts')}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => {
              const badge = getStockBadge(product.stock_status);
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={`/shop/${product.handle}`}
                    data-testid={`product-card-${product.id}`}
                    data-cursor-view
                    className="group block"
                  >
                    {/* Image */}
                    <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-mono-surface mb-4">
                      {product.images?.[0] && (
                        <img
                          src={product.images[0].src}
                          alt={product.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 bg-mono-black/0 group-hover:bg-mono-black/20 transition-colors duration-500" />
                      
                      {/* Badge */}
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 font-sans text-xs uppercase tracking-wider rounded-full ${badge.class}`}>
                          {badge.text}
                        </span>
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <span className="px-6 py-3 bg-mono-black/80 font-sans text-xs uppercase tracking-widest text-mono-cream rounded-full">
                          {t('featured.viewPiece')}
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <h3 className="font-serif text-xl italic text-mono-cream group-hover:text-mono-accent transition-colors">
                      {language === 'tr' && product.title_tr ? product.title_tr : product.title}
                    </h3>
                    <p className="font-sans text-mono-accent mt-1">
                      {formatPrice(product.price)}
                    </p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};

const ProductDetailPage = () => {
  const { handle } = useParams();
  const { t, language } = useLanguage();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${API}/products/handle/${handle}`);
        setProduct(response.data);

        // Fetch related products
        const productsRes = await axios.get(`${API}/products?limit=4`);
        setRelatedProducts(productsRes.data.filter((p) => p.id !== response.data.id).slice(0, 3));
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [handle]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat(language === 'tr' ? 'tr-TR' : 'en-US', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    if (product.stock_status === 'sold_out') return;
    addToCart(product);
    toast.success(language === 'tr' ? 'Sepete eklendi!' : 'Added to cart!');
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-mono-black pt-32 pb-24">
        <div className="container mx-auto px-6 md:px-12 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="aspect-square bg-mono-surface animate-pulse rounded-lg" />
            <div className="space-y-4">
              <div className="h-12 bg-mono-surface animate-pulse rounded" />
              <div className="h-8 bg-mono-surface animate-pulse rounded w-1/3" />
              <div className="h-32 bg-mono-surface animate-pulse rounded" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-mono-black pt-32 pb-24">
        <div className="container mx-auto px-6 text-center">
          <p className="text-mono-secondary">Product not found</p>
        </div>
      </main>
    );
  }

  const images = product.images || [];

  return (
    <main data-testid="product-detail-page" className="min-h-screen bg-mono-black pt-32 pb-24">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        {/* Back Link */}
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-widest text-mono-secondary hover:text-mono-cream transition-colors mb-8"
        >
          <ChevronLeft size={16} />
          {t('cart.continueShopping')}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Images */}
          <div>
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden rounded-lg bg-mono-surface mb-4">
              {images[selectedImageIndex] && (
                <img
                  src={images[selectedImageIndex].src}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              )}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-mono-black/60 rounded-full flex items-center justify-center text-mono-cream hover:bg-mono-black transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => setSelectedImageIndex((prev) => (prev + 1) % images.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-mono-black/60 rounded-full flex items-center justify-center text-mono-cream hover:bg-mono-black transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-20 h-20 rounded overflow-hidden border-2 transition-colors ${
                      idx === selectedImageIndex ? 'border-mono-accent' : 'border-transparent'
                    }`}
                  >
                    <img src={img.src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <h1 className="font-serif text-4xl md:text-5xl italic text-mono-cream mb-4">
              {language === 'tr' && product.title_tr ? product.title_tr : product.title}
            </h1>

            <p className="font-serif text-3xl text-mono-accent mb-8">{formatPrice(product.price)}</p>

            <p className="font-sans text-mono-secondary leading-relaxed mb-8">
              {language === 'tr' && product.description_tr ? product.description_tr : product.description}
            </p>

            {/* Specs */}
            <div className="space-y-4 mb-8 pb-8 border-b border-mono-border">
              {product.materials?.length > 0 && (
                <div className="flex justify-between">
                  <span className="font-sans text-sm text-mono-secondary">{t('shop.materials')}</span>
                  <span className="font-sans text-sm text-mono-cream">{product.materials.join(', ')}</span>
                </div>
              )}
              {product.dimensions && (
                <div className="flex justify-between">
                  <span className="font-sans text-sm text-mono-secondary">{t('shop.dimensions')}</span>
                  <span className="font-sans text-sm text-mono-cream">{product.dimensions}</span>
                </div>
              )}
              {product.weight && (
                <div className="flex justify-between">
                  <span className="font-sans text-sm text-mono-secondary">{t('shop.weight')}</span>
                  <span className="font-sans text-sm text-mono-cream">{product.weight}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-4">
              {product.stock_status !== 'sold_out' ? (
                <button
                  onClick={handleAddToCart}
                  data-testid="add-to-cart-btn"
                  className="w-full flex items-center justify-center gap-3 py-4 font-sans text-sm uppercase tracking-widest bg-mono-accent text-mono-black rounded-full hover:bg-mono-highlight transition-colors"
                >
                  <ShoppingBag size={18} />
                  {t('shop.addToCart')}
                </button>
              ) : (
                <button
                  disabled
                  className="w-full py-4 font-sans text-sm uppercase tracking-widest bg-mono-surface text-mono-secondary rounded-full cursor-not-allowed"
                >
                  {t('featured.soldOut')}
                </button>
              )}

              {product.custom_available && (
                <Link
                  to="/contact"
                  className="w-full flex items-center justify-center gap-3 py-4 font-sans text-sm uppercase tracking-widest border border-mono-accent text-mono-accent rounded-full hover:bg-mono-accent hover:text-mono-black transition-colors"
                >
                  <Mail size={18} />
                  {t('shop.requestQuote')}
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-24">
            <h2 className="font-serif text-3xl italic text-mono-cream mb-12">{t('shop.youMayLike')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProducts.map((relProduct) => (
                <Link
                  key={relProduct.id}
                  to={`/shop/${relProduct.handle}`}
                  className="group"
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-mono-surface mb-4">
                    {relProduct.images?.[0] && (
                      <img
                        src={relProduct.images[0].src}
                        alt={relProduct.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <h3 className="font-serif text-xl italic text-mono-cream group-hover:text-mono-accent transition-colors">
                    {language === 'tr' && relProduct.title_tr ? relProduct.title_tr : relProduct.title}
                  </h3>
                  <p className="font-sans text-mono-accent mt-1">{formatPrice(relProduct.price)}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export { ShopPage, ProductDetailPage };
