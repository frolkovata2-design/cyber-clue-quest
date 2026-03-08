import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, FileText, Terminal, Mail, File, Eye, Scale } from 'lucide-react';
import { SAMPLE_EVIDENCE } from '@/data/gameContent';
import { SFX } from '@/lib/sfx';

interface DeductionPhaseProps {
  foundEvidence: string[];
  onComplete: (score: number) => void;
}

const typeIcons = {
  document: FileText,
  log: Terminal,
  email: Mail,
  testimony: Eye,
  file: File,
};

const DEDUCTION_QUESTIONS = [
  {
    id: 'q1',
    question: 'Как произошла утечка данных?',
    options: [
      { id: 'a', text: 'Через массовый экспорт API в ночное время', correct: true, evidenceRef: 'ev_002' },
      { id: 'b', text: 'Через физический доступ к серверам', correct: false },
      { id: 'c', text: 'Через фишинговое письмо', correct: false },
    ],
    explanation: 'Серверные логи показали массовый экспорт данных через API в 02:47 с IP внутренней сети.',
  },
  {
    id: 'q2',
    question: 'Кто несёт ответственность за уязвимость доступа?',
    options: [
      { id: 'a', text: 'Внешний хакер', correct: false },
      { id: 'b', text: 'Сотрудник Зотов, хранивший пароли на стикере', correct: true, evidenceRef: 'ev_004' },
      { id: 'c', text: 'Руководство компании', correct: false },
    ],
    explanation: 'На мониторе Зотова был обнаружен стикер с паролями от API и базы данных — грубое нарушение ст. 19 152-ФЗ.',
  },
  {
    id: 'q3',
    question: 'Какое нарушение допустил директор Петров?',
    options: [
      { id: 'a', text: 'Не установил антивирус', correct: false },
      { id: 'b', text: 'Не знал о сроках уведомления Роскомнадзора (24ч вместо 72ч)', correct: true, evidenceRef: 'ev_001' },
      { id: 'c', text: 'Не нанял охрану', correct: false },
    ],
    explanation: 'Директор считал, что на уведомление есть 72 часа, тогда как закон требует 24 часа — нарушение ст. 21 152-ФЗ.',
  },
  {
    id: 'q4',
    question: 'Какова главная причина успешной утечки?',
    options: [
      { id: 'a', text: 'Отсутствие шифрования и ненадлежащее хранение паролей', correct: true, evidenceRef: 'ev_004' },
      { id: 'b', text: 'Использование устаревшего ПО', correct: false },
      { id: 'c', text: 'Атака из-за рубежа', correct: false },
    ],
    explanation: 'Совокупность факторов: пароли на стикере, отсутствие мониторинга ночного доступа, системные нарушения ст. 19 152-ФЗ.',
  },
];

