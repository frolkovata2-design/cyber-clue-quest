import { MapPin, Check } from 'lucide-react';

interface ChapterNavProps {
  chapters: {
    id: string;
    title: string;
    location: string;
    type: string;
  }[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

const ChapterNav = ({ chapters, activeIndex, onSelect }: ChapterNavProps) => {
  return (
    <div className="space-y-1">
      <p className="text-xs font-mono text-primary uppercase tracking-wider mb-4">Главы</p>
      {chapters.map((ch, i) => {
        const isActive = i === activeIndex;
        const isPast = i < activeIndex;

        return (
          <button
            key={ch.id}
            onClick={() => i <= activeIndex && onSelect(i)}
            className={`w-full text-left px-3 py-2.5 rounded-lg transition-all text-sm ${
              isActive
                ? 'bg-primary/10 border border-primary/30 text-foreground'
                : isPast
                ? 'text-muted-foreground hover:bg-secondary cursor-pointer'
                : 'text-muted/60 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : isPast
                  ? 'bg-success/20 text-success'
                  : 'bg-secondary text-muted-foreground'
              }`}>
                {isPast ? <Check className="w-3 h-3" /> : i + 1}
              </div>
              <div className="min-w-0">
                <p className="font-medium truncate">{ch.title}</p>
                <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                  <MapPin className="w-2.5 h-2.5" />
                  {ch.location}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default ChapterNav;
