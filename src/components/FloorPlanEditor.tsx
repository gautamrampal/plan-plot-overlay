
import React, { useState } from 'react';
import { ImageUploader } from './ImageUploader';
import { FloorPlanCanvas } from './FloorPlanCanvas';
import { Toolbar } from './Toolbar';
import { OverlayControls } from './OverlayControls';
import { toast } from 'sonner';

export interface Point {
  x: number;
  y: number;
  id: string;
}

export interface FloorPlanState {
  floorPlanImage: string | null;
  overlayImage: string | null;
  points: Point[];
  center: Point | null;
  mode: 'select' | 'plot' | 'overlay';
  overlayOpacity: number;
  overlayVisible: boolean;
  overlayRotation: number;
  overlayScale: number;
  displayOptions: {
    directions: boolean;
    entrances: boolean;
    chakra: boolean;
    planets: boolean;
    vastu: boolean;
    analysis: boolean;
  };
}

export const FloorPlanEditor = () => {
  const [state, setState] = useState<FloorPlanState>({
    floorPlanImage: null,
    overlayImage: null,
    points: [],
    center: null,
    mode: 'select',
    overlayOpacity: 0.5,
    overlayVisible: true,
    overlayRotation: 0,
    overlayScale: 1,
    displayOptions: {
      directions: true,
      entrances: false,
      chakra: true,
      planets: false,
      vastu: false,
      analysis: false,
    },
  });

  const calculateCenter = (points: Point[]) => {
    if (points.length < 3) return null;
    
    const centerX = points.reduce((sum, p) => sum + p.x, 0) / points.length;
    const centerY = points.reduce((sum, p) => sum + p.y, 0) / points.length;
    
    return {
      x: centerX,
      y: centerY,
      id: 'center',
    };
  };

  const handleFloorPlanUpload = (imageUrl: string) => {
    setState(prev => ({
      ...prev,
      floorPlanImage: imageUrl,
      points: [],
      center: null,
    }));
    toast.success('Floor plan uploaded successfully!');
  };

  const handleOverlayUpload = (imageUrl: string) => {
    setState(prev => ({
      ...prev,
      overlayImage: imageUrl,
    }));
    toast.success('Overlay image uploaded successfully!');
  };

  const handlePointAdd = (point: Point) => {
    setState(prev => {
      const newPoints = [...prev.points, point];
      const newCenter = calculateCenter(newPoints);
      
      // Show toast when center is first calculated
      if (newPoints.length === 3 && !prev.center) {
        toast.success('Center point calculated and marked!');
      }
      
      return {
        ...prev,
        points: newPoints,
        center: newCenter,
      };
    });
  };

  const handleClearPoints = () => {
    setState(prev => ({
      ...prev,
      points: [],
      center: null,
    }));
    toast.info('All points cleared');
  };

  const handleModeChange = (mode: FloorPlanState['mode']) => {
    setState(prev => ({ ...prev, mode }));
  };

  const handleOpacityChange = (opacity: number) => {
    setState(prev => ({ ...prev, overlayOpacity: opacity }));
  };

  const handleRotationChange = (rotation: number) => {
    setState(prev => ({ ...prev, overlayRotation: rotation }));
  };

  const handleScaleChange = (scale: number) => {
    setState(prev => ({ ...prev, overlayScale: scale }));
  };

  const handleToggleOverlay = (visible: boolean) => {
    setState(prev => ({ ...prev, overlayVisible: visible }));
  };

  const handleDisplayOptionChange = (option: string, value: boolean) => {
    setState(prev => ({
      ...prev,
      displayOptions: {
        ...prev.displayOptions,
        [option]: value,
      },
    }));
  };

  if (!state.floorPlanImage) {
    return <ImageUploader onImageUpload={handleFloorPlanUpload} title="Upload Floor Plan" />;
  }

  return (
    <div className="space-y-6">
      <Toolbar
        mode={state.mode}
        onModeChange={handleModeChange}
        onClear={handleClearPoints}
        onOverlayUpload={handleOverlayUpload}
        opacity={state.overlayOpacity}
        onOpacityChange={handleOpacityChange}
        hasPoints={state.points.length > 0}
        hasOverlay={!!state.overlayImage}
      />
      
      <FloorPlanCanvas
        state={state}
        onPointAdd={handlePointAdd}
      />

      {state.overlayImage && (
        <OverlayControls
          isVisible={state.overlayVisible}
          rotation={state.overlayRotation}
          scale={state.overlayScale}
          opacity={state.overlayOpacity}
          onRotationChange={handleRotationChange}
          onScaleChange={handleScaleChange}
          onOpacityChange={handleOpacityChange}
          displayOptions={state.displayOptions}
          onDisplayOptionChange={handleDisplayOptionChange}
          onToggleOverlay={handleToggleOverlay}
        />
      )}
    </div>
  );
};
