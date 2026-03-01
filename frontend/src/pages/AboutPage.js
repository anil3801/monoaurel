import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Palette, Lightbulb, Mountain, Building2, Pencil, Brush } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

const AboutPage = () => {
  const { t, language } = useLanguage();
  const timelineRef = useRef(null);

  const services = [
    {
      icon: Palette,
      title: language === 'tr' ? 'Seramik Heykel & Sanat Objeleri' : 'Ceramic Sculpture & Art Objects',
      description: language === 'tr' 
        ? 'El yapımı seramik heykeller, totem ve küre kompozisyonları.'
        : 'Handmade ceramic sculptures, totem and sphere compositions.',
    },
    {
      icon: Lightbulb,
      title: language === 'tr' ? 'Marquee Işıklı Harf & Neon' : 'Marquee Letters & Neon',
      description: language === 'tr'
        ? 'Kişiselleştirilmiş ışıklı harfler, tabelalar ve neon tasarımlar.'
        : 'Personalized illuminated letters, signs, and neon designs.',
    },
    {
      icon: Mountain,
      title: language === 'tr' ? 'Taş & Doğal Malzeme Objeler' : 'Stone & Natural Material Objects',
      description: language === 'tr'
        ? 'Doğal taş görünümlü dekoratif parçalar ve heykelsi objeler.'
        : 'Natural stone-look decorative pieces and sculptural objects.',
    },
    {
      icon: Building2,
      title: language === 'tr' ? 'İnşaat & İç Mekân Malzemeleri' : 'Architectural Materials',
      description: language === 'tr'
        ? 'Mimari projeler için özel üretim malzemeler ve kaplamalar.'
        : 'Custom-made materials and coatings for architectural projects.',
    },
    {
      icon: Pencil,
      title: language === 'tr' ? 'Custom Tasarım & Özel Sipariş' : 'Custom Design & Bespoke',
      description: language === 'tr'
        ? 'Vizyonunuza özel tasarlanmış benzersiz sanat eserleri.'
        : 'Unique art pieces custom designed to your vision.',
    },
    {
      icon: Brush,
      title: language === 'tr' ? 'Mimarlık & İç Mekân Projeleri' : 'Architecture & Interior Projects',
      description: language === 'tr'
        ? 'Mimarlar ve iç mekân tasarımcıları için proje bazlı işbirlikleri.'
        : 'Project-based collaborations for architects and interior designers.',
    },
  ];

  const processSteps = [
    {
      step: '01',
      title: 'Concept',
      titleTr: 'Konsept',
      description: language === 'tr' ? 'Vizyon belirleme ve ilk görüşme' : 'Vision definition and initial consultation',
    },
    {
      step: '02',
      title: 'Design',
      titleTr: 'Tasarım',
      description: language === 'tr' ? 'Tasarım geliştirme ve onay süreci' : 'Design development and approval process',
    },
    {
      step: '03',
      title: 'Craft',
      titleTr: 'Üretim',
      description: language === 'tr' ? 'El yapımı üretim ve kalite kontrol' : 'Handmade production and quality control',
    },
    {
      step: '04',
      title: 'Delivery',
      titleTr: 'Teslimat',
      description: language === 'tr' ? 'Güvenli paketleme ve teslimat' : 'Safe packaging and delivery',
    },
  ];

  const testimonials = [
    {
      quote: language === 'tr'
        ? 'Mono Aurel ile çalışmak harika bir deneyimdi. Totem heykelleri evimize tam aradığımız karakteri kattı.'
        : 'Working with Mono Aurel was a wonderful experience. The totem sculptures added exactly the character we were looking for.',
      author: 'Ayşe K.',
      project: language === 'tr' ? 'Villa Projesi, İstanbul' : 'Villa Project, Istanbul',
    },
    {
      quote: language === 'tr'
        ? 'Düğünümüz için özel üretilen ışıklı harfler herkesi büyüledi. Profesyonellik ve sanat bir arada.'
        : 'The custom marquee letters made for our wedding enchanted everyone. Professionalism and art combined.',
      author: 'Elif & Mert',
      project: language === 'tr' ? 'Düğün, Bodrum' : 'Wedding, Bodrum',
    },
    {
      quote: language === 'tr'
        ? 'Ofisimiz için tasarlanan geometrik objeler mekanı tamamen dönüştürdü. Müşterilerimizden harika geri bildirimler alıyoruz.'
        : 'The geometric objects designed for our office completely transformed the space. We receive great feedback from our clients.',
      author: 'Can B.',
      project: language === 'tr' ? 'Kurumsal Ofis, Ankara' : 'Corporate Office, Ankara',
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.process-step', {
        x: -50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: timelineRef.current,
          start: 'top 70%',
        },
      });
    }, timelineRef);

    return () => ctx.revert();
  }, []);

  return (
    <main data-testid="about-page" className="min-h-screen bg-mono-cream">
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1716876995651-1ff85b65a6d9?crop=entropy&cs=srgb&fm=jpg&q=85"
            alt="Artisan at work"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-mono-cream/60 via-mono-cream/40 to-mono-cream" />
        </div>
        <div className="relative z-10 text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-6xl md:text-8xl italic font-light text-mono-primary mb-4"
          >
            {t('about.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-sans text-lg text-mono-secondary"
          >
            {t('about.subtitle')}
          </motion.p>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6 md:px-12 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-serif text-4xl md:text-5xl italic text-mono-primary mb-8">
                {t('about.storyTitle')}
              </h2>
              <div className="space-y-6 font-sans text-mono-secondary leading-relaxed">
                <p>
                  {language === 'tr'
                    ? 'Mono Aurel, İstanbul\'un kalbinde doğan bir sanat atölyesidir. 2016 yılından bu yana, ham malzemeleri benzersiz sanat eserlerine dönüştürüyoruz.'
                    : 'Mono Aurel is an art studio born in the heart of Istanbul. Since 2016, we have been transforming raw materials into unique works of art.'}
                </p>
                <p>
                  {language === 'tr'
                    ? 'Her eserimiz, sabır ve ustalıkla el yapımı olarak üretilmektedir. Seramik, taş ve metal gibi doğal malzemelerle çalışarak, mekanlarınıza karakter ve anlam katıyoruz.'
                    : 'Each piece is handcrafted with patience and expertise. Working with natural materials like ceramic, stone, and metal, we add character and meaning to your spaces.'}
                </p>
                <p>
                  {language === 'tr'
                    ? 'Amacımız, modern yaşam alanlarına sıcaklık ve derinlik katan, zamansız sanat eserleri yaratmaktır.'
                    : 'Our goal is to create timeless art pieces that add warmth and depth to modern living spaces.'}
                </p>
              </div>
            </div>
            <div className="relative aspect-[4/5] rounded-lg overflow-hidden">
              <img
                src="https://customer-assets.emergentagent.com/job_f854762d-e9d8-45ed-a96a-aa51980e7c30/artifacts/y2uawiad_artobject23.png"
                alt="Sphere sculpture"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 md:py-32 bg-mono-surface">
        <div className="container mx-auto px-6 md:px-12 lg:px-24">
          <h2 className="font-serif text-4xl md:text-5xl italic text-mono-primary mb-16 text-center">
            {t('about.servicesTitle')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group p-8 bg-mono-surface border border-mono-border rounded-lg hover:border-mono-accent/30 transition-colors"
                data-testid={`service-${index}`}
              >
                <service.icon size={32} className="text-mono-accent mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="font-serif text-xl italic text-mono-cream mb-3">{service.title}</h3>
                <p className="font-sans text-sm text-mono-secondary leading-relaxed">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section ref={timelineRef} className="py-24 md:py-32">
        <div className="container mx-auto px-6 md:px-12 lg:px-24">
          <h2 className="font-serif text-4xl md:text-5xl italic text-mono-primary mb-16 text-center">
            {t('about.processTitle')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="process-step" data-testid={`process-step-${index}`}>
                <span className="font-serif text-6xl italic text-mono-accent/30">{step.step}</span>
                <h3 className="font-serif text-2xl italic text-mono-cream mt-4 mb-2">
                  {language === 'tr' ? step.titleTr : step.title}
                </h3>
                <p className="font-sans text-sm text-mono-secondary">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 md:py-32 bg-mono-surface">
        <div className="container mx-auto px-6 md:px-12 lg:px-24">
          <h2 className="font-serif text-4xl md:text-5xl italic text-mono-primary mb-16 text-center">
            {t('about.testimonials')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-8"
                data-testid={`testimonial-${index}`}
              >
                <p className="font-serif text-xl italic text-mono-secondary/80 leading-relaxed mb-6">
                  "{testimonial.quote}"
                </p>
                <p className="font-sans text-sm text-mono-cream">{testimonial.author}</p>
                <p className="font-sans text-xs text-mono-secondary">{testimonial.project}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
