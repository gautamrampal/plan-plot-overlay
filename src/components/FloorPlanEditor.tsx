import React, { useState, useRef } from 'react';
import { ImageUploader } from './ImageUploader';
import { FloorPlanCanvas, FloorPlanCanvasRef } from './FloorPlanCanvas';
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
  const canvasRef = useRef<FloorPlanCanvasRef>(null);
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
    setState(prev => ({
      ...prev,
      points: [...prev.points, point],
    }));
  };

  const handlePointsComplete = () => {
    if (state.points.length < 3) {
      toast.error('Please plot at least 3 points to calculate center');
      return;
    }

    // Calculate center point
    const centerX = state.points.reduce((sum, p) => sum + p.x, 0) / state.points.length;
    const centerY = state.points.reduce((sum, p) => sum + p.y, 0) / state.points.length;
    
    const center: Point = {
      x: centerX,
      y: centerY,
      id: 'center',
    };

    setState(prev => ({
      ...prev,
      center,
      mode: 'select',
    }));
    
    toast.success('Center point calculated and marked!');
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

  const handleExport = () => {
    if (!canvasRef.current) {
      toast.error('Canvas not ready for export');
      return;
    }

    const success = canvasRef.current.exportCanvas();
    if (success) {
      toast.success('Floor plan exported successfully!');
    } else {
      toast.error('Failed to export floor plan');
    }
  };

  if (!state.floorPlanImage) {
    return <ImageUploader onImageUpload={handleFloorPlanUpload} title="Upload Floor Plan" />;
  }

  return (
    <div className="space-y-6">
      <Toolbar
        mode={state.mode}
        onModeChange={handleModeChange}
        onComplete={handlePointsComplete}
        onClear={handleClearPoints}
        onOverlayUpload={handleOverlayUpload}
        onExport={handleExport}
        opacity={state.overlayOpacity}
        onOpacityChange={handleOpacityChange}
        hasPoints={state.points.length > 0}
        hasOverlay={!!state.overlayImage}
      />
      
      <FloorPlanCanvas
        ref={canvasRef}
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
