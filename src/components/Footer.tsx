
import { LogIn, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "#features" },
        { label: "Modules", href: "#modules" },
        { label: "Pricing", href: "#" },
        { label: "Roadmap", href: "#" }
      ]
    },
    {
      title: "Resources",
      links: [
        { label: "Documentation", href: "#" },
        { label: "Blog", href: "#" },
        { label: "Case Studies", href: "#" },
        { label: "Support", href: "#" }
      ]
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Contact Us", href: "#contact" },
        { label: "Privacy Policy", href: "#" }
      ]
    }
  ];

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <a href="#" className="inline-block mb-4">
              <img 
                src="/lovable-uploads/40d79691-f7a4-491a-8173-d8fa907dac30.png" 
                alt="Carmen BPM Logo" 
                className="h-10 w-auto" 
              />
            </a>
            
            <p className="text-gray-600 mb-6 max-w-md">
              Carmen provides flexible, modular BPM solutions that adapt to your business processes, not the other way around.
            </p>
            
            <div className="flex items-center space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-carmen-gray flex items-center justify-center text-carmen-teal hover:bg-carmen-teal hover:text-white transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-carmen-gray flex items-center justify-center text-carmen-teal hover:bg-carmen-teal hover:text-white transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-carmen-gray flex items-center justify-center text-carmen-teal hover:bg-carmen-teal hover:text-white transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
            </div>
          </div>
          
          {footerLinks.map((column, index) => (
            <div key={index}>
              <h3 className="text-gray-900 font-medium mb-4">{column.title}</h3>
              <ul className="space-y-2">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a 
                      href={link.href} 
                      className="text-gray-600 hover:text-carmen-teal transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-4 md:mb-0">
              <a href="#" className="flex items-center text-gray-600 hover:text-carmen-teal">
                <LogIn size={20} className="mr-2" /> Sign In
              </a>
              <div className="hidden md:block h-4 w-px bg-gray-300"></div>
              <div className="relative flex md:w-64">
                <input
                  type="email"
                  placeholder="Subscribe to newsletter"
                  className="w-full pr-12 pl-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-carmen-teal/50 focus:border-transparent text-sm"
                />
                <Button 
                  size="icon" 
                  className="absolute inset-y-0 right-0 carmen-btn p-2 text-white rounded-l-none"
                >
                  <Send size={16} />
                </Button>
              </div>
            </div>
            
            <p className="text-gray-500 text-sm">
              © {currentYear} Carmen BPM. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
