import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FloorPlanState, Point, Planet, Sign } from './FloorPlanEditor';
import { Plus, Minus } from 'lucide-react';
import { drawChakraOverlay } from './ChakraOverlay';
import directionsCompass from '@/assets/directions-compass.png';
import directionsCompassTwo from '@/assets/directions-compass-two.png';

interface FloorPlanCanvasProps {
  state: FloorPlanState;
  onPointAdd: (point: Point) => void;
  onOverlayMove?: (x: number, y: number) => void;
  onPlanetMove?: (planetId: string, x: number, y: number) => void;
  onSignMove?: (signId: string, x: number, y: number) => void;
}

export const FloorPlanCanvas = forwardRef<HTMLCanvasElement, FloorPlanCanvasProps>(
  ({ state, onPointAdd, onOverlayMove, onPlanetMove, onSignMove }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
    const [overlaySelected, setOverlaySelected] = useState(false);
    const [overlayBounds, setOverlayBounds] = useState<{
      x: number;
      y: number;
      width: number;
      height: number;
    } | null>(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [floorPlanImg, setFloorPlanImg] = useState<HTMLImageElement | null>(null);
    const [directionsImg, setDirectionsImg] = useState<HTMLImageElement | null>(null);
    const [directionsImageLoaded, setDirectionsImageLoaded] = useState(false);
    const [directionsTwoImg, setDirectionsTwoImg] = useState<HTMLImageElement | null>(null);
    const [directionsTwoImageLoaded, setDirectionsTwoImageLoaded] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [draggedPlanet, setDraggedPlanet] = useState<string | null>(null);
    const [draggedSign, setDraggedSign] = useState<string | null>(null);

    // Expose canvas ref to parent component
    useImperativeHandle(ref, () => canvasRef.current as HTMLCanvasElement);

    // Check if points are finalized (3 or more points means plotting is complete)
    const isPlottingComplete = state.points.length >= 3;

    // Calculate the bounding box of all plot points
    const calculatePlotBounds = (points: Point[]) => {
      if (points.length === 0) return null;
      
      const xs = points.map(p => p.x);
      const ys = points.map(p => p.y);
      
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);
      
      return {
        minX,
        maxX,
        minY,
        maxY,
        width: maxX - minX,
        height: maxY - minY,
        centerX: (minX + maxX) / 2,
        centerY: (minY + maxY) / 2
      };
    };

    // ... keep existing code (useEffect for size updates and image loading)

    useEffect(() => {
      const updateSize = () => {
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const maxWidth = Math.min(rect.width - 32, 1200);
          const maxHeight = Math.min(window.innerHeight * 0.85, 1000);
          setCanvasSize({ width: maxWidth, height: maxHeight });
        }
      };

      updateSize();
      window.addEventListener('resize', updateSize);
      return () => window.removeEventListener('resize', updateSize);
    }, []);

    // Load floor plan image
    useEffect(() => {
      if (state.floorPlanImage) {
        console.log('Loading floor plan image:', state.floorPlanImage);
        const img = new Image();
        img.onload = () => {
          console.log('Floor plan image loaded successfully');
          setFloorPlanImg(img);
          setImageLoaded(true);
        };
        img.onerror = () => {
          console.error('Failed to load floor plan image');
          setImageLoaded(false);
          setFloorPlanImg(null);
        };
        img.src = state.floorPlanImage;
      } else {
        setImageLoaded(false);
        setFloorPlanImg(null);
      }
    }, [state.floorPlanImage]);

    // Load directions compass image
    useEffect(() => {
      const img = new Image();
      img.onload = () => {
        console.log('Directions compass image loaded successfully');
        setDirectionsImg(img);
        setDirectionsImageLoaded(true);
      };
      img.onerror = () => {
        console.error('Failed to load directions compass image');
        setDirectionsImageLoaded(false);
        setDirectionsImg(null);
      };
      img.src = directionsCompass;
    }, []);

    // Load directions compass two image
    useEffect(() => {
      const img = new Image();
      img.onload = () => {
        console.log('Directions compass two image loaded successfully');
        setDirectionsTwoImg(img);
        setDirectionsTwoImageLoaded(true);
      };
      img.onerror = () => {
        console.error('Failed to load directions compass two image');
        setDirectionsTwoImageLoaded(false);
        setDirectionsTwoImg(null);
      };
      img.src = directionsCompassTwo;
    }, []);

    // Draw canvas
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw floor plan image if loaded
      if (floorPlanImg && imageLoaded) {
        console.log('Drawing floor plan image on canvas');
        
        // Calculate scaling to fit canvas while maintaining aspect ratio
        const scale = Math.min(canvas.width / floorPlanImg.width, canvas.height / floorPlanImg.height);
        const scaledWidth = floorPlanImg.width * scale;
        const scaledHeight = floorPlanImg.height * scale;
        const offsetX = (canvas.width - scaledWidth) / 2;
        const offsetY = (canvas.height - scaledHeight) / 2;

        // Draw the floor plan image
        ctx.drawImage(floorPlanImg, offsetX, offsetY, scaledWidth, scaledHeight);

        // Draw directions compass overlay if enabled and plotting is complete
        if (state.displayOptions.directions && state.center && state.isPlottingComplete && directionsImg && directionsImageLoaded) {
          const plotBounds = calculatePlotBounds(state.points);
          
          if (plotBounds) {
            // Calculate compass size based on plot bounds
            const maxSize = Math.min(plotBounds.width, plotBounds.height);
            const compassSize = maxSize * state.overlayScale * 0.8; // Make it slightly smaller than plot bounds
            
            // Use custom position if available, otherwise center on the center point
            const centerX = state.overlayPosition?.x ?? state.center.x;
            const centerY = state.overlayPosition?.y ?? state.center.y;
            
            // Apply rotation and opacity
            ctx.save();
            ctx.globalAlpha = state.overlayOpacity;
            ctx.translate(centerX, centerY);
            ctx.rotate((state.overlayRotation * Math.PI) / 180);
            
            // Draw the compass image centered
            ctx.drawImage(
              directionsImg,
              -compassSize / 2,
              -compassSize / 2,
              compassSize,
              compassSize
            );
            
            ctx.restore();

            // Store overlay bounds for selection detection
            setOverlayBounds({
              x: centerX - compassSize / 2,
              y: centerY - compassSize / 2,
              width: compassSize,
              height: compassSize,
            });

            // Draw selection border if overlay is selected
            if (overlaySelected) {
              ctx.save();
              ctx.strokeStyle = '#3b82f6';
              ctx.lineWidth = 3;
              ctx.setLineDash([10, 5]);
              ctx.globalAlpha = 0.8;
              ctx.beginPath();
              ctx.arc(centerX, centerY, compassSize / 2, 0, 2 * Math.PI);
              ctx.stroke();
              ctx.setLineDash([]);
              ctx.restore();
            }
          }
        }

        // Draw directions compass two overlay if enabled and plotting is complete
        if (state.displayOptions.directionsTwo && state.center && state.isPlottingComplete && directionsTwoImg && directionsTwoImageLoaded) {
          const plotBounds = calculatePlotBounds(state.points);
          
          if (plotBounds) {
            // Calculate compass size based on plot bounds
            const maxSize = Math.min(plotBounds.width, plotBounds.height);
            const compassSize = maxSize * state.overlayScale * 0.8; // Make it slightly smaller than plot bounds
            
            // Use custom position if available, otherwise center on the center point
            const centerX = state.overlayPosition?.x ?? state.center.x;
            const centerY = state.overlayPosition?.y ?? state.center.y;
            
            // Apply rotation and opacity
            ctx.save();
            ctx.globalAlpha = state.overlayOpacity;
            ctx.translate(centerX, centerY);
            ctx.rotate((state.overlayRotation * Math.PI) / 180);
            
            // Draw the compass two image centered
            ctx.drawImage(
              directionsTwoImg,
              -compassSize / 2,
              -compassSize / 2,
              compassSize,
              compassSize
            );
            
            ctx.restore();

            // Store overlay bounds for selection detection
            setOverlayBounds({
              x: centerX - compassSize / 2,
              y: centerY - compassSize / 2,
              width: compassSize,
              height: compassSize,
            });

            // Draw selection border if overlay is selected
            if (overlaySelected) {
              ctx.save();
              ctx.strokeStyle = '#3b82f6';
              ctx.lineWidth = 3;
              ctx.setLineDash([10, 5]);
              ctx.globalAlpha = 0.8;
              ctx.beginPath();
              ctx.arc(centerX, centerY, compassSize / 2, 0, 2 * Math.PI);
              ctx.stroke();
              ctx.setLineDash([]);
              ctx.restore();
            }
          }
        }

        // Draw chakra overlay if enabled and plotting is complete
        if ((state.displayOptions.chakra || state.displayOptions.chakraDirections) && state.center && state.isPlottingComplete) {
          const plotBounds = calculatePlotBounds(state.points);
          
          if (plotBounds) {
            // For regular chakra, use normal size calculation
            // For chakra directions, constrain size to plot bounds
            let overlaySize;
            if (state.displayOptions.chakraDirections) {
              // Calculate overlay size to fit exactly within plot bounds
              const maxSize = Math.min(plotBounds.width, plotBounds.height);
              overlaySize = maxSize * state.overlayScale;
            } else {
              // Normal chakra overlay size (can extend beyond plot)
              overlaySize = 300 * state.overlayScale;
            }

            // Use custom position if available, otherwise center on the center point
            const centerX = state.overlayPosition?.x ?? state.center.x;
            const centerY = state.overlayPosition?.y ?? state.center.y;

            // Draw the chakra overlay
            drawChakraOverlay({
              center: { x: centerX, y: centerY, id: 'overlay-center' },
              rotation: state.overlayRotation,
              scale: state.overlayScale,
              opacity: state.overlayOpacity,
              size: overlaySize,
              ctx,
              plotBounds,
              constrainToPlot: state.displayOptions.chakraDirections
            });

            // Store overlay bounds for selection detection
            setOverlayBounds({
              x: centerX - overlaySize / 2,
              y: centerY - overlaySize / 2,
              width: overlaySize,
              height: overlaySize,
            });

            // Draw selection border if overlay is selected
            if (overlaySelected) {
              ctx.save();
              ctx.strokeStyle = '#3b82f6';
              ctx.lineWidth = 3;
              ctx.setLineDash([10, 5]);
              ctx.globalAlpha = 0.8;
              ctx.beginPath();
              ctx.arc(centerX, centerY, overlaySize / 2, 0, 2 * Math.PI);
              ctx.stroke();
              ctx.setLineDash([]);
              ctx.restore();
            }
          }
        }
      }

      // Draw connection lines between points
      if (state.points.length > 1) {
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        
        ctx.beginPath();
        ctx.moveTo(state.points[0].x, state.points[0].y);
        
        for (let i = 1; i < state.points.length; i++) {
          ctx.lineTo(state.points[i].x, state.points[i].y);
        }
        
        // Connect back to first point if we have more than 2 points
        if (state.points.length > 2) {
          ctx.lineTo(state.points[0].x, state.points[0].y);
        }
        
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Draw plotted points
      state.points.forEach((point, index) => {
        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(point.x, point.y, 6, 0, 2 * Math.PI);
        ctx.fill();

        // Draw point number
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText((index + 1).toString(), point.x, point.y + 4);
      });

      // Draw center point
      if (state.center) {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(state.center.x, state.center.y, 8, 0, 2 * Math.PI);
        ctx.fill();

        // Draw center cross
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(state.center.x - 6, state.center.y);
        ctx.lineTo(state.center.x + 6, state.center.y);
        ctx.moveTo(state.center.x, state.center.y - 6);
        ctx.lineTo(state.center.x, state.center.y + 6);
        ctx.stroke();
      }

      // Draw planet labels if enabled
      console.log('Planet check:', {
        planetsEnabled: state.displayOptions.planets,
        plottingComplete: state.isPlottingComplete,
        planetCount: state.planetPositions?.length || 0,
        centerExists: !!state.center
      });
      
      if (state.displayOptions.planets && state.isPlottingComplete) {
        console.log('Drawing planets:', state.planetPositions?.length || 0, 'planets');
        console.log('Planet positions:', state.planetPositions);
        
        const planets = state.planetPositions || [];
        planets.forEach((planet) => {
          const baseRadius = 20;
          const scaledRadius = baseRadius * (state.planetScale || 1);
          
          // Apply planet opacity
          ctx.save();
          ctx.globalAlpha = state.planetOpacity || 0.8;
          
          // Draw planet background circle
          ctx.fillStyle = '#10b981';
          ctx.beginPath();
          ctx.arc(planet.x, planet.y, scaledRadius, 0, 2 * Math.PI);
          ctx.fill();

          // Draw planet border
          ctx.strokeStyle = '#059669';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(planet.x, planet.y, scaledRadius, 0, 2 * Math.PI);
          ctx.stroke();

          // Draw planet name
          ctx.fillStyle = 'white';
          ctx.font = `${Math.max(10, 12 * (state.planetScale || 1))}px Arial`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(planet.name, planet.x, planet.y);

          ctx.restore();

          // Draw selection highlight if dragging (without opacity)
          if (draggedPlanet === planet.id) {
            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 3;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.arc(planet.x, planet.y, scaledRadius + 5, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.setLineDash([]);
          }
        });
      }

      // Draw sign labels if enabled (after planets for proper layering)
      if (state.displayOptions.signs && state.isPlottingComplete) {
        console.log('Drawing signs:', state.signPositions?.length || 0, 'signs');
        
        const signs = state.signPositions || [];
        signs.forEach((sign) => {
          const baseRadius = 20;
          const scaledRadius = baseRadius * (state.signScale || 1);
          
          // Apply sign opacity
          ctx.save();
          ctx.globalAlpha = state.signOpacity || 0.8;
          
          // Draw sign background circle (purple theme to differentiate from planets)
          ctx.fillStyle = '#8b5cf6';
          ctx.beginPath();
          ctx.arc(sign.x, sign.y, scaledRadius, 0, 2 * Math.PI);
          ctx.fill();

          // Draw sign border
          ctx.strokeStyle = '#7c3aed';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(sign.x, sign.y, scaledRadius, 0, 2 * Math.PI);
          ctx.stroke();

          // Draw sign name
          ctx.fillStyle = 'white';
          ctx.font = `${Math.max(10, 12 * (state.signScale || 1))}px Arial`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(sign.name, sign.x, sign.y);

          ctx.restore();

          // Draw selection highlight if dragging (without opacity)
          if (draggedSign === sign.id) {
            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 3;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.arc(sign.x, sign.y, scaledRadius + 5, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.setLineDash([]);
          }
        });
      }
    }, [floorPlanImg, imageLoaded, directionsImg, directionsImageLoaded, state.points, state.center, state.displayOptions.chakra, state.displayOptions.chakraDirections, state.displayOptions.directions, state.displayOptions.planets, state.displayOptions.signs, state.planetPositions, state.signPositions, state.planetOpacity, state.planetScale, state.signOpacity, state.signScale, state.overlayOpacity, state.overlayRotation, state.overlayScale, state.overlayPosition, state.isPlottingComplete, overlaySelected, draggedPlanet, draggedSign]);

    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Check if clicking on a sign first
      if (state.displayOptions.signs && state.isPlottingComplete) {
        for (const sign of state.signPositions) {
          const scaledRadius = 20 * (state.signScale || 1);
          const distance = Math.sqrt((x - sign.x) ** 2 + (y - sign.y) ** 2);
          if (distance <= scaledRadius) {
            // Sign clicked - this will be handled by mouse down for dragging
            return;
          }
        }
      }

      // Check if clicking on a planet
      if (state.displayOptions.planets && state.isPlottingComplete) {
        for (const planet of state.planetPositions) {
          const scaledRadius = 20 * (state.planetScale || 1);
          const distance = Math.sqrt((x - planet.x) ** 2 + (y - planet.y) ** 2);
          if (distance <= scaledRadius) {
            // Planet clicked - drag handling is done in handleMouseDown
            return;
          }
        }
      }

      // Check if clicking on overlay (chakra or directions)
      if (overlayBounds && (state.displayOptions.chakra || state.displayOptions.chakraDirections || state.displayOptions.directions)) {
        const clickedOnOverlay = 
          x >= overlayBounds.x && 
          x <= overlayBounds.x + overlayBounds.width &&
          y >= overlayBounds.y && 
          y <= overlayBounds.y + overlayBounds.height;

        if (clickedOnOverlay) {
          setOverlaySelected(true);
          return;
        } else {
          setOverlaySelected(false);
        }
      }

      // Handle point plotting - only allow if plotting is not complete
      if (state.mode === 'plot' && !state.isPlottingComplete) {
        const newPoint: Point = {
          x,
          y,
          id: `point-${Date.now()}`,
        };
        onPointAdd(newPoint);
      }
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Check if clicking on a sign first
      if (state.displayOptions.signs && state.isPlottingComplete) {
        for (const sign of state.signPositions) {
          const scaledRadius = 20 * (state.signScale || 1);
          const distance = Math.sqrt((x - sign.x) ** 2 + (y - sign.y) ** 2);
          if (distance <= scaledRadius) {
            setDraggedSign(sign.id);
            setDragOffset({
              x: x - sign.x,
              y: y - sign.y,
            });
            return;
          }
        }
      }

      // Check if clicking on a planet
      if (state.displayOptions.planets && state.isPlottingComplete) {
        for (const planet of state.planetPositions) {
          const scaledRadius = 20 * (state.planetScale || 1);
          const distance = Math.sqrt((x - planet.x) ** 2 + (y - planet.y) ** 2);
          if (distance <= scaledRadius) {
            setDraggedPlanet(planet.id);
            setDragOffset({
              x: x - planet.x,
              y: y - planet.y,
            });
            return;
          }
        }
      }

      // Check if clicking on overlay
      if (!overlaySelected || !overlayBounds) return;

      // Check if mouse is over overlay
      const clickedOnOverlay = 
        x >= overlayBounds.x && 
        x <= overlayBounds.x + overlayBounds.width &&
        y >= overlayBounds.y && 
        y <= overlayBounds.y + overlayBounds.height;

      if (clickedOnOverlay) {
        setIsDragging(true);
        const centerX = state.overlayPosition?.x ?? state.center?.x ?? 0;
        const centerY = state.overlayPosition?.y ?? state.center?.y ?? 0;
        setDragOffset({
          x: x - centerX,
          y: y - centerY,
        });
        e.preventDefault();
      }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Handle sign dragging
      if (draggedSign && onSignMove) {
        const newX = x - dragOffset.x;
        const newY = y - dragOffset.y;
        onSignMove(draggedSign, newX, newY);
        return;
      }

      // Handle planet dragging
      if (draggedPlanet && onPlanetMove) {
        const newX = x - dragOffset.x;
        const newY = y - dragOffset.y;
        onPlanetMove(draggedPlanet, newX, newY);
        return;
      }

      // Handle overlay dragging
      if (isDragging && onOverlayMove) {
        const newX = x - dragOffset.x;
        const newY = y - dragOffset.y;
        onOverlayMove(newX, newY);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setDraggedPlanet(null);
      setDraggedSign(null);
      setDragOffset({ x: 0, y: 0 });
    };

    const handleMouseLeave = () => {
      setIsDragging(false);
      setDraggedPlanet(null);
      setDraggedSign(null);
      setDragOffset({ x: 0, y: 0 });
    };

    return (
      <Card className="p-4" ref={containerRef}>
        <div className="space-y-4">
          {overlaySelected && (state.displayOptions.chakra || state.displayOptions.directions) && (
            <div className="flex items-center justify-center gap-2 p-2 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-blue-800">
                {state.displayOptions.directions ? 'Directions Overlay Selected' : 'Chakra Overlay Selected'}
              </span>
              <span className="text-xs text-blue-600">
                Click and drag to move • Use controls to adjust rotation and scale
              </span>
            </div>
          )}

          {/* Show message when plotting is complete */}
          {state.isPlottingComplete && state.mode === 'plot' && (
            <div className="flex items-center justify-center gap-2 p-2 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-green-800">Plotting Complete</span>
              <span className="text-xs text-green-600">
                Plot points are finalized. Use "Clear Points" to start over.
              </span>
            </div>
          )}

          <div className="text-center">
            <canvas
              ref={canvasRef}
              width={canvasSize.width}
              height={canvasSize.height}
              onClick={handleCanvasClick}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              className={`border border-slate-200 rounded-lg shadow-sm max-w-full transition-all duration-200 ${
                state.mode === 'plot' && !state.isPlottingComplete ? 'cursor-crosshair' : 
                draggedSign || draggedPlanet ? 'cursor-grabbing' :
                overlaySelected && isDragging ? 'cursor-grabbing' :
                overlaySelected ? 'cursor-grab' : 'cursor-pointer'
              }`}
              style={{ 
                maxWidth: '100%', 
                height: 'auto'
              }}
            />
          </div>

          {state.floorPlanImage && !imageLoaded && (
            <div className="text-center text-sm text-orange-600">
              Loading floor plan image...
            </div>
          )}

          {(state.displayOptions.chakra || state.displayOptions.directions) && state.isPlottingComplete && (
            <div className="text-center text-sm text-green-600">
              {state.displayOptions.directions ? 'Directions overlay is active' : 'Chakra overlay is active'} - click to select and modify
            </div>
          )}

          {state.displayOptions.planets && state.isPlottingComplete && (
            <div className="text-center text-sm text-emerald-600">
              Planet labels are active - drag to move them around the floor plan
            </div>
          )}

          {state.displayOptions.signs && state.isPlottingComplete && (
            <div className="text-center text-sm text-violet-600">
              Zodiac signs are active - drag to move them around the floor plan
            </div>
          )}
        </div>
      </Card>
    );
  }
);

FloorPlanCanvas.displayName = 'FloorPlanCanvas';
