import { InputMode, useQrStore } from '@/state/useQrStore';
import { Globe, Mail, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

const modes: { value: InputMode; label: string; icon: typeof Globe }[] = [
  { value: 'url', label: 'URL', icon: Globe },
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'text', label: 'Text', icon: FileText },
];

export function InputModeSelector() {
  const { settings, updateSettings } = useQrStore();

  return (
    <div className="flex items-center gap-1.5 p-1.5 glass-card rounded-xl">
      {modes.map(({ value, label, icon: Icon }) => {
        const isActive = settings.mode === value;
        return (
          <button
            key={value}
            onClick={() => updateSettings({ mode: value })}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all duration-300 font-medium text-sm tracking-tight relative overflow-hidden group',
              isActive
                ? 'bg-gradient-to-br from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/25 scale-[1.02]'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/70'
            )}
          >
            {isActive && (
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            )}
            <Icon className={cn("w-4 h-4 transition-transform", isActive && "scale-110")} />
            <span className="relative">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
