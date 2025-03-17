
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const Modules = () => {
  const [activeTab, setActiveTab] = useState("quote-invoice");
  
  const modules = [
    {
      id: "quote-invoice",
      title: "Quote and Invoice Builder",
      description: "Create professional quotes and invoices in minutes with customizable templates.",
      collage: {
        photo: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600&h=400",
        screenshot: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600&h=400",
        tagline1: "Simple",
        tagline2: "Professional"
      }
    },
    {
      id: "project-tracker",
      title: "Project Tracker",
      description: "Keep projects on schedule and within budget with comprehensive tracking tools.",
      collage: {
        photo: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&q=80&w=600&h=400",
        screenshot: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&q=80&w=600&h=400",
        tagline1: "Organized",
        tagline2: "Efficient"
      }
    },
    {
      id: "appointment-scheduler",
      title: "Appointment Scheduler",
      description: "Streamline booking with an intelligent scheduling system that integrates with your calendar.",
      collage: {
        photo: "https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&q=80&w=600&h=400",
        screenshot: "https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&q=80&w=600&h=400",
        tagline1: "Seamless",
        tagline2: "Automated"
      }
    },
    {
      id: "pipeline-analytics",
      title: "Pipeline Analytics",
      description: "Gain insights into your sales pipeline with powerful analytics and visualization tools.",
      collage: {
        photo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600&h=400",
        screenshot: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600&h=400",
        tagline1: "Insightful",
        tagline2: "Strategic"
      }
    }
  ];

  return (
    <section id="modules" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-0 w-1/2 h-1/2 bg-carmen-blue/5 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-carmen-navy/10 blur-3xl rounded-full"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured <span className="bg-carmen-gradient bg-clip-text text-transparent">Modules</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Mix and match these powerful modules to create your perfect BPM solution.
            Only pay for what you actually need and use.
          </p>
        </div>

        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left side - Module selection buttons */}
          <div className="space-y-3 fade-in-up">
            <p className="text-lg font-medium text-gray-800 mb-4">Select a module to learn more:</p>
            {modules.map((module) => (
              <Button
                key={module.id}
                variant="outline"
                className={`w-full justify-start text-left py-6 px-6 rounded-xl transition-all duration-300 ${
                  activeTab === module.id 
                    ? "bg-carmen-navy/10 border-carmen-navy text-carmen-navy font-medium" 
                    : "hover:bg-gray-50 text-gray-700"
                }`}
                onClick={() => setActiveTab(module.id)}
              >
                <div>
                  <h3 className="text-lg font-medium mb-1">{module.title}</h3>
                  <p className="text-sm opacity-80 line-clamp-2">{module.description}</p>
                </div>
              </Button>
            ))}
          </div>

          {/* Right side - Module collages */}
          <div className="relative h-[400px] md:h-[500px] fade-in-up">
            {modules.map((module, index) => (
              <div 
                key={module.id}
                className={`absolute inset-0 transition-all duration-300 ${
                  activeTab === module.id ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                <ModuleCollage 
                  data={module.collage} 
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

const ModuleCollage = ({ data, variant = 0 }) => {
  // Different layout variants for visual variety
  const layouts = [
    // Variant 0: Photo top-left, screenshot bottom-right, taglines in between
    "photo-left-top",
    // Variant 1: Screenshot top-right, photo bottom-left, taglines in between
    "screenshot-right-top",
    // Variant 2: Photo centered-top, screenshot bottom, taglines right
    "photo-centered",
    // Variant 3: Screenshot centered-right, photo left, taglines bottom
    "screenshot-right"
  ];
  
  const layout = layouts[variant];
  
  return (
    <div className="w-full h-full relative">
      {/* Photo */}
      <div className={`absolute rounded-2xl overflow-hidden shadow-lg ${
        layout === "photo-left-top" 
          ? "top-0 left-0 w-3/4 h-3/5" 
          : layout === "screenshot-right-top" 
          ? "bottom-0 left-0 w-3/5 h-3/5" 
          : layout === "photo-centered" 
          ? "top-0 left-1/2 transform -translate-x-1/2 w-4/5 h-1/2" 
          : "left-0 top-1/4 w-3/5 h-3/5"
      }`}>
        <img 
          src={data.photo} 
          alt="Module visual" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Screenshot */}
      <div className={`absolute rounded-2xl overflow-hidden border-4 border-white shadow-xl ${
        layout === "photo-left-top" 
          ? "bottom-0 right-0 w-3/5 h-1/2" 
          : layout === "screenshot-right-top" 
          ? "top-0 right-0 w-2/3 h-1/2" 
          : layout === "photo-centered" 
          ? "bottom-0 right-0 w-3/5 h-2/5" 
          : "right-0 top-0 w-1/2 h-3/5"
      }`}>
        <img 
          src={data.screenshot} 
          alt="Module interface" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Tagline 1 */}
      <div className={`absolute bg-carmen-navy text-white px-6 py-3 rounded-full shadow-lg ${
        layout === "photo-left-top" 
          ? "top-1/3 right-1/4" 
          : layout === "screenshot-right-top" 
          ? "top-1/3 right-1/3" 
          : layout === "photo-centered" 
          ? "top-1/3 right-1/6" 
          : "bottom-1/4 left-1/4"
      }`}>
        <p className="font-medium">{data.tagline1}</p>
      </div>
      
      {/* Tagline 2 */}
      <div className={`absolute bg-carmen-navy text-white px-6 py-3 rounded-full shadow-lg ${
        layout === "photo-left-top" 
          ? "bottom-1/4 left-1/4" 
          : layout === "screenshot-right-top" 
          ? "top-2/3 left-1/6" 
          : layout === "photo-centered" 
          ? "right-1/3 bottom-1/6" 
          : "bottom-1/6 right-1/6"
      }`}>
        <p className="font-medium">{data.tagline2}</p>
      </div>
    </div>
  );
};

export default Modules;
