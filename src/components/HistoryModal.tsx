import { useQrStore } from '@/state/useQrStore';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { History, RotateCcw, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';

export function HistoryModal() {
  const { history, restoreFromHistory, deleteHistoryItem, clearHistory } = useQrStore();

  const handleRestore = (item: any) => {
    restoreFromHistory(item);
    toast.success('Settings restored from history');
  };

  const handleDelete = (id: string) => {
    deleteHistoryItem(id);
    toast.success('Item removed from history');
  };

  const handleClearAll = () => {
    clearHistory();
    toast.success('History cleared');
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 glass-card border-glass-border/50 hover:scale-105 transition-transform">
          <History className="w-4 h-4" />
          View History
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] glass-card border-glass-border">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl tracking-tight">Generation History</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mt-1">
                Last {history.length} generated QR codes
              </DialogDescription>
            </div>
            {history.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="hover:bg-destructive/10 hover:text-destructive gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[60vh] space-y-2 pr-2">
          {history.length === 0 ? (
            <div className="text-center py-12 glass-card rounded-lg">
              <History className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
              <p className="text-sm text-muted-foreground">No history yet</p>
              <p className="text-xs text-muted-foreground mt-1">Generated QR codes will appear here</p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="glass-card rounded-lg p-4 hover:bg-muted/30 transition-all border border-glass-border/30"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                        {item.mode.toUpperCase()}
                      </span>
                      <span className="text-xs text-muted-foreground">{item.size}px</span>
                      {item.hasLogo && (
                        <span className="text-xs px-2 py-0.5 rounded-md bg-accent/10 text-accent">Logo</span>
                      )}
                    </div>
                    
                    <p className="text-sm font-mono truncate text-foreground mb-2">
                      {item.content}
                    </p>
                    
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{formatDate(item.timestamp)}</span>
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-3 h-3 rounded-sm border border-glass-border/50"
                          style={{ backgroundColor: item.foregroundColor }}
                        />
                        <span>on</span>
                        <div
                          className="w-3 h-3 rounded-sm border border-glass-border/50"
                          style={{
                            backgroundColor: item.transparentBg ? 'transparent' : item.backgroundColor,
                            backgroundImage: item.transparentBg ? 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%)' : 'none',
                            backgroundSize: item.transparentBg ? '8px 8px' : 'auto',
                            backgroundPosition: item.transparentBg ? '0 0, 4px 4px' : '0 0',
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRestore(item)}
                      className="hover:bg-primary/10 hover:text-primary"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                      className="hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
