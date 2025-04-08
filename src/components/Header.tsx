
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import UserMenu from '@/components/UserMenu';
import AuthModal from '@/components/AuthModal';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { user, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [{
    name: 'Features',
    href: '#features',
    id: 'nav-features'
  }, {
    name: 'Modules',
    href: '#modules',
    id: 'nav-modules'
  }, {
    name: 'Partner',
    href: '#partner',
    id: 'nav-partner'
  }];

  const openAuthModal = () => {
    setAuthModalOpen(true);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-white'}`} data-section-id="header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 md:h-24">
            <div className="flex items-center">
              <a href="#" className="flex-shrink-0">
                <img className="h-16 md:h-20 w-auto" src="/lovable-uploads/ce0d528b-e6e0-4e11-acd3-5b3a9f26ebf5.png" alt="Carmen BPM Logo" />
              </a>
            </div>
            
            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map(item => (
                <a 
                  key={item.name} 
                  href={item.href} 
                  className="text-carmen-navy hover:text-carmen-blue transition-colors duration-200 font-medium text-sm"
                  data-editable-id={item.id}
                >
                  {item.name}
                </a>
              ))}
              
              {!loading && (
                user ? (
                  <UserMenu />
                ) : (
                  <Button 
                    className="bg-carmen-gradient text-white hover:opacity-90 transition-all duration-300 font-medium px-6 py-3 rounded-md shadow-md hover:shadow-lg active:scale-95 transform" 
                    onClick={openAuthModal}
                    data-editable-id="login-button"
                  >
                    Log In
                  </Button>
                )
              )}
            </nav>
            
            {/* Mobile menu button */}
            <div className="flex md:hidden">
              {!loading && !user && (
                <Button 
                  className="bg-carmen-gradient text-white mr-2 hover:opacity-90 transition-all duration-300 px-4 py-2" 
                  onClick={openAuthModal}
                  data-editable-id="login-button-mobile"
                >
                  Log In
                </Button>
              )}
              
              {!loading && user && (
                <div className="mr-4">
                  <UserMenu />
                </div>
              )}
              
              <button 
                type="button" 
                className="inline-flex items-center justify-center p-2 rounded-md text-carmen-navy hover:text-carmen-blue focus:outline-none" 
                aria-controls="mobile-menu" 
                aria-expanded="false" 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                data-editable-id="mobile-menu-button"
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? 
                  <X className="block h-6 w-6" aria-hidden="true" /> : 
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                }
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div 
          className={`md:hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? 'max-h-64 opacity-100 visible' : 'max-h-0 opacity-0 invisible'
          } overflow-hidden`} 
          id="mobile-menu"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-md shadow-lg">
            {navigation.map(item => (
              <a 
                key={item.name} 
                href={item.href} 
                className="block px-3 py-2 rounded-md text-base font-medium text-carmen-navy hover:text-carmen-blue hover:bg-carmen-light-blue/10" 
                onClick={() => setMobileMenuOpen(false)}
                data-editable-id={`${item.id}-mobile`}
              >
                {item.name}
              </a>
            ))}
            <div className="px-3 py-2">
              <Button 
                className="bg-carmen-gradient text-white w-full hover:opacity-90 transition-all duration-300" 
                onClick={() => {
                  window.location.href = '#contact';
                  setMobileMenuOpen(false);
                }}
                data-editable-id="contact-button-mobile"
              >
                Build with Us
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
};

export default Header;
