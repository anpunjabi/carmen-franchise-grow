import { ArrowRight, MessageSquare, Users, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const Partner = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });

  const partnershipBenefits = [{
    icon: <MessageSquare size={24} className="text-carmen-teal" />,
    title: "Collaborative Development",
    description: "Work closely with our team to design a BPM solution tailored perfectly to your organization's needs."
  }, {
    icon: <Users size={24} className="text-carmen-blue" />,
    title: "Dedicated Support",
    description: "Receive priority support and training for your team throughout the implementation process."
  }, {
    icon: <Code size={24} className="text-carmen-soft-teal" />,
    title: "Custom Integrations",
    description: "Get custom integrations built specifically for your existing systems and workflows."
  }];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await supabase.functions.invoke('send-contact-email', {
        body: formData
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      toast({
        title: "Message Sent!",
        description: "Thank you for your interest. We'll be in touch soon!",
      });

      setFormData({
        name: '',
        email: '',
        company: '',
        message: ''
      });

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="partner" className="py-24 bg-carmen-cream relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-pattern-dots"></div>
      
      <div className="absolute top-0 right-0 w-96 h-96 bg-carmen-sky/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-carmen-soft-teal/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-1/2 fade-in-up">
            <div className="inline-block px-4 py-1 mb-6 rounded-full bg-carmen-sky/20 border border-carmen-sky/30">
              <p className="text-carmen-blue text-sm font-medium">
                Let's Build Together
              </p>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-carmen-navy">
              Partner With Us to Build Your
              <span className="bg-carmen-gradient-light bg-clip-text text-transparent"> Perfect BPM Solution</span>
            </h2>
            
            <p className="text-gray-700 text-lg mb-8">
              Join forces with our expert team to create a custom BPM solution that perfectly addresses your unique business challenges. We'll work closely with you from conception to implementation.
            </p>
            
            <div className="space-y-6 mb-8">
              {partnershipBenefits.map((benefit, index) => (
                <div key={index} className="flex items-start fade-in-up rounded-xl p-4 hover:bg-white/70 transition-all duration-300" style={{
                  animationDelay: `${0.2 + index * 0.1}s`
                }}>
                  <div className="rounded-full bg-white p-2.5 mt-1 flex-shrink-0 shadow-soft">
                    {benefit.icon}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-carmen-navy font-medium text-lg">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <Button className="bg-carmen-gradient text-white hover:bg-opacity-90 shadow-soft group" id="contact">
              Start a Conversation
              <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
          
          <div className="lg:w-1/2 fade-in-up" style={{
            animationDelay: '0.3s'
          }}>
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-soft border border-white">
              <h3 className="text-xl font-semibold mb-6 text-carmen-navy">Get Started</h3>
              
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-1">
                      Full Name
                    </label>
                    <input 
                      type="text" 
                      id="name" 
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 bg-carmen-sand/50 border border-carmen-teal/20 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-carmen-teal/30" 
                      placeholder="John Doe" 
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">
                      Email Address
                    </label>
                    <input 
                      type="email" 
                      id="email" 
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 bg-carmen-sand/50 border border-carmen-teal/20 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-carmen-teal/30" 
                      placeholder="john@example.com" 
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-600 mb-1">
                    Company Name
                  </label>
                  <input 
                    type="text" 
                    id="company" 
                    value={formData.company}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 bg-carmen-sand/50 border border-carmen-teal/20 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-carmen-teal/30" 
                    placeholder="Acme Inc." 
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-600 mb-1">
                    Tell us about your needs
                  </label>
                  <textarea 
                    id="message" 
                    rows={4} 
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 bg-carmen-sand/50 border border-carmen-teal/20 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-carmen-teal/30" 
                    placeholder="Please describe your BPM requirements..." 
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-carmen-gradient-soft hover:opacity-90 transition-opacity text-white py-2.5 rounded-xl"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Submit Request"}
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
