import React, { useState, useRef } from 'react';
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

interface FloorPlanEditorProps {
  onFloorPlanUpload?: () => void;
  forceShowUploader?: boolean;
}

export const FloorPlanEditor = ({ onFloorPlanUpload, forceShowUploader = false }: FloorPlanEditorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
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
      directions: false,
      entrances: false,
      chakra: false,
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
    onFloorPlanUpload?.();
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
    setState(prev => {
      const newState = {
        ...prev,
        displayOptions: {
          ...prev.displayOptions,
        },
      };

      if (value) {
        // Disable all other display options when enabling one
        Object.keys(newState.displayOptions).forEach(key => {
          newState.displayOptions[key as keyof typeof newState.displayOptions] = key === option;
        });

        // Set the appropriate overlay image based on the selected option
        if (option === 'directions') {
          newState.overlayImage = '/lovable-uploads/908ba2e8-f456-48c1-ac55-63fe60118d79.png';
          newState.overlayVisible = true;
          toast.success('Directions compass overlay enabled!');
        } else if (option === 'chakra') {
          newState.overlayImage = '/lovable-uploads/31a3f34b-1195-4cbd-bb55-0029bc57c4cb.png';
          newState.overlayVisible = true;
          toast.success('Chakra compass overlay enabled!');
        } else {
          // For other options that don't have overlay images yet
          newState.overlayImage = null;
          newState.overlayVisible = false;
          toast.success(`${option.charAt(0).toUpperCase() + option.slice(1)} display enabled!`);
        }
      } else {
        // Disable the option and remove overlay
        newState.displayOptions[option as keyof typeof newState.displayOptions] = false;
        newState.overlayImage = null;
        newState.overlayVisible = false;
        toast.info(`${option.charAt(0).toUpperCase() + option.slice(1)} display disabled`);
      }

      return newState;
    });
  };

  const handleExport = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      toast.error('No canvas found to export');
      return;
    }

    try {
      // Create a download link
      const link = document.createElement('a');
      link.download = `floor-plan-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Floor plan exported successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export floor plan');
    }
  };

  if (!state.floorPlanImage || forceShowUploader) {
    return <ImageUploader onImageUpload={handleFloorPlanUpload} title="Upload Floor Plan" />;
  }

  return (
    <div className="space-y-6">
      <Toolbar
        mode={state.mode}
        onModeChange={handleModeChange}
        onClear={handleClearPoints}
        opacity={state.overlayOpacity}
        onOpacityChange={handleOpacityChange}
        hasPoints={state.points.length > 0}
        hasOverlay={!!state.overlayImage}
        onExport={handleExport}
      />
      
      <FloorPlanCanvas
        ref={canvasRef}
        state={state}
        onPointAdd={handlePointAdd}
      />

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
        hasOverlay={!!state.overlayImage}
      />
    </div>
  );
};
