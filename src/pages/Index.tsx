
import React, { useState } from 'react';
import { FloorPlanEditor } from '@/components/FloorPlanEditor';
import { LoginScreen } from '@/components/LoginScreen';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      <Header onLogout={handleLogout} />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Floor Plan Analysis</h2>
            <p className="text-lg text-slate-600">Upload, analyze, and enhance your floor plans with Vastu principles</p>
          </div>
          <FloorPlanEditor />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
