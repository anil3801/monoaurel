import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Phone, Mail, MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import axios from 'axios';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const ContactPage = () => {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
    message: '',
    budget_range: '',
    preferred_contact: 'email',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { value: 'sculpture', label: language === 'tr' ? 'Heykel & Sanat Objeleri' : 'Sculpture & Art Objects' },
    { value: 'marquee', label: language === 'tr' ? 'Işıklı Harfler' : 'Marquee Letters' },
    { value: 'custom', label: language === 'tr' ? 'Özel Tasarım' : 'Custom Design' },
    { value: 'architectural', label: language === 'tr' ? 'Mimari Malzemeler' : 'Architectural Materials' },
    { value: 'wholesale', label: 'B2B / Wholesale' },
    { value: 'other', label: language === 'tr' ? 'Diğer' : 'Other' },
  ];

  const budgetRanges = [
    { value: '5000-15000', label: '₺5.000 - ₺15.000' },
    { value: '15000-30000', label: '₺15.000 - ₺30.000' },
    { value: '30000-50000', label: '₺30.000 - ₺50.000' },
    { value: '50000+', label: '₺50.000+' },
    { value: 'not-sure', label: language === 'tr' ? 'Henüz belirlenmedi' : 'Not yet determined' },
  ];

  const contactMethods = [
    { value: 'email', label: 'E-posta' },
    { value: 'phone', label: language === 'tr' ? 'Telefon' : 'Phone' },
    { value: 'whatsapp', label: 'WhatsApp' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post(`${API}/quotes`, formData);
      toast.success(t('contact.success'));
      setFormData({
        name: '',
        email: '',
        phone: '',
        category: '',
        message: '',
        budget_range: '',
        preferred_contact: 'email',
      });
    } catch (error) {
      toast.error(language === 'tr' ? 'Bir hata oluştu. Lütfen tekrar deneyin.' : 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main data-testid="contact-page" className="min-h-screen bg-mono-cream pt-32 pb-24">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left - Contact Info */}
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-serif text-5xl md:text-6xl italic font-light text-mono-primary mb-8"
            >
              {t('contact.title')}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-sans text-mono-secondary leading-relaxed mb-12"
            >
              {language === 'tr'
                ? 'Bir projeniz mi var? Birlikte çalışmak için iletişime geçin. Tüm sorularınızı yanıtlamaktan mutluluk duyarız.'
                : 'Have a project in mind? Get in touch to work together. We\'d be happy to answer all your questions.'}
            </motion.p>

            <div className="space-y-8">
              {/* Address */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex gap-4"
              >
                <MapPin size={24} className="text-mono-accent flex-shrink-0" />
                <div>
                  <h3 className="font-sans text-xs uppercase tracking-widest text-mono-accent mb-2">
                    {t('contact.address')}
                  </h3>
                  <p className="font-sans text-mono-secondary">
                    Mono Aurel Atölye<br />
                    Karaköy, Beyoğlu<br />
                    İstanbul, Türkiye
                  </p>
                </div>
              </motion.div>

              {/* Hours */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex gap-4"
              >
                <Clock size={24} className="text-mono-accent flex-shrink-0" />
                <div>
                  <h3 className="font-sans text-xs uppercase tracking-widest text-mono-accent mb-2">
                    {t('contact.hours')}
                  </h3>
                  <p className="font-sans text-mono-secondary">
                    {language === 'tr' ? 'Pazartesi - Cuma' : 'Monday - Friday'}: 10:00 - 18:00<br />
                    {language === 'tr' ? 'Cumartesi' : 'Saturday'}: 11:00 - 16:00<br />
                    {language === 'tr' ? 'Pazar' : 'Sunday'}: {language === 'tr' ? 'Kapalı' : 'Closed'}
                  </p>
                </div>
              </motion.div>

              {/* Phone */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex gap-4"
              >
                <Phone size={24} className="text-mono-accent flex-shrink-0" />
                <div>
                  <h3 className="font-sans text-xs uppercase tracking-widest text-mono-accent mb-2">
                    {t('contact.phone')}
                  </h3>
                  <a href="tel:+905551234567" className="font-sans text-mono-secondary hover:text-mono-cream transition-colors">
                    +90 555 123 45 67
                  </a>
                </div>
              </motion.div>

              {/* Email */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="flex gap-4"
              >
                <Mail size={24} className="text-mono-accent flex-shrink-0" />
                <div>
                  <h3 className="font-sans text-xs uppercase tracking-widest text-mono-accent mb-2">
                    {t('contact.email')}
                  </h3>
                  <a href="mailto:hello@monoaurel.com" className="font-sans text-mono-secondary hover:text-mono-cream transition-colors">
                    hello@monoaurel.com
                  </a>
                </div>
              </motion.div>

              {/* Social */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="pt-8 border-t border-mono-border"
              >
                <div className="flex gap-4">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 border border-mono-border rounded-full font-sans text-xs uppercase tracking-widest text-mono-secondary hover:border-mono-accent hover:text-mono-primary transition-colors"
                  >
                    Instagram
                  </a>
                  <a
                    href="https://wa.me/905551234567"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 border border-mono-border rounded-full font-sans text-xs uppercase tracking-widest text-mono-secondary hover:border-mono-accent hover:text-mono-cream transition-colors flex items-center gap-2"
                  >
                    <MessageCircle size={16} />
                    WhatsApp
                  </a>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right - Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-mono-surface rounded-2xl p-8 md:p-12"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
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
                  data-testid="contact-form-name"
                  className="w-full bg-transparent border-b border-mono-border px-0 py-3 font-sans text-mono-cream focus:border-mono-accent transition-colors"
                />
              </div>

              {/* Email */}
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
                  data-testid="contact-form-email"
                  className="w-full bg-transparent border-b border-mono-border px-0 py-3 font-sans text-mono-cream focus:border-mono-accent transition-colors"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block font-sans text-xs uppercase tracking-widest text-mono-secondary mb-2">
                  {t('contact.phone')}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  data-testid="contact-form-phone"
                  className="w-full bg-transparent border-b border-mono-border px-0 py-3 font-sans text-mono-cream focus:border-mono-accent transition-colors"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block font-sans text-xs uppercase tracking-widest text-mono-secondary mb-2">
                  {t('contact.category')} *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  data-testid="contact-form-category"
                  className="w-full bg-transparent border-b border-mono-border px-0 py-3 font-sans text-mono-cream focus:border-mono-accent transition-colors"
                >
                  <option value="" className="bg-mono-surface">{language === 'tr' ? 'Seçiniz' : 'Select'}</option>
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value} className="bg-mono-surface">{cat.label}</option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block font-sans text-xs uppercase tracking-widest text-mono-secondary mb-2">
                  {t('contact.message')} *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  data-testid="contact-form-message"
                  className="w-full bg-transparent border-b border-mono-border px-0 py-3 font-sans text-mono-cream focus:border-mono-accent transition-colors resize-none"
                />
              </div>

              {/* Budget */}
              <div>
                <label className="block font-sans text-xs uppercase tracking-widest text-mono-secondary mb-2">
                  {t('contact.budget')}
                </label>
                <select
                  name="budget_range"
                  value={formData.budget_range}
                  onChange={handleInputChange}
                  data-testid="contact-form-budget"
                  className="w-full bg-transparent border-b border-mono-border px-0 py-3 font-sans text-mono-cream focus:border-mono-accent transition-colors"
                >
                  <option value="" className="bg-mono-surface">{language === 'tr' ? 'Seçiniz' : 'Select'}</option>
                  {budgetRanges.map((range) => (
                    <option key={range.value} value={range.value} className="bg-mono-surface">{range.label}</option>
                  ))}
                </select>
              </div>

              {/* Preferred Contact */}
              <div>
                <label className="block font-sans text-xs uppercase tracking-widest text-mono-secondary mb-3">
                  {t('contact.preferredContact')}
                </label>
                <div className="flex flex-wrap gap-3">
                  {contactMethods.map((method) => (
                    <label
                      key={method.value}
                      className={`px-4 py-2 border rounded-full cursor-pointer transition-colors ${
                        formData.preferred_contact === method.value
                          ? 'border-mono-accent bg-mono-accent text-mono-black'
                          : 'border-mono-border text-mono-secondary hover:border-mono-accent'
                      }`}
                    >
                      <input
                        type="radio"
                        name="preferred_contact"
                        value={method.value}
                        checked={formData.preferred_contact === method.value}
                        onChange={handleInputChange}
                        className="hidden"
                      />
                      <span className="font-sans text-xs uppercase tracking-widest">{method.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                data-testid="contact-form-submit"
                className="w-full py-4 mt-8 font-sans text-sm uppercase tracking-widest bg-mono-accent text-mono-black rounded-full hover:bg-mono-highlight transition-colors disabled:opacity-50"
              >
                {isSubmitting ? '...' : t('contact.submit')}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Map Placeholder */}
        <div className="mt-24 h-[400px] bg-mono-surface rounded-lg overflow-hidden">
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <MapPin size={48} className="text-mono-accent/30 mx-auto mb-4" />
              <p className="font-sans text-mono-secondary">
                {language === 'tr' ? 'Karaköy, Beyoğlu, İstanbul' : 'Karaköy, Beyoğlu, Istanbul'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ContactPage;
