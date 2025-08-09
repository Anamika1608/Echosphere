import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import Logo from '../../../assets/logo.svg';

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className = '' }) => {
  return (
    <nav className={`sticky top-0 z-50 bg-transparent border-b border-gray-200/20 ${className}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <img src={Logo} alt="Logo" />
            </div>
            <span className="text-gray-900 font-semibold text-lg">Echo</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a 
              href="#demo" 
              className="text-black hover:text-gray-900 transition-colors duration-200 font-medium text-[15px]"
            >
              Demo
            </a>
            <a 
              href="#features" 
              className="text-black hover:text-gray-900 transition-colors duration-200 font-medium text-[15px]"
            >
              Features
            </a>
            <a 
              href="#how-it-works" 
              className="text-black hover:text-gray-900 transition-colors duration-200 font-medium text-[15px]"
            >
              How it works
            </a>
            <a 
              href="#pricing" 
              className="text-black hover:text-gray-900 transition-colors duration-200 font-medium text-[15px]"
            >
              Pricing
            </a>
          </div>

          {/* Login Button */}
          <div className="flex items-center">
            <Button
                            size="sm"
                            asChild
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
          <div className="md:hidden">
            <button className="text-gray-700 hover:text-gray-900 p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

     
      
    </nav>
  );
};

export default Navbar;