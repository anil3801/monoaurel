import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const JournalPage = () => {
  const { t, language } = useLanguage();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    { value: null, label: language === 'tr' ? 'Tümü' : 'All' },
    { value: 'process', label: language === 'tr' ? 'Süreç' : 'Process' },
    { value: 'inspiration', label: language === 'tr' ? 'İlham' : 'Inspiration' },
    { value: 'behind-scenes', label: language === 'tr' ? 'Kamera Arkası' : 'Behind the Scenes' },
    { value: 'new-work', label: language === 'tr' ? 'Yeni Eserler' : 'New Work' },
    { value: 'custom-stories', label: language === 'tr' ? 'Özel Hikayeler' : 'Custom Stories' },
  ];

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const url = selectedCategory
          ? `${API}/blog?category=${selectedCategory}`
          : `${API}/blog`;
        const response = await axios.get(url);
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
        // Set demo posts if API fails
        setPosts([
          {
            id: '1',
            title: 'The Art of Balance: Creating Totem Sculptures',
            title_tr: 'Denge Sanatı: Totem Heykelleri Yaratmak',
            slug: 'art-of-balance-totem-sculptures',
            excerpt: 'Exploring the delicate process of stacking ceramic forms to create our signature totem sculptures.',
            excerpt_tr: 'İmza totem heykellerimizi yaratmak için seramik formları istiflemenin hassas sürecini keşfetmek.',
            featured_image: 'https://customer-assets.emergentagent.com/job_f854762d-e9d8-45ed-a96a-aa51980e7c30/artifacts/35as5za0_totemmy13.png',
            category: 'process',
            reading_time: 5,
            created_at: new Date().toISOString(),
          },
          {
            id: '2',
            title: 'Finding Serenity in Stone',
            title_tr: 'Taşta Huzuru Bulmak',
            slug: 'finding-serenity-in-stone',
            excerpt: 'How natural materials inspire our meditation-focused stone sculptures.',
            excerpt_tr: 'Doğal malzemelerin meditasyon odaklı taş heykellerimize nasıl ilham verdiği.',
            featured_image: 'https://customer-assets.emergentagent.com/job_f854762d-e9d8-45ed-a96a-aa51980e7c30/artifacts/yymn2n6w_stone9.png',
            category: 'inspiration',
            reading_time: 4,
            created_at: new Date().toISOString(),
          },
          {
            id: '3',
            title: 'Behind the Scenes: A Day in the Studio',
            title_tr: 'Kamera Arkası: Atölyede Bir Gün',
            slug: 'behind-scenes-day-in-studio',
            excerpt: 'Take a peek into our daily creative process and the making of our handcrafted pieces.',
            excerpt_tr: 'Günlük yaratıcı sürecimize ve el yapımı parçalarımızın üretimine bir göz atın.',
            featured_image: 'https://customer-assets.emergentagent.com/job_f854762d-e9d8-45ed-a96a-aa51980e7c30/artifacts/y2uawiad_artobject23.png',
            category: 'behind-scenes',
            reading_time: 6,
            created_at: new Date().toISOString(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, [selectedCategory]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'tr' ? 'tr-TR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  return (
    <main data-testid="journal-page" className="min-h-screen bg-mono-cream pt-32 pb-24">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-5xl md:text-7xl italic font-light text-mono-primary mb-16"
        >
          {t('nav.journal')}
        </motion.h1>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.value || 'all'}
              onClick={() => setSelectedCategory(cat.value)}
              data-testid={`journal-filter-${cat.value || 'all'}`}
              className={`px-4 py-2 font-sans text-xs uppercase tracking-widest rounded-full border transition-colors ${
                selectedCategory === cat.value
                  ? 'border-mono-accent bg-mono-accent text-mono-black'
                  : 'border-mono-border text-mono-secondary hover:border-mono-accent hover:text-mono-cream'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Posts Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-[4/3] bg-mono-surface animate-pulse rounded-lg" />
                <div className="h-6 bg-mono-surface animate-pulse rounded w-3/4" />
                <div className="h-4 bg-mono-surface animate-pulse rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <p className="text-center font-sans text-mono-secondary py-16">
            {language === 'tr' ? 'Henüz yazı yok' : 'No posts yet'}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                data-testid={`journal-post-${post.id}`}
              >
                <Link to={`/journal/${post.slug}`} className="group block">
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-mono-surface mb-4">
                    {post.featured_image && (
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 font-sans text-xs uppercase tracking-wider rounded-full bg-mono-cream/90 text-mono-primary">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex items-center gap-3 mb-3 text-mono-secondary">
                    <span className="font-sans text-xs">{formatDate(post.created_at)}</span>
                    <span className="w-1 h-1 rounded-full bg-mono-secondary" />
                    <span className="font-sans text-xs flex items-center gap-1">
                      <Clock size={12} />
                      {post.reading_time} min
                    </span>
                  </div>

                  <h2 className="font-serif text-2xl italic text-mono-primary group-hover:text-mono-accent transition-colors mb-2">
                    {language === 'tr' && post.title_tr ? post.title_tr : post.title}
                  </h2>

                  <p className="font-sans text-sm text-mono-secondary leading-relaxed line-clamp-2 mb-4">
                    {language === 'tr' && post.excerpt_tr ? post.excerpt_tr : post.excerpt}
                  </p>

                  <span className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-widest text-mono-accent group-hover:gap-3 transition-all">
                    {language === 'tr' ? 'Devamını Oku' : 'Read More'}
                    <ArrowRight size={14} />
                  </span>
                </Link>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default JournalPage;
