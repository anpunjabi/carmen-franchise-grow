
import { useEffect } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import HeroSecondary from '@/components/HeroSecondary';
import HeroTertiary from '@/components/HeroTertiary';
import Features from '@/components/Features';
import Modules from '@/components/Modules';
import Partnerships from '@/components/Partnerships';
import Partner from '@/components/Partner';
import Footer from '@/components/Footer';
import SectionEditor from '@/components/SectionEditor';
import BookingSection from '@/components/BookingSection';

const Index = () => {
  useEffect(() => {
    // Intersection Observer for animation triggers
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe all fade-in elements
    document.querySelectorAll('.fade-in, .fade-in-up, .slide-in-right').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <SectionEditor />
      <main className="flex-grow">
        <div data-section-id="hero" data-section-order="0">
          <Hero />
        </div>
        <div data-section-id="hero-secondary" data-section-order="1">
          <HeroSecondary />
        </div>
        <div data-section-id="hero-tertiary" data-section-order="2">
          <HeroTertiary />
        </div>
        <div data-section-id="features" data-section-order="3">
          <Features />
        </div>
        <div data-section-id="modules" data-section-order="4">
          <Modules />
        </div>
        <div data-section-id="booking" data-section-order="5">
          <BookingSection />
        </div>
        <div data-section-id="partnerships" data-section-order="6">
          <Partnerships />
        </div>
        <div data-section-id="partner" data-section-order="7">
          <Partner />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
