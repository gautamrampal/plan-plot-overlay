import React from 'react';
import { Point } from './FloorPlanEditor';

interface ChakraDoorZone {
  name: string;
  element: string;
  startAngle: number;
  endAngle: number;
  color: string;
  innerRadius: number;
  outerRadius: number;
}

interface ChakraDoorsOverlayProps {
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

// 32 Chakra Door zones - each zone is 11.25 degrees (360/32)
const CHAKRA_DOOR_ZONES: ChakraDoorZone[] = [
  { name: 'N1', element: 'North 1', startAngle: 0, endAngle: 11.25, color: '#3b82f6', innerRadius: 0, outerRadius: 1.0 },
  { name: 'N2', element: 'North 2', startAngle: 11.25, endAngle: 22.5, color: '#2563eb', innerRadius: 0, outerRadius: 1.0 },
  { name: 'NNE1', element: 'North-Northeast 1', startAngle: 22.5, endAngle: 33.75, color: '#06b6d4', innerRadius: 0, outerRadius: 1.0 },
  { name: 'NNE2', element: 'North-Northeast 2', startAngle: 33.75, endAngle: 45, color: '#0891b2', innerRadius: 0, outerRadius: 1.0 },
  { name: 'NE1', element: 'Northeast 1', startAngle: 45, endAngle: 56.25, color: '#10b981', innerRadius: 0, outerRadius: 1.0 },
  { name: 'NE2', element: 'Northeast 2', startAngle: 56.25, endAngle: 67.5, color: '#059669', innerRadius: 0, outerRadius: 1.0 },
  { name: 'ENE1', element: 'East-Northeast 1', startAngle: 67.5, endAngle: 78.75, color: '#84cc16', innerRadius: 0, outerRadius: 1.0 },
  { name: 'ENE2', element: 'East-Northeast 2', startAngle: 78.75, endAngle: 90, color: '#65a30d', innerRadius: 0, outerRadius: 1.0 },
  { name: 'E1', element: 'East 1', startAngle: 90, endAngle: 101.25, color: '#eab308', innerRadius: 0, outerRadius: 1.0 },
  { name: 'E2', element: 'East 2', startAngle: 101.25, endAngle: 112.5, color: '#ca8a04', innerRadius: 0, outerRadius: 1.0 },
  { name: 'ESE1', element: 'East-Southeast 1', startAngle: 112.5, endAngle: 123.75, color: '#f59e0b', innerRadius: 0, outerRadius: 1.0 },
  { name: 'ESE2', element: 'East-Southeast 2', startAngle: 123.75, endAngle: 135, color: '#d97706', innerRadius: 0, outerRadius: 1.0 },
  { name: 'SE1', element: 'Southeast 1', startAngle: 135, endAngle: 146.25, color: '#f97316', innerRadius: 0, outerRadius: 1.0 },
  { name: 'SE2', element: 'Southeast 2', startAngle: 146.25, endAngle: 157.5, color: '#ea580c', innerRadius: 0, outerRadius: 1.0 },
  { name: 'SSE1', element: 'South-Southeast 1', startAngle: 157.5, endAngle: 168.75, color: '#ef4444', innerRadius: 0, outerRadius: 1.0 },
  { name: 'SSE2', element: 'South-Southeast 2', startAngle: 168.75, endAngle: 180, color: '#dc2626', innerRadius: 0, outerRadius: 1.0 },
  { name: 'S1', element: 'South 1', startAngle: 180, endAngle: 191.25, color: '#dc2626', innerRadius: 0, outerRadius: 1.0 },
  { name: 'S2', element: 'South 2', startAngle: 191.25, endAngle: 202.5, color: '#b91c1c', innerRadius: 0, outerRadius: 1.0 },
  { name: 'SSW1', element: 'South-Southwest 1', startAngle: 202.5, endAngle: 213.75, color: '#b91c1c', innerRadius: 0, outerRadius: 1.0 },
  { name: 'SSW2', element: 'South-Southwest 2', startAngle: 213.75, endAngle: 225, color: '#991b1b', innerRadius: 0, outerRadius: 1.0 },
  { name: 'SW1', element: 'Southwest 1', startAngle: 225, endAngle: 236.25, color: '#991b1b', innerRadius: 0, outerRadius: 1.0 },
  { name: 'SW2', element: 'Southwest 2', startAngle: 236.25, endAngle: 247.5, color: '#7c2d12', innerRadius: 0, outerRadius: 1.0 },
  { name: 'WSW1', element: 'West-Southwest 1', startAngle: 247.5, endAngle: 258.75, color: '#7c2d12', innerRadius: 0, outerRadius: 1.0 },
  { name: 'WSW2', element: 'West-Southwest 2', startAngle: 258.75, endAngle: 270, color: '#78350f', innerRadius: 0, outerRadius: 1.0 },
  { name: 'W1', element: 'West 1', startAngle: 270, endAngle: 281.25, color: '#78350f', innerRadius: 0, outerRadius: 1.0 },
  { name: 'W2', element: 'West 2', startAngle: 281.25, endAngle: 292.5, color: '#6b7280', innerRadius: 0, outerRadius: 1.0 },
  { name: 'WNW1', element: 'West-Northwest 1', startAngle: 292.5, endAngle: 303.75, color: '#6b7280', innerRadius: 0, outerRadius: 1.0 },
  { name: 'WNW2', element: 'West-Northwest 2', startAngle: 303.75, endAngle: 315, color: '#64748b', innerRadius: 0, outerRadius: 1.0 },
  { name: 'NW1', element: 'Northwest 1', startAngle: 315, endAngle: 326.25, color: '#64748b', innerRadius: 0, outerRadius: 1.0 },
  { name: 'NW2', element: 'Northwest 2', startAngle: 326.25, endAngle: 337.5, color: '#475569', innerRadius: 0, outerRadius: 1.0 },
  { name: 'NNW1', element: 'North-Northwest 1', startAngle: 337.5, endAngle: 348.75, color: '#475569', innerRadius: 0, outerRadius: 1.0 },
  { name: 'NNW2', element: 'North-Northwest 2', startAngle: 348.75, endAngle: 360, color: '#3b82f6', innerRadius: 0, outerRadius: 1.0 },
];

export const drawChakraDoorsOverlay = ({ center, rotation, scale, opacity, size, ctx, plotBounds, constrainToPlot = false }: ChakraDoorsOverlayProps) => {
  ctx.save();
  ctx.globalAlpha = opacity;
  
  // Translate to center point
  ctx.translate(center.x, center.y);
  
  // Apply rotation - North is now at 0 degrees properly
  ctx.rotate((rotation * Math.PI) / 180);
  
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
  CHAKRA_DOOR_ZONES.forEach(zone => {
    const startAngle = (zone.startAngle * Math.PI) / 180;
    const endAngle = (zone.endAngle * Math.PI) / 180;
    const outerRadius = radius * zone.outerRadius;
    
    if (constrainToPlot && plotBounds) {
      // For chakra doors directions, draw lines to plot boundaries
      const midAngle = (zone.startAngle + zone.endAngle) / 2;
      const angleRad = (midAngle * Math.PI) / 180;
      
      // Calculate line endpoint to always reach plot boundary
      const cos = Math.cos(angleRad);
      const sin = Math.sin(angleRad);
      
      // Calculate maximum distance to plot boundary in this direction
      const halfWidth = plotBounds.width / 2;
      const halfHeight = plotBounds.height / 2;
      
      // Find intersection with plot rectangle boundary
      let lineEndX, lineEndY;
      
      // Calculate distances to each boundary
      const distToRight = halfWidth / Math.abs(cos);
      const distToTop = halfHeight / Math.abs(sin);
      const distToLeft = halfWidth / Math.abs(cos);  
      const distToBottom = halfHeight / Math.abs(sin);
      
      // Use the minimum distance to ensure we hit the boundary
      let maxDistance;
      if (Math.abs(cos) < 0.001) {
        // Nearly vertical line
        maxDistance = halfHeight;
        lineEndX = 0;
        lineEndY = sin > 0 ? halfHeight : -halfHeight;
      } else if (Math.abs(sin) < 0.001) {
        // Nearly horizontal line
        maxDistance = halfWidth;
        lineEndX = cos > 0 ? halfWidth : -halfWidth;
        lineEndY = 0;
      } else {
        // Find which boundary we hit first
        const distanceToVertical = halfWidth / Math.abs(cos);
        const distanceToHorizontal = halfHeight / Math.abs(sin);
        
        if (distanceToVertical <= distanceToHorizontal) {
          // Hit vertical boundary first
          maxDistance = distanceToVertical;
          lineEndX = cos > 0 ? halfWidth : -halfWidth;
          lineEndY = lineEndX * Math.tan(angleRad);
        } else {
          // Hit horizontal boundary first
          maxDistance = distanceToHorizontal;
          lineEndY = sin > 0 ? halfHeight : -halfHeight;
          lineEndX = lineEndY / Math.tan(angleRad);
        }
      }
      
      // Draw line from center to plot boundary
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(lineEndX, lineEndY);
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      ctx.stroke();
    } else {
      // Regular chakra doors overlay with circular sectors
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
    
    // Calculate text angle - position between the lines, not on them
    // Offset the text angle slightly from the center to avoid being on the directional line
    let textAngle = (zone.startAngle + zone.endAngle) / 2 * Math.PI / 180;
    // Add a small angular offset to position text between lines
    const angleOffset = (5.625 * Math.PI / 180); // Half of the zone width (11.25/2)
    textAngle += angleOffset * 0.3; // Use 30% of the offset to stay between lines
    
    const textRadius = radius * 1.15;
    const textX = Math.cos(textAngle) * textRadius;
    const textY = Math.sin(textAngle) * textRadius;
    
    ctx.save();
    ctx.translate(textX, textY);
    
    // Keep text always horizontal and readable by counter-rotating the entire chakra rotation
    ctx.rotate(-((rotation) * Math.PI) / 180);
    
    ctx.fillStyle = '#dc2626'; // Red color
    ctx.font = `bold ${Math.max(8, radius * 0.03)}px Arial`;
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

export default drawChakraDoorsOverlay;
