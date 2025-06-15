
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RotateCcw, RotateCw, Expand, ToggleLeft } from 'lucide-react';

interface OverlayControlsProps {
  isVisible: boolean;
  rotation: number;
  scale: number;
  opacity: number;
  onRotationChange: (rotation: number) => void;
  onScaleChange: (scale: number) => void;
  onOpacityChange: (opacity: number) => void;
  displayOptions: {
    directions: boolean;
    entrances: boolean;
    chakra: boolean;
    planets: boolean;
    vastu: boolean;
    analysis: boolean;
  };
  onDisplayOptionChange: (option: string, value: boolean) => void;
  onToggleOverlay: (visible: boolean) => void;
  hasOverlay: boolean;
}

export const OverlayControls = ({
  isVisible,
  rotation,
  scale,
  opacity,
  onRotationChange,
  onScaleChange,
  onOpacityChange,
  displayOptions,
  onDisplayOptionChange,
  onToggleOverlay,
  hasOverlay,
}: OverlayControlsProps) => {
  const handleRotationChange = (delta: number) => {
    const newRotation = (rotation + delta) % 360;
    onRotationChange(newRotation < 0 ? newRotation + 360 : newRotation);
  };

  // Get the active overlay type for the label
  const getActiveOverlayType = () => {
    if (displayOptions.directions) return 'Directions';
    if (displayOptions.chakra) return 'Chakra';
    return 'Overlay';
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <h3 className="text-lg font-semibold">Display Options</h3>
        </div>
        <p className="text-sm text-muted-foreground">Toggle display features and adjust overlay settings</p>
      </div>

      <div className="space-y-6">
        {/* Overlay Controls - Show above display options if there's an overlay */}
        {hasOverlay && (
          <div className="space-y-4">
            <Label className="text-sm font-medium">{getActiveOverlayType()} Compass Controls</Label>
            
            {/* Rotation Control */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Rotation</Label>
                <span className="text-sm text-muted-foreground">{rotation}°</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRotationChange(-15)}
                  className="h-8 w-8 p-0"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <Slider
                  value={[rotation]}
                  onValueChange={(value) => onRotationChange(value[0])}
                  max={360}
                  min={0}
                  step={1}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRotationChange(15)}
                  className="h-8 w-8 p-0"
                >
                  <RotateCw className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Scale Control */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Scale</Label>
                <span className="text-sm text-muted-foreground">{scale.toFixed(1)}x</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onScaleChange(Math.max(0.1, scale - 0.1))}
                  className="h-8 w-8 p-0"
                >
                  -
                </Button>
                <Slider
                  value={[scale]}
                  onValueChange={(value) => onScaleChange(value[0])}
                  max={5}
                  min={0.1}
                  step={0.1}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onScaleChange(Math.min(5, scale + 0.1))}
                  className="h-8 w-8 p-0"
                >
                  <Expand className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Opacity Control */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Opacity</Label>
                <span className="text-sm text-muted-foreground">{Math.round(opacity * 100)}%</span>
              </div>
              <Slider
                value={[opacity]}
                onValueChange={(value) => onOpacityChange(value[0])}
                max={1}
                min={0}
                step={0.01}
                className="w-full"
              />
            </div>

            {/* Enable/Disable Overlay */}
            <div className="flex items-center justify-between">
              <Label className="text-sm">Show Overlay</Label>
              <Switch
                checked={isVisible}
                onCheckedChange={onToggleOverlay}
              />
            </div>
          </div>
        )}

        {/* Display Options - Now below compass controls */}
        <div className={`space-y-4 ${hasOverlay ? 'border-t pt-4' : ''}`}>
          <Label className="text-sm font-medium">Display Features</Label>
          
          <div className="space-y-3">
            {Object.entries(displayOptions).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ToggleLeft className="w-4 h-4 text-muted-foreground" />
                  <Label className="text-sm capitalize">{key}</Label>
                </div>
                <Switch
                  checked={value}
                  onCheckedChange={(checked) => onDisplayOptionChange(key, checked)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
