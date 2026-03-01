import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Lightbulb } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const MarqueeLettersPage = () => {
  const { t, language } = useLanguage();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    text: '',
    size: '',
    material: '',
    light_type: '',
    color: '',
    purpose: '',
    delivery_date: '',
    name: '',
    email: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API}/products?product_type=marquee`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat(language === 'tr' ? 'tr-TR' : 'en-US', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post(`${API}/marquee-orders`, formData);
      toast.success(language === 'tr' ? 'Talebiniz alındı! En kısa sürede size dönüş yapacağız.' : 'Your request has been received!');
      setFormData({
        text: '',
        size: '',
        material: '',
        light_type: '',
        color: '',
        purpose: '',
        delivery_date: '',
        name: '',
        email: '',
        phone: '',
      });
    } catch (error) {
      toast.error(language === 'tr' ? 'Bir hata oluştu. Lütfen tekrar deneyin.' : 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const sizes = ['S (30cm)', 'M (50cm)', 'L (80cm)', 'XL (120cm)'];
  const materials = [
    { value: 'metal', label: language === 'tr' ? 'Metal' : 'Metal' },
    { value: 'wood', label: language === 'tr' ? 'Ahşap' : 'Wood' },
    { value: 'mdf', label: 'MDF' },
  ];
  const lightTypes = [
    { value: 'led_warm', label: 'LED Warm White' },
    { value: 'led_cold', label: 'LED Cold White' },
    { value: 'neon', label: 'Neon' },
  ];
  const purposes = [
    { value: 'wedding', label: language === 'tr' ? 'Düğün' : 'Wedding' },
    { value: 'store', label: language === 'tr' ? 'Mağaza / Vitrin' : 'Store / Display' },
    { value: 'event', label: language === 'tr' ? 'Etkinlik' : 'Event' },
    { value: 'home', label: language === 'tr' ? 'Ev Dekorasyon' : 'Home Decor' },
    { value: 'corporate', label: language === 'tr' ? 'Kurumsal' : 'Corporate' },
  ];

  return (
    <main data-testid="marquee-letters-page" className="min-h-screen bg-mono-cream pt-32 pb-24">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-mono-accent/10 to-transparent" />
        <div className="container mx-auto px-6 md:px-12 lg:px-24 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 mb-6"
          >
            <Lightbulb size={32} className="text-mono-accent" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-5xl md:text-7xl italic font-light text-mono-primary mb-4"
          >
            {t('marqueePage.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-sans text-lg text-mono-secondary"
          >
            {t('marqueePage.subtitle')}
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        {/* Stock Products */}
        <section className="mb-24">
          <h2 className="font-serif text-3xl md:text-4xl italic text-mono-primary mb-12">
            {t('marqueePage.stockTitle')}
          </h2>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="aspect-square bg-mono-surface animate-pulse rounded-lg" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <p className="text-mono-secondary font-sans">
              {language === 'tr' 
                ? 'Şu anda stokta hazır ürün bulunmamaktadır. Özel sipariş için aşağıdaki formu kullanabilirsiniz.'
                : 'No stock products available at the moment. Please use the custom order form below.'}
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {products.map((product) => (
                <Link
                  key={product.id}
                  to={`/shop/${product.handle}`}
                  className="group"
                  data-testid={`marquee-product-${product.id}`}
                >
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-mono-surface mb-4">
                    {product.images?.[0] && (
                      <img
                        src={product.images[0].src}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <h3 className="font-serif text-xl italic text-mono-cream group-hover:text-mono-accent transition-colors">
                    {language === 'tr' && product.title_tr ? product.title_tr : product.title}
                  </h3>
                  <p className="font-sans text-mono-accent mt-1">{formatPrice(product.price)}</p>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Custom Order Form */}
        <section className="bg-mono-surface rounded-2xl p-8 md:p-12">
          <h2 className="font-serif text-3xl md:text-4xl italic text-mono-primary mb-4">
            {t('marqueePage.customTitle')}
          </h2>
          <p className="font-sans text-mono-secondary mb-12">
            {t('marqueePage.customDescription')}
          </p>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Text */}
            <div className="md:col-span-2">
              <label className="block font-sans text-xs uppercase tracking-widest text-mono-secondary mb-2">
                {t('marqueePage.formText')} *
              </label>
              <input
                type="text"
                name="text"
                value={formData.text}
                onChange={handleInputChange}
                required
                data-testid="marquee-form-text"
                placeholder="LOVE, YOUR NAME, etc."
                className="w-full bg-transparent border-b border-mono-border px-0 py-3 font-sans text-mono-primary placeholder:text-mono-secondary/30 focus:border-mono-accent transition-colors"
              />
            </div>

            {/* Size */}
            <div>
              <label className="block font-sans text-xs uppercase tracking-widest text-mono-secondary mb-2">
                {t('marqueePage.formSize')} *
              </label>
              <select
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                required
                data-testid="marquee-form-size"
                className="w-full bg-transparent border-b border-mono-border px-0 py-3 font-sans text-mono-primary focus:border-mono-accent transition-colors"
              >
                <option value="" className="bg-mono-surface">{language === 'tr' ? 'Seçiniz' : 'Select'}</option>
                {sizes.map((size) => (
                  <option key={size} value={size} className="bg-mono-surface">{size}</option>
                ))}
              </select>
            </div>

            {/* Material */}
            <div>
              <label className="block font-sans text-xs uppercase tracking-widest text-mono-secondary mb-2">
                {t('marqueePage.formMaterial')} *
              </label>
              <select
                name="material"
                value={formData.material}
                onChange={handleInputChange}
                required
                data-testid="marquee-form-material"
                className="w-full bg-transparent border-b border-mono-border px-0 py-3 font-sans text-mono-primary focus:border-mono-accent transition-colors"
              >
                <option value="" className="bg-mono-surface">{language === 'tr' ? 'Seçiniz' : 'Select'}</option>
                {materials.map((mat) => (
                  <option key={mat.value} value={mat.value} className="bg-mono-surface">{mat.label}</option>
                ))}
              </select>
            </div>

            {/* Light Type */}
            <div>
              <label className="block font-sans text-xs uppercase tracking-widest text-mono-secondary mb-2">
                {t('marqueePage.formLightType')} *
              </label>
              <select
                name="light_type"
                value={formData.light_type}
                onChange={handleInputChange}
                required
                data-testid="marquee-form-light-type"
                className="w-full bg-transparent border-b border-mono-border px-0 py-3 font-sans text-mono-primary focus:border-mono-accent transition-colors"
              >
                <option value="" className="bg-mono-surface">{language === 'tr' ? 'Seçiniz' : 'Select'}</option>
                {lightTypes.map((lt) => (
                  <option key={lt.value} value={lt.value} className="bg-mono-surface">{lt.label}</option>
                ))}
              </select>
            </div>

            {/* Color */}
            <div>
              <label className="block font-sans text-xs uppercase tracking-widest text-mono-secondary mb-2">
                {t('marqueePage.formColor')}
              </label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                data-testid="marquee-form-color"
                placeholder={language === 'tr' ? 'Altın, Beyaz, Siyah...' : 'Gold, White, Black...'}
                className="w-full bg-transparent border-b border-mono-border px-0 py-3 font-sans text-mono-primary placeholder:text-mono-secondary/30 focus:border-mono-accent transition-colors"
              />
            </div>

            {/* Purpose */}
            <div>
              <label className="block font-sans text-xs uppercase tracking-widest text-mono-secondary mb-2">
                {t('marqueePage.formPurpose')} *
              </label>
              <select
                name="purpose"
                value={formData.purpose}
                onChange={handleInputChange}
                required
                data-testid="marquee-form-purpose"
                className="w-full bg-transparent border-b border-mono-border px-0 py-3 font-sans text-mono-primary focus:border-mono-accent transition-colors"
              >
                <option value="" className="bg-mono-surface">{language === 'tr' ? 'Seçiniz' : 'Select'}</option>
                {purposes.map((p) => (
                  <option key={p.value} value={p.value} className="bg-mono-surface">{p.label}</option>
                ))}
              </select>
            </div>

            {/* Delivery Date */}
            <div>
              <label className="block font-sans text-xs uppercase tracking-widest text-mono-secondary mb-2">
                {t('marqueePage.formDelivery')}
              </label>
              <input
                type="date"
                name="delivery_date"
                value={formData.delivery_date}
                onChange={handleInputChange}
                data-testid="marquee-form-delivery"
                className="w-full bg-transparent border-b border-mono-border px-0 py-3 font-sans text-mono-primary focus:border-mono-accent transition-colors"
              />
            </div>

            {/* Contact Info */}
            <div className="md:col-span-2 pt-8 border-t border-mono-border">
              <h3 className="font-sans text-xs uppercase tracking-widest text-mono-accent mb-6">
                {language === 'tr' ? 'İletişim Bilgileri' : 'Contact Information'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <label className="block font-sans text-xs uppercase tracking-widest text-mono-secondary mb-2">
                    {t('contact.name')} *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    data-testid="marquee-form-name"
                    className="w-full bg-transparent border-b border-mono-border px-0 py-3 font-sans text-mono-primary focus:border-mono-accent transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-sans text-xs uppercase tracking-widest text-mono-secondary mb-2">
                    {t('contact.email')} *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    data-testid="marquee-form-email"
                    className="w-full bg-transparent border-b border-mono-border px-0 py-3 font-sans text-mono-primary focus:border-mono-accent transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-sans text-xs uppercase tracking-widest text-mono-secondary mb-2">
                    {t('contact.phone')}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    data-testid="marquee-form-phone"
                    className="w-full bg-transparent border-b border-mono-border px-0 py-3 font-sans text-mono-primary focus:border-mono-accent transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="md:col-span-2 pt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                data-testid="marquee-form-submit"
                className="px-8 py-4 font-sans text-sm uppercase tracking-widest bg-mono-accent text-mono-cream rounded-full hover:bg-mono-highlight transition-colors disabled:opacity-50"
              >
                {isSubmitting ? '...' : t('marqueePage.formSubmit')}
              </button>
            </div>
          </form>

          {/* Rental Note */}
          <p className="font-sans text-sm text-mono-secondary/60 mt-8 italic">
            * {t('marqueePage.rentalNote')}
          </p>
        </section>
      </div>
    </main>
  );
};

export default MarqueeLettersPage;
