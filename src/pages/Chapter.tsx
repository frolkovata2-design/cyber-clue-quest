import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Search, MessageSquare } from 'lucide-react';
import { CHAPTERS, SAMPLE_DIALOGUE, SAMPLE_EVIDENCE } from '@/data/gameContent';
import { useGameStore } from '@/stores/gameStore';
import EvidenceCard from '@/components/game/EvidenceCard';
import DialogueSystem from '@/components/game/DialogueSystem';
import GameTimer from '@/components/game/GameTimer';
import NarrativeSection from '@/components/game/NarrativeSection';
import ChapterNav from '@/components/game/ChapterNav';

const Chapter = () => {
  const navigate = useNavigate();
  const { moduleId } = useParams();
  const [activeChapter, setActiveChapter] = useState(0);
  const [showDialogue, setShowDialogue] = useState(false);
  const [foundEvidence, setFoundEvidence] = useState<string[]>([]);
  const addEvidence = useGameStore((s) => s.addEvidence);

  const chapters = CHAPTERS.filter((c) => c.moduleId === moduleId);
  const current = chapters[activeChapter];

  const handleEvidenceFound = (evId: string) => {
    if (!foundEvidence.includes(evId)) {
      setFoundEvidence((prev) => [...prev, evId]);
      const ev = SAMPLE_EVIDENCE.find((e) => e.id === evId);
      if (ev) addEvidence(ev);
    }
  };

  if (!current) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Модуль не найден</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/game')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            К модулям
          </button>

          <div className="flex items-center gap-3">
            <GameTimer />
            <div className="flex items-center gap-1 text-xs font-mono text-muted-foreground bg-secondary px-3 py-1.5 rounded-md">
              <Search className="w-3 h-3 text-primary" />
              <span>{foundEvidence.length}/{SAMPLE_EVIDENCE.length}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Sidebar - Chapter Nav */}
        <aside className="hidden lg:block w-64 border-r border-border p-4">
          <ChapterNav
            chapters={chapters}
            activeIndex={activeChapter}
            onSelect={setActiveChapter}
          />
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto px-6 py-12"
            >
              {/* Chapter header */}
              <div className="mb-10">
                <div className="flex items-center gap-2 text-primary font-mono text-xs tracking-wider uppercase mb-3">
                  <MapPin className="w-3 h-3" />
                  {current.location}
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                  Глава {activeChapter + 1}: {current.title}
                </h2>
                <div className="h-px bg-gradient-to-r from-primary/50 via-primary/20 to-transparent" />
              </div>

              {/* Narrative */}
              <NarrativeSection
                text={current.description}
                onEvidenceClick={() => handleEvidenceFound('ev_001')}
              />

              {/* Dialogue trigger */}
              {(current.type === 'dialogue' || activeChapter === 0) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="mt-10"
                >
                  <button
                    onClick={() => setShowDialogue(true)}
                    className="flex items-center gap-3 px-6 py-4 rounded-lg border border-primary/30 bg-primary/5 text-foreground hover:bg-primary/10 hover:border-primary/50 transition-all group w-full"
                  >
                    <MessageSquare className="w-5 h-5 text-primary" />
                    <div className="text-left">
                      <p className="font-medium text-sm">Начать диалог</p>
                      <p className="text-xs text-muted-foreground">Поговорите с персонажем этой сцены</p>
                    </div>
                  </button>
                </motion.div>
              )}

              {/* Evidence cards */}
              {foundEvidence.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-12"
                >
                  <h3 className="text-sm font-mono text-primary uppercase tracking-wider mb-4">
                    Найденные улики
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {foundEvidence.map((evId) => {
                      const ev = SAMPLE_EVIDENCE.find((e) => e.id === evId);
                      if (!ev) return null;
                      return <EvidenceCard key={ev.id} evidence={ev} />;
                    })}
                  </div>
                </motion.div>
              )}

              {/* Next chapter button */}
              {activeChapter < chapters.length - 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                  className="mt-16 flex justify-end"
                >
                  <button
                    onClick={() => {
                      setActiveChapter((p) => p + 1);
                      setShowDialogue(false);
                    }}
                    className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:scale-105 active:scale-95 transition-transform"
                  >
                    Следующая глава →
                  </button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Dialogue overlay */}
      <AnimatePresence>
        {showDialogue && (
          <DialogueSystem
            lines={SAMPLE_DIALOGUE}
            onClose={() => setShowDialogue(false)}
            onEvidenceFound={handleEvidenceFound}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chapter;
