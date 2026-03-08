import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, ChevronRight, Eye } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background">
      {/* Grid background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />

      {/* Scan line effect */}
      <div className="absolute inset-0 bg-scanlines pointer-events-none opacity-50" />

      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, hsl(187 100% 50% / 0.15) 0%, transparent 70%)' }}
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="relative z-10 flex flex-col items-center text-center px-4 max-w-3xl"
      >
        {/* Shield icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
          className="mb-8"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-full animate-glow-pulse" />
            <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center border border-border">
              <Shield className="w-12 h-12 text-primary" />
            </div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <p className="text-primary font-mono text-sm tracking-[0.3em] uppercase mb-4">
            Интерактивное расследование
          </p>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-2 text-foreground">
            ОПЕРАЦИЯ
          </h1>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-glow-cyan text-primary">
            ЦИФРОВОЙ СЛЕД
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed"
        >
          Детективный лонгрид по защите персональных данных.
          Найдите источник утечки, соберите улики и примите решение — до истечения 72 часов.
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex gap-8 mt-8 text-center"
        >
          {[
            { value: '5', label: 'Глав' },
            { value: '10', label: 'Улик' },
            { value: '~60', label: 'Минут' },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <span className="text-2xl font-bold text-primary font-mono">{stat.value}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-4 mt-12"
        >
          <button
            onClick={() => navigate('/game')}
            className="group relative px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg overflow-hidden transition-all hover:scale-105 active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-2">
              Начать расследование
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>

          <button
            onClick={() => navigate('/game')}
            className="px-8 py-4 border border-border text-foreground font-medium rounded-lg hover:bg-secondary transition-colors flex items-center gap-2"
          >
            <Eye className="w-5 h-5 text-muted-foreground" />
            Как это работает
          </button>
        </motion.div>

        {/* Bottom info */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="mt-16 text-xs text-muted-foreground font-mono tracking-wider"
        >
          152-ФЗ • GDPR • Обучение через геймификацию
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Landing;
