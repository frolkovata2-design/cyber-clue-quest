import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const GameTimer = () => {
  const [seconds, setSeconds] = useState(259200); // 72 hours

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const isLow = seconds < 259200 * 0.1;

  return (
    <div className={`flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-md border ${
      isLow 
        ? 'border-destructive/50 text-destructive bg-destructive/5 animate-pulse'
        : 'border-border text-muted-foreground bg-secondary'
    }`}>
      <Clock className="w-3 h-3" />
      <span>
        {String(hours).padStart(2, '0')}:{String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
      </span>
    </div>
  );
};

export default GameTimer;
