import { useQrStore } from '@/state/useQrStore';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import { useRef } from 'react';

export function LogoUpload() {
  const { settings, updateLogo } = useQrStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      updateLogo({
        file,
        dataUrl: event.target?.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    updateLogo({
      file: null,
      dataUrl: null,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Logo Overlay (Optional)</Label>
        
        {!settings.logo.dataUrl ? (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/svg+xml,image/jpeg"
              onChange={handleFileChange}
              className="sr-only"
              id="logo-upload"
            />
            <label htmlFor="logo-upload">
              <div className="glass-card border-2 border-dashed border-glass-border/50 rounded-lg p-8 cursor-pointer hover:border-primary/50 transition-all text-center">
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">Upload Logo</p>
                <p className="text-xs text-muted-foreground mt-1">PNG, SVG, or JPEG</p>
              </div>
            </label>
          </div>
        ) : (
          <div className="glass-card rounded-lg p-4 space-y-4">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-lg border-2 border-glass-border/50 bg-white/10 flex items-center justify-center overflow-hidden"
                style={{
                  backgroundImage: `url("${settings.logo.dataUrl}")`,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              />
              <div className="flex-1">
                <p className="text-sm font-medium truncate">{settings.logo.file?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {settings.logo.file ? Math.round(settings.logo.file.size / 1024) : 0}KB
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemoveLogo}
                className="hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-3 pt-2 border-t border-glass-border/50">
              <div className="space-y-2">
                <Label className="text-xs font-medium">
                  Scale: {settings.logo.scale}%
                </Label>
                <Slider
                  value={[settings.logo.scale]}
                  onValueChange={(values) => updateLogo({ scale: values[0] })}
                  min={10}
                  max={35}
                  step={1}
                  className="cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium">
                  Corner Radius: {settings.logo.cornerRadius}px
                </Label>
                <Slider
                  value={[settings.logo.cornerRadius]}
                  onValueChange={(values) => updateLogo({ cornerRadius: values[0] })}
                  min={0}
                  max={32}
                  step={1}
                  className="cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="space-y-0.5">
                  <Label htmlFor="safety-ring" className="text-xs font-medium cursor-pointer">
                    Safety Ring
                  </Label>
                  <p className="text-xs text-muted-foreground">Adds contrast padding</p>
                </div>
                <Switch
                  id="safety-ring"
                  checked={settings.logo.safetyRing}
                  onCheckedChange={(checked) => updateLogo({ safetyRing: checked })}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
