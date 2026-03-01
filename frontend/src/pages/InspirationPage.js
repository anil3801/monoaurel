import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const InspirationPage = () => {
  const { t, language } = useLanguage();

  const styles = [
    {
      id: 'minimalist',
      title: language === 'tr' ? 'Minimalist / Wabi-Sabi' : 'Minimalist / Wabi-Sabi',
      description: language === 'tr'
        ? 'Sadelik ve kusurlu güzelliğin buluştuğu zarafet'
        : 'Where simplicity meets the beauty of imperfection',
      image: 'https://customer-assets.emergentagent.com/job_f854762d-e9d8-45ed-a96a-aa51980e7c30/artifacts/yymn2n6w_stone9.png',
      products: ['Zen Stone Stack', 'Sphere Sculptures'],
    },
    {
      id: 'industrial',
      title: language === 'tr' ? 'Endüstriyel Loft' : 'Industrial Loft',
      description: language === 'tr'
        ? 'Ham dokular ve güçlü formların birleşimi'
        : 'A combination of raw textures and strong forms',
      image: 'https://customer-assets.emergentagent.com/job_f854762d-e9d8-45ed-a96a-aa51980e7c30/artifacts/35as5za0_totemmy13.png',
      products: ['Equilibrium Totem', 'Geometric Objects'],
    },
    {
      id: 'luxury',
      title: language === 'tr' ? 'Lüks Çağdaş' : 'Luxury Contemporary',
      description: language === 'tr'
        ? 'Modern zarafet ve zamansız sanat'
        : 'Modern elegance and timeless art',
      image: 'https://customer-assets.emergentagent.com/job_f854762d-e9d8-45ed-a96a-aa51980e7c30/artifacts/y2uawiad_artobject23.png',
      products: ['Serenity Spheres', 'Column Sculptures'],
    },
    {
      id: 'nordic',
      title: language === 'tr' ? 'İskandinav / Nordic' : 'Nordic / Scandinavian',
      description: language === 'tr'
        ? 'Açık tonlar, doğal malzemeler, işlevsel estetik'
        : 'Light tones, natural materials, functional aesthetics',
      image: 'https://images.unsplash.com/photo-1696694138288-d3c14bdd35f1?crop=entropy&cs=srgb&fm=jpg&q=85&w=800',
      products: ['Stone Objects', 'Organic Sculptures'],
    },
    {
      id: 'japandi',
      title: 'Japandi',
      description: language === 'tr'
        ? 'Japon minimalizmi ile İskandinav sıcaklığının buluşması'
        : 'Where Japanese minimalism meets Scandinavian warmth',
      image: 'https://customer-assets.emergentagent.com/job_f854762d-e9d8-45ed-a96a-aa51980e7c30/artifacts/yymn2n6w_stone9.png',
      products: ['Zen Collection', 'Meditation Stones'],
    },
    {
      id: 'bohemian',
      title: language === 'tr' ? 'Bohem / Doğal' : 'Bohemian / Earthy',
      description: language === 'tr'
        ? 'Organik formlar ve toprak tonları'
        : 'Organic forms and earthy tones',
      image: 'https://customer-assets.emergentagent.com/job_f854762d-e9d8-45ed-a96a-aa51980e7c30/artifacts/35as5za0_totemmy13.png',
      products: ['Totem Sculptures', 'Natural Stone'],
    },
  ];

  return (
    <main data-testid="inspiration-page" className="min-h-screen bg-mono-black pt-32 pb-24">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-5xl md:text-7xl italic font-light text-mono-cream mb-4"
          >
            {t('inspiration.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-sans text-lg text-mono-secondary"
          >
            {t('inspiration.subtitle')}
          </motion.p>
        </div>

        {/* Styles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {styles.map((style, index) => (
            <motion.div
              key={style.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
              data-testid={`inspiration-style-${style.id}`}
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-mono-surface mb-6">
                <img
                  src={style.image}
                  alt={style.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-mono-black/80 via-mono-black/20 to-transparent" />
                
                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h2 className="font-serif text-3xl italic text-mono-cream mb-2">{style.title}</h2>
                  <p className="font-sans text-sm text-mono-secondary mb-4">{style.description}</p>
                  
                  {/* Featured Products */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {style.products.map((product, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-mono-black/50 backdrop-blur-sm rounded-full font-sans text-xs text-mono-cream"
                      >
                        {product}
                      </span>
                    ))}
                  </div>

                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-widest text-mono-accent hover:text-mono-cream transition-colors group-hover:gap-3"
                  >
                    {t('inspiration.shopLook')}
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* B2B Note */}
        <div className="mt-24 text-center">
          <p className="font-sans text-mono-secondary mb-4">
            {language === 'tr'
              ? 'Mimarlar ve iç mekân tasarımcıları için toplu sipariş indirimleri mevcuttur.'
              : 'Wholesale discounts available for architects and interior designers.'}
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 font-sans text-sm uppercase tracking-widest text-mono-accent hover:text-mono-cream transition-colors"
          >
            {language === 'tr' ? 'B2B İletişim' : 'B2B Inquiries'}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </main>
  );
};

export default InspirationPage;
