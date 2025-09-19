import React from 'react';
import { Point } from './FloorPlanEditor';

interface ChakraZone {
  name: string;
  element: string;
  startAngle: number;
  endAngle: number;
  color: string;
  innerRadius: number;
  outerRadius: number;
}

interface ChakraOverlayProps {
  center: Point;
  rotation: number;
  scale: number;
  opacity: number;
  size: number;
  ctx: CanvasRenderingContext2D;
  plotBounds?: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    width: number;
    height: number;
    centerX: number;
    centerY: number;
  } | null;
  constrainToPlot?: boolean;
}

const CHAKRA_ZONES: ChakraZone[] = [
  { name: 'N', element: 'North', startAngle: 337.5, endAngle: 22.5, color: '#3b82f6', innerRadius: 0, outerRadius: 1.0 },
  { name: 'NNE', element: 'North-Northeast', startAngle: 22.5, endAngle: 45, color: '#06b6d4', innerRadius: 0, outerRadius: 1.0 },
  { name: 'NE', element: 'Northeast', startAngle: 45, endAngle: 67.5, color: '#10b981', innerRadius: 0, outerRadius: 1.0 },
  { name: 'ENE', element: 'East-Northeast', startAngle: 67.5, endAngle: 90, color: '#84cc16', innerRadius: 0, outerRadius: 1.0 },
  { name: 'E', element: 'East', startAngle: 90, endAngle: 112.5, color: '#eab308', innerRadius: 0, outerRadius: 1.0 },
  { name: 'ESE', element: 'East-Southeast', startAngle: 112.5, endAngle: 135, color: '#f59e0b', innerRadius: 0, outerRadius: 1.0 },
  { name: 'SE', element: 'Southeast', startAngle: 135, endAngle: 157.5, color: '#f97316', innerRadius: 0, outerRadius: 1.0 },
  { name: 'SSE', element: 'South-Southeast', startAngle: 157.5, endAngle: 180, color: '#ef4444', innerRadius: 0, outerRadius: 1.0 },
  { name: 'S', element: 'South', startAngle: 180, endAngle: 202.5, color: '#dc2626', innerRadius: 0, outerRadius: 1.0 },
  { name: 'SSW', element: 'South-Southwest', startAngle: 202.5, endAngle: 225, color: '#b91c1c', innerRadius: 0, outerRadius: 1.0 },
  { name: 'SW', element: 'Southwest', startAngle: 225, endAngle: 247.5, color: '#991b1b', innerRadius: 0, outerRadius: 1.0 },
  { name: 'WSW', element: 'West-Southwest', startAngle: 247.5, endAngle: 270, color: '#7c2d12', innerRadius: 0, outerRadius: 1.0 },
  { name: 'W', element: 'West', startAngle: 270, endAngle: 292.5, color: '#78350f', innerRadius: 0, outerRadius: 1.0 },
  { name: 'WNW', element: 'West-Northwest', startAngle: 292.5, endAngle: 315, color: '#6b7280', innerRadius: 0, outerRadius: 1.0 },
  { name: 'NW', element: 'Northwest', startAngle: 315, endAngle: 337.5, color: '#64748b', innerRadius: 0, outerRadius: 1.0 },
  { name: 'NNW', element: 'North-Northwest', startAngle: 337.5, endAngle: 360, color: '#475569', innerRadius: 0, outerRadius: 1.0 },
];

