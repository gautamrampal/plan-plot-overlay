
import React from 'react';
import { FloorPlanEditor } from '@/components/FloorPlanEditor';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Floor Plan Editor</h1>
          <p className="text-lg text-slate-600">Upload, edit, and enhance your floor plans with ease</p>
        </div>
        <FloorPlanEditor />
      </div>
    </div>
  );
};

export default Index;
