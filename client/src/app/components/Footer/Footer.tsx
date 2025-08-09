import React from 'react';
import FooterPic from '../../../assets/FooterPic.png';

const Footer: React.FC = () => {
  return (
    <footer className="relative overflow-hidden min-h-[200px] " style={{backgroundImage: `url(${FooterPic})`, backgroundSize: 'h-auto', backgroundPosition: 'center'}}>

      
      <div className='max-w-6xl flex flex-col items-center justify-center mx-auto px-4 sm:px-6 lg:px-8'>
      {/* Content container */}
      <div className="relative pt-30 container mx-auto flex flex-col sm:flex-row justify-between items-center py-8 px-6 gap-4">
        
        <p className="text-sm text-slate-700/80 text-center sm:text-left font-medium">copyright
          © {new Date().getFullYear()} Echospere
        </p>
        <div className="flex items-center gap-8">
          <a href="#" className="text-sm text-slate-700/80 hover:text-slate-900 font-medium transition-colors duration-200">
            Privacy Policy
          </a>
          <a href="#" className="text-sm text-slate-700/80 hover:text-slate-900 font-medium transition-colors duration-200">
            Terms of Service
          </a>
          <a href="#" className="text-sm text-slate-700/80 hover:text-slate-900 font-medium transition-colors duration-200">
            Contact Us
          </a>
          <a href="#" className="text-sm text-slate-700/80 hover:text-slate-900 font-medium transition-colors duration-200">
            Feedback
          </a>
        </div>
      </div></div>
      
      {/* Decorative elements to match the organic feel */}
      <div className="absolute top-0 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-0 right-1/3 w-24 h-24 bg-orange-200/30 rounded-full blur-lg"></div>
    </footer>
  );
}

export default Footer;