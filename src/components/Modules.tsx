
import { useState } from 'react';
import { modules } from '@/data/moduleData';
import ModuleCollage from '@/components/ModuleCollage';
import ModuleSelector from '@/components/ModuleSelector';

const Modules = () => {
  const [activeTab, setActiveTab] = useState("quote-invoice");

  return (
    <section id="modules" className="py-24 relative overflow-hidden bg-white">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-0 w-1/2 h-1/2 bg-[#bbc1ff]/20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-[#0069e4]/10 blur-3xl rounded-full"></div>
        <div className="absolute inset-0 bg-pattern-dots opacity-30"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 fade-in-up">
          <h2 className="text-3xl md:text-5xl font-bold text-[#0049a4] mb-4">
            Featured <span className="bg-gradient-to-r from-[#0069e4] to-[#4a89f8] bg-clip-text text-transparent">Modules</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Mix and match these powerful modules to create your perfect BPM solution.
            Only pay for what you actually need and use.
          </p>
        </div>

        <div className="grid md:grid-cols-1 lg:grid-cols-[1fr,1.5fr] gap-8 lg:gap-12">
          {/* Left side - Module selection buttons */}
          <ModuleSelector 
            modules={modules} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />

          {/* Right side - Collage display */}
          <div className="relative h-[450px] md:h-[550px] fade-in-up bg-white/70 backdrop-blur-sm rounded-3xl overflow-hidden shadow-md border border-white">
            {modules.map((module, index) => (
              <div 
                key={module.id}
                className={`absolute inset-0 transition-all duration-500 ${
                  activeTab === module.id ? "opacity-100 scale-100 z-10" : "opacity-0 scale-95 z-0"
                }`}
              >
                <ModuleCollage 
                  data={module.collage} 
                  description={module.description}
                  variant={index % 4} 
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Modules;
