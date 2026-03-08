import { create } from 'zustand';

export interface Evidence {
  id: string;
  title: string;
  type: string;
  description: string;
  chapter: number;
  discoveredAt?: Date;
  connections: string[];
  violationRef?: string;
  isSecret: boolean;
}

export interface ChapterProgress {
  chapterId: string;
  completed: boolean;
  completedAt?: Date;
  choicesMade: { choiceId: string; lineId: string }[];
}

interface GameState {
  currentModule: string | null;
  currentChapter: string | null;
  score: number;
  evidence: Evidence[];
  chapterProgress: ChapterProgress[];
  timerStarted: Date | null;
  isPlaying: boolean;

  startGame: (moduleId: string) => void;
  setChapter: (chapterId: string) => void;
  addEvidence: (evidence: Evidence) => void;
  completeChapter: (chapterId: string) => void;
  addScore: (points: number) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  currentModule: null,
  currentChapter: null,
  score: 0,
  evidence: [],
  chapterProgress: [],
  timerStarted: null,
  isPlaying: false,

  startGame: (moduleId) =>
    set({
      currentModule: moduleId,
      currentChapter: null,
      score: 0,
      evidence: [],
      chapterProgress: [],
      timerStarted: new Date(),
      isPlaying: true,
    }),

  setChapter: (chapterId) => set({ currentChapter: chapterId }),

  addEvidence: (evidence) =>
    set((state) => {
      if (state.evidence.some(e => e.id === evidence.id)) return state;
      return { evidence: [...state.evidence, { ...evidence, discoveredAt: new Date() }] };
    }),

  completeChapter: (chapterId) =>
    set((state) => ({
      chapterProgress: [
        ...state.chapterProgress,
        { chapterId, completed: true, completedAt: new Date(), choicesMade: [] },
      ],
    })),

  addScore: (points) =>
    set((state) => ({ score: state.score + points })),

  resetGame: () =>
    set({
      currentModule: null,
      currentChapter: null,
      score: 0,
      evidence: [],
      chapterProgress: [],
      timerStarted: null,
      isPlaying: false,
    }),
}));
