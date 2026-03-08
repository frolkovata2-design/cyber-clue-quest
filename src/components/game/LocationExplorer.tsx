import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, X, AlertTriangle, FileText, Terminal, Mail, File, Eye, ChevronRight } from 'lucide-react';
import { SAMPLE_EVIDENCE, SCENE_IMAGES } from '@/data/gameContent';

interface LocationHotspot {
  id: string;
  evidenceId: string;
  x: number;
  y: number;
  radius: number;
  label: string;
  hint: string;
}

interface LocationData {
  id: string;
  name: string;
  locationKey: string;
  hotspots: LocationHotspot[];
}

interface LocationExplorerProps {
  locations: LocationData[];
  foundEvidence: string[];
  onEvidenceFound: (evidenceId: string) => void;
  onComplete: () => void;
}

const typeIcons = {
  document: FileText,
  log: Terminal,
  email: Mail,
  testimony: Eye,
  file: File,
};

const LocationExplorer = ({ locations, foundEvidence, onEvidenceFound, onComplete }: LocationExplorerProps) => {
  const [activeLocation, setActiveLocation] = useState(0);
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);
  const [selectedEvidence, setSelectedEvidence] = useState<string | null>(null);
  const [animatingEvidence, setAnimatingEvidence] = useState<string | null>(null);

  const loc = locations[activeLocation];
  const sceneImage = SCENE_IMAGES[loc.locationKey];
  const totalEvidence = locations.reduce((sum, l) => sum + l.hotspots.length, 0);
  const uniqueFoundCount = new Set(foundEvidence).size;

  const handleHotspotClick = (hotspot: LocationHotspot) => {
    if (foundEvidence.includes(hotspot.evidenceId)) return;
    setSelectedEvidence(hotspot.evidenceId);
  };

  const handleClosePopup = (evidenceId: string) => {
    setAnimatingEvidence(evidenceId);
    setSelectedEvidence(null);

    // Short delay then add to collection
    setTimeout(() => {
      onEvidenceFound(evidenceId);
      setTimeout(() => setAnimatingEvidence(null), 600);
    }, 300);
  };

  const allLocationEvidenceFound = loc.hotspots.every(h => foundEvidence.includes(h.evidenceId));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-lg px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">{loc.name}</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground bg-secondary px-3 py-1.5 rounded-md">
            <Search className="w-3 h-3 text-primary" />
            <span>{uniqueFoundCount}/{totalEvidence} улик</span>
          </div>
        </div>
      </header>

      {/* Location tabs */}
      <div className="border-b border-border bg-card/50">
        <div className="max-w-5xl mx-auto flex overflow-x-auto">
          {locations.map((l, i) => {
            const locFound = l.hotspots.every(h => foundEvidence.includes(h.evidenceId));
            const hasAnyFound = l.hotspots.some(h => foundEvidence.includes(h.evidenceId));
            return (
              <button
                key={l.id}
                onClick={() => setActiveLocation(i)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  i === activeLocation
                    ? 'border-primary text-primary'
                    : locFound
                    ? 'border-transparent text-muted-foreground/60'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <MapPin className="w-3 h-3" />
                {l.name}
                {locFound && <span className="text-xs text-primary">✓</span>}
                {!locFound && hasAnyFound && (
                  <span className="w-2 h-2 rounded-full bg-primary/50" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scene with hotspots */}
      <div className="flex-1 flex flex-col">
        <div className="max-w-5xl w-full mx-auto px-4 py-8 flex-1">
          {/* Instruction */}
          {!allLocationEvidenceFound && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-sm text-muted-foreground mb-4 font-mono"
            >
              🔍 Нажмите на подсвеченные объекты, чтобы найти улики
            </motion.p>
          )}

          {/* Scene image */}
          <div className="relative rounded-xl overflow-hidden border border-border shadow-2xl">
            <img
              src={sceneImage}
              alt={loc.name}
              className="w-full h-auto block"
              draggable={false}
            />

            {/* Hotspots */}
            {loc.hotspots.map((hotspot) => {
              const isFound = foundEvidence.includes(hotspot.evidenceId);
              const isHovered = hoveredHotspot === hotspot.id;

              return (
                <motion.button
                  key={hotspot.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className={`absolute z-10 group ${isFound ? 'pointer-events-none' : 'cursor-pointer'}`}
                  style={{
                    left: `${hotspot.x}%`,
                    top: `${hotspot.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  onMouseEnter={() => setHoveredHotspot(hotspot.id)}
                  onMouseLeave={() => setHoveredHotspot(null)}
                  onClick={() => handleHotspotClick(hotspot)}
                >
                  {/* Pulsing ring */}
                  {!isFound && (
                    <>
                      <motion.div
                        animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 w-12 h-12 -m-1.5 rounded-full border-2 border-primary/50"
                      />
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                        isHovered
                          ? 'bg-primary shadow-lg shadow-primary/50 scale-125'
                          : 'bg-primary/30 backdrop-blur-sm border border-primary/50'
                      }`}>
                        <Search className={`w-4 h-4 ${isHovered ? 'text-primary-foreground' : 'text-primary'}`} />
                      </div>
                    </>
                  )}

                  {/* Found marker */}
                  {isFound && (
                    <div className="w-8 h-8 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center">
                      <span className="text-primary text-xs">✓</span>
                    </div>
                  )}

                  {/* Tooltip */}
                  {isHovered && !isFound && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap z-20"
                    >
                      <div className="px-3 py-1.5 rounded-md bg-card border border-border text-xs font-medium text-foreground shadow-xl">
                        {hotspot.hint}
                      </div>
                    </motion.div>
                  )}
                </motion.button>
              );
            })}

            {/* Location complete overlay */}
            {allLocationEvidenceFound && loc.hotspots.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-background/30 flex items-center justify-center"
              >
                <div className="bg-card/90 backdrop-blur-sm border border-primary/30 rounded-xl px-6 py-4 text-center shadow-2xl">
                  <p className="text-primary font-bold">✓ Все улики найдены</p>
                  <p className="text-xs text-muted-foreground mt-1">Переходите к следующей локации</p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Next location / Complete button */}
          <div className="mt-6 flex justify-end">
            {activeLocation < locations.length - 1 ? (
              <button
                onClick={() => setActiveLocation(prev => prev + 1)}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors"
              >
                Следующая локация <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              uniqueFoundCount > 0 && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={onComplete}
                  className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-primary/20"
                >
                  🧩 Перейти к расследованию
                </motion.button>
              )
            )}
          </div>
        </div>

        {/* Collected evidence bar at bottom */}
        {foundEvidence.length > 0 && (
          <div className="border-t border-border bg-card/80 backdrop-blur-sm px-4 py-4">
            <div className="max-w-5xl mx-auto">
              <p className="text-xs font-mono text-primary uppercase tracking-wider mb-3">
                Собранные улики ({foundEvidence.length})
              </p>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {foundEvidence.map((evId) => {
                  const ev = SAMPLE_EVIDENCE.find(e => e.id === evId);
                  if (!ev) return null;
                  const Icon = typeIcons[ev.type] || FileText;
                  return (
                    <motion.div
                      key={ev.id}
                      initial={{ scale: 0, y: -30 }}
                      animate={{ scale: 1, y: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className="flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg border border-primary/30 bg-primary/5 min-w-[180px]"
                    >
                      <div className="w-7 h-7 rounded bg-primary/10 flex items-center justify-center">
                        <Icon className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{ev.title}</p>
                        {ev.violationRef && (
                          <p className="text-[10px] text-destructive font-mono">{ev.violationRef}</p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Evidence popup modal */}
      <AnimatePresence>
        {selectedEvidence && (() => {
          const ev = SAMPLE_EVIDENCE.find(e => e.id === selectedEvidence);
          if (!ev) return null;
          const Icon = typeIcons[ev.type] || FileText;
          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={() => handleClosePopup(selectedEvidence)}
            >
              <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
              <motion.div
                initial={{ scale: 0.8, opacity: 0, rotate: -2 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.5, opacity: 0, y: 100 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="relative bg-card border-2 border-primary/50 rounded-2xl p-6 max-w-md w-full shadow-2xl"
                style={{ boxShadow: '0 0 60px hsl(var(--primary) / 0.2)' }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-primary/10 rounded-2xl blur-xl -z-10" />

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-mono text-primary uppercase tracking-wider mb-1">Улика найдена!</p>
                    <h3 className="text-lg font-bold text-foreground mb-2">{ev.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">{ev.description}</p>
                    {ev.violationRef && (
                      <div className="flex items-center gap-2 text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-xs font-mono font-bold">{ev.violationRef}</span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleClosePopup(selectedEvidence)}
                  className="mt-6 w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:scale-[1.02] active:scale-95 transition-transform text-sm"
                >
                  Добавить к уликам ↓
                </button>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
};

export default LocationExplorer;