const DeductionPhase = ({ foundEvidence, onComplete }: DeductionPhaseProps) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { selected: string; correct: boolean }>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const question = DEDUCTION_QUESTIONS[currentQ];

  const handleAnswer = (optionId: string) => {
    if (showExplanation) return;
    const option = question.options.find(o => o.id === optionId);
    if (!option) return;

    setSelectedOption(optionId);
    setAnswers(prev => ({
      ...prev,
      [question.id]: { selected: optionId, correct: option.correct },
    }));
    setShowExplanation(true);
    if (option.correct) SFX.correct(); else SFX.wrong();
  };

  const handleNext = () => {
    setShowExplanation(false);
    setSelectedOption(null);
    if (currentQ < DEDUCTION_QUESTIONS.length - 1) {
      setCurrentQ(prev => prev + 1);
    } else {
      setIsComplete(true);
    }
  };

  const correctCount = Object.values(answers).filter(a => a.correct).length;
  const score = Math.round((correctCount / DEDUCTION_QUESTIONS.length) * 100);

  if (isComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-lg w-full bg-card border border-border rounded-2xl p-8 text-center shadow-2xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6"
            style={{
              background: score >= 75
                ? 'linear-gradient(135deg, hsl(var(--primary)), hsl(160 80% 40%))'
                : 'linear-gradient(135deg, hsl(var(--warning)), hsl(var(--destructive)))',
            }}
          >
            <Scale className="w-10 h-10 text-primary-foreground" />
          </motion.div>

          <h2 className="text-2xl font-bold text-foreground mb-2">Расследование завершено</h2>
          <p className="text-muted-foreground text-sm mb-6">
            {score >= 75
              ? 'Отличная работа, детектив! Вы верно восстановили картину событий.'
              : 'Неплохо, но некоторые детали ускользнули от вашего внимания.'}
          </p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-secondary rounded-lg p-3">
              <p className="text-2xl font-bold text-primary">{score}%</p>
              <p className="text-xs text-muted-foreground">Точность</p>
            </div>
            <div className="bg-secondary rounded-lg p-3">
              <p className="text-2xl font-bold text-foreground">{foundEvidence.length}</p>
              <p className="text-xs text-muted-foreground">Улик</p>
            </div>
            <div className="bg-secondary rounded-lg p-3">
              <p className="text-2xl font-bold text-foreground">{correctCount}/{DEDUCTION_QUESTIONS.length}</p>
              <p className="text-xs text-muted-foreground">Верно</p>
            </div>
          </div>

          {/* Evidence summary */}
          <div className="text-left mb-6">
            <p className="text-xs font-mono text-primary uppercase tracking-wider mb-3">Найденные нарушения</p>
            <div className="space-y-2">
              {foundEvidence.map(evId => {
                const ev = SAMPLE_EVIDENCE.find(e => e.id === evId);
                if (!ev || !ev.violationRef) return null;
                return (
                  <div key={evId} className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/50 px-3 py-2 rounded">
                    <AlertTriangle className="w-3 h-3 text-destructive" />
                    <span className="font-mono text-destructive">{ev.violationRef}</span>
                    <span>— {ev.title}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => onComplete(score)}
            className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:scale-[1.02] active:scale-95 transition-transform"
          >
            Завершить модуль
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-lg px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Расследование</span>
          </div>
          <span className="text-xs font-mono text-muted-foreground">
            Вопрос {currentQ + 1}/{DEDUCTION_QUESTIONS.length}
          </span>
        </div>
      </header>

      {/* Progress */}
      <div className="max-w-3xl mx-auto w-full px-4 pt-6">
        <div className="h-1 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQ + (showExplanation ? 1 : 0)) / DEDUCTION_QUESTIONS.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="max-w-2xl w-full"
          >
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-8 text-center">
              {question.question}
            </h2>

            <div className="space-y-3">
              {question.options.map((option) => {
                const isSelected = selectedOption === option.id;
                const isCorrect = option.correct;
                const showResult = showExplanation;

                return (
                  <motion.button
                    key={option.id}
                    onClick={() => handleAnswer(option.id)}
                    whileHover={!showExplanation ? { scale: 1.02 } : {}}
                    whileTap={!showExplanation ? { scale: 0.98 } : {}}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      showResult
                        ? isCorrect
                          ? 'border-primary bg-primary/10'
                          : isSelected
                          ? 'border-destructive bg-destructive/10'
                          : 'border-border bg-card opacity-50'
                        : 'border-border bg-card hover:border-primary/50 hover:bg-card/80'
                    }`}
                    disabled={showExplanation}
                  >
                    <div className="flex items-center gap-3">
                      {showResult && isCorrect && <CheckCircle className="w-5 h-5 text-primary shrink-0" />}
                      {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-destructive shrink-0" />}
                      {!showResult && (
                        <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 shrink-0" />
                      )}
                      <span className="text-sm font-medium text-foreground">{option.text}</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Explanation */}
            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, y: 20, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  className="mt-6"
                >
                  <div className="bg-secondary/50 border border-border rounded-xl p-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      💡 {question.explanation}
                    </p>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={handleNext}
                      className="px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:scale-105 active:scale-95 transition-transform text-sm"
                    >
                      {currentQ < DEDUCTION_QUESTIONS.length - 1 ? 'Следующий вопрос →' : 'Завершить расследование'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Evidence reference bar */}
      <div className="border-t border-border bg-card/50 px-4 py-3">
        <div className="max-w-3xl mx-auto">
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-2">Ваши улики</p>
          <div className="flex gap-2 overflow-x-auto">
            {foundEvidence.map(evId => {
              const ev = SAMPLE_EVIDENCE.find(e => e.id === evId);
              if (!ev) return null;
              const Icon = typeIcons[ev.type] || FileText;
              return (
                <div key={evId} className="flex items-center gap-1.5 px-2 py-1 rounded border border-border bg-secondary/50 text-xs text-muted-foreground whitespace-nowrap">
                  <Icon className="w-3 h-3 text-primary" />
                  {ev.title}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeductionPhase;
