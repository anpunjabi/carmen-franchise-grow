
import { ArrowRight, MessageSquare, Users, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Partner = () => {
  const partnershipBenefits = [
    {
      icon: <MessageSquare size={24} className="text-carmen-teal" />,
      title: "Collaborative Development",
      description: "Work closely with our team to design a BPM solution tailored perfectly to your organization's needs."
    },
    {
      icon: <Users size={24} className="text-carmen-blue" />,
      title: "Dedicated Support",
      description: "Receive priority support and training for your team throughout the implementation process."
    },
    {
      icon: <Code size={24} className="text-carmen-teal" />,
      title: "Custom Integrations",
      description: "Get custom integrations built specifically for your existing systems and workflows."
    }
  ];

  return (
    <section id="partner" className="py-24 bg-carmen-gradient-dark text-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTR6bTAtMThjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTR6bTE4IDBjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTR6bS0xOCAxOGMwIDIuMjA5LTEuNzkxIDQtNCA0cy00LTEuNzkxLTQtNCAxLjc5MS00IDQtNCA0IDEuNzkxIDQgNHoiLz48L2c+PC9nPjwvc3ZnPg==')]"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-1/2 fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Partner With Us to Build Your
              <span className="bg-carmen-gradient-light bg-clip-text text-transparent"> Perfect BPM Solution</span>
            </h2>
            
            <p className="text-white/90 text-lg mb-8">
              Join forces with our expert team to create a custom BPM solution that perfectly addresses your unique business challenges. We'll work closely with you from conception to implementation.
            </p>
            
            <div className="space-y-6 mb-8">
              {partnershipBenefits.map((benefit, index) => (
                <div key={index} className="flex items-start fade-in-up" style={{ animationDelay: `${0.2 + index * 0.1}s` }}>
                  <div className="rounded-full bg-white/10 p-2 mt-1 flex-shrink-0">
                    {benefit.icon}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-white font-medium text-lg">{benefit.title}</h3>
                    <p className="text-white/80">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <Button 
              className="bg-white text-carmen-teal hover:bg-white/90 shadow-lg group"
              id="contact"
            >
              Start a Conversation
              <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
          
          <div className="lg:w-1/2 fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 md:p-8 shadow-glass border border-white/20">
              <h3 className="text-xl font-semibold mb-6">Get in Touch</h3>
              
              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-white/90 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-carmen-light-blue/50"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-carmen-light-blue/50"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-white/90 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="company"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-carmen-light-blue/50"
                    placeholder="Acme Inc."
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-white/90 mb-1">
                    Tell us about your needs
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-carmen-light-blue/50"
                    placeholder="Please describe your BPM requirements..."
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-carmen-gradient hover:opacity-90 transition-opacity"
                >
                  Submit Request
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partner;
