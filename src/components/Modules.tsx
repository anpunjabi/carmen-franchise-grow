
import { Check, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Modules = () => {
  const moduleCategories = [
    {
      title: "Process Management",
      modules: [
        "Process Designer",
        "Workflow Automation",
        "Task Management",
        "Document Processing"
      ],
      icon: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=600&h=400",
      gradient: "from-carmen-teal to-carmen-blue"
    },
    {
      title: "Data & Analytics",
      modules: [
        "Business Intelligence",
        "Custom Dashboards",
        "Report Builder",
        "Process Mining"
      ],
      icon: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=600&h=400",
      gradient: "from-carmen-blue to-carmen-light-blue"
    },
    {
      title: "Integration & Connectivity",
      modules: [
        "API Gateway",
        "CRM Integration",
        "ERP Connector",
        "Legacy System Bridge"
      ],
      icon: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600&h=400",
      gradient: "from-carmen-dark-blue to-carmen-teal"
    }
  ];

  return (
    <section id="modules" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-0 w-1/2 h-1/2 bg-carmen-light-blue/5 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-carmen-teal/10 blur-3xl rounded-full"></div>
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
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {moduleCategories.map((category, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 h-full fade-in-up"
              style={{ animationDelay: `${0.1 + index * 0.1}s` }}
            >
              <div className="relative h-48 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-r ${category.gradient} opacity-80`}></div>
                <img 
                  src={category.icon} 
                  alt={category.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-white text-2xl font-bold px-4 text-center">{category.title}</h3>
                </div>
              </div>
              
              <div className="p-6">
                <ul className="space-y-3 mb-6">
                  {category.modules.map((module, moduleIndex) => (
                    <li key={moduleIndex} className="flex items-start">
                      <Check size={20} className="text-carmen-teal mt-1 flex-shrink-0" />
                      <span className="ml-3 text-gray-700">{module}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  variant="outline"
                  className="w-full border-carmen-teal text-carmen-teal hover:bg-carmen-teal/5 mt-4 group"
                >
                  Learn More
                  <ChevronRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center fade-in-up" style={{ animationDelay: '0.5s' }}>
          <p className="text-gray-600 mb-6">
            Need something specific? Our AI can help you configure a custom module.
          </p>
          <Button className="carmen-btn">
            Explore All Modules
            <ChevronRight size={16} className="ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Modules;
