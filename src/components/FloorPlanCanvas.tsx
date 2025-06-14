import React, { useRef, useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FloorPlanState, Point } from './FloorPlanEditor';
import { Plus, Minus } from 'lucide-react';

interface FloorPlanCanvasProps {
  state: FloorPlanState;
  onPointAdd: (point: Point) => void;
}

export const FloorPlanCanvas = ({ state, onPointAdd }: FloorPlanCanvasProps) => {
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

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const maxWidth = Math.min(rect.width - 32, 1200);
        const maxHeight = Math.min(window.innerHeight * 0.7, 800);
        setCanvasSize({ width: maxWidth, height: maxHeight });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw floor plan image
    if (state.floorPlanImage) {
      const img = new Image();
      img.onload = () => {
        // Calculate scaling to fit canvas while maintaining aspect ratio
        const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        const offsetX = (canvas.width - scaledWidth) / 2;
        const offsetY = (canvas.height - scaledHeight) / 2;

        ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);

        // Draw overlay image if present and visible
        if (state.overlayImage && state.center && state.overlayVisible) {
          const overlayImg = new Image();
          overlayImg.onload = () => {
            ctx.save();
            ctx.globalAlpha = state.overlayOpacity;

            // Scale overlay to be proportional to floor plan with user scaling
            const baseOverlayScale = Math.min(scaledWidth, scaledHeight) * 0.3;
            const finalOverlayScale = baseOverlayScale * state.overlayScale;
            const overlayWidth = finalOverlayScale;
            const overlayHeight = (overlayImg.height / overlayImg.width) * finalOverlayScale;

            // Center the overlay on the calculated center point
            const overlayX = state.center.x - overlayWidth / 2;
            const overlayY = state.center.y - overlayHeight / 2;

            // Apply rotation
            ctx.translate(state.center.x, state.center.y);
            ctx.rotate((state.overlayRotation * Math.PI) / 180);
            ctx.translate(-state.center.x, -state.center.y);

            ctx.drawImage(overlayImg, overlayX, overlayY, overlayWidth, overlayHeight);

            // Store overlay bounds for selection detection (before rotation)
            setOverlayBounds({
              x: overlayX,
              y: overlayY,
              width: overlayWidth,
              height: overlayHeight,
            });

            // Draw selection border if overlay is selected
            if (overlaySelected) {
              ctx.strokeStyle = '#3b82f6';
              ctx.lineWidth = 2;
              ctx.setLineDash([5, 5]);
              ctx.strokeRect(overlayX - 2, overlayY - 2, overlayWidth + 4, overlayHeight + 4);
              ctx.setLineDash([]);
            }

            ctx.restore();
          };
          overlayImg.src = state.overlayImage;
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
      };
      img.src = state.floorPlanImage;
    }
  }, [state, overlaySelected]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicking on overlay
    if (overlayBounds && state.overlayImage) {
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

    // Handle point plotting
    if (state.mode === 'plot') {
      const newPoint: Point = {
        x,
        y,
        id: `point-${Date.now()}`,
      };
      onPointAdd(newPoint);
    }
  };

  return (
    <Card className="p-4" ref={containerRef}>
      <div className="space-y-4">
        {overlaySelected && state.overlayImage && state.overlayVisible && (
          <div className="flex items-center justify-center gap-2 p-2 bg-blue-50 rounded-lg">
            <span className="text-sm font-medium text-blue-800">Overlay Selected</span>
            <span className="text-xs text-blue-600">
              Use the controls panel to adjust settings
            </span>
          </div>
        )}

        <div className="text-center">
          <canvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            onClick={handleCanvasClick}
            className={`border border-slate-200 rounded-lg shadow-sm max-w-full ${
              state.mode === 'plot' ? 'cursor-crosshair' : 'cursor-pointer'
            }`}
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>
        
        {state.mode === 'plot' && (
          <div className="text-center text-sm text-slate-600">
            Click on the floor plan to plot corner points. Points plotted: {state.points.length}
          </div>
        )}
        
        {state.center && (
          <div className="text-center text-sm text-green-700 font-medium">
            ✓ Center point calculated and marked in red
          </div>
        )}

        {state.overlayImage && !state.overlayVisible && (
          <div className="text-center text-sm text-orange-600">
            Overlay is hidden - use controls to show it
          </div>
        )}

        {state.overlayImage && state.overlayVisible && (
          <div className="text-center text-sm text-slate-600">
            Click on the overlay image to select it
          </div>
        )}
      </div>
    </Card>
  );
};
