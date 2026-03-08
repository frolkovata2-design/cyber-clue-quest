import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CHAPTERS, SAMPLE_EVIDENCE } from '@/data/gameContent';
import { useGameStore } from '@/stores/gameStore';
import ComicStrip from '@/components/game/ComicStrip';
import LocationExplorer from '@/components/game/LocationExplorer';
import EvidenceBoard from '@/components/game/EvidenceBoard';
import DeductionPhase from '@/components/game/DeductionPhase';

type GamePhase = 'comic' | 'explore' | 'match' | 'deduction';

const Chapter = () => {
  const navigate = useNavigate();
  const { moduleId } = useParams();
  const [phase, setPhase] = useState<GamePhase>('comic');
  const [foundEvidence, setFoundEvidence] = useState<string[]>([]);
  const addEvidence = useGameStore((s) => s.addEvidence);
  const addScore = useGameStore((s) => s.addScore);

  const chapters = CHAPTERS.filter((c) => c.moduleId === moduleId);

  const handleEvidenceFound = (evId: string) => {
    let isNewEvidence = false;

    setFoundEvidence((prev) => {
      if (prev.includes(evId)) return prev;
      isNewEvidence = true;
      return [...prev, evId];
    });

    if (!isNewEvidence) return;

    const ev = SAMPLE_EVIDENCE.find((e) => e.id === evId);
    if (ev) addEvidence(ev);
  };

  const handleDeductionComplete = (score: number) => {
    addScore(score);
    navigate('/game');
  };

  const locations = chapters
    .filter(c => c.hotspots && c.hotspots.length > 0)
    .map(c => ({
      id: c.id,
      name: c.location,
      locationKey: c.locationKey,
      hotspots: c.hotspots,
    }));

  if (!chapters.length) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Модуль не найден</p>
      </div>
    );
  }

  if (phase === 'comic') {
    return <ComicStrip moduleId={moduleId} onComplete={() => setPhase('explore')} />;
  }

  if (phase === 'explore') {
    return (
      <LocationExplorer
        locations={locations}
        foundEvidence={foundEvidence}
        onEvidenceFound={handleEvidenceFound}
        onComplete={() => setPhase('match')}
      />
    );
  }

  if (phase === 'match') {
    return (
      <EvidenceBoard
        foundEvidence={foundEvidence}
        moduleId={moduleId}
        onComplete={() => setPhase('deduction')}
      />
    );
  }

  return (
    <DeductionPhase
      foundEvidence={foundEvidence}
      moduleId={moduleId}
      onComplete={handleDeductionComplete}
    />
  );
};

export default Chapter;
