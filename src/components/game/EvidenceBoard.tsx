import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, CheckCircle, XCircle, FileText, Terminal, Mail, File, Eye, ArrowRight } from 'lucide-react';
import { SAMPLE_EVIDENCE, EVIDENCE_MATCHES } from '@/data/gameContent';
import { SFX } from '@/lib/sfx';

interface EvidenceBoardProps {
  foundEvidence: string[];
  onComplete: () => void;
}

const typeIcons: Record<string, any> = {
  document: FileText,
  log: Terminal,
  email: Mail,
  testimony: Eye,
  file: File,
};

const EvidenceBoard = ({ foundEvidence, onComplete }: EvidenceBoardProps) => {
  const [currentMatch, setCurrentMatch] = useState(0);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [matchResults, setMatchResults] = useState<Record<string, boolean>>({});
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const match = EVIDENCE_MATCHES[currentMatch];
  const availableEvidence = foundEvidence.map(id => SAMPLE_EVIDENCE.find(e => e.id === id)).filter(Boolean);

  const toggleCard = (evId: string) => {
    if (showResult) return;
    setSelectedCards(prev =>
      prev.includes(evId) ? prev.filter(id => id !== evId) : prev.length < 2 ? [...prev, evId] : prev
    );
  };

  const handleCheck = () => {
    if (selectedCards.length !== 2) return;
    const correct = match.correctEvidence.every(id => selectedCards.includes(id))
      && selectedCards.every(id => match.correctEvidence.includes(id));
    setIsCorrect(correct);
    setShowResult(true);
    setMatchResults(prev => ({ ...prev, [match.id]: correct }));
    if (correct) SFX.matchCorrect(); else SFX.wrong();
  };

  const handleNext = () => {
    setSelectedCards([]);
    setShowResult(false);
    if (currentMatch < EVIDENCE_MATCHES.length - 1) {
      setCurrentMatch(prev => prev + 1);
      SFX.transition();
    } else {
      SFX.complete();
      onComplete();
    }
  };

  const correctCount = Object.values(matchResults).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-lg px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link2 className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Сопоставление улик</span>
          </div>
          <span className="text-xs font-mono text-muted-foreground">
            {currentMatch + 1}/{EVIDENCE_MATCHES.length}
          </span>
        </div>
      </header>

      {/* Progress */}
      <div className="max-w-4xl mx-auto w-full px-4 pt-4">
        <div className="h-1 bg-secondary rounded-full overflow-hidden">
          <motion.div className="h-full bg-primary rounded-full"
            animate={{ width: `${((currentMatch + (showResult ? 1 : 0)) / EVIDENCE_MATCHES.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <AnimatePresence mode="wait">
          <motion.div key={match.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="max-w-3xl w-full"
          >
            {/* Conclusion card */}
            <div className="bg-card border border-border rounded-xl p-6 mb-8 text-center">
              <p className="text-xs font-mono text-primary uppercase tracking-wider mb-2">Вывод расследования</p>
              <h2 className="text-lg md:text-xl font-bold text-foreground mb-2">{match.conclusion}</h2>
              <p className="text-sm text-muted-foreground">{match.hint}</p>
              <p className="text-xs text-muted-foreground mt-3 font-mono">Выберите 2 улики, которые подтверждают этот вывод</p>
            </div>

            {/* Evidence cards grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
              {availableEvidence.map((ev) => {
                if (!ev) return null;
                const isSelected = selectedCards.includes(ev.id);
                const Icon = typeIcons[ev.type] || FileText;
                const isCorrectCard = showResult && match.correctEvidence.includes(ev.id);
                const isWrongSelected = showResult && isSelected && !match.correctEvidence.includes(ev.id);

                return (
                  <motion.button
                    key={ev.id}
                    whileHover={!showResult ? { scale: 1.03 } : {}}
                    whileTap={!showResult ? { scale: 0.97 } : {}}
                    onClick={() => toggleCard(ev.id)}
                    className={`text-left p-3 rounded-xl border-2 transition-all ${
                      showResult
                        ? isCorrectCard
                          ? 'border-primary bg-primary/10'
                          : isWrongSelected
                          ? 'border-destructive bg-destructive/10'
                          : 'border-border bg-card opacity-40'
                        : isSelected
                        ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10'
                        : 'border-border bg-card hover:border-muted-foreground/30'
                    }`}
                    disabled={showResult}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="w-3.5 h-3.5 text-primary" />
                      </div>
                      {showResult && isCorrectCard && <CheckCircle className="w-4 h-4 text-primary ml-auto" />}
                      {isWrongSelected && <XCircle className="w-4 h-4 text-destructive ml-auto" />}
                      {!showResult && isSelected && (
                        <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center ml-auto">
                          <span className="text-[9px] text-primary-foreground font-bold">✓</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs font-medium text-foreground leading-tight">{ev.title}</p>
                    {ev.violationRef && (
                      <p className="text-[9px] text-destructive font-mono mt-1">{ev.violationRef}</p>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Actions */}
            {!showResult ? (
              <div className="flex justify-center">
                <button
                  onClick={handleCheck}
                  disabled={selectedCards.length !== 2}
                  className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-transform text-sm"
                >
                  Проверить ({selectedCards.length}/2)
                </button>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className={`text-center p-4 rounded-xl ${isCorrect ? 'bg-primary/10 border border-primary/30' : 'bg-destructive/10 border border-destructive/30'}`}>
                  <p className={`text-sm font-bold ${isCorrect ? 'text-primary' : 'text-destructive'}`}>
                    {isCorrect ? '✓ Верно! Улики сопоставлены правильно.' : '✗ Неверно. Посмотрите на правильные улики.'}
                  </p>
                </div>
                <div className="flex justify-center">
                  <button onClick={handleNext}
                    className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:scale-105 active:scale-95 transition-transform text-sm"
                  >
                    {currentMatch < EVIDENCE_MATCHES.length - 1 ? 'Следующий вывод' : 'К финальному расследованию'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EvidenceBoard;
