import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, Clock, FileText, ChevronRight, Star } from 'lucide-react';
import { MODULES } from '@/data/gameContent';
import { useGameStore } from '@/stores/gameStore';

const GameHub = () => {
  const navigate = useNavigate();
  const startGame = useGameStore((s) => s.startGame);

  const handleStart = (moduleId: string) => {
    startGame(moduleId);
    navigate(`/game/module/${moduleId}`);
  };

  const difficultyColor: Record<string, string> = {
    'Лёгкая': 'text-success',
    'Средняя': 'text-warning',
    'Высокая': 'text-destructive',
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center">
              <FileText className="w-4 h-4 text-primary" />
            </div>
            <span className="font-semibold text-sm">Цифровой След</span>
          </button>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="font-mono">Детектив</span>
            <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center text-xs font-bold text-primary">
              ДС
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-primary font-mono text-xs tracking-[0.2em] uppercase mb-2">Выберите модуль</p>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Хаб расследований</h1>
          <p className="text-muted-foreground mb-10 max-w-lg">
            Каждый модуль — самостоятельное дело. Проходите в любом порядке, собирайте улики и повышайте свой рейтинг.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {MODULES.map((mod, i) => (
            <motion.div
              key={mod.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className={`group relative rounded-xl border border-border bg-card p-6 flex flex-col transition-all ${
                mod.status === 'available'
                  ? 'hover:border-primary/50 hover:box-glow-cyan cursor-pointer'
                  : 'opacity-50 cursor-not-allowed'
              }`}
              onClick={() => mod.status === 'available' && handleStart(mod.id)}
            >
              {mod.status === 'locked' && (
                <div className="absolute inset-0 rounded-xl bg-background/60 flex items-center justify-center z-10">
                  <Lock className="w-8 h-8 text-muted-foreground" />
                </div>
              )}

              {/* Difficulty badge */}
              <div className="flex items-center justify-between mb-4">
                <span className={`text-xs font-mono font-medium ${difficultyColor[mod.difficulty] || 'text-muted-foreground'}`}>
                  {mod.difficulty}
                </span>
                <div className="flex gap-1">
                  {[1, 2, 3].map((s) => (
                    <Star
                      key={s}
                      className={`w-3 h-3 ${s <= (mod.difficulty === 'Высокая' ? 3 : mod.difficulty === 'Средняя' ? 2 : 1) ? 'text-warning fill-warning' : 'text-muted'}`}
                    />
                  ))}
                </div>
              </div>

              <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                {mod.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-6 flex-1 leading-relaxed">
                {mod.description}
              </p>

              {/* Stats */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono border-t border-border pt-4">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {mod.estimatedTime} мин
                </span>
                <span>{mod.chapters} глав</span>
                <span>{mod.totalEvidence} улик</span>
              </div>

              {mod.status === 'available' && (
                <div className="mt-4 flex items-center gap-1 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Начать <ChevronRight className="w-4 h-4" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default GameHub;
