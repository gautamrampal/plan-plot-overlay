
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, Upload, Compass } from 'lucide-react';

interface HeaderProps {
  onLogout: () => void;
  onReUpload?: () => void;
  showReUpload?: boolean;
}

export const Header = ({ onLogout, onReUpload, showReUpload = false }: HeaderProps) => {
  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-sage-medium shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Compass className="h-6 w-6 text-emerald-primary" />
          <h1 className="text-2xl font-bold text-text-dark">Vastu Tool Kit</h1>
        </div>
        
        <div className="flex items-center gap-3">
          {showReUpload && onReUpload && (
            <Button
              variant="outline"
              onClick={onReUpload}
              size="sm"
              className="flex items-center gap-2 border-emerald-primary text-emerald-primary hover:bg-emerald-primary hover:text-white"
            >
              <Upload className="w-4 h-4" />
              Re-upload Floor Plan
            </Button>
          )}
          
          <Button
            variant="outline"
            onClick={onLogout}
            size="sm"
            className="flex items-center gap-2 border-emerald-primary text-emerald-primary hover:bg-emerald-primary hover:text-white"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};
