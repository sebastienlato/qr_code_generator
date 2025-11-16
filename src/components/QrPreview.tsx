import { useQrStore } from '@/state/useQrStore';
import { buildPayload, validatePayload, generateQrSVG, composeLogo, toPng, downloadFile, getFilename } from '@/lib/qr';
import { Button } from '@/components/ui/button';
import { Download, Copy, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export function QrPreview() {
  const { settings, addToHistory } = useQrStore();
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const generate = async () => {
      const payload = {
        mode: settings.mode,
        url: settings.url,
        email: settings.email,
        text: settings.text,
      };

      const validation = validatePayload(payload);
      if (!validation.valid) {
        setSvgContent(null);
        return;
      }

      setIsGenerating(true);
      try {
        const data = buildPayload(payload);
        let svg = await generateQrSVG(data, {
          size: Math.min(settings.size, 512),
          color: settings.foregroundColor,
          bgColor: settings.backgroundColor,
          margin: settings.quietZone,
          ecLevel: settings.errorCorrection,
          transparentBg: settings.transparentBg,
        });

        if (settings.logo.dataUrl) {
          svg = await composeLogo(
            svg,
            {
              dataUrl: settings.logo.dataUrl,
              scale: settings.logo.scale,
              cornerRadius: settings.logo.cornerRadius,
              safetyRing: settings.logo.safetyRing,
            },
            Math.min(settings.size, 512)
          );
        }

        setSvgContent(svg);
      } catch (error) {
        console.error('QR generation error:', error);
        setSvgContent(null);
      } finally {
        setIsGenerating(false);
      }
    };

    const debounce = setTimeout(generate, 300);
    return () => clearTimeout(debounce);
  }, [settings]);

  const handleDownloadPng = async () => {
    if (!svgContent) return;

    setIsExporting(true);
    try {
      let exportSvg = svgContent;
      
      if (settings.size !== Math.min(settings.size, 512)) {
        const payload = {
          mode: settings.mode,
          url: settings.url,
          email: settings.email,
          text: settings.text,
        };
        const data = buildPayload(payload);
        
        exportSvg = await generateQrSVG(data, {
          size: settings.size,
          color: settings.foregroundColor,
          bgColor: settings.backgroundColor,
          margin: settings.quietZone,
          ecLevel: settings.errorCorrection,
          transparentBg: settings.transparentBg,
        });

        if (settings.logo.dataUrl) {
          exportSvg = await composeLogo(
            exportSvg,
            {
              dataUrl: settings.logo.dataUrl,
              scale: settings.logo.scale,
              cornerRadius: settings.logo.cornerRadius,
              safetyRing: settings.logo.safetyRing,
            },
            settings.size
          );
        }
      }

      const blob = await toPng(exportSvg, settings.size);
      const filename = getFilename('qr', settings.size, 'png');
      downloadFile(blob, filename);
      
      saveToHistory();
      toast.success('PNG downloaded successfully');
    } catch (error) {
      console.error('PNG export error:', error);
      toast.error('Failed to export PNG');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadSvg = async () => {
    if (!svgContent) return;

    setIsExporting(true);
    try {
      let exportSvg = svgContent;
      
      if (settings.size !== Math.min(settings.size, 512)) {
        const payload = {
          mode: settings.mode,
          url: settings.url,
          email: settings.email,
          text: settings.text,
        };
        const data = buildPayload(payload);
        
        exportSvg = await generateQrSVG(data, {
          size: settings.size,
          color: settings.foregroundColor,
          bgColor: settings.backgroundColor,
          margin: settings.quietZone,
          ecLevel: settings.errorCorrection,
          transparentBg: settings.transparentBg,
        });

        if (settings.logo.dataUrl) {
          exportSvg = await composeLogo(
            exportSvg,
            {
              dataUrl: settings.logo.dataUrl,
              scale: settings.logo.scale,
              cornerRadius: settings.logo.cornerRadius,
              safetyRing: settings.logo.safetyRing,
            },
            settings.size
          );
        }
      }

      const blob = new Blob([exportSvg], { type: 'image/svg+xml' });
      const filename = getFilename('qr', settings.size, 'svg');
      downloadFile(blob, filename);
      
      saveToHistory();
      toast.success('SVG downloaded successfully');
    } catch (error) {
      console.error('SVG export error:', error);
      toast.error('Failed to export SVG');
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopySvg = () => {
    if (!svgContent) return;

    navigator.clipboard.writeText(svgContent).then(
      () => toast.success('SVG copied to clipboard'),
      () => toast.error('Failed to copy SVG')
    );
  };

  const saveToHistory = () => {
    const payload = {
      mode: settings.mode,
      url: settings.url,
      email: settings.email,
      text: settings.text,
    };
    const content = buildPayload(payload);

    addToHistory({
      mode: settings.mode,
      content: content.slice(0, 100),
      size: settings.size,
      foregroundColor: settings.foregroundColor,
      backgroundColor: settings.backgroundColor,
      transparentBg: settings.transparentBg,
      hasLogo: !!settings.logo.dataUrl,
    });
  };

  const isValid = svgContent !== null;
  const showLargeRenderNote = settings.size >= 1536;

  return (
    <div className="glass-card rounded-2xl p-8 space-y-6 sticky top-6 animate-fade-in shadow-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold tracking-tight text-foreground/90 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
          Preview
        </h2>
        {isValid && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopySvg}
            className="hover:bg-primary/10 hover:text-primary transition-all hover:scale-110"
          >
            <Copy className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="aspect-square w-full flex items-center justify-center glass-card rounded-xl p-8 relative overflow-hidden bg-gradient-to-br from-muted/30 to-muted/10">
        {isGenerating ? (
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <div className="absolute inset-0 w-10 h-10 animate-ping text-primary/20">
                <Loader2 className="w-10 h-10" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground font-medium">Generating...</p>
          </div>
        ) : !isValid ? (
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-muted/40 to-muted/20 flex items-center justify-center backdrop-blur-sm border border-muted/30">
              <div className="w-10 h-10 border-4 border-muted/60 rounded-lg" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Enter content to generate QR code</p>
          </div>
        ) : (
          <div
            className="w-full h-full flex items-center justify-center transition-all duration-500 hover:scale-105"
            dangerouslySetInnerHTML={{ __html: svgContent }}
            style={{
              imageRendering: 'crisp-edges',
            }}
          />
        )}
      </div>

      {showLargeRenderNote && isValid && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground glass-card p-3 rounded-lg bg-primary/5 border-primary/20">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
          <span className="font-medium">Large render - export may take a moment</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={handleDownloadPng}
          disabled={!isValid || isExporting}
          className="gap-2 hover:scale-105 transition-all"
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span className="font-semibold">PNG</span>
        </Button>
        <Button
          onClick={handleDownloadSvg}
          disabled={!isValid || isExporting}
          variant="secondary"
          className="gap-2 hover:scale-105 transition-all"
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span className="font-semibold">SVG</span>
        </Button>
      </div>
    </div>
  );
}
