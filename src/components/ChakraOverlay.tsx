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
}

const CHAKRA_ZONES: ChakraZone[] = [
  // Outer ring - Primary directions
  { name: 'NORTH', element: 'Water', startAngle: 337.5, endAngle: 22.5, color: '#4f46e5', innerRadius: 0.7, outerRadius: 1.0 },
  { name: 'NORTHEAST', element: 'Air + Water', startAngle: 22.5, endAngle: 67.5, color: '#06b6d4', innerRadius: 0.7, outerRadius: 1.0 },
  { name: 'EAST', element: 'Air', startAngle: 67.5, endAngle: 112.5, color: '#10b981', innerRadius: 0.7, outerRadius: 1.0 },
  { name: 'SOUTHEAST', element: 'Fire + Air', startAngle: 112.5, endAngle: 157.5, color: '#f59e0b', innerRadius: 0.7, outerRadius: 1.0 },
  { name: 'SOUTH', element: 'Fire', startAngle: 157.5, endAngle: 202.5, color: '#ef4444', innerRadius: 0.7, outerRadius: 1.0 },
  { name: 'SOUTHWEST', element: 'Earth + Fire', startAngle: 202.5, endAngle: 247.5, color: '#dc2626', innerRadius: 0.7, outerRadius: 1.0 },
  { name: 'WEST', element: 'Earth', startAngle: 247.5, endAngle: 292.5, color: '#7c2d12', innerRadius: 0.7, outerRadius: 1.0 },
  { name: 'NORTHWEST', element: 'Air + Earth', startAngle: 292.5, endAngle: 337.5, color: '#6b7280', innerRadius: 0.7, outerRadius: 1.0 },
  
  // Middle ring - Sub-directions
  { name: 'N1', element: 'Water+', startAngle: 337.5, endAngle: 0, color: '#3730a3', innerRadius: 0.4, outerRadius: 0.7 },
  { name: 'N2', element: 'Water', startAngle: 0, endAngle: 22.5, color: '#4338ca', innerRadius: 0.4, outerRadius: 0.7 },
  { name: 'NE1', element: 'Water-Air', startAngle: 22.5, endAngle: 45, color: '#0891b2', innerRadius: 0.4, outerRadius: 0.7 },
  { name: 'NE2', element: 'Air-Water', startAngle: 45, endAngle: 67.5, color: '#0e7490', innerRadius: 0.4, outerRadius: 0.7 },
  { name: 'E1', element: 'Air+', startAngle: 67.5, endAngle: 90, color: '#047857', innerRadius: 0.4, outerRadius: 0.7 },
  { name: 'E2', element: 'Air', startAngle: 90, endAngle: 112.5, color: '#059669', innerRadius: 0.4, outerRadius: 0.7 },
  { name: 'SE1', element: 'Air-Fire', startAngle: 112.5, endAngle: 135, color: '#d97706', innerRadius: 0.4, outerRadius: 0.7 },
  { name: 'SE2', element: 'Fire-Air', startAngle: 135, endAngle: 157.5, color: '#ea580c', innerRadius: 0.4, outerRadius: 0.7 },
  { name: 'S1', element: 'Fire+', startAngle: 157.5, endAngle: 180, color: '#dc2626', innerRadius: 0.4, outerRadius: 0.7 },
  { name: 'S2', element: 'Fire', startAngle: 180, endAngle: 202.5, color: '#b91c1c', innerRadius: 0.4, outerRadius: 0.7 },
  { name: 'SW1', element: 'Fire-Earth', startAngle: 202.5, endAngle: 225, color: '#991b1b', innerRadius: 0.4, outerRadius: 0.7 },
  { name: 'SW2', element: 'Earth-Fire', startAngle: 225, endAngle: 247.5, color: '#7f1d1d', innerRadius: 0.4, outerRadius: 0.7 },
  { name: 'W1', element: 'Earth+', startAngle: 247.5, endAngle: 270, color: '#451a03', innerRadius: 0.4, outerRadius: 0.7 },
  { name: 'W2', element: 'Earth', startAngle: 270, endAngle: 292.5, color: '#78350f', innerRadius: 0.4, outerRadius: 0.7 },
  { name: 'NW1', element: 'Earth-Air', startAngle: 292.5, endAngle: 315, color: '#4b5563', innerRadius: 0.4, outerRadius: 0.7 },
  { name: 'NW2', element: 'Air-Earth', startAngle: 315, endAngle: 337.5, color: '#6b7280', innerRadius: 0.4, outerRadius: 0.7 },
];

