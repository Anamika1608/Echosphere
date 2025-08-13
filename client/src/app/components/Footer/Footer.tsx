import React from 'react';
import FooterPic from '../../../assets/FooterPic.png';

const Footer: React.FC = () => {
  return (
    <footer
      className="relative overflow-hidden min-h-[200px]"
      style={{
        backgroundImage: `url(${FooterPic})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Heading in its own row */}
        

        {/* Rest of the footer content */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl sm:text-6xl text-left py-6 font-bold text-black/20 text-center mb-4">
          Echosphere
        </h1>
          <div className="flex flex-wrap justify-center sm:justify-end gap-6">
            <a
              href="#"
              className="text-sm text-slate-700/80 hover:text-slate-900 font-medium transition-colors duration-200"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-sm text-slate-700/80 hover:text-slate-900 font-medium transition-colors duration-200"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-sm text-slate-700/80 hover:text-slate-900 font-medium transition-colors duration-200"
            >
              Contact Us
            </a>
            <a
              href="#"
              className="text-sm text-slate-700/80 hover:text-slate-900 font-medium transition-colors duration-200"
            >
              Feedback
            </a>
          </div>
        </div><p className="text-sm text-slate-700/80 text-center sm:text-left font-medium">
            copyright © {new Date().getFullYear()} Echosphere
          </p>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-0 right-1/3 w-24 h-24 bg-orange-200/30 rounded-full blur-lg"></div>
    </footer>
  );
};

export default Footer;
