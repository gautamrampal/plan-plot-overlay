import React, { useState, useRef } from 'react';
import { ImageUploader } from './ImageUploader';
import { FloorPlanCanvas } from './FloorPlanCanvas';
import { Toolbar } from './Toolbar';
import { OverlayControls } from './OverlayControls';
import { VastuAnalysisChart } from './VastuAnalysisChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import jsPDF from 'jspdf';

export interface Point {
  x: number;
  y: number;
  id: string;
}

export interface Planet {
  id: string;
  name: string;
  x: number;
  y: number;
}

export interface FloorPlanState {
  floorPlanImage: string | null;
  points: Point[];
  center: Point | null;
  mode: 'select' | 'plot';
  overlayOpacity: number;
  overlayRotation: number;
  overlayScale: number;
  overlayPosition?: Point;
  isPlottingComplete: boolean;
  notes: string;
  planetPositions: Planet[];
  planetOpacity: number;
  planetScale: number;
  displayOptions: {
    directions: boolean;
    directionsTwo: boolean;
    entrances: boolean;
    chakra: boolean;
    chakraDirections: boolean;
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
    points: [],
    center: null,
    mode: 'select',
    overlayOpacity: 0.6,
    overlayRotation: 0,
    overlayScale: 1,
    isPlottingComplete: false,
    notes: '',
    planetPositions: [],
    planetOpacity: 0.8,
    planetScale: 1,
    displayOptions: {
      directions: false,
      directionsTwo: false,
      entrances: false,
      chakra: false,
      chakraDirections: false,
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

  const handlePlanetMove = (planetId: string, x: number, y: number) => {
    setState(prev => ({
      ...prev,
      planetPositions: prev.planetPositions.map(planet =>
        planet.id === planetId ? { ...planet, x, y } : planet
      ),
    }));
  };

  const handlePlanetOpacityChange = (opacity: number) => {
    setState(prev => ({ ...prev, planetOpacity: opacity }));
  };

  const handlePlanetScaleChange = (scale: number) => {
    setState(prev => ({ ...prev, planetScale: scale }));
  };

  const handleNotesChange = (notes: string) => {
    setState(prev => ({ ...prev, notes }));
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
        // For planets, don't disable other options - planets can coexist
        if (option === 'planets') {
          newState.displayOptions.planets = true;
        } else {
          // Disable all other display options when enabling non-planet options
          Object.keys(newState.displayOptions).forEach(key => {
            if (key !== 'planets') {
              newState.displayOptions[key as keyof typeof newState.displayOptions] = key === option;
            }
          });
        }

        // Initialize planet positions when planets option is enabled
        if (option === 'planets') {
          console.log('Enabling planets option, center:', newState.center);
          console.log('Current planet positions:', newState.planetPositions.length);
          
          const planetNames = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
          const center = newState.center;
          
          if (center && newState.planetPositions.length === 0) {
            const radius = 120 * newState.planetScale;
            const angleStep = (2 * Math.PI) / planetNames.length;
            newState.planetPositions = planetNames.map((name, index) => ({
              id: `planet-${name.toLowerCase()}`,
              name,
              x: center.x + Math.cos(index * angleStep) * radius,
              y: center.y + Math.sin(index * angleStep) * radius,
            }));
            console.log('Created planet positions:', newState.planetPositions);
          } else if (!center) {
            console.log('No center point available for planet initialization');
            // Force planets option to false if no center
            newState.displayOptions.planets = false;
            toast.error('Please mark at least 3 points to enable planets');
            return newState;
          } else {
            console.log('Planet positions already exist, keeping current positions');
          }
        }

        if (option === 'chakra') {
          toast.success('Chakra compass overlay enabled!');
        } else if (option === 'analysis') {
          toast.success('Vastu analysis chart enabled!');
        } else if (option === 'planets') {
          toast.success('Planet labels enabled! Drag to move them.');
        } else {
          toast.success(`${option.charAt(0).toUpperCase() + option.slice(1)} display enabled!`);
        }
      } else {
        // Disable the option
        newState.displayOptions[option as keyof typeof newState.displayOptions] = false;
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
      // Force canvas redraw to ensure latest state is captured
      // This ensures the chakra overlay is properly rendered for export
      canvas.getContext('2d')?.drawImage(canvas, 0, 0);
      
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
      // Force canvas redraw to ensure latest state is captured
      // This ensures the chakra overlay is properly rendered for export
      canvas.getContext('2d')?.drawImage(canvas, 0, 0);
      
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
      
      // Add the floor plan image first
      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
      
      // Add notes below the image if they exist
      if (state.notes.trim()) {
        const notesStartY = y + imgHeight + 10; // Start notes 10mm below the image
        pdf.setFontSize(12);
        pdf.text('Notes:', 10, notesStartY);
        pdf.setFontSize(10);
        const notesLines = pdf.splitTextToSize(state.notes, pdfWidth - 20);
        pdf.text(notesLines, 10, notesStartY + 8);
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
        hasOverlay={state.displayOptions.chakra || state.displayOptions.chakraDirections || state.displayOptions.directions || state.displayOptions.directionsTwo}
        isPlottingComplete={state.isPlottingComplete}
        onExport={handleExport}
        onExportPDF={handleExportPDF}
      />
      
          <FloorPlanCanvas
            ref={canvasRef}
            state={state}
            onPointAdd={handlePointAdd}
            onOverlayMove={handleOverlayMove}
            onPlanetMove={handlePlanetMove}
          />

      {/* Show analysis chart when analysis is selected */}
      {state.displayOptions.analysis && (
        <VastuAnalysisChart />
      )}

      <OverlayControls
        isVisible={state.displayOptions.chakra || state.displayOptions.directions || state.displayOptions.directionsTwo}
        rotation={state.overlayRotation}
        scale={state.overlayScale}
        opacity={state.overlayOpacity}
        planetOpacity={state.planetOpacity}
        planetScale={state.planetScale}
        onRotationChange={handleRotationChange}
        onScaleChange={handleScaleChange}
        onOpacityChange={handleOpacityChange}
        onPlanetOpacityChange={handlePlanetOpacityChange}
        onPlanetScaleChange={handlePlanetScaleChange}
        displayOptions={state.displayOptions}
        onDisplayOptionChange={handleDisplayOptionChange}
        onToggleOverlay={() => {}}
        hasOverlay={state.displayOptions.chakra || state.displayOptions.chakraDirections || state.displayOptions.directions || state.displayOptions.directionsTwo}
        isPlottingComplete={state.isPlottingComplete}
      />

      {/* Notes Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="notes">Add notes about this floor plan analysis</Label>
            <Textarea
              id="notes"
              placeholder="Enter your observations, recommendations, or other notes here..."
              value={state.notes}
              onChange={(e) => handleNotesChange(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
