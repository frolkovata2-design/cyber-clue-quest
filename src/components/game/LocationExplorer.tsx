import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, AlertTriangle, FileText, Terminal, Mail, File, Eye, ChevronRight } from 'lucide-react';
import { SAMPLE_EVIDENCE, SCENE_IMAGES } from '@/data/gameContent';
import { SFX } from '@/lib/sfx';

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

const typeIcons: Record<string, any> = {
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
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isOverScene, setIsOverScene] = useState(false);
  const [nearHotspot, setNearHotspot] = useState(false);
  const sceneRef = useRef<HTMLDivElement>(null);
  const prevHoveredRef = useRef<string | null>(null);

  const loc = locations[activeLocation];
  const sceneImage = SCENE_IMAGES[loc.locationKey];
  const totalEvidence = locations.reduce((sum, l) => sum + l.hotspots.length, 0);
  const uniqueFound = new Set(foundEvidence);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!sceneRef.current) return;
    const rect = sceneRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });

    // Check proximity to any hotspot
    const pctX = ((e.clientX - rect.left) / rect.width) * 100;
    const pctY = ((e.clientY - rect.top) / rect.height) * 100;
    let near = false;
    for (const hs of loc.hotspots) {
      if (foundEvidence.includes(hs.evidenceId)) continue;
      const dx = pctX - hs.x;
      const dy = pctY - hs.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 12) { near = true; break; }
    }
    setNearHotspot(near);
  }, [loc.hotspots, foundEvidence]);

  const handleHotspotClick = (hotspot: LocationHotspot) => {
    if (foundEvidence.includes(hotspot.evidenceId)) return;
    SFX.hotspotClick();
    setSelectedEvidence(hotspot.evidenceId);
  };

  const handleHotspotHover = (id: string | null) => {
    if (id && id !== prevHoveredRef.current) {
      SFX.hotspotHover();
    }
    prevHoveredRef.current = id;
    setHoveredHotspot(id);
  };

  const handleClosePopup = (evidenceId: string) => {
    SFX.evidenceFound();
    setSelectedEvidence(null);
    setTimeout(() => onEvidenceFound(evidenceId), 200);
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
            <span>{uniqueFound.size}/{totalEvidence} улик</span>
          </div>
        </div>
      </header>

      {/* Location tabs */}
      <div className="border-b border-border bg-card/50">
        <div className="max-w-5xl mx-auto flex overflow-x-auto">
          {locations.map((l, i) => {
            const locDone = l.hotspots.every(h => foundEvidence.includes(h.evidenceId));
            const hasAny = l.hotspots.some(h => foundEvidence.includes(h.evidenceId));
            return (
              <button
                key={l.id}
                onClick={() => { setActiveLocation(i); SFX.transition(); }}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  i === activeLocation
                    ? 'border-primary text-primary'
                    : locDone
                    ? 'border-transparent text-muted-foreground/60'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <MapPin className="w-3 h-3" />
                {l.name}
                {locDone && <span className="text-xs text-primary">✓</span>}
                {!locDone && hasAny && <span className="w-2 h-2 rounded-full bg-primary/50" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scene */}
      <div className="flex-1 flex flex-col">
        <div className="max-w-5xl w-full mx-auto px-4 py-8 flex-1">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center text-sm text-muted-foreground mb-4 font-mono"
          >
            🔍 Води лупой по сцене — она покажет скрытые следы и аномалии
          </motion.p>

          {/* Scene image with magnifier */}
          <div
            ref={sceneRef}
            className="relative rounded-xl overflow-hidden border border-border shadow-2xl"
            style={{ cursor: isOverScene ? 'none' : 'default' }}
            onMouseEnter={() => setIsOverScene(true)}
            onMouseLeave={() => { setIsOverScene(false); setNearHotspot(false); }}
            onMouseMove={handleMouseMove}
          >
            <img src={sceneImage} alt={loc.name} className="w-full h-auto block" draggable={false} />

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
                  className={`absolute z-10 ${isFound ? 'pointer-events-none' : 'cursor-none'}`}
                  style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%`, transform: 'translate(-50%, -50%)' }}
                  onMouseEnter={() => handleHotspotHover(hotspot.id)}
                  onMouseLeave={() => handleHotspotHover(null)}
                  onClick={() => handleHotspotClick(hotspot)}
                >
                  {!isFound && (
                    <>
                      <motion.div
                        animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 w-12 h-12 -m-1.5 rounded-full border-2 border-primary/40"
                      />
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                        isHovered ? 'bg-primary shadow-lg shadow-primary/50 scale-125' : 'bg-primary/20 backdrop-blur-sm border border-primary/40'
                      }`}>
                        <Search className={`w-4 h-4 ${isHovered ? 'text-primary-foreground' : 'text-primary'}`} />
                      </div>
                    </>
                  )}
                  {isFound && (
                    <div className="w-8 h-8 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center">
                      <span className="text-primary text-xs">✓</span>
                    </div>
                  )}
                  {isHovered && !isFound && (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
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

            {/* Magnifier lens following cursor */}
            {isOverScene && (
              <div
                className="absolute z-20 pointer-events-none"
                style={{ left: mousePos.x - 50, top: mousePos.y - 50, width: 100, height: 100 }}
              >
                <div
                  className="w-full h-full rounded-full overflow-hidden border-2 relative"
                  style={{
                    borderColor: nearHotspot ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground) / 0.3)',
                    boxShadow: nearHotspot
                      ? '0 0 25px hsl(var(--primary) / 0.5), inset 0 0 15px hsl(var(--primary) / 0.1)'
                      : '0 0 15px hsl(var(--background) / 0.7)',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                  }}
                >
                  {/* Forensic trace view — shows "anomalies" */}
                  <div
                    className="absolute"
                    style={{
                      width: sceneRef.current?.offsetWidth ?? 800,
                      height: sceneRef.current?.offsetHeight ?? 450,
                      left: -(mousePos.x * 1.5 - 50),
                      top: -(mousePos.y * 1.5 - 50),
                      transform: 'scale(1.5)',
                      transformOrigin: 'top left',
                    }}
                  >
                    <img src={sceneImage} alt="" className="w-full h-full object-cover" style={{
                      filter: nearHotspot
                        ? 'brightness(1.6) contrast(1.8) saturate(0.3) hue-rotate(180deg)'
                        : 'brightness(1.2) contrast(1.4) saturate(0.5) sepia(0.3)',
                      transition: 'filter 0.3s',
                    }} draggable={false} />
                    {/* Hotspot glow markers visible only in magnifier */}
                    {loc.hotspots.filter(h => !foundEvidence.includes(h.evidenceId)).map(h => (
                      <div
                        key={h.id}
                        className="absolute rounded-full"
                        style={{
                          left: `${h.x}%`,
                          top: `${h.y}%`,
                          width: 24,
                          height: 24,
                          transform: 'translate(-50%, -50%)',
                          background: 'radial-gradient(circle, hsl(var(--destructive) / 0.6) 0%, transparent 70%)',
                          boxShadow: '0 0 12px hsl(var(--destructive) / 0.4)',
                        }}
                      />
                    ))}
                  </div>
                  {/* Crosshair */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-px h-5 bg-primary/30 absolute" />
                    <div className="h-px w-5 bg-primary/30 absolute" />
                  </div>
                  {/* Pulse when near */}
                  {nearHotspot && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-primary"
                      animate={{ scale: [1, 1.15, 1], opacity: [0.7, 0.2, 0.7] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    />
                  )}
                </div>
                {/* Handle */}
                <div className="absolute -bottom-3 -right-3 w-5 h-8 bg-muted-foreground/20 rounded-b-full"
                  style={{ transform: 'rotate(45deg)', transformOrigin: 'top left' }}
                />
              </div>
            )}




            {/* All found overlay */}
            {allLocationEvidenceFound && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="absolute inset-0 bg-background/30 flex items-center justify-center"
              >
                <div className="bg-card/90 backdrop-blur-sm border border-primary/30 rounded-xl px-6 py-4 text-center shadow-2xl">
                  <p className="text-primary font-bold">✓ Все улики найдены</p>
                  <p className="text-xs text-muted-foreground mt-1">Переходите к следующей локации</p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Navigation */}
          <div className="mt-6 flex justify-end">
            {activeLocation < locations.length - 1 ? (
              <button
                onClick={() => { setActiveLocation(p => p + 1); SFX.transition(); }}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors"
              >
                Следующая локация <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              uniqueFound.size > 0 && (
                <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  onClick={() => { SFX.complete(); onComplete(); }}
                  className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-primary/20"
                >
                  🧩 Сопоставить улики
                </motion.button>
              )
            )}
          </div>
        </div>

        {/* Bottom evidence bar */}
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
                    <motion.div key={ev.id}
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
                        {ev.violationRef && <p className="text-[10px] text-destructive font-mono">{ev.violationRef}</p>}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Evidence popup */}
      <AnimatePresence>
        {selectedEvidence && (() => {
          const ev = SAMPLE_EVIDENCE.find(e => e.id === selectedEvidence);
          if (!ev) return null;
          const Icon = typeIcons[ev.type] || FileText;
          return (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
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
