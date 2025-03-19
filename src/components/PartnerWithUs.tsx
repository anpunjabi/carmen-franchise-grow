
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const PartnerWithUs = () => {
  const partnershipTiles = [
    {
      type: 'Our program',
      title: 'Build for Others',
      imageUrl: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=600',
      link: '#build-for-others',
    },
    {
      type: 'Our service',
      title: 'Affiliate Program',
      imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=600',
      link: '#affiliate-program',
    },
  ];

  return (
    <section id="partnerships" className="py-24 bg-carmen-navy relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-pattern-dots"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 fade-in-up">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-5">
            Partner With Us
          </h2>
          <p className="text-lg text-white/80 max-w-3xl mx-auto">
            We deliver both cutting-edge BPM tools and deep integration support services. This powerful 
            combination means our technology is shaped by real-world expertise, while our support is 
            enhanced by proprietary workflow tools—giving you unparalleled flexibility.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 mt-12">
          {partnershipTiles.map((tile, index) => (
            <a 
              href={tile.link}
              key={index}
              className="block group fade-in-up"
              style={{ animationDelay: `${0.3 + index * 0.2}s` }}
            >
              <Card className="bg-carmen-sky/30 backdrop-blur-sm border-0 rounded-3xl overflow-hidden h-full hover:bg-carmen-sky/40 transition-all duration-300">
                <CardContent className="p-8 flex flex-col h-full">
                  <div className="text-white/70 text-sm mb-2">{tile.type}</div>
                  <h3 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold mb-8">
                    {tile.title}
                  </h3>
                  
                  <div className="mt-auto">
                    <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10"></div>
                      <img 
                        src={tile.imageUrl} 
                        alt={tile.title} 
                        className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="flex justify-end mt-4">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-carmen-navy transition-all duration-300">
                        <ChevronRight size={20} className="text-white group-hover:text-carmen-navy" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnerWithUs;