export const drawChakraOverlay = ({ center, rotation, scale, opacity, size, ctx }: ChakraOverlayProps) => {
  ctx.save();
  ctx.globalAlpha = opacity;
  
  // Translate to center point
  ctx.translate(center.x, center.y);
  
  // Apply rotation
  ctx.rotate((rotation * Math.PI) / 180);
  
  // Apply scale
  ctx.scale(scale, scale);
  
  const radius = size / 2;
  
  // Draw each zone
  CHAKRA_ZONES.forEach(zone => {
    const startAngle = (zone.startAngle * Math.PI) / 180;
    const endAngle = (zone.endAngle * Math.PI) / 180;
    const innerRadius = radius * zone.innerRadius;
    const outerRadius = radius * zone.outerRadius;
    
    // Create gradient for the zone
    const gradient = ctx.createRadialGradient(0, 0, innerRadius, 0, 0, outerRadius);
    gradient.addColorStop(0, zone.color + '80'); // Semi-transparent
    gradient.addColorStop(1, zone.color + 'CC'); // More opaque
    
    // Draw the sector
    ctx.beginPath();
    ctx.arc(0, 0, outerRadius, startAngle, endAngle);
    ctx.arc(0, 0, innerRadius, endAngle, startAngle, true);
    ctx.closePath();
    
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Draw border
    ctx.strokeStyle = '#ffffff40';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Draw text labels for main directions
    if (zone.outerRadius === 1.0 && zone.name.length <= 9) {
      const textAngle = (startAngle + endAngle) / 2;
      const textRadius = radius * 0.85;
      const textX = Math.cos(textAngle) * textRadius;
      const textY = Math.sin(textAngle) * textRadius;
      
      ctx.save();
      ctx.translate(textX, textY);
      ctx.rotate(textAngle + Math.PI / 2);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = `${Math.max(8, radius * 0.04)}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.strokeText(zone.name, 0, 0);
      ctx.fillText(zone.name, 0, 0);
      
      ctx.restore();
    }
  });
  
  // Draw center circle
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.4, 0, 2 * Math.PI);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.strokeStyle = '#333333';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Draw center cross
  ctx.beginPath();
  ctx.moveTo(-radius * 0.2, 0);
  ctx.lineTo(radius * 0.2, 0);
  ctx.moveTo(0, -radius * 0.2);
  ctx.lineTo(0, radius * 0.2);
  ctx.strokeStyle = '#333333';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Draw degree markings
  for (let i = 0; i < 360; i += 15) {
    const angle = (i * Math.PI) / 180;
    const innerR = radius * 0.95;
    const outerR = radius * (i % 45 === 0 ? 1.05 : 1.02);
    
    ctx.beginPath();
    ctx.moveTo(Math.cos(angle) * innerR, Math.sin(angle) * innerR);
    ctx.lineTo(Math.cos(angle) * outerR, Math.sin(angle) * outerR);
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = i % 45 === 0 ? 2 : 1;
    ctx.stroke();
    
    // Add degree numbers for major directions
    if (i % 45 === 0) {
      const textR = radius * 1.15;
      const textX = Math.cos(angle) * textR;
      const textY = Math.sin(angle) * textR;
      
      ctx.fillStyle = '#333333';
      ctx.font = `${Math.max(10, radius * 0.06)}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(i.toString() + '°', textX, textY);
    }
  }
  
  ctx.restore();
};

export default drawChakraOverlay;