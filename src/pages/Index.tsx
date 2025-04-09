
import { useEffect } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
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
        <div data-section-id="hero">
          <Hero />
        </div>
        <div data-section-id="features">
          <Features />
        </div>
        <div data-section-id="modules">
          <Modules />
        </div>
        <div data-section-id="booking">
          <BookingSection />
        </div>
        <div data-section-id="partnerships">
          <Partnerships />
        </div>
        <div data-section-id="partner">
          <Partner />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
