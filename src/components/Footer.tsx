import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white/20 dark:bg-dark-footer/50 backdrop-blur-lg text-gray-800 dark:text-white text-sm fixed left-0 bottom-0 z-40 rounded-t-2xl border-t border-white/30 dark:border-white/10">
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between p-4 sm:px-8">
        <span className="font-medium tracking-wide">© 2025 OPS Online Support</span>
        <div className="flex items-center gap-4 sm:gap-6 font-semibold">
          <a href="#" className="hover:text-primary transition-colors">User Feedback</a>
          <a href="#" className="hover:text-primary transition-colors">T & C</a>
          <a href="#" className="hover:text-primary transition-colors">Cookie Consent</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;