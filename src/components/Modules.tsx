
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { User, BarChart2, Calendar, LineChart } from 'lucide-react';

const Modules = () => {
  const [activeTab, setActiveTab] = useState("quote-invoice");
  
  const modules = [
    {
      id: "quote-invoice",
      title: "Quote and Invoice Builder",
      description: "Create professional quotes and invoices in minutes with customizable templates.",
      icon: <User className="w-5 h-5" />,
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
      icon: <BarChart2 className="w-5 h-5" />,
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
      icon: <Calendar className="w-5 h-5" />,
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
      icon: <LineChart className="w-5 h-5" />,
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
        <div className="absolute top-1/3 left-0 w-1/2 h-1/2 bg-carmen-navy/5 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-carmen-navy/10 blur-3xl rounded-full"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 fade-in-up">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Featured <span className="bg-carmen-gradient bg-clip-text text-transparent">Modules</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Mix and match these powerful modules to create your perfect BPM solution.
            Only pay for what you actually need and use.
          </p>
        </div>

        <div className="grid md:grid-cols-1 lg:grid-cols-[1fr,1.5fr] gap-8 lg:gap-12">
          {/* Left side - Module selection buttons */}
          <div className="space-y-4 fade-in-up">
            <p className="text-lg font-medium text-gray-800 mb-4">Select a module to learn more:</p>
            {modules.map((module) => (
              <Button
                key={module.id}
                variant="outline"
                className={`w-full justify-start text-left py-6 px-6 rounded-xl transition-all duration-300 ${
                  activeTab === module.id 
                    ? "bg-carmen-navy/5 border-carmen-navy border-2 text-carmen-navy shadow-md" 
                    : "hover:bg-gray-50 text-gray-700 border-gray-200"
                }`}
                onClick={() => setActiveTab(module.id)}
              >
                <div className="flex items-center gap-4">
                  <div className={`rounded-full p-2 ${activeTab === module.id ? 'bg-carmen-navy text-white' : 'bg-gray-100 text-gray-600'}`}>
                    {module.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">{module.title}</h3>
                    <p className="text-sm opacity-80 line-clamp-2">{module.description}</p>
                  </div>
                </div>
              </Button>
            ))}
          </div>

          {/* Right side - Collage display */}
          <div className="relative h-[400px] md:h-[500px] fade-in-up bg-gray-50/50 rounded-xl overflow-hidden">
            {modules.map((module, index) => (
              <div 
                key={module.id}
                className={`absolute inset-0 transition-all duration-500 ${
                  activeTab === module.id ? "opacity-100 scale-100 z-10" : "opacity-0 scale-95 z-0"
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
    // Variant 0: Main photo right, screenshot bottom left, taglines spread
    "photo-right",
    // Variant 1: Photo top, screenshot right, taglines bottom
    "photo-top",
    // Variant 2: Photo left, screenshot bottom right, taglines top right
    "photo-left",
    // Variant 3: Screenshot centered right, photo left, taglines spread
    "screenshot-right"
  ];
  
  const layout = layouts[variant];
  
  return (
    <div className="w-full h-full relative p-4">
      {/* Main photo */}
      <div className={`absolute rounded-xl overflow-hidden border-4 border-white shadow-lg ${
        layout === "photo-right" 
          ? "top-4 right-4 w-[60%] h-[60%]" 
          : layout === "photo-top" 
          ? "top-4 left-1/2 transform -translate-x-1/2 w-[80%] h-[50%]" 
          : layout === "photo-left" 
          ? "top-4 left-4 w-[55%] h-[70%]" 
          : "left-4 top-1/4 w-[50%] h-[60%]"
      }`}>
        <img 
          src={data.photo} 
          alt="Module visual" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Screenshot/UI mockup */}
      <div className={`absolute rounded-xl overflow-hidden border-4 border-white shadow-xl ${
        layout === "photo-right" 
          ? "bottom-4 left-4 w-[50%] h-[50%]" 
          : layout === "photo-top" 
          ? "bottom-4 right-4 w-[60%] h-[40%]" 
          : layout === "photo-left" 
          ? "bottom-4 right-4 w-[50%] h-[45%]" 
          : "right-4 top-4 w-[45%] h-[65%]"
      }`}>
        <img 
          src={data.screenshot} 
          alt="Module interface" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Tagline 1 */}
      <div className={`absolute bg-carmen-navy text-white px-5 py-3 rounded-full shadow-lg ${
        layout === "photo-right" 
          ? "top-1/4 left-8" 
          : layout === "photo-top" 
          ? "bottom-1/3 left-8" 
          : layout === "photo-left" 
          ? "top-8 right-8" 
          : "bottom-1/4 left-1/4"
      }`}>
        <p className="font-medium">{data.tagline1}</p>
      </div>
      
      {/* Tagline 2 */}
      <div className={`absolute bg-carmen-navy text-white px-5 py-3 rounded-full shadow-lg ${
        layout === "photo-right" 
          ? "bottom-1/3 right-1/4" 
          : layout === "photo-top" 
          ? "bottom-1/6 right-1/3" 
          : layout === "photo-left" 
          ? "top-1/3 right-1/6" 
          : "bottom-8 right-8"
      }`}>
        <p className="font-medium">{data.tagline2}</p>
      </div>
    </div>
  );
};

export default Modules;
