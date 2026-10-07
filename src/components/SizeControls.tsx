import { useQrStore } from '@/state/useQrStore';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const presets = [128, 256, 384, 512, 640, 768, 1024, 1536, 2048];

export function SizeControls() {
  const { settings, updateSettings } = useQrStore();

  const handleSliderChange = (values: number[]) => {
    updateSettings({ size: values[0] });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (isNaN(value)) return;
    const clamped = Math.min(Math.max(value, 128), 4096);
    updateSettings({ size: clamped });
  };

  const handlePresetClick = (size: number) => {
    updateSettings({ size });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-foreground/90">Size: {settings.size}px</Label>
          <Input
            type="number"
            min={128}
            max={4096}
            value={settings.size}
            onChange={handleInputChange}
            className="w-24 h-9 glass-card border-glass-border/50 text-right text-sm font-medium"
          />
        </div>
        
        <Slider
          value={[settings.size]}
          onValueChange={handleSliderChange}
          min={128}
          max={2048}
          step={1}
          className="cursor-pointer"
        />
      </div>

      <div className="space-y-3">
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Quick Presets</Label>
        <div className="flex flex-wrap gap-2">
          {presets.map((size) => (
            <button
              key={size}
              onClick={() => handlePresetClick(size)}
              className={cn(
                'px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300',
                'glass-card border border-glass-border/30',
                settings.size === size
                  ? 'bg-linear-to-br from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/20 scale-105 border-primary/50'
                  : 'hover:bg-muted/60 hover:scale-105 hover:border-glass-border/50'
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
