
import React from 'react';
import { Compass } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-text-dark text-white py-6 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Compass className="h-5 w-5 text-emerald-light" />
          <span className="text-lg font-bold">Vastu Tool Kit</span>
        </div>
        <p className="text-sm text-white/70">
          © 2024 Vastu Tool Kit. All rights reserved.
        </p>
        <p className="text-xs text-white/50 mt-2">
          Enhance your spaces with ancient Vastu principles
        </p>
      </div>
    </footer>
  );
};
