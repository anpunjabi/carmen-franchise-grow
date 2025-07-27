import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSecondary = () => {
  return (
    <section className="relative pt-20 md:pt-32 pb-16 md:pb-24 overflow-hidden bg-carmen-cream" id="hero-secondary" data-section-id="hero-secondary" data-section-name="Flexible Features Hero">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-carmen-soft-teal/20 blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 rounded-full bg-carmen-sky/20 blur-3xl"></div>
        <div className="absolute inset-0 bg-pattern-dots opacity-30"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row-reverse items-center">
          <div className="md:w-1/2 mb-12 md:mb-0 fade-in-up" style={{
          animationDelay: '0.1s'
        }}>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-carmen-navy mb-6 leading-tight text-balance max-w-md lg:max-w-xl">
              <span className="bg-carmen-gradient bg-clip-text text-transparent">
                Flexible software
              </span>
              {' that adapts to your business needs'}
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg text-balance">
              Carmen grows with your business. Start with the essentials and add modules as you need them. No more paying for features you don't use.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-carmen-gradient text-white hover:opacity-90 transition-all duration-300 font-medium px-6 py-3 rounded-xl shadow-soft active:scale-95 transform" onClick={() => window.location.href = '#contact'}>
                Book a Demo
                <ArrowRight size={16} className="ml-2" />
              </Button>
              <Button variant="outline" className="border-carmen-teal text-carmen-teal hover:bg-carmen-teal/10 rounded-xl" onClick={() => window.location.href = '#modules'}>
                View Modules
              </Button>
            </div>
          </div>
          
          <div className="md:w-1/2 md:pr-12 fade-in-up" style={{
            animationDelay: '0.3s'
          }}>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-carmen-teal/20 to-carmen-sky/20 rounded-3xl blur-xl animate-floating"></div>
              <div className="relative bg-white p-2 rounded-3xl shadow-soft overflow-hidden border border-white">
                <img src="https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?auto=format&fit=crop&q=80&w=800&h=600" alt="Custom Business Solution" className="w-full h-auto rounded-2xl shadow-sm" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white/90 to-white/0 p-4">
                  <div className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-sm border border-white">
                    <h3 className="text-carmen-navy font-semibold mb-1">
                      Modular BPM Solutions
                    </h3>
                    <p className="text-sm text-gray-600">
                      Add only the features your business needs
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSecondary;