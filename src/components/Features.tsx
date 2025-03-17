
import { 
  Layers, 
  Settings, 
  MessageSquare, 
  Puzzle, 
  Shield, 
  BarChart 
} from 'lucide-react';

const Features = () => {
  const featuresList = [
    {
      icon: <Layers size={24} className="text-carmen-teal" />,
      title: 'Modular Architecture',
      description: 'Add only the modules you need, when you need them, avoiding bloated software.'
    },
    {
      icon: <Settings size={24} className="text-carmen-blue" />,
      title: 'Fully Customizable',
      description: 'Tailor the workflow engine to match your exact business processes and requirements.'
    },
    {
      icon: <MessageSquare size={24} className="text-carmen-soft-teal" />,
      title: 'AI-Powered Configuration',
      description: 'Use our AI chat to effortlessly customize Carmen to fit your business needs.'
    },
    {
      icon: <Puzzle size={24} className="text-carmen-blue" />,
      title: 'Seamless Integration',
      description: 'Connect with your existing tools and software through our flexible API.'
    },
    {
      icon: <Shield size={24} className="text-carmen-teal" />,
      title: 'Enterprise Security',
      description: 'Bank-grade security to protect your sensitive business processes and data.'
    },
    {
      icon: <BarChart size={24} className="text-carmen-soft-teal" />,
      title: 'Advanced Analytics',
      description: 'Gain insights into your processes with built-in reporting and analytics.'
    }
  ];

  return (
    <section id="features" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-carmen-sky/10 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-carmen-soft-teal/10 blur-3xl rounded-full"></div>
        <div className="absolute inset-0 bg-pattern-dots opacity-20"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 fade-in-up">
          <div className="inline-block px-4 py-1 mb-4 rounded-full bg-carmen-sky/20 border border-carmen-sky/30">
            <p className="text-carmen-blue text-sm font-medium">
              Powerful Features
            </p>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-carmen-navy mb-4">
            Powerful Features, <span className="bg-carmen-gradient bg-clip-text text-transparent">Limitless Flexibility</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Carmen combines powerful BPM capabilities with unprecedented flexibility,
            allowing you to create a solution that works exactly how you need it to.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresList.map((feature, index) => (
            <div 
              key={index} 
              className="bg-carmen-sand rounded-3xl p-6 shadow-soft border border-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 fade-in-up"
              style={{ animationDelay: `${0.1 + index * 0.1}s` }}
            >
              <div className="rounded-full bg-white w-14 h-14 flex items-center justify-center mb-4 shadow-sm">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-carmen-navy mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
