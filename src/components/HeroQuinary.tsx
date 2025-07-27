import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EditableText from './EditableText';
import { useElementVisibility } from '@/hooks/useElementVisibility';

const HeroQuinary = () => {
  const { isElementVisible } = useElementVisibility();
  return (
    <section className="relative pt-20 md:pt-32 pb-16 md:pb-24 overflow-hidden bg-carmen-cream" id="hero-quinary" data-section-id="hero-quinary" data-section-name="Flexible Software Hero">
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
            {isElementVisible('hero-quinary-heading') && (
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-carmen-navy mb-6 leading-tight text-balance max-w-md lg:max-w-xl" data-editable-id="hero-quinary-heading">
                <EditableText id="hero-quinary-heading-1" as="span" className="bg-carmen-gradient bg-clip-text text-transparent">
                  Flexible software
                </EditableText>
                <EditableText id="hero-quinary-heading-2" as="span">
                  {' that adapts to your business needs'}
                </EditableText>
              </h1>
            )}
            {isElementVisible('hero-quinary-description') && (
              <EditableText id="hero-quinary-paragraph" as="p" className="text-lg text-gray-600 mb-8 max-w-lg text-balance" data-editable-id="hero-quinary-description">
                Carmen grows with your business. Start with the essentials and add modules as you need them. No more paying for features you don't use.
              </EditableText>
            )}
            
            {isElementVisible('hero-quinary-buttons') && (
              <div className="flex flex-col sm:flex-row gap-4" data-editable-id="hero-quinary-buttons">
                <Button className="bg-carmen-gradient text-white hover:opacity-90 transition-all duration-300 font-medium px-6 py-3 rounded-xl shadow-soft active:scale-95 transform" onClick={() => window.location.href = '#contact'}>
                  <EditableText id="hero-quinary-button-primary">
                    Book a Demo
                  </EditableText>
                  <ArrowRight size={16} className="ml-2" />
                </Button>
                <Button variant="outline" className="border-carmen-teal text-carmen-teal hover:bg-carmen-teal/10 rounded-xl" onClick={() => window.location.href = '#modules'}>
                  <EditableText id="hero-quinary-button-secondary">
                    View Modules
                  </EditableText>
                </Button>
              </div>
            )}
          </div>
          
          {isElementVisible('hero-quinary-image-section') && (
            <div className="md:w-1/2 md:pr-12 fade-in-up" style={{
              animationDelay: '0.3s'
            }} data-editable-id="hero-quinary-image-section">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-carmen-teal/20 to-carmen-sky/20 rounded-3xl blur-xl animate-floating"></div>
                <div className="relative bg-white p-2 rounded-3xl shadow-soft overflow-hidden border border-white">
                  <img src="https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?auto=format&fit=crop&q=80&w=800&h=600" alt="Custom Business Solution" className="w-full h-auto rounded-2xl shadow-sm" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white/90 to-white/0 p-4">
                    <div className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-sm border border-white">
                      <EditableText id="hero-quinary-card-title" as="h3" className="text-carmen-navy font-semibold mb-1">
                        Modular BPM Solutions
                      </EditableText>
                      <EditableText id="hero-quinary-card-description" as="p" className="text-sm text-gray-600">
                        Add only the features your business needs
                      </EditableText>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroQuinary;
