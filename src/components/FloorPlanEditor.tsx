import React, { useState, useRef } from 'react';
import { ImageUploader } from './ImageUploader';
import { FloorPlanCanvas } from './FloorPlanCanvas';
import { Toolbar } from './Toolbar';
import { OverlayControls } from './OverlayControls';
import { VastuAnalysisChart } from './VastuAnalysisChart';
import { toast } from 'sonner';
import jsPDF from 'jspdf';

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
  overlayPosition?: Point;
  isPlottingComplete: boolean;
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
    isPlottingComplete: false,
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
    if (points.length < 2) return null;
    
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
      isPlottingComplete: false,
    }));
    toast.success('Floor plan uploaded successfully!');
    onFloorPlanUpload?.();
  };

  const handlePointAdd = (point: Point) => {
    setState(prev => {
      const newPoints = [...prev.points, point];
      const newCenter = calculateCenter(newPoints);
      
      return {
        ...prev,
        points: newPoints,
        center: newCenter,
      };
    });
  };

  const handleCompletePlotting = () => {
    if (state.points.length < 2) {
      toast.error('You need at least 2 points to complete plotting');
      return;
    }

    setState(prev => ({
      ...prev,
      isPlottingComplete: true,
      mode: 'select',
    }));
    
    toast.success(`Plotting completed with ${state.points.length} points! Center point calculated and marked.`);
  };

  const handleClearPoints = () => {
    setState(prev => ({
      ...prev,
      points: [],
      center: null,
      isPlottingComplete: false,
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

  const handleOverlayMove = (x: number, y: number) => {
    setState(prev => ({
      ...prev,
      overlayPosition: { x, y, id: 'overlay-position' },
    }));
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
        } else if (option === 'analysis') {
          // For analysis, we don't need an overlay image
          newState.overlayImage = null;
          newState.overlayVisible = false;
          toast.success('Vastu analysis chart enabled!');
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

  const handleExportPDF = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      toast.error('No canvas found to export');
      return;
    }

    try {
      // Create new PDF document
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      // Get canvas image data
      const imgData = canvas.toDataURL('image/png');
      
      // Calculate dimensions to fit the canvas on the PDF page
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const canvasAspectRatio = canvas.width / canvas.height;
      
      let imgWidth = pdfWidth - 20; // 10mm margin on each side
      let imgHeight = imgWidth / canvasAspectRatio;
      
      // If height exceeds page height, adjust dimensions
      if (imgHeight > pdfHeight - 20) {
        imgHeight = pdfHeight - 20;
        imgWidth = imgHeight * canvasAspectRatio;
      }
      
      // Center the image on the page
      const x = (pdfWidth - imgWidth) / 2;
      const y = (pdfHeight - imgHeight) / 2;
      
      // Add title
      pdf.setFontSize(16);
      pdf.text('Floor Plan Analysis', 10, 15);
      
      // Add current date
      pdf.setFontSize(10);
      pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 10, 25);
      
      // Add the floor plan image
      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
      
      // Add analysis information if available
      if (state.points.length > 0) {
        pdf.setFontSize(12);
        const analysisY = y + imgHeight + 10;
        pdf.text('Analysis Information:', 10, analysisY);
        
        pdf.setFontSize(10);
        pdf.text(`Plot Points: ${state.points.length}`, 10, analysisY + 10);
        
        if (state.center) {
          pdf.text(`Center Point: (${Math.round(state.center.x)}, ${Math.round(state.center.y)})`, 10, analysisY + 20);
        }
        
        // Add active display options
        const activeOptions = Object.entries(state.displayOptions)
          .filter(([_, value]) => value)
          .map(([key, _]) => key);
        
        if (activeOptions.length > 0) {
          pdf.text(`Active Analysis: ${activeOptions.join(', ')}`, 10, analysisY + 30);
        }
      }
      
      // Save the PDF
      const fileName = `floor-plan-analysis-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      toast.success('PDF generated successfully!');
    } catch (error) {
      console.error('PDF export failed:', error);
      toast.error('Failed to generate PDF');
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
        onCompletePlotting={handleCompletePlotting}
        opacity={state.overlayOpacity}
        onOpacityChange={handleOpacityChange}
        hasPoints={state.points.length > 0}
        hasOverlay={!!state.overlayImage}
        isPlottingComplete={state.isPlottingComplete}
        onExport={handleExport}
        onExportPDF={handleExportPDF}
      />
      
      <FloorPlanCanvas
        ref={canvasRef}
        state={state}
        onPointAdd={handlePointAdd}
        onOverlayMove={handleOverlayMove}
      />

      {/* Show analysis chart when analysis is selected */}
      {state.displayOptions.analysis && (
        <VastuAnalysisChart />
      )}

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
