import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

import panel1 from '@/assets/comic/panel-1-call.jpg';
import panel2 from '@/assets/comic/panel-2-building.jpg';
import panel3 from '@/assets/comic/panel-3-elevator.jpg';
import panel4 from '@/assets/comic/panel-4-office.jpg';
import panel5 from '@/assets/comic/panel-5-screen.jpg';
import panel6 from '@/assets/comic/panel-6-slam.jpg';
import panel7 from '@/assets/comic/panel-7-server.jpg';

interface ComicPanel {
  image: string;
  layout: 'full' | 'square' | 'wide';
  dialogue?: { text: string; position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'; speaker?: string };
  caption?: string;
}

const COMIC_PANELS: ComicPanel[] = [
  {
    image: panel1,
    layout: 'square',
    dialogue: { text: 'Нам нужен специалист по защите данных. Срочно.', position: 'top-right', speaker: 'Директор Петров' },
    caption: 'Понедельник, 11 марта. 7:32 утра.',
  },
  {
    image: panel2,
    layout: 'wide',
    caption: 'Бизнес-центр «Горизонт». Штаб-квартира «НоваТех» — крупнейшего разработчика CRM-систем в регионе.',
  },
  {
    image: panel3,
    layout: 'square',
    caption: '50 000 клиентов. Терабайты персональных данных. И что-то пошло не так...',
  },
  {
    image: panel4,
    layout: 'wide',
    dialogue: { text: 'Данные 50 000 клиентов оказались в открытом доступе. Мы обнаружили это сегодня утром.', position: 'top-left', speaker: 'Петров' },
  },
  {
    image: panel5,
    layout: 'wide',
    caption: 'База данных — взломана. Система мониторинга — молчала. Кто-то знал, что делает.',
  },
  {
    image: panel6,
    layout: 'square',
    dialogue: { text: 'У нас есть 72 часа... или нет?', position: 'bottom-right' },
    caption: 'Время уже пошло.',
  },
  {
    image: panel7,
    layout: 'wide',
    caption: 'Ваша задача — найти улики, опросить подозреваемых и раскрыть, как произошла утечка.',
  },
];

interface ComicStripProps {
  onComplete: () => void;
}

const ComicStrip = ({ onComplete }: ComicStripProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="py-16 text-center"
      >
        <h1 className="text-4xl md:text-6xl font-black text-foreground uppercase tracking-tight mb-2"
          style={{ textShadow: '0 0 40px hsl(var(--primary) / 0.3)' }}
        >
          Операция: Цифровой След
        </h1>
        <p className="text-muted-foreground font-mono text-sm tracking-widest uppercase">Глава 1 — Точка входа</p>
      </motion.div>

      {/* Comic panels */}
      <div className="max-w-4xl mx-auto px-4 pb-8 space-y-6">
        {COMIC_PANELS.map((panel, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className={`relative overflow-hidden rounded-lg border-2 border-border shadow-2xl ${
              panel.layout === 'wide' ? 'aspect-[16/9]' : 'aspect-square max-w-lg mx-auto'
            }`}
          >
            {/* Image */}
            <img
              src={panel.image}
              alt=""
              className="w-full h-full object-cover"
              draggable={false}
            />

            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/30" />

            {/* Speech bubble */}
            {panel.dialogue && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                className={`absolute max-w-[70%] ${
                  panel.dialogue.position === 'top-left' ? 'top-4 left-4' :
                  panel.dialogue.position === 'top-right' ? 'top-4 right-4' :
                  panel.dialogue.position === 'bottom-left' ? 'bottom-12 left-4' :
                  'bottom-12 right-4'
                }`}
              >
                <div className="relative bg-foreground text-background rounded-2xl px-4 py-3 shadow-xl">
                  {panel.dialogue.speaker && (
                    <p className="text-xs font-bold text-primary mb-1 uppercase tracking-wider">
                      {panel.dialogue.speaker}
                    </p>
                  )}
                  <p className="text-sm md:text-base font-medium leading-snug italic">
                    {panel.dialogue.text}
                  </p>
                  {/* Speech bubble tail */}
                  <div className="absolute -bottom-2 left-8 w-4 h-4 bg-foreground rotate-45" />
                </div>
              </motion.div>
            )}

            {/* Caption bar */}
            {panel.caption && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
                className="absolute bottom-0 left-0 right-0 px-4 py-3"
              >
                <p className="text-xs md:text-sm font-mono text-primary/90 tracking-wide leading-relaxed bg-background/60 backdrop-blur-sm px-3 py-2 rounded border-l-2 border-primary">
                  {panel.caption}
                </p>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* CTA to start investigation */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-20 text-center"
      >
        <motion.button
          onClick={onComplete}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-10 py-5 bg-primary text-primary-foreground text-lg font-bold rounded-xl shadow-2xl hover:shadow-primary/30 transition-shadow"
          style={{ boxShadow: '0 0 40px hsl(var(--primary) / 0.3)' }}
        >
          🔍 Начать расследование
        </motion.button>
        <p className="text-muted-foreground text-sm mt-4 font-mono">Обследуйте локации и соберите улики</p>
      </motion.div>
    </div>
  );
};

export default ComicStrip;
