import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const WhatsAppButton = () => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const phoneNumber = '905551234567'; // Replace with actual number
  const message = 'Merhaba, Mono Aurel hakkında bilgi almak istiyorum.';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <AnimatePresence>
        {isTooltipVisible && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute right-16 bottom-2 glass px-4 py-2 rounded-lg whitespace-nowrap"
          >
            <span className="font-sans text-sm text-mono-cream">Bize Yazın</span>
          </motion.div>
        )}
      </AnimatePresence>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-testid="whatsapp-button"
        onMouseEnter={() => setIsTooltipVisible(true)}
        onMouseLeave={() => setIsTooltipVisible(false)}
        className="w-14 h-14 md:w-16 md:h-16 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
      >
        <MessageCircle size={28} />
      </a>
    </div>
  );
};

export const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(() => {
    return !localStorage.getItem('mono_aurel_cookie_consent');
  });

  const handleAccept = () => {
    localStorage.setItem('mono_aurel_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem('mono_aurel_cookie_consent', 'rejected');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
      data-testid="cookie-consent"
    >
      <div className="container mx-auto max-w-4xl">
        <div className="glass rounded-2xl p-6 flex flex-col md:flex-row items-center gap-4 border border-mono-border">
          <p className="font-sans text-sm text-mono-secondary flex-1">
            Deneyiminizi iyileştirmek için çerezler kullanıyoruz. Devam ederek çerez politikamızı kabul etmiş olursunuz.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={handleReject}
              className="px-4 py-2 font-sans text-xs uppercase tracking-widest text-mono-secondary hover:text-mono-cream transition-colors"
            >
              Reddet
            </button>
            <button
              onClick={handleAccept}
              data-testid="accept-cookies-btn"
              className="px-6 py-2 font-sans text-xs uppercase tracking-widest bg-mono-accent text-mono-black rounded-full hover:bg-mono-highlight transition-colors"
            >
              Kabul Et
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
