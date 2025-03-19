
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from 'lucide-react';

const PartnershipCard = ({ 
  type, 
  title, 
  description, 
  bgColor, 
  images 
}: { 
  type: string;
  title: string;
  description: string;
  bgColor: string;
  images: string[];
}) => (
  <Card className={`overflow-hidden border-none shadow-soft ${bgColor} h-full`}>
    <CardContent className="p-8 flex flex-col h-full">
      <div className="mb-6">
        <p className="text-sm font-medium opacity-80">{type}</p>
        <h3 className="text-3xl md:text-4xl font-bold mt-2">{title}</h3>
      </div>
      <p className="text-lg mb-8">{description}</p>
      <div className="mt-auto grid grid-cols-2 md:grid-cols-3 gap-3">
        {images.map((src, index) => (
          <div 
            key={index}
            className="relative aspect-square rounded-lg overflow-hidden bg-white/30 backdrop-blur-sm shadow-sm"
          >
            {/* This would normally have images, using placeholders for now */}
            <div className={`absolute inset-0 bg-${index % 2 === 0 ? 'carmen-navy/10' : 'carmen-blue/10'} flex items-center justify-center`}>
              {index % 3 === 0 && <span className="px-2 py-1 text-xs bg-black/70 text-white rounded-full">Feature</span>}
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const Partnerships = () => {
  return (
    <section className="bg-carmen-navy text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 fade-in-up">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Partner with Us
          </h2>
          <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-90">
            We deliver both cutting-edge BPM tools and deep strategic consulting services. This 
            powerful combination means our technology is shaped by real-world expertise, while 
            our consulting is enhanced by proprietary data tools—giving you unparalleled insights 
            into processes and workflows.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          <div className="fade-in-up" style={{ animationDelay: "0.2s" }}>
            <PartnershipCard
              type="Our program"
              title="Build for Others"
              description="Have you identified market demand for a particular BPM tool? Build it with Carmen."
              bgColor="bg-carmen-sky/30"
              images={Array(6).fill('')}
            />
          </div>
          
          <div className="fade-in-up" style={{ animationDelay: "0.4s" }}>
            <PartnershipCard
              type="Our service"
              title="Affiliate Program"
              description="Refer clients to Carmen BPM and earn commissions while providing your customers with the best BPM solution."
              bgColor="bg-carmen-lavender/30"
              images={Array(6).fill('')}
            />
          </div>
        </div>
        
        <div className="mt-10 text-center">
          <button className="carmen-btn group">
            Become a Partner
            <ArrowRight size={18} className="inline-block ml-2 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Partnerships;
