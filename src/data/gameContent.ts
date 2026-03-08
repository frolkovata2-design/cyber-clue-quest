// Re-exports from JSON content for backward compatibility
// The actual data lives in public/content/game-data.json
// This file provides sync access after data is loaded via useGameContent hook

import type { GameModule, GameChapter, DialogueLine, EvidenceItem, EvidenceMatch } from '@/hooks/useGameContent';

// These will be populated after useGameContent loads data
// For new code, prefer using the useGameContent() hook directly

export type { GameModule, GameChapter, DialogueLine, EvidenceItem, EvidenceMatch };

// Legacy re-exports — kept for components that haven't migrated yet
// These are populated synchronously from cache after first load
export let MODULES: GameModule[] = [];
export let CHAPTERS: GameChapter[] = [];
export let SAMPLE_DIALOGUE: DialogueLine[] = [];
export let SAMPLE_EVIDENCE: EvidenceItem[] = [];
export let EVIDENCE_MATCHES: EvidenceMatch[] = [];
export let SCENE_IMAGES: Record<string, string> = {};

export function hydrateGameContent(data: {
  modules: GameModule[];
  chapters: GameChapter[];
  dialogue: DialogueLine[];
  evidence: EvidenceItem[];
  evidenceMatches: EvidenceMatch[];
  sceneImages: Record<string, string>;
}) {
  MODULES = data.modules;
  CHAPTERS = data.chapters;
  SAMPLE_DIALOGUE = data.dialogue;
  SAMPLE_EVIDENCE = data.evidence;
  EVIDENCE_MATCHES = data.evidenceMatches;
  SCENE_IMAGES = data.sceneImages;
}
