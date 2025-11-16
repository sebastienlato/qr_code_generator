import { useQrStore } from '@/state/useQrStore';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

const errorLevels = [
  { value: 'L', label: 'Low', description: '~7%' },
  { value: 'M', label: 'Medium', description: '~15%' },
  { value: 'Q', label: 'Quality', description: '~25%' },
  { value: 'H', label: 'High', description: '~30%' },
] as const;

export function StyleControls() {
  const { settings, updateSettings } = useQrStore();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fg-color" className="text-sm font-medium">
            Foreground
          </Label>
          <div className="flex items-center gap-2">
            <div
              className="w-10 h-10 rounded-lg border-2 border-glass-border/50 cursor-pointer hover:scale-110 transition-transform"
              style={{ backgroundColor: settings.foregroundColor }}
              onClick={() => document.getElementById('fg-color-input')?.click()}
            />
            <Input
              id="fg-color-input"
              type="color"
              value={settings.foregroundColor}
              onChange={(e) => updateSettings({ foregroundColor: e.target.value })}
              className="sr-only"
            />
            <Input
              type="text"
              value={settings.foregroundColor}
              onChange={(e) => updateSettings({ foregroundColor: e.target.value })}
              className="flex-1 h-10 glass-card border-glass-border/50 font-mono text-xs"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bg-color" className="text-sm font-medium">
            Background
          </Label>
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'w-10 h-10 rounded-lg border-2 border-glass-border/50 cursor-pointer hover:scale-110 transition-transform',
                settings.transparentBg && 'bg-gradient-to-br from-gray-200 to-gray-300'
              )}
              style={{
                backgroundColor: settings.transparentBg ? 'transparent' : settings.backgroundColor,
              }}
              onClick={() => document.getElementById('bg-color-input')?.click()}
            />
            <Input
              id="bg-color-input"
              type="color"
              value={settings.backgroundColor}
              onChange={(e) => updateSettings({ backgroundColor: e.target.value })}
              className="sr-only"
              disabled={settings.transparentBg}
            />
            <Input
              type="text"
              value={settings.backgroundColor}
              onChange={(e) => updateSettings({ backgroundColor: e.target.value })}
              disabled={settings.transparentBg}
              className="flex-1 h-10 glass-card border-glass-border/50 font-mono text-xs disabled:opacity-50"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between glass-card p-4 rounded-lg">
        <div className="space-y-0.5">
          <Label htmlFor="transparent-bg" className="text-sm font-medium cursor-pointer">
            Transparent Background
          </Label>
          <p className="text-xs text-muted-foreground">Recommended for PNG exports</p>
        </div>
        <Switch
          id="transparent-bg"
          checked={settings.transparentBg}
          onCheckedChange={(checked) => updateSettings({ transparentBg: checked })}
        />
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">
          Quiet Zone (Margin): {settings.quietZone}px
        </Label>
        <Slider
          value={[settings.quietZone]}
          onValueChange={(values) => updateSettings({ quietZone: values[0] })}
          min={0}
          max={32}
          step={1}
          className="cursor-pointer"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Error Correction Level</Label>
        <div className="grid grid-cols-4 gap-2">
          {errorLevels.map(({ value, label, description }) => (
            <button
              key={value}
              onClick={() => updateSettings({ errorCorrection: value })}
              className={cn(
                'flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-200',
                'glass-card border border-glass-border/50',
                settings.errorCorrection === value
                  ? 'bg-primary text-primary-foreground shadow-lg scale-105 glass-glow'
                  : 'hover:bg-muted/50 hover:scale-105'
              )}
            >
              <span className="text-sm font-bold">{label}</span>
              <span className="text-xs opacity-70">{description}</span>
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Higher levels allow more damage recovery but increase QR density
        </p>
      </div>
    </div>
  );
}
