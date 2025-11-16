import { useQrStore } from '@/state/useQrStore';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { buildPayload, validatePayload } from '@/lib/qr';
import { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';

export function InputFields() {
  const { settings, updateSettings, updateEmailField } = useQrStore();
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    const payload = {
      mode: settings.mode,
      url: settings.url,
      email: settings.email,
      text: settings.text,
    };
    const validation = validatePayload(payload);
    setError(validation.error);
  }, [settings.mode, settings.url, settings.email, settings.text]);

  return (
    <div className="space-y-4">
      {settings.mode === 'url' && (
        <div className="space-y-2">
          <Label htmlFor="url" className="text-sm font-medium">
            Website URL
          </Label>
          <Input
            id="url"
            type="url"
            placeholder="https://example.com"
            value={settings.url}
            onChange={(e) => updateSettings({ url: e.target.value })}
            className="glass-card border-glass-border/50 focus:border-primary/50 transition-all"
          />
          {error && (
            <div className="flex items-center gap-2 text-xs text-destructive">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{error}</span>
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            Enter a complete URL starting with http:// or https://
          </p>
        </div>
      )}

      {settings.mode === 'email' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email-to" className="text-sm font-medium">
              Recipient Email *
            </Label>
            <Input
              id="email-to"
              type="email"
              placeholder="recipient@example.com"
              value={settings.email.to}
              onChange={(e) => updateEmailField('to', e.target.value)}
              className="glass-card border-glass-border/50 focus:border-primary/50 transition-all"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email-subject" className="text-sm font-medium">
              Subject
            </Label>
            <Input
              id="email-subject"
              type="text"
              placeholder="Email subject"
              value={settings.email.subject}
              onChange={(e) => updateEmailField('subject', e.target.value)}
              className="glass-card border-glass-border/50 focus:border-primary/50 transition-all"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email-body" className="text-sm font-medium">
              Message
            </Label>
            <Textarea
              id="email-body"
              placeholder="Email message body"
              value={settings.email.body}
              onChange={(e) => updateEmailField('body', e.target.value)}
              rows={4}
              className="glass-card border-glass-border/50 focus:border-primary/50 transition-all resize-none"
            />
          </div>
          
          {error && (
            <div className="flex items-center gap-2 text-xs text-destructive">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{error}</span>
            </div>
          )}
        </div>
      )}

      {settings.mode === 'text' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="text" className="text-sm font-medium">
              Text Content
            </Label>
            <span className="text-xs text-muted-foreground">
              {settings.text.length} characters
            </span>
          </div>
          <Textarea
            id="text"
            placeholder="Enter any text content..."
            value={settings.text}
            onChange={(e) => updateSettings({ text: e.target.value })}
            rows={6}
            className="glass-card border-glass-border/50 focus:border-primary/50 transition-all resize-none font-mono text-sm"
          />
          {error && (
            <div className="flex items-center gap-2 text-xs text-destructive">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{error}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
