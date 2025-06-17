
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MousePointer, Plus, Download, FileText, Check } from 'lucide-react';
import { FloorPlanState } from './FloorPlanEditor';

interface ToolbarProps {
  mode: FloorPlanState['mode'];
  onModeChange: (mode: FloorPlanState['mode']) => void;
  onClear: () => void;
  onCompletePlotting: () => void;
  opacity: number;
  onOpacityChange: (opacity: number) => void;
  hasPoints: boolean;
  hasOverlay: boolean;
  isPlottingComplete: boolean;
  onExport: () => void;
  onExportPDF: () => void;
}

export const Toolbar = ({
  mode,
  onModeChange,
  onClear,
  onCompletePlotting,
  hasPoints,
  isPlottingComplete,
  onExport,
  onExportPDF,
}: ToolbarProps) => {
  return (
    <Card className="p-4">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2 flex-wrap">
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
            disabled={isPlottingComplete}
          >
            <Plus className="w-4 h-4 mr-2" />
            {isPlottingComplete ? 'Plotting Complete' : 'Plot Points'}
          </Button>

          {mode === 'plot' && hasPoints && !isPlottingComplete && (
            <Button
              variant="default"
              onClick={onCompletePlotting}
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="w-4 h-4 mr-2" />
              Complete Plotting
            </Button>
          )}

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

        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={onExport}
            size="sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Image
          </Button>

          <Button
            variant="secondary"
            onClick={onExportPDF}
            size="sm"
          >
            <FileText className="w-4 h-4 mr-2" />
            Generate PDF
          </Button>
        </div>
      </div>
    </Card>
  );
};
