
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ImageUploader } from './ImageUploader';
import { MousePointer, Plus, Square, Upload } from 'lucide-react';
import { FloorPlanState } from './FloorPlanEditor';

interface ToolbarProps {
  mode: FloorPlanState['mode'];
  onModeChange: (mode: FloorPlanState['mode']) => void;
  onComplete: () => void;
  onClear: () => void;
  onOverlayUpload: (imageUrl: string) => void;
  opacity: number;
  onOpacityChange: (opacity: number) => void;
  hasPoints: boolean;
  hasOverlay: boolean;
}

export const Toolbar = ({
  mode,
  onModeChange,
  onComplete,
  onClear,
  onOverlayUpload,
  opacity,
  onOpacityChange,
  hasPoints,
  hasOverlay,
}: ToolbarProps) => {
  const [showOverlayUploader, setShowOverlayUploader] = React.useState(false);

  return (
    <>
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
              <>
                <Button
                  onClick={onComplete}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  size="sm"
                >
                  <Square className="w-4 h-4 mr-2" />
                  Mark Center
                </Button>
                
                <Button
                  variant="destructive"
                  onClick={onClear}
                  size="sm"
                >
                  Clear Points
                </Button>
              </>
            )}
          </div>

          <div className="flex gap-4 items-center">
            <Button
              variant="outline"
              onClick={() => setShowOverlayUploader(true)}
              size="sm"
            >
              <Upload className="w-4 h-4 mr-2" />
              Add Overlay
            </Button>

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
        </div>
      </Card>

      {showOverlayUploader && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">Upload Overlay Image</h2>
              <Button
                variant="ghost"
                onClick={() => setShowOverlayUploader(false)}
                size="sm"
              >
                ✕
              </Button>
            </div>
            <div className="p-4">
              <ImageUploader
                onImageUpload={(url) => {
                  onOverlayUpload(url);
                  setShowOverlayUploader(false);
                }}
                title="Upload Overlay Image"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
