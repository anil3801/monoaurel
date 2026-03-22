import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "sonner";

// Context
import { LanguageProvider } from "./context/LanguageContext";
import { CartProvider } from "./context/CartContext";

// Layout Components
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { CartDrawer } from "./components/layout/CartDrawer";
import { CustomCursor, GrainOverlay } from "./components/layout/Cursor";
import { WhatsAppButton, CookieConsent } from "./components/layout/FloatingElements";

// Pages
import HomePage from "./pages/HomePage";
import { ShopPage, ProductDetailPage } from "./pages/ShopPage";
import MarqueeLettersPage from "./pages/MarqueeLettersPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import FAQPage from "./pages/FAQPage";
import JournalPage from "./pages/JournalPage";
import InspirationPage from "./pages/InspirationPage";
import AdminPage from "./pages/AdminPage";

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  return (
    <LanguageProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="App min-h-screen bg-mono-cream text-mono-primary">
            <ScrollToTop />
            <CustomCursor />
            <GrainOverlay />
            <Navbar />
            <CartDrawer />
            
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/shop/:handle" element={<ProductDetailPage />} />
              <Route path="/marquee-letters" element={<MarqueeLettersPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/journal" element={<JournalPage />} />
              <Route path="/journal/:slug" element={<JournalPage />} />
              <Route path="/inspiration" element={<InspirationPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>

            <Footer />
            <WhatsAppButton />
            <CookieConsent />
            
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: '#ede8dc',
                  border: '1px solid rgba(139,111,71,0.2)',
                  color: '#1a1714',
                  fontFamily: '"DM Sans", sans-serif',
                },
              }}
            />
          </div>
        </BrowserRouter>
      </CartProvider>
    </LanguageProvider>
  );
}

export default App;
