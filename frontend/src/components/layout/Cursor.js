import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const text = textRef.current;

    if (!dot || !ring || !text) return;

    const onMouseMove = (e) => {
      gsap.to(dot, {
        x: e.clientX - 4,
        y: e.clientY - 4,
        duration: 0.1,
        ease: 'power2.out',
      });

      gsap.to(ring, {
        x: e.clientX - 20,
        y: e.clientY - 20,
        duration: 0.3,
        ease: 'power2.out',
      });

      gsap.to(text, {
        x: e.clientX + 25,
        y: e.clientY - 8,
        duration: 0.2,
        ease: 'power2.out',
      });
    };

    const onMouseEnterLink = () => {
      gsap.to(ring, {
        scale: 1.5,
        borderColor: 'rgba(201, 185, 154, 0.8)',
        duration: 0.3,
      });
      gsap.to(dot, {
        scale: 0.5,
        duration: 0.3,
      });
    };

    const onMouseLeaveLink = () => {
      gsap.to(ring, {
        scale: 1,
        borderColor: 'rgba(201, 185, 154, 0.5)',
        duration: 0.3,
      });
      gsap.to(dot, {
        scale: 1,
        duration: 0.3,
      });
      gsap.to(text, {
        opacity: 0,
        duration: 0.2,
      });
    };

    const onMouseEnterProduct = () => {
      gsap.to(text, {
        opacity: 1,
        duration: 0.3,
      });
      text.textContent = 'VIEW';
    };

    window.addEventListener('mousemove', onMouseMove);

    const links = document.querySelectorAll('a, button, [data-cursor-hover]');
    links.forEach((link) => {
      link.addEventListener('mouseenter', onMouseEnterLink);
      link.addEventListener('mouseleave', onMouseLeaveLink);
    });

    const products = document.querySelectorAll('[data-cursor-view]');
    products.forEach((product) => {
      product.addEventListener('mouseenter', onMouseEnterProduct);
      product.addEventListener('mouseleave', onMouseLeaveLink);
    });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      links.forEach((link) => {
        link.removeEventListener('mouseenter', onMouseEnterLink);
        link.removeEventListener('mouseleave', onMouseLeaveLink);
      });
      products.forEach((product) => {
        product.removeEventListener('mouseenter', onMouseEnterProduct);
        product.removeEventListener('mouseleave', onMouseLeaveLink);
      });
    };
  }, []);

  // Hide on mobile
  if (typeof window !== 'undefined' && window.innerWidth < 1024) {
    return null;
  }

  return (
    <>
      <div ref={dotRef} className="cursor-dot hidden lg:block" />
      <div ref={ringRef} className="cursor-ring hidden lg:block" />
      <div ref={textRef} className="cursor-text hidden lg:block" />
    </>
  );
};

export const GrainOverlay = () => {
  return <div className="grain-overlay" aria-hidden="true" />;
};
