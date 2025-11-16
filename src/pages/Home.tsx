import { InputModeSelector } from '@/components/InputModeSelector';
import { InputFields } from '@/components/InputFields';
import { SizeControls } from '@/components/SizeControls';
import { StyleControls } from '@/components/StyleControls';
import { LogoUpload } from '@/components/LogoUpload';
import { QrPreview } from '@/components/QrPreview';
import { HistoryModal } from '@/components/HistoryModal';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-dark">
      <div className="container max-w-[1240px] mx-auto px-6 py-12">
        <header className="text-center mb-16 animate-fade-in">
          <div className="inline-block mb-4">
            <div className="px-4 py-2 rounded-full glass-card text-sm font-medium text-primary">
              Premium QR Generator
            </div>
          </div>
          <h1 className="text-6xl font-bold tracking-tight mb-4 text-gray-200 leading-tight">
            QR Code Generator
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Create beautiful, customizable QR codes with professional styling and logo overlay
          </p>
        </header>

        <div className="grid lg:grid-cols-[1fr_440px] gap-8 items-start">
          {/* Controls Column */}
          <div className="space-y-6 animate-slide-up">
            <div className="glass-card rounded-2xl p-8 space-y-8 shadow-lg">
              <div>
                <h2 className="text-base font-semibold mb-5 tracking-tight text-foreground/90 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  Content Type
                </h2>
                <InputModeSelector />
              </div>

              <Separator className="bg-gradient-to-r from-transparent via-glass-border/40 to-transparent" />

              <div>
                <h2 className="text-base font-semibold mb-5 tracking-tight text-foreground/90 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  Input
                </h2>
                <InputFields />
              </div>
            </div>

            <div className="glass-card rounded-2xl p-8 space-y-6 shadow-lg">
              <h2 className="text-base font-semibold tracking-tight text-foreground/90 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                Size
              </h2>
              <SizeControls />
            </div>

            <div className="glass-card rounded-2xl p-8 space-y-6 shadow-lg">
              <h2 className="text-base font-semibold tracking-tight text-foreground/90 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                Styling
              </h2>
              <StyleControls />
            </div>

            <div className="glass-card rounded-2xl p-8 space-y-6 shadow-lg">
              <h2 className="text-base font-semibold tracking-tight text-foreground/90 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                Logo
              </h2>
              <LogoUpload />
            </div>

            <div className="flex justify-center">
              <HistoryModal />
            </div>
          </div>

          {/* Preview Column */}
          <div className="lg:sticky lg:top-6">
            <QrPreview />
          </div>
        </div>

        <footer className="text-center mt-20 text-sm text-muted-foreground/60">
          <div className="flex items-center justify-center gap-2">
            <div className="w-1 h-1 rounded-full bg-muted-foreground/40"></div>
            <p>Premium QR Code Generator</p>
            <div className="w-1 h-1 rounded-full bg-muted-foreground/40"></div>
            <p>Built with React & TypeScript</p>
            <div className="w-1 h-1 rounded-full bg-muted-foreground/40"></div>
          </div>
        </footer>
      </div>
    </div>
  );
}
