
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/card';

// Sample data for the 16 Vastu directions
const vastuDirectionsData = [
  { direction: 'N', area: 7.5, color: '#ef4444' },
  { direction: 'NNE', area: 9.2, color: '#f97316' },
  { direction: 'NE', area: 10.1, color: '#ec4899' },
  { direction: 'ENE', area: 8.8, color: '#06b6d4' },
  { direction: 'E', area: 7.8, color: '#0ea5e9' },
  { direction: 'ESE', area: 8.5, color: '#10b981' },
  { direction: 'SE', area: 9.0, color: '#eab308' },
  { direction: 'SSE', area: 7.2, color: '#a855f7' },
  { direction: 'S', area: 6.8, color: '#22d3ee' },
  { direction: 'SSW', area: 5.5, color: '#84cc16' },
  { direction: 'SW', area: 4.2, color: '#f59e0b' },
  { direction: 'WSW', area: 4.8, color: '#8b5cf6' },
  { direction: 'W', area: 5.2, color: '#3b82f6' },
  { direction: 'WNW', area: 4.9, color: '#f97316' },
  { direction: 'NW', area: 5.8, color: '#10b981' },
  { direction: 'NNW', area: 6.2, color: '#06b6d4' },
];

export const VastuAnalysisChart = () => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{`Direction: ${label}`}</p>
          <p className="text-blue-600">
            {`Area: ${payload[0].value}%`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-slate-800 mb-2">Directional Area Analysis</h3>
        <p className="text-sm text-muted-foreground">Distribution of area across 16 Vastu directions</p>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={vastuDirectionsData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 60,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="direction" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              label={{ value: 'Area %', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="area" 
              fill={(entry: any) => entry.color}
              radius={[2, 2, 0, 0]}
            >
              {vastuDirectionsData.map((entry, index) => (
                <Bar key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-xs text-muted-foreground">
          Analysis based on plotted floor plan area distribution
        </p>
      </div>
    </Card>
  );
};
