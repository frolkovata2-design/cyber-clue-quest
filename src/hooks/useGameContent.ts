import { useState, useEffect } from 'react';

export interface GameModule {
  id: string;
  title: string;
  description: string;
  estimatedTime: number;
  difficulty: string;
  chapters: number;
  totalEvidence: number;
  status: string;
}

export interface Hotspot {
  id: string;
  evidenceId: string;
  x: number;
  y: number;
  radius: number;
  label: string;
  hint: string;
}

export interface GameChapter {
  id: string;
  moduleId: string;
  title: string;
  location: string;
  locationKey: string;
  type: string;
  description: string;
  hotspots: Hotspot[];
}

export interface DialogueChoice {
  id: string;
  label: string;
  next: string;
}

export interface DialogueLine {
  id: string;
  speaker: string;
  characterName: string;
  emotion: string;
  text: string;
  choices?: DialogueChoice[];
  evidenceUnlock?: string;
}

export interface EvidenceItem {
  id: string;
  title: string;
  type: string;
  description: string;
  chapter: number;
  connections: string[];
  violationRef: string | null;
  isSecret: boolean;
}

export interface EvidenceMatch {
  id: string;
  conclusion: string;
  correctEvidence: string[];
  hint: string;
}

export interface GameData {
  modules: GameModule[];
  sceneImages: Record<string, string>;
  chapters: GameChapter[];
  dialogue: DialogueLine[];
  evidence: EvidenceItem[];
  evidenceMatches: EvidenceMatch[];
}

let cachedData: GameData | null = null;

async function loadGameData(): Promise<GameData> {
  if (cachedData) return cachedData;
  const res = await fetch('/content/game-data.json');
  cachedData = await res.json();
  return cachedData!;
}

export function useGameContent() {
  const [data, setData] = useState<GameData | null>(cachedData);
  const [loading, setLoading] = useState(!cachedData);

  useEffect(() => {
    if (cachedData) {
      setData(cachedData);
      setLoading(false);
      return;
    }
    loadGameData().then((d) => {
      setData(d);
      setLoading(false);
    });
  }, []);

  return { data, loading };
}

// Sync accessors for components that already have data loaded
export function getGameData(): GameData | null {
  return cachedData;
}

// Preload for faster access
export function preloadGameContent() {
  loadGameData();
}