export const drawChakraOverlay = ({ center, rotation, scale, opacity, size, ctx, plotBounds, constrainToPlot = false }: ChakraOverlayProps) => {
  ctx.save();
  ctx.globalAlpha = opacity;
  
  // Translate to center point
  ctx.translate(center.x, center.y);
  
  // Apply rotation - adjust base rotation so North points up (subtract 90 degrees)
  ctx.rotate(((rotation - 90) * Math.PI) / 180);
  
  // Apply scale
  ctx.scale(scale, scale);
  
  let radius = size / 2;
  
  // If constraining to plot and plot bounds exist, calculate the maximum radius
  if (constrainToPlot && plotBounds) {
    // Calculate the distance from center to the nearest plot boundary
    const distanceToLeft = Math.abs(center.x - plotBounds.minX);
    const distanceToRight = Math.abs(plotBounds.maxX - center.x);
    const distanceToTop = Math.abs(center.y - plotBounds.minY);
    const distanceToBottom = Math.abs(plotBounds.maxY - center.y);
    
    // Find the minimum distance to ensure chakra stays within plot bounds
    const maxRadius = Math.min(distanceToLeft, distanceToRight, distanceToTop, distanceToBottom);
    
    // Use the smaller of the calculated radius or the constrained radius
    radius = Math.min(radius, maxRadius / scale); // Divide by scale to account for scaling
  }
  
  // Draw each zone
  CHAKRA_ZONES.forEach(zone => {
    const startAngle = (zone.startAngle * Math.PI) / 180;
    const endAngle = (zone.endAngle * Math.PI) / 180;
    const outerRadius = radius * zone.outerRadius;
    
    if (constrainToPlot && plotBounds) {
      // For chakra directions, draw lines to plot corners instead of circular sectors
      const midAngle = zone.startAngle === 337.5 && zone.endAngle === 22.5 ? 0 : (zone.startAngle + zone.endAngle) / 2;
      const angleRad = (midAngle * Math.PI) / 180;
      
      // Calculate line endpoint based on plot bounds
      const cos = Math.cos(angleRad);
      const sin = Math.sin(angleRad);
      
      // Find intersection with plot boundary
      let lineEndX, lineEndY;
      if (Math.abs(cos) > Math.abs(sin)) {
        // Hit vertical boundary
        const boundaryX = cos > 0 ? plotBounds.width / 2 : -plotBounds.width / 2;
        lineEndX = boundaryX;
        lineEndY = boundaryX * Math.tan(angleRad);
      } else {
        // Hit horizontal boundary  
        const boundaryY = sin > 0 ? plotBounds.height / 2 : -plotBounds.height / 2;
        lineEndY = boundaryY;
        lineEndX = boundaryY / Math.tan(angleRad);
      }
      
      // Draw line from center to plot boundary
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(lineEndX, lineEndY);
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      ctx.stroke();
    } else {
      // Regular chakra overlay with circular sectors
      // Draw the sector from center to outer radius
      ctx.beginPath();
      ctx.moveTo(0, 0); // Start from center
      ctx.arc(0, 0, outerRadius, startAngle, endAngle);
      ctx.lineTo(0, 0); // Connect back to center
      ctx.closePath();
      
      ctx.fillStyle = '#ffffff20'; // Light transparent fill
      ctx.fill();
      
      // Draw border
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    
    // Calculate text angle, handling zones that cross 0° and special positioning for North
    let textAngle;
    if (zone.name === 'N') {
      // Position North label at zero degrees
      textAngle = 0;
    } else if (zone.startAngle > zone.endAngle) {
      // Zone crosses 0° (like North: 337.5° to 22.5°)
      textAngle = ((zone.startAngle + zone.endAngle + 360) / 2) * Math.PI / 180;
      if (textAngle > Math.PI) textAngle -= 2 * Math.PI;
    } else {
      textAngle = (zone.startAngle + zone.endAngle) / 2 * Math.PI / 180;
    }
    const textRadius = radius * 1.15;
    const textX = Math.cos(textAngle) * textRadius;
    const textY = Math.sin(textAngle) * textRadius;
    
    ctx.save();
    ctx.translate(textX, textY);
    
    // Keep text always horizontal and readable by counter-rotating the entire chakra rotation
    ctx.rotate(-((rotation) * Math.PI) / 180);
    
    ctx.fillStyle = '#dc2626'; // Red color
    ctx.font = `bold ${Math.max(10, radius * 0.04)}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(zone.name, 0, 0);
    
    ctx.restore();
  });
  
  // Draw center point
  ctx.beginPath();
  ctx.arc(0, 0, 3, 0, 2 * Math.PI);
  ctx.fillStyle = '#000000';
  ctx.fill();
  
  
  ctx.restore();
};

export default drawChakraOverlay;