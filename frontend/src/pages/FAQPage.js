import React from 'react';
import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';
import { useLanguage } from '../context/LanguageContext';

const FAQPage = () => {
  const { t, language } = useLanguage();

  const faqData = {
    ordering: {
      title: t('faq.categories.ordering'),
      items: [
        {
          question: language === 'tr' ? 'Nasıl sipariş verebilirim?' : 'How can I place an order?',
          answer: language === 'tr'
            ? 'Web sitemizden ürünleri sepete ekleyerek sipariş verebilirsiniz. Özel tasarım talepleriniz için iletişim formunu kullanabilir veya bize WhatsApp üzerinden ulaşabilirsiniz.'
            : 'You can place an order by adding products to your cart from our website. For custom design requests, you can use the contact form or reach us via WhatsApp.',
        },
        {
          question: language === 'tr' ? 'Hangi ödeme yöntemlerini kabul ediyorsunuz?' : 'What payment methods do you accept?',
          answer: language === 'tr'
            ? 'Kredi kartı, banka kartı ve havale/EFT ile ödeme yapabilirsiniz. Türkiye içi siparişlerde iyzico, yurtdışı siparişlerde Stripe altyapısını kullanıyoruz. Taksit seçenekleri mevcuttur.'
            : 'We accept credit cards, debit cards, and bank transfers. We use iyzico for domestic orders and Stripe for international orders. Installment options are available.',
        },
        {
          question: language === 'tr' ? 'Taksitle ödeme yapabilir miyim?' : 'Can I pay in installments?',
          answer: language === 'tr'
            ? 'Evet, Türkiye içi siparişlerde 2, 3, 6 ve 9 taksit seçenekleri mevcuttur. Taksit seçenekleri ödeme sayfasında görüntülenecektir.'
            : 'Yes, for domestic orders in Turkey, 2, 3, 6, and 9 installment options are available. Installment options will be displayed on the payment page.',
        },
      ],
    },
    shipping: {
      title: t('faq.categories.shipping'),
      items: [
        {
          question: language === 'tr' ? 'Kargo süresi ne kadar?' : 'How long is the delivery time?',
          answer: language === 'tr'
            ? 'Stokta olan ürünler için Türkiye içi teslimat 3-5 iş günüdür. Sipariş üzerine üretilen ürünler için üretim süresi 2-4 hafta arasında değişmektedir. Yurtdışı kargo için lütfen iletişime geçin.'
            : 'For in-stock items, domestic delivery within Turkey is 3-5 business days. For made-to-order products, production time varies between 2-4 weeks. For international shipping, please contact us.',
        },
        {
          question: language === 'tr' ? 'Kırılma garantisi var mı?' : 'Is there a breakage guarantee?',
          answer: language === 'tr'
            ? 'Evet, tüm ürünlerimiz profesyonelce paketlenir ve sigortalı olarak gönderilir. Nakliye sırasında oluşan hasarlarda ücretsiz değişim yapılmaktadır.'
            : 'Yes, all our products are professionally packaged and shipped with insurance. Free replacement is provided for damage during shipping.',
        },
        {
          question: language === 'tr' ? 'Yurtdışına kargo yapıyor musunuz?' : 'Do you ship internationally?',
          answer: language === 'tr'
            ? 'Evet, dünya genelinde kargo yapıyoruz. Yurtdışı siparişler için kargo ücreti ve süresi destinasyona göre değişmektedir. Detaylı bilgi için lütfen iletişime geçin.'
            : 'Yes, we ship worldwide. For international orders, shipping costs and times vary by destination. Please contact us for detailed information.',
        },
      ],
    },
    custom: {
      title: t('faq.categories.custom'),
      items: [
        {
          question: language === 'tr' ? 'Özel tasarım süreci nasıl işliyor?' : 'How does the custom design process work?',
          answer: language === 'tr'
            ? '1) İletişim formu veya WhatsApp üzerinden vizyonunuzu paylaşın. 2) Ekibimiz sizinle iletişime geçerek detayları konuşur. 3) Tasarım teklifinizi hazırlarız. 4) Onayınızın ardından üretime başlarız. 5) Üretim tamamlandığında teslimat yapılır.'
            : '1) Share your vision via contact form or WhatsApp. 2) Our team will contact you to discuss details. 3) We prepare your design proposal. 4) Production begins after your approval. 5) Delivery is made when production is complete.',
        },
        {
          question: language === 'tr' ? 'Özel sipariş ne kadar sürer?' : 'How long does a custom order take?',
          answer: language === 'tr'
            ? 'Tasarım onayından sonra üretim süresi projenin karmaşıklığına göre 3-8 hafta arasında değişmektedir. Acil projeler için lütfen önceden iletişime geçin.'
            : 'After design approval, production time varies between 3-8 weeks depending on project complexity. For urgent projects, please contact us in advance.',
        },
        {
          question: language === 'tr' ? 'Minimum sipariş miktarı var mı?' : 'Is there a minimum order quantity?',
          answer: language === 'tr'
            ? 'Bireysel müşteriler için minimum sipariş yoktur. B2B ve toplu siparişlerde minimum miktarlar proje bazında belirlenir.'
            : 'There is no minimum order for individual customers. For B2B and bulk orders, minimum quantities are determined on a project basis.',
        },
      ],
    },
    materials: {
      title: t('faq.categories.materials'),
      items: [
        {
          question: language === 'tr' ? 'Hangi malzemelerle çalışıyorsunuz?' : 'What materials do you work with?',
          answer: language === 'tr'
            ? 'Seramik, taş, metal, ahşap ve cam gibi doğal malzemelerle çalışıyoruz. Her proje için en uygun malzemeyi birlikte belirleriz.'
            : 'We work with natural materials such as ceramic, stone, metal, wood, and glass. We determine the most suitable material for each project together.',
        },
        {
          question: language === 'tr' ? 'Ürünler iç mekan ve dış mekan için uygun mu?' : 'Are products suitable for indoor and outdoor use?',
          answer: language === 'tr'
            ? 'Çoğu ürünümüz iç mekan kullanımı için tasarlanmıştır. Dış mekan kullanımı için özel üretim ve kaplama seçenekleri mevcuttur. Lütfen sipariş öncesi belirtin.'
            : 'Most of our products are designed for indoor use. Special production and coating options are available for outdoor use. Please specify before ordering.',
        },
      ],
    },
    marquee: {
      title: t('faq.categories.marquee'),
      items: [
        {
          question: language === 'tr' ? 'Işıklı harfler için kiralama seçeneği var mı?' : 'Is there a rental option for marquee letters?',
          answer: language === 'tr'
            ? 'Evet, düğün ve etkinlikler için ışıklı harf kiralama hizmeti sunuyoruz. Kiralama süresi ve fiyatları için iletişime geçin.'
            : 'Yes, we offer marquee letter rental service for weddings and events. Contact us for rental duration and prices.',
        },
        {
          question: language === 'tr' ? 'Kurulum dahil mi?' : 'Is installation included?',
          answer: language === 'tr'
            ? 'İstanbul içi teslimatlar için kurulum hizmeti sunuyoruz. Diğer şehirler için kurulum kılavuzu gönderilmektedir.'
            : 'We offer installation service for deliveries within Istanbul. For other cities, an installation guide is provided.',
        },
        {
          question: language === 'tr' ? 'Hangi boyutlar mevcut?' : 'What sizes are available?',
          answer: language === 'tr'
            ? 'Standart boyutlarımız 30cm, 50cm, 80cm ve 120cm\'dir. Özel boyutlar talep üzerine üretilebilir.'
            : 'Our standard sizes are 30cm, 50cm, 80cm, and 120cm. Custom sizes can be produced upon request.',
        },
      ],
    },
    returns: {
      title: t('faq.categories.returns'),
      items: [
        {
          question: language === 'tr' ? 'Özel siparişlerde iade mümkün mü?' : 'Is return possible for custom orders?',
          answer: language === 'tr'
            ? 'Özel tasarım ürünlerde, müşterinin onayladığı tasarıma uygun üretilmiş ürünler için iade kabul edilmemektedir. Üretim hatası durumunda ücretsiz değişim yapılır.'
            : 'For custom design products, returns are not accepted for products manufactured according to the design approved by the customer. Free replacement is made in case of manufacturing defects.',
        },
        {
          question: language === 'tr' ? 'Stok ürünlerde iade süreci nasıl?' : 'What is the return process for stock products?',
          answer: language === 'tr'
            ? 'Stok ürünlerde teslim tarihinden itibaren 14 gün içinde iade talebinde bulunabilirsiniz. Ürün orijinal ambalajında ve kullanılmamış olmalıdır.'
            : 'For stock products, you can request a return within 14 days of delivery. The product must be in its original packaging and unused.',
        },
        {
          question: language === 'tr' ? 'Hasarlı ürün gelirse ne yapmalıyım?' : 'What should I do if I receive a damaged product?',
          answer: language === 'tr'
            ? 'Teslim aldığınız anda hasarı fotoğraflayarak 24 saat içinde bize bildirin. Sigortalı kargo sayesinde ücretsiz değişim yapılacaktır.'
            : 'Photograph the damage upon receipt and notify us within 24 hours. Free replacement will be made thanks to insured shipping.',
        },
      ],
    },
  };

  return (
    <main data-testid="faq-page" className="min-h-screen bg-mono-cream pt-32 pb-24">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-5xl md:text-7xl italic font-light text-mono-cream mb-16 text-center"
        >
          {t('faq.title')}
        </motion.h1>

        <div className="max-w-3xl mx-auto space-y-12">
          {Object.entries(faqData).map(([key, category], categoryIndex) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1 }}
              data-testid={`faq-category-${key}`}
            >
              <h2 className="font-serif text-2xl italic text-mono-accent mb-6">
                {category.title}
              </h2>
              <Accordion type="single" collapsible className="space-y-4">
                {category.items.map((item, index) => (
                  <AccordionItem
                    key={index}
                    value={`${key}-${index}`}
                    className="border border-mono-border rounded-lg overflow-hidden"
                    data-testid={`faq-item-${key}-${index}`}
                  >
                    <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-mono-surface-hover transition-colors">
                      <span className="font-sans text-left text-mono-cream">{item.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
                      <p className="font-sans text-mono-secondary leading-relaxed">{item.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default FAQPage;
