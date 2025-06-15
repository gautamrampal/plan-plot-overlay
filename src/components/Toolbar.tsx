
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { MousePointer, Plus } from 'lucide-react';
import { FloorPlanState } from './FloorPlanEditor';

interface ToolbarProps {
  mode: FloorPlanState['mode'];
  onModeChange: (mode: FloorPlanState['mode']) => void;
  onClear: () => void;
  opacity: number;
  onOpacityChange: (opacity: number) => void;
  hasPoints: boolean;
  hasOverlay: boolean;
}

export const Toolbar = ({
  mode,
  onModeChange,
  onClear,
  opacity,
  onOpacityChange,
  hasPoints,
  hasOverlay,
}: ToolbarProps) => {
  return (
    <Card className="p-4">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={mode === 'select' ? 'default' : 'outline'}
            onClick={() => onModeChange('select')}
            size="sm"
          >
            <MousePointer className="w-4 h-4 mr-2" />
            Select
          </Button>
          
          <Button
            variant={mode === 'plot' ? 'default' : 'outline'}
            onClick={() => onModeChange('plot')}
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Plot Points
          </Button>

          {hasPoints && (
            <Button
              variant="destructive"
              onClick={onClear}
              size="sm"
            >
              Clear Points
            </Button>
          )}
        </div>

        {hasOverlay && (
          <div className="flex items-center gap-2 min-w-[200px]">
            <span className="text-sm text-slate-600 whitespace-nowrap">Opacity:</span>
            <Slider
              value={[opacity]}
              onValueChange={(value) => onOpacityChange(value[0])}
              max={1}
              min={0}
              step={0.1}
              className="flex-1"
            />
            <span className="text-sm text-slate-600 w-8">{Math.round(opacity * 100)}%</span>
          </div>
        )}
      </div>
    </Card>
  );
};
