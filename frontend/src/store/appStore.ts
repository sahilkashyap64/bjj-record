import { create } from 'zustand';
import { User, SessionLog } from '../types';

interface AppState {
  // Auth
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;

  // UI
  isOnline: boolean;
  isSyncing: boolean;

  // Data
  sessions: SessionLog[];
  selectedSession: SessionLog | null;

  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setIsOnline: (online: boolean) => void;
  setIsSyncing: (syncing: boolean) => void;
  setSessions: (sessions: SessionLog[]) => void;
  setSelectedSession: (session: SessionLog | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  token: null,
  isLoggedIn: false,
  isOnline: navigator.onLine,
  isSyncing: false,
  sessions: [],
  selectedSession: null,

  setUser: (user) => set({ user, isLoggedIn: user !== null }),
  setToken: (token) => set({ token }),
  setIsOnline: (isOnline) => set({ isOnline }),
  setIsSyncing: (isSyncing) => set({ isSyncing }),
  setSessions: (sessions) => set({ sessions }),
  setSelectedSession: (selectedSession) => set({ selectedSession }),
}));
