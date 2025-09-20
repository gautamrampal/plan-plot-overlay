
import React, { useState } from 'react';
import { FloorPlanEditor } from '@/components/FloorPlanEditor';
import { LoginScreen } from '@/components/LoginScreen';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [floorPlanUploaded, setFloorPlanUploaded] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setFloorPlanUploaded(false);
  };

  const handleFloorPlanUpload = () => {
    setFloorPlanUploaded(true);
  };

  const handleReUpload = () => {
    setFloorPlanUploaded(false);
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-light to-warm-gray flex flex-col">
      <Header 
        onLogout={handleLogout} 
        onReUpload={handleReUpload}
        showReUpload={floorPlanUploaded}
      />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {!floorPlanUploaded && (
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-text-dark mb-2">Floor Plan Analysis</h2>
              <p className="text-lg text-text-medium">Upload, analyze, and enhance your floor plans with Vastu principles</p>
            </div>
          )}
          <FloorPlanEditor 
            onFloorPlanUpload={handleFloorPlanUpload}
            forceShowUploader={!floorPlanUploaded}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
