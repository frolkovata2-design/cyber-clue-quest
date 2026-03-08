import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Eye, CheckCircle } from 'lucide-react';

export interface Hotspot {
  id: string;
  evidenceId: string;
  x: number; // % from left
  y: number; // % from top
  radius: number; // px radius for detection
  label: string;
  hint: string;
}

interface SceneExplorerProps {
  image: string;
  hotspots: Hotspot[];
  foundIds: string[];
  onEvidenceFound: (evidenceId: string) => void;
  locationName: string;
}

const MAGNIFIER_SIZE = 160;
const SCAN_RADIUS = 80;

const SceneExplorer = ({ image, hotspots, foundIds, onEvidenceFound, locationName }: SceneExplorerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isScanning, setIsScanning] = useState(false);
  const [nearbyHotspot, setNearbyHotspot] = useState<Hotspot | null>(null);
  const [justFound, setJustFound] = useState<string | null>(null);
  const [imageNaturalSize, setImageNaturalSize] = useState({ w: 1920, h: 1080 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    // Check proximity to hotspots
    const pctX = (x / rect.width) * 100;
    const pctY = (y / rect.height) * 100;

    let closest: Hotspot | null = null;
    let closestDist = Infinity;

    for (const hs of hotspots) {
      if (foundIds.includes(hs.evidenceId)) continue;
      const dx = pctX - hs.x;
      const dy = pctY - hs.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const detectionRadius = (hs.radius / rect.width) * 100 + 5;
      if (dist < detectionRadius && dist < closestDist) {
        closest = hs;
        closestDist = dist;
      }
    }
    setNearbyHotspot(closest);
  }, [hotspots, foundIds]);

  const handleClick = useCallback(() => {
    if (nearbyHotspot && !foundIds.includes(nearbyHotspot.evidenceId)) {
      setJustFound(nearbyHotspot.evidenceId);
      onEvidenceFound(nearbyHotspot.evidenceId);
      setTimeout(() => setJustFound(null), 2000);
    }
  }, [nearbyHotspot, foundIds, onEvidenceFound]);

  const totalHotspots = hotspots.length;
  const foundCount = hotspots.filter(h => foundIds.includes(h.evidenceId)).length;

  return (
    <div className="space-y-4">
      {/* Scanner header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-wider">
          <Eye className="w-4 h-4" />
          <span>Режим сканирования</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <Search className="w-3 h-3 text-primary" />
          <span>{foundCount}/{totalHotspots} улик найдено</span>
        </div>
      </div>

      {/* Scene image with magnifier */}
      <div
        ref={containerRef}
        className="relative rounded-xl overflow-hidden border border-border group select-none"
        style={{ cursor: isScanning ? 'none' : 'crosshair' }}
        onMouseEnter={() => setIsScanning(true)}
        onMouseLeave={() => setIsScanning(false)}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
      >
        {/* Base image (darkened) */}
        <img
          src={image}
          alt={locationName}
          className="w-full h-auto block"
          style={{ filter: 'brightness(0.4)' }}
          draggable={false}
        />

        {/* Found evidence markers */}
        {hotspots
          .filter(h => foundIds.includes(h.evidenceId))
          .map(h => (
            <motion.div
              key={h.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute z-20 pointer-events-none"
              style={{ left: `${h.x}%`, top: `${h.y}%`, transform: 'translate(-50%, -50%)' }}
            >
              <div className="w-8 h-8 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-primary" />
              </div>
            </motion.div>
          ))}

        {/* Magnifier lens */}
        <AnimatePresence>
          {isScanning && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute z-30 pointer-events-none"
              style={{
                left: mousePos.x - MAGNIFIER_SIZE / 2,
                top: mousePos.y - MAGNIFIER_SIZE / 2,
                width: MAGNIFIER_SIZE,
                height: MAGNIFIER_SIZE,
              }}
            >
              {/* Magnifier circle */}
              <div
                className="w-full h-full rounded-full overflow-hidden border-2 relative"
                style={{
                  borderColor: nearbyHotspot
                    ? 'hsl(var(--primary))'
                    : 'hsl(var(--border))',
                  boxShadow: nearbyHotspot
                    ? '0 0 30px hsl(var(--primary) / 0.5), inset 0 0 20px hsl(var(--primary) / 0.1)'
                    : '0 0 20px hsl(var(--background) / 0.8)',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
              >
                {/* Zoomed image inside magnifier */}
                <div
                  className="absolute"
                  style={{
                    width: containerRef.current?.offsetWidth ?? 800,
                    height: containerRef.current?.offsetHeight ?? 450,
                    left: -(mousePos.x * 2 - MAGNIFIER_SIZE / 2),
                    top: -(mousePos.y * 2 - MAGNIFIER_SIZE / 2),
                    transform: 'scale(2)',
                    transformOrigin: 'top left',
                  }}
                >
                  <img
                    src={image}
                    alt=""
                    className="w-full h-full object-cover"
                    style={{ filter: 'brightness(1)' }}
                    draggable={false}
                  />
                </div>

                {/* Crosshair */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-px h-6 bg-primary/40 absolute" />
                  <div className="h-px w-6 bg-primary/40 absolute" />
                </div>

                {/* Scanner ring animation when near hotspot */}
                {nearbyHotspot && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-primary"
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.8, 0.3, 0.8],
                    }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </div>

              {/* Hotspot label */}
              {nearbyHotspot && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap"
                >
                  <div className="px-3 py-1.5 rounded-md bg-primary/90 text-primary-foreground text-xs font-medium shadow-lg">
                    🔍 {nearbyHotspot.hint} — нажмите!
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Flash effect on finding evidence */}
        <AnimatePresence>
          {justFound && (
            <motion.div
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 z-40 pointer-events-none"
              style={{
                background: 'radial-gradient(circle, hsl(var(--primary) / 0.3) 0%, transparent 70%)',
              }}
            />
          )}
        </AnimatePresence>

        {/* Scan instruction overlay */}
        {!isScanning && foundCount < totalHotspots && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/40 z-10">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card/80 border border-primary/30 text-sm text-foreground"
            >
              <Search className="w-4 h-4 text-primary" />
              Наведите курсор для сканирования
            </motion.div>
          </div>
        )}
      </div>

      {/* Evidence found notification */}
      <AnimatePresence>
        {justFound && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-lg border border-primary/50 bg-primary/10 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
              <CheckCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-primary">Улика найдена!</p>
              <p className="text-xs text-muted-foreground">Проверьте раздел «Найденные улики» ниже</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SceneExplorer;
