import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

interface NarrativeSectionProps {
  text: string;
  onEvidenceClick: () => void;
}

const NARRATIVE_PARAGRAPHS = [
  'Утро понедельника, 11 марта. Серое небо за окнами бизнес-центра «Горизонт» обещает долгий, непростой день. Ваш телефон вибрирует — срочный вызов.',
  'Генеральный директор компании «НоваТех» Алексей Петров ждёт вас в своём кабинете на 12-м этаже. Голос в трубке звучал встревоженно: «Нам нужен специалист по защите данных. Срочно.»',
  'Поднимаясь в лифте, вы просматриваете досье компании. «НоваТех» — крупный разработчик CRM-систем. 50 000 клиентов. Обработка персональных данных — основа бизнеса. И, судя по всему, что-то пошло не так.',
  'Двери кабинета открываются. Петров сидит за столом, нервно перебирая документы. Рядом — начальник IT-отдела Марина Козлова и юрист компании Дмитрий Воронов. Все трое выглядят так, будто не спали всю ночь.',
  '«Данные 50 000 клиентов оказались в открытом доступе,» — без предисловий начинает Петров. — «Мы обнаружили это сегодня утром. Нам нужна ваша помощь.»',
];

const NarrativeSection = ({ text, onEvidenceClick }: NarrativeSectionProps) => {
  return (
    <div className="space-y-6">
      {NARRATIVE_PARAGRAPHS.map((paragraph, i) => (
        <motion.p
          key={i}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: i * 0.3 }}
          className="narrative-text text-foreground/90 text-base md:text-lg"
        >
          {paragraph}
        </motion.p>
      ))}

      {/* Interactive evidence hint */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: NARRATIVE_PARAGRAPHS.length * 0.3 + 0.5 }}
        onClick={onEvidenceClick}
        className="mt-8 p-4 rounded-lg border border-dashed border-primary/30 bg-primary/5 cursor-pointer hover:border-primary/60 hover:bg-primary/10 transition-all group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center animate-glow-pulse">
            <Search className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
              Осмотреть документы на столе
            </p>
            <p className="text-xs text-muted-foreground">Нажмите, чтобы исследовать улику</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NarrativeSection;
