import React from 'react';
import { Hero, MarqueeBanner } from '../components/home/Hero';
import { FeaturedWorks } from '../components/home/FeaturedWorks';
import { Philosophy } from '../components/home/Philosophy';
import { CustomCTA, Newsletter } from '../components/home/CTASections';

const HomePage = () => {
  return (
    <main data-testid="home-page">
      <Hero />
      <MarqueeBanner />
      <FeaturedWorks />
      <Philosophy />
      <CustomCTA />
      <Newsletter />
    </main>
  );
};

export default HomePage;
