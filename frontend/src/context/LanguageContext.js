import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    // Navigation
    nav: {
      home: 'Home',
      shop: 'Shop',
      marqueeLetters: 'Marquee Letters',
      inspiration: 'Inspiration',
      about: 'About',
      journal: 'Journal',
      faq: 'FAQ',
      contact: 'Contact',
    },
    // Hero
    hero: {
      tagline: 'Where Matter Becomes Memory',
      subtitle: 'Art Studio & Workshop',
      exploreBtn: 'Explore Collection',
      customBtn: 'Custom Order',
    },
    // Marquee
    marquee: {
      text: 'HANDMADE · CUSTOM DESIGN · CERAMIC SCULPTURE · MARQUEE LETTERS · STONE OBJECTS · ARCHITECTURAL MATERIALS ·',
    },
    // Featured
    featured: {
      title: 'Featured Works',
      viewAll: 'View All Works',
      viewPiece: 'View Piece',
      madeToOrder: 'Made to Order',
      inStock: 'In Stock',
      soldOut: 'Sold Out',
      customAvailable: 'Custom Available',
      from: 'From',
    },
    // Philosophy
    philosophy: {
      quote: 'Every piece carries the weight of intention.',
      description: 'At Mono Aurel, we believe in the transformative power of handcrafted art. Each sculpture is born from patience, skill, and a deep respect for materials.',
      uniquePieces: 'Unique Pieces',
      yearsOfCraft: 'Years of Craft',
      customProjects: 'Custom Projects',
    },
    // Custom CTA
    customCTA: {
      title: 'Have a vision? We\'ll build it.',
      description: 'Ceramic, stone, marquee letters, or architectural materials — let us create the design of your dreams.',
      btn: 'Start a Custom Project',
    },
    // Newsletter
    newsletter: {
      title: 'Be the first to know.',
      description: 'New collections, studio stories, exclusive pieces.',
      placeholder: 'Enter your email',
      btn: 'Subscribe',
      success: 'Thank you for subscribing!',
    },
    // Footer
    footer: {
      tagline: 'All pieces are handcrafted in our Istanbul atelier.',
      quickLinks: 'Quick Links',
      info: 'Information',
      legal: 'Legal',
      rights: 'All rights reserved.',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      returns: 'Returns & Refunds',
      shipping: 'Shipping Info',
    },
    // Shop
    shop: {
      title: 'The Collection',
      all: 'All',
      filters: 'Filters',
      noProducts: 'No products found',
      addToCart: 'Add to Cart',
      requestQuote: 'Request Quote',
      materials: 'Materials',
      dimensions: 'Dimensions',
      weight: 'Weight',
      youMayLike: 'You May Also Like',
    },
    // Cart
    cart: {
      title: 'Your Cart',
      empty: 'Your cart is empty',
      continueShopping: 'Continue Shopping',
      subtotal: 'Subtotal',
      checkout: 'Proceed to Checkout',
      remove: 'Remove',
    },
    // Contact
    contact: {
      title: 'Let\'s Create Together',
      name: 'Full Name',
      email: 'Email',
      phone: 'Phone',
      category: 'Category of Interest',
      message: 'Project Details',
      budget: 'Budget Range',
      preferredContact: 'Preferred Contact Method',
      submit: 'Send Message',
      success: 'Message sent successfully!',
      address: 'Atelier Address',
      hours: 'Working Hours',
    },
    // About
    about: {
      title: 'Mono Aurel',
      subtitle: 'An atelier where raw materials find their form.',
      storyTitle: 'Our Story',
      servicesTitle: 'What We Create',
      processTitle: 'How We Work',
      testimonials: 'What Clients Say',
    },
    // Marquee Letters Page
    marqueePage: {
      title: 'Letters That Glow',
      subtitle: 'Illuminate your name, logo, or message',
      stockTitle: 'Ready to Ship',
      customTitle: 'Custom Order',
      customDescription: 'Let us illuminate your name, logo, or message',
      formText: 'Text / Letters',
      formSize: 'Size',
      formMaterial: 'Material',
      formLightType: 'Light Type',
      formColor: 'Color Preference',
      formPurpose: 'Purpose',
      formDelivery: 'Preferred Delivery Date',
      formSubmit: 'Request Quote',
      rentalNote: 'Rental options available for events — contact us.',
    },
    // FAQ
    faq: {
      title: 'Frequently Asked Questions',
      categories: {
        ordering: 'Ordering & Payment',
        shipping: 'Shipping & Delivery',
        custom: 'Custom Design',
        materials: 'Materials',
        marquee: 'Marquee Letters',
        returns: 'Returns & Exchanges',
      },
    },
    // Inspiration
    inspiration: {
      title: 'Find Your Style',
      subtitle: 'Find your style, find your piece',
      shopLook: 'Shop This Look',
    },
    // Common
    common: {
      loading: 'Loading...',
      error: 'Something went wrong',
      tryAgain: 'Try Again',
      currency: '₺',
    },
  },
  tr: {
    // Navigation
    nav: {
      home: 'Ana Sayfa',
      shop: 'Mağaza',
      marqueeLetters: 'Işıklı Harfler',
      inspiration: 'İlham',
      about: 'Hakkımızda',
      journal: 'Günlük',
      faq: 'SSS',
      contact: 'İletişim',
    },
    // Hero
    hero: {
      tagline: 'Madde Anıya Dönüştüğünde',
      subtitle: 'Sanat Atölyesi',
      exploreBtn: 'Koleksiyonu Keşfet',
      customBtn: 'Özel Sipariş',
    },
    // Marquee
    marquee: {
      text: 'EL YAPIMI · ÖZEL TASARIM · SERAMİK HEYKEL · IŞIKLI HARFLER · TAŞ OBJELER · MİMARİ MALZEMELER ·',
    },
    // Featured
    featured: {
      title: 'Öne Çıkan Eserler',
      viewAll: 'Tümünü Gör',
      viewPiece: 'Detaylı Gör',
      madeToOrder: 'Sipariş Üzerine',
      inStock: 'Stokta',
      soldOut: 'Tükendi',
      customAvailable: 'Özel Tasarım',
      from: 'den başlayan',
    },
    // Philosophy
    philosophy: {
      quote: 'Her parça niyet ağırlığını taşır.',
      description: 'Mono Aurel\'de el yapımı sanatın dönüştürücü gücüne inanıyoruz. Her heykel sabır, ustalık ve malzemelere derin saygıdan doğar.',
      uniquePieces: 'Benzersiz Eser',
      yearsOfCraft: 'Yıllık Deneyim',
      customProjects: 'Özel Proje',
    },
    // Custom CTA
    customCTA: {
      title: 'Bir vizyonunuz mu var? Birlikte yapalım.',
      description: 'Seramik, taş, ışıklı harf veya mimari malzemeler — hayalinizdeki tasarımı üretelim.',
      btn: 'Özel Proje Başlat',
    },
    // Newsletter
    newsletter: {
      title: 'İlk siz duyun.',
      description: 'Yeni koleksiyonlar, atölye hikayeleri, özel eserler.',
      placeholder: 'E-posta adresiniz',
      btn: 'Abone Ol',
      success: 'Abone olduğunuz için teşekkürler!',
    },
    // Footer
    footer: {
      tagline: 'Tüm eserler İstanbul atölyemizde el yapımı üretilmektedir.',
      quickLinks: 'Hızlı Bağlantılar',
      info: 'Bilgi',
      legal: 'Yasal',
      rights: 'Tüm hakları saklıdır.',
      privacy: 'Gizlilik Politikası',
      terms: 'Kullanım Koşulları',
      returns: 'İade & Değişim',
      shipping: 'Kargo Bilgisi',
    },
    // Shop
    shop: {
      title: 'Koleksiyon',
      all: 'Tümü',
      filters: 'Filtreler',
      noProducts: 'Ürün bulunamadı',
      addToCart: 'Sepete Ekle',
      requestQuote: 'Teklif Al',
      materials: 'Malzemeler',
      dimensions: 'Boyutlar',
      weight: 'Ağırlık',
      youMayLike: 'Bunları da Beğenebilirsiniz',
    },
    // Cart
    cart: {
      title: 'Sepetiniz',
      empty: 'Sepetiniz boş',
      continueShopping: 'Alışverişe Devam',
      subtotal: 'Ara Toplam',
      checkout: 'Ödemeye Geç',
      remove: 'Kaldır',
    },
    // Contact
    contact: {
      title: 'Birlikte Yaratalım',
      name: 'Ad Soyad',
      email: 'E-posta',
      phone: 'Telefon',
      category: 'İlgi Alanı',
      message: 'Proje Detayları',
      budget: 'Bütçe Aralığı',
      preferredContact: 'Tercih Edilen İletişim',
      submit: 'Mesaj Gönder',
      success: 'Mesajınız başarıyla gönderildi!',
      address: 'Atölye Adresi',
      hours: 'Çalışma Saatleri',
    },
    // About
    about: {
      title: 'Mono Aurel',
      subtitle: 'Ham malzemelerin form bulduğu atölye.',
      storyTitle: 'Hikayemiz',
      servicesTitle: 'Neler Üretiyoruz',
      processTitle: 'Nasıl Çalışıyoruz',
      testimonials: 'Müşterilerimiz Ne Diyor',
    },
    // Marquee Letters Page
    marqueePage: {
      title: 'Işıyan Harfler',
      subtitle: 'İsminizi, logonuzu veya mesajınızı aydınlatın',
      stockTitle: 'Hazır Ürünler',
      customTitle: 'Özel Sipariş',
      customDescription: 'İsminizi, logonuzu veya mesajınızı ışıklandıralım',
      formText: 'Metin / Harfler',
      formSize: 'Boyut',
      formMaterial: 'Malzeme',
      formLightType: 'Işık Tipi',
      formColor: 'Renk Tercihi',
      formPurpose: 'Kullanım Amacı',
      formDelivery: 'Tercih Edilen Teslim Tarihi',
      formSubmit: 'Teklif Al',
      rentalNote: 'Etkinlikler için kiralama seçeneği mevcuttur — iletişime geçin.',
    },
    // FAQ
    faq: {
      title: 'Sıkça Sorulan Sorular',
      categories: {
        ordering: 'Sipariş & Ödeme',
        shipping: 'Kargo & Teslimat',
        custom: 'Özel Tasarım',
        materials: 'Malzemeler',
        marquee: 'Işıklı Harfler',
        returns: 'İade & Değişim',
      },
    },
    // Inspiration
    inspiration: {
      title: 'Stilinizi Bulun',
      subtitle: 'Stilinizi bulun, eserinizi bulun',
      shopLook: 'Bu Görünümü İncele',
    },
    // Common
    common: {
      loading: 'Yükleniyor...',
      error: 'Bir hata oluştu',
      tryAgain: 'Tekrar Dene',
      currency: '₺',
    },
  },
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('mono_aurel_lang');
    return saved || 'tr';
  });

  useEffect(() => {
    localStorage.setItem('mono_aurel_lang', language);
  }, [language]);

  const t = (path) => {
    const keys = path.split('.');
    let result = translations[language];
    for (const key of keys) {
      result = result?.[key];
    }
    return result || path;
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'tr' : 'en');
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
