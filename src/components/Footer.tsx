import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import EditableText from './EditableText';

const Footer = () => {
  const { user } = useAuth();
  const currentYear = new Date().getFullYear();
  const [visibleLinks, setVisibleLinks] = useState<Record<string, boolean>>({
    'footer-product': true,
    'footer-resources': true,
    'footer-company': true
  });
  
  const footerLinks = [
    {
      title: "Product",
      id: "footer-product",
      links: [
        { label: "Features", href: "#features", id: "link-features" },
        { label: "Modules", href: "#modules", id: "link-modules" },
        { label: "Pricing", href: "#", id: "link-pricing" },
        { label: "Roadmap", href: "#", id: "link-roadmap" }
      ]
    },
    {
      title: "Resources",
      id: "footer-resources",
      links: [
        { label: "Documentation", href: "#", id: "link-documentation" },
        { label: "Blog", href: "#", id: "link-blog" },
        { label: "Case Studies", href: "#", id: "link-case-studies" },
        { label: "Support", href: "#", id: "link-support" }
      ]
    },
    {
      title: "Company",
      id: "footer-company",
      links: [
        { label: "About Us", href: "#", id: "link-about-us" },
        { label: "Careers", href: "#", id: "link-careers" },
        { label: "Contact Us", href: "#contact", id: "link-contact-us" },
        { label: "Privacy Policy", href: "/privacy-policy", id: "link-privacy-policy", isPage: true },
        { label: "Terms of Service", href: "/terms-of-service", id: "link-terms-of-service", isPage: true }
      ]
    }
  ];

  useEffect(() => {
    const checkVisibility = () => {
      const newVisibleLinks: Record<string, boolean> = {};
      
      footerLinks.forEach(column => {
        const hasVisibleLink = column.links.some(link => {
          const element = document.querySelector(`[data-editable-id="${link.id}"]`);
          return element && !element.classList.contains('hidden');
        });
        
        newVisibleLinks[column.id] = hasVisibleLink;
      });
      
      setVisibleLinks(newVisibleLinks);
    };
    
    setTimeout(checkVisibility, 300);
    
    const handleEditModeChange = () => {
      setTimeout(checkVisibility, 300);
    };
    
    window.addEventListener('editmodechange', handleEditModeChange);
    
    return () => {
      window.removeEventListener('editmodechange', handleEditModeChange);
    };
  }, []);

  return (
    <footer className="bg-white border-t border-gray-200" data-section-id="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <a href="#" className="inline-block mb-4">
              <img 
                src="/lovable-uploads/ce0d528b-e6e0-4e11-acd3-5b3a9f26ebf5.png" 
                alt="Carmen BPM Logo" 
                className="h-16 w-auto" 
              />
            </a>
            
            <EditableText id="footer-tagline" as="p" className="text-gray-600 mb-6 max-w-md">
              Carmen provides flexible, modular BPM solutions that adapt to your business processes, not the other way around.
            </EditableText>
            
            <div className="flex items-center space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-carmen-light-blue/20 flex items-center justify-center text-carmen-blue hover:bg-carmen-blue hover:text-white transition-colors duration-200" data-editable-id="social-linkedin">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-carmen-light-blue/20 flex items-center justify-center text-carmen-blue hover:bg-carmen-blue hover:text-white transition-colors duration-200" data-editable-id="social-twitter">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-carmen-light-blue/20 flex items-center justify-center text-carmen-blue hover:bg-carmen-blue hover:text-white transition-colors duration-200" data-editable-id="social-instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
            </div>
          </div>
          
          {footerLinks.map((column, index) => (
            <div key={index} data-editable-id={column.id} className={!visibleLinks[column.id] ? 'hidden' : ''}>
              <EditableText id={`footer-column-title-${index}`} as="h3" className="text-carmen-navy font-medium mb-4">
                {column.title}
              </EditableText>
              <ul className="space-y-2">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex} data-editable-id={link.id}>
                    {link.isPage ? (
                      <Link 
                        to={link.href} 
                        className="text-gray-600 hover:text-carmen-blue transition-colors duration-200"
                      >
                        <EditableText id={`footer-link-${column.id}-${linkIndex}`} as="span">
                          {link.label}
                        </EditableText>
                      </Link>
                    ) : (
                      <a 
                        href={link.href} 
                        className="text-gray-600 hover:text-carmen-blue transition-colors duration-200"
                      >
                        <EditableText id={`footer-link-${column.id}-${linkIndex}`} as="span">
                          {link.label}
                        </EditableText>
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-4 md:mb-0">
              <div className="relative flex md:w-64" data-editable-id="newsletter-form">
                <input
                  type="email"
                  placeholder="Subscribe to newsletter"
                  className="w-full pr-12 pl-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-carmen-blue/50 focus:border-transparent text-sm"
                />
                <Button 
                  size="icon" 
                  className="absolute inset-y-0 right-0 bg-carmen-gradient p-2 text-white rounded-l-none"
                >
                  <Send size={16} />
                </Button>
              </div>
            </div>
            
            <EditableText id="footer-copyright" as="p" className="text-gray-500 text-sm">
              © {currentYear} Carmen BPM. All rights reserved.
            </EditableText>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
