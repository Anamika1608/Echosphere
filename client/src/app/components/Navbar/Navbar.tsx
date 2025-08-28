import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import Logo from '../../../assets/Logo.svg';

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className = '' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-md border-b border-gray-200/20 shadow-sm' 
          : 'bg-transparent border-b border-transparent'
      } ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <img src={Logo} alt="Logo"  />
            </div>
            <span className="text-gray-900 font-semibold text-lg">Echo</span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <a
              href=""
              className="text-black hover:text-orange-800 transition-colors duration-200 font-medium text-sm lg:text-[15px] whitespace-nowrap"
            >
              Demo
            </a>
            <a
              href="#features"
              className="text-black hover:text-orange-800 transition-colors duration-200 font-medium text-sm lg:text-[15px] whitespace-nowrap"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-black hover:text-orange-800 transition-colors duration-200 font-medium text-sm lg:text-[15px] whitespace-nowrap"
            >
              How it works
            </a>
            <a
              href="#pricing"
              className="text-black hover:text-orange-800 transition-colors duration-200 font-medium text-sm lg:text-[15px] whitespace-nowrap"
            >
              Pricing
            </a>
          </div>

          {/* Desktop Login Button */}
          <div className="hidden md:flex items-center flex-shrink-0">
            <Button
              size="sm"
              asChild
              className="px-4 py-2 text-sm font-medium"
              style={{
                borderRadius: "12px",
                border: "1.26px solid #FFAA67",
                background: "linear-gradient(95deg, #FFD0A2 4.5%, #FEB070 13.38%, #FF994F 31.58%, #FF7835 57.33%, #FF661F 79.98%, #FF5000 96.85%)",
                boxShadow: "1.26px 3.78px 7.686px 0 rgba(0, 0, 0, 0.20)",
                color: "#fff"
              }}
            >
              <Link to="/login">Login here</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleMobileMenu}
              className="text-black hover:text-orange-950 p-2 rounded-md transition-colors duration-200"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen 
            ? 'max-h-96 opacity-100 pb-6' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="pt-4 pb-2 space-y-1">
            <a
              href="#demo"
              className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors duration-200 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Demo
            </a>
            <a
              href="#features"
              className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors duration-200 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors duration-200 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              How it works
            </a>
            <a
              href="#pricing"
              className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors duration-200 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pricing
            </a>
            
            {/* Mobile Login Button */}
            <div className="pt-3 px-3">
              <Button
                size="sm"
                asChild
                className="px-4 py-2 text-sm font-medium"
                style={{
                  borderRadius: "12px",
                  border: "1.26px solid #FFAA67",
                  background: "linear-gradient(95deg, #FFD0A2 4.5%, #FEB070 13.38%, #FF994F 31.58%, #FF7835 57.33%, #FF661F 79.98%, #FF5000 96.85%)",
                  boxShadow: "1.26px 3.78px 7.686px 0 rgba(0, 0, 0, 0.20)",
                  color: "#fff"
                }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Link to="/login">Login here</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;