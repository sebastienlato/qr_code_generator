import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type InputMode = 'url' | 'email' | 'text';
export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export interface EmailData {
  to: string;
  subject: string;
  body: string;
}

export interface LogoSettings {
  file: File | null;
  dataUrl: string | null;
  scale: number;
  cornerRadius: number;
  safetyRing: boolean;
}

export interface QrSettings {
  mode: InputMode;
  url: string;
  email: EmailData;
  text: string;
  size: number;
  foregroundColor: string;
  backgroundColor: string;
  transparentBg: boolean;
  quietZone: number;
  errorCorrection: ErrorCorrectionLevel;
  logo: LogoSettings;
}

export interface HistoryItem {
  id: string;
  mode: InputMode;
  content: string;
  size: number;
  foregroundColor: string;
  backgroundColor: string;
  transparentBg: boolean;
  hasLogo: boolean;
  timestamp: number;
}

interface QrStore {
  settings: QrSettings;
  history: HistoryItem[];
  updateSettings: (updates: Partial<QrSettings>) => void;
  updateEmailField: (field: keyof EmailData, value: string) => void;
  updateLogo: (updates: Partial<LogoSettings>) => void;
  addToHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
  restoreFromHistory: (item: HistoryItem) => void;
  deleteHistoryItem: (id: string) => void;
  clearHistory: () => void;
}

const defaultSettings: QrSettings = {
  mode: 'url',
  url: '',
  email: { to: '', subject: '', body: '' },
  text: '',
  size: 512,
  foregroundColor: '#000000',
  backgroundColor: '#ffffff',
  transparentBg: true,
  quietZone: 16,
  errorCorrection: 'M',
  logo: {
    file: null,
    dataUrl: null,
    scale: 20,
    cornerRadius: 8,
    safetyRing: true,
  },
};

export const useQrStore = create<QrStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      history: [],
      
      updateSettings: (updates) =>
        set((state) => ({
          settings: { ...state.settings, ...updates },
        })),
      
      updateEmailField: (field, value) =>
        set((state) => ({
          settings: {
            ...state.settings,
            email: { ...state.settings.email, [field]: value },
          },
        })),
      
      updateLogo: (updates) =>
        set((state) => ({
          settings: {
            ...state.settings,
            logo: { ...state.settings.logo, ...updates },
          },
        })),
      
      addToHistory: (item) =>
        set((state) => {
          const newItem: HistoryItem = {
            ...item,
            id: Date.now().toString(),
            timestamp: Date.now(),
          };
          
          const history = [newItem, ...state.history].slice(0, 20);
          return { history };
        }),
      
      restoreFromHistory: (item) =>
        set((state) => ({
          settings: {
            ...state.settings,
            mode: item.mode,
            url: item.mode === 'url' ? item.content : state.settings.url,
            text: item.mode === 'text' ? item.content : state.settings.text,
            size: item.size,
            foregroundColor: item.foregroundColor,
            backgroundColor: item.backgroundColor,
            transparentBg: item.transparentBg,
          },
        })),
      
      deleteHistoryItem: (id) =>
        set((state) => ({
          history: state.history.filter((item) => item.id !== id),
        })),
      
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'qr-generator-store',
      partialize: (state) => ({
        settings: {
          ...state.settings,
          logo: {
            ...state.settings.logo,
            file: null,
            dataUrl: null,
          },
        },
        history: state.history,
      }),
    }
  )
);
