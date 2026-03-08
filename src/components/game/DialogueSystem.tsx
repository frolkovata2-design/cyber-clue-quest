import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, User, ChevronRight } from 'lucide-react';

interface DialogueLine {
  id: string;
  speaker: 'player' | 'character';
  characterName: string;
  emotion: string;
  text: string;
  choices?: { id: string; label: string; next: string }[];
  evidenceUnlock?: string;
}

interface DialogueSystemProps {
  lines: DialogueLine[];
  onClose: () => void;
  onEvidenceFound: (evId: string) => void;
}

const DialogueSystem = ({ lines, onClose, onEvidenceFound }: DialogueSystemProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [history, setHistory] = useState<DialogueLine[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const current = lines[currentIndex];

  // Typewriter effect
  useEffect(() => {
    if (!current || current.speaker === 'player') {
      setDisplayedText('');
      setIsTyping(false);
      return;
    }

    setIsTyping(true);
    setDisplayedText('');
    let i = 0;
    const text = current.text;

    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.slice(0, i + 1));
        i++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [currentIndex, current]);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [history, displayedText]);

  const advance = () => {
    if (isTyping) {
      setDisplayedText(current.text);
      setIsTyping(false);
      return;
    }

    if (current.evidenceUnlock) {
      onEvidenceFound(current.evidenceUnlock);
    }

    setHistory((prev) => [...prev, current]);

    if (currentIndex < lines.length - 1 && !current.choices) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleChoice = (choice: { id: string; label: string; next: string }) => {
    setHistory((prev) => [
      ...prev,
      current,
      { id: choice.id, speaker: 'player', characterName: 'Вы', emotion: 'neutral', text: choice.label },
    ]);
    const nextLine = lines.find((l) => l.id === choice.next);
    if (nextLine) {
      setCurrentIndex(lines.indexOf(nextLine));
    }
  };

  if (!current) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25 }}
        className="w-full max-w-2xl rounded-xl border border-border bg-card overflow-hidden"
        style={{ maxHeight: '70vh' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm font-semibold text-foreground">{current.characterName}</span>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat area */}
        <div ref={scrollRef} className="p-5 space-y-4 overflow-y-auto" style={{ maxHeight: '50vh' }}>
          {/* History */}
          {history.map((line, i) => (
            <div
              key={i}
              className={`flex ${line.speaker === 'player' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-4 py-2.5 rounded-lg text-sm leading-relaxed ${
                  line.speaker === 'player'
                    ? 'bg-primary text-primary-foreground rounded-br-none'
                    : 'bg-secondary text-secondary-foreground rounded-bl-none'
                }`}
              >
                {line.text}
              </div>
            </div>
          ))}

          {/* Current line */}
          {current.speaker === 'character' && (
            <div className="flex justify-start">
              <div
                onClick={advance}
                className="max-w-[80%] px-4 py-2.5 rounded-lg rounded-bl-none bg-secondary text-secondary-foreground text-sm leading-relaxed cursor-pointer"
              >
                {displayedText}
                {isTyping && <span className="inline-block w-0.5 h-4 bg-primary ml-0.5 align-middle animate-typing-cursor" />}
              </div>
            </div>
          )}

          {/* Choices */}
          {current.speaker === 'player' && current.choices && (
            <div className="space-y-2 mt-4">
              {current.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice)}
                  className="w-full text-left px-4 py-3 rounded-lg border border-primary/20 bg-primary/5 text-sm text-foreground hover:bg-primary/10 hover:border-primary/40 transition-all flex items-center justify-between group"
                >
                  <span>{choice.label}</span>
                  <ChevronRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {current.speaker === 'character' && !isTyping && !current.choices && (
          <div className="px-5 py-3 border-t border-border">
            <button
              onClick={advance}
              className="w-full py-2.5 rounded-lg bg-secondary text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Продолжить →
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default DialogueSystem;
