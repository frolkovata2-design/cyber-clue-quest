import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, FileText, Terminal, Mail, File, Eye, Scale, ArrowLeft } from 'lucide-react';
import { SAMPLE_EVIDENCE } from '@/data/gameContent';
import { SFX } from '@/lib/sfx';

interface DeductionPhaseProps {
  foundEvidence: string[];
  moduleId?: string;
  onComplete: (score: number) => void;
}

const typeIcons = {
  document: FileText,
  log: Terminal,
  email: Mail,
  testimony: Eye,
  file: File,
};

interface DeductionQuestion {
  id: string;
  question: string;
  options: { id: string; text: string; correct: boolean; evidenceRef?: string }[];
  explanation: string;
}

const MODULE_QUESTIONS: Record<string, DeductionQuestion[]> = {
  module_1: [
    {
      id: 'q1',
      question: 'Как произошла утечка данных?',
      options: [
        { id: 'a', text: 'Через массовый экспорт API в ночное время', correct: true, evidenceRef: 'ev_002' },
        { id: 'b', text: 'Через физический доступ к серверам', correct: false },
        { id: 'c', text: 'Через фишинговое письмо', correct: false },
      ],
      explanation: 'Серверные логи показали массовый экспорт данных через API в 02:47 с IP внутренней сети. API-шлюз не имел ограничений по количеству запросов (rate limiting), что позволило выгрузить все 50 000 записей за один сеанс.',
    },
    {
      id: 'q2',
      question: 'Кто несёт ответственность за уязвимость доступа?',
      options: [
        { id: 'a', text: 'Внешний хакер', correct: false },
        { id: 'b', text: 'Сотрудник Зотов, хранивший пароли на стикере', correct: true, evidenceRef: 'ev_004' },
        { id: 'c', text: 'Руководство компании', correct: false },
      ],
      explanation: 'На мониторе Зотова был обнаружен стикер с паролями от API и базы данных — грубое нарушение ст. 19 152-ФЗ. Хранение паролей в открытом виде на рабочем месте создаёт прямую угрозу несанкционированного доступа.',
    },
    {
      id: 'q3',
      question: 'Какое нарушение допустил директор Петров?',
      options: [
        { id: 'a', text: 'Не установил антивирус', correct: false },
        { id: 'b', text: 'Не знал о сроках уведомления Роскомнадзора (24ч вместо 72ч)', correct: true, evidenceRef: 'ev_001' },
        { id: 'c', text: 'Не нанял охрану', correct: false },
      ],
      explanation: 'Директор считал, что на уведомление есть 72 часа, тогда как ч. 3.1 ст. 21 152-ФЗ требует уведомить Роскомнадзор в течение 24 часов с момента обнаружения инцидента. Задержка уведомления — самостоятельное правонарушение.',
    },
    {
      id: 'q4',
      question: 'Какова главная причина успешной утечки?',
      options: [
        { id: 'a', text: 'Совокупность системных нарушений: открытые пароли, отсутствие мониторинга и шифрования', correct: true, evidenceRef: 'ev_004' },
        { id: 'b', text: 'Использование устаревшего ПО', correct: false },
        { id: 'c', text: 'Атака из-за рубежа', correct: false },
      ],
      explanation: 'Утечка стала возможной из-за комплекса нарушений ст. 19 152-ФЗ: пароли на стикере (небезопасное хранение учётных данных), отсутствие rate limiting на API, отсутствие мониторинга ночных подключений, игнорирование рекомендаций аудиторов по шифрованию.',
    },
  ],
  module_2: [
    {
      id: 'm2_q1',
      question: 'Как атакующий получил первоначальный доступ к сети «ДатаКор»?',
      options: [
        { id: 'a', text: 'Через уязвимость в устаревшем файрволе, который не обновлялся 3 месяца', correct: true, evidenceRef: 'ev_m2_001' },
        { id: 'b', text: 'Через фишинговое письмо сотруднику', correct: false },
        { id: 'c', text: 'Через физический доступ к офису', correct: false },
      ],
      explanation: 'Файрвол не обновлялся 3 месяца, и известная уязвимость (CVE) не была закрыта патчем. Это нарушение ст. 19 152-ФЗ — оператор обязан применять актуальные средства защиты информации.',
    },
    {
      id: 'm2_q2',
      question: 'Какова роль администратора Лебедева в инциденте?',
      options: [
        { id: 'a', text: 'Он случайно допустил ошибку в настройках', correct: false },
        { id: 'b', text: 'Он умышленно содействовал атаке за денежное вознаграждение', correct: true, evidenceRef: 'ev_m2_007' },
        { id: 'c', text: 'Он не был вовлечён — его учётку украли', correct: false },
      ],
      explanation: 'На счёт Лебедева поступило 450 000 руб. от неизвестных, на его станции найдены команды экспорта БД, а незарегистрированная флешка содержала утилиты для сбора данных. Это указывает на умышленное содействие атаке — уголовная ответственность по ст. 272 УК РФ.',
    },
    {
      id: 'm2_q3',
      question: 'Какой объём данных был скомпрометирован?',
      options: [
        { id: 'a', text: 'Только почтовые ящики сотрудников', correct: false },
        { id: 'b', text: '2.3 ГБ данных 120 000 клиентов, включая платёжные данные, без шифрования', correct: true, evidenceRef: 'ev_m2_008' },
        { id: 'c', text: 'Несколько тестовых записей', correct: false },
      ],
      explanation: 'Форензик-анализ подтвердил утечку ПД 120 000 клиентов, включая платёжные данные. БД не была зашифрована — нарушение ст. 19 152-ФЗ. Данные были переданы на зарубежный сервер без правовых оснований — нарушение ст. 12 152-ФЗ о трансграничной передаче ПД.',
    },
    {
      id: 'm2_q4',
      question: 'Какое устройство использовалось для маскировки атаки?',
      options: [
        { id: 'a', text: 'Корпоративный VPN-сервер', correct: false },
        { id: 'b', text: 'Нелегальный мини-роутер, подключённый к магистральному каналу в серверном шкафу', correct: true, evidenceRef: 'ev_m2_006' },
        { id: 'c', text: 'Личный ноутбук сотрудника', correct: false },
      ],
      explanation: 'В серверном шкафу обнаружен миниатюрный роутер, не входящий в схему сети. Он позволял создать скрытый канал для вывода данных, минуя системы мониторинга. Отсутствие инвентаризации сетевого оборудования — нарушение ст. 19 152-ФЗ.',
    },
  ],
  module_3: [
    {
      id: 'm3_q1',
      question: 'Кто организовал систематическую продажу персональных данных сотрудников?',
      options: [
        { id: 'a', text: 'Заместитель главного бухгалтера', correct: false },
        { id: 'b', text: 'Начальница HR-отдела Воронова Н.А.', correct: true, evidenceRef: 'ev_m3_007' },
        { id: 'c', text: 'Внешний злоумышленник', correct: false },
      ],
      explanation: 'В ежедневнике Вороновой найдены записи о ценах («500₽/строка»), графиках передачи и объёмах («200 записей»). Переписка в мессенджере подтверждает систематическую продажу ПД — нарушение ст. 7 152-ФЗ о конфиденциальности персональных данных.',
    },
    {
      id: 'm3_q2',
      question: 'Какое системное нарушение позволило утечке продолжаться 5 месяцев?',
      options: [
        { id: 'a', text: 'Система управления ПД не требовала авторизации — любой сотрудник HR имел полный доступ', correct: true, evidenceRef: 'ev_m3_006' },
        { id: 'b', text: 'Серверы были взломаны хакерами', correct: false },
        { id: 'c', text: 'Сотрудники сами раздавали свои данные', correct: false },
      ],
      explanation: 'Отсутствие авторизации в системе управления ПД — грубейшее нарушение ст. 19 152-ФЗ. Оператор обязан принимать технические меры защиты, включая разграничение доступа, аутентификацию и журналирование действий пользователей.',
    },
    {
      id: 'm3_q3',
      question: 'Какое нарушение связано с хранением персональных данных уволенных сотрудников?',
      options: [
        { id: 'a', text: 'Данные хранились слишком долго', correct: false },
        { id: 'b', text: 'Личные дела 34 уволенных сотрудников были полностью изъяты из архива и уничтожены без соблюдения процедуры', correct: true, evidenceRef: 'ev_m3_004' },
        { id: 'c', text: 'Данные не были зашифрованы', correct: false },
      ],
      explanation: 'Ст. 21 152-ФЗ обязывает оператора уничтожать ПД по достижении цели обработки, но с соблюдением установленного порядка и сроков. Произвольное уничтожение документов для сокрытия следов — отдельное правонарушение.',
    },
    {
      id: 'm3_q4',
      question: 'Какой объём персональных данных был скомпрометирован?',
      options: [
        { id: 'a', text: 'Только имена и должности 50 человек', correct: false },
        { id: 'b', text: 'Около 100 записей за последний месяц', correct: false },
        { id: 'c', text: 'Около 1 200 полных записей (СНИЛС, паспорта, адреса) за 5 месяцев', correct: true, evidenceRef: 'ev_m3_009' },
      ],
      explanation: 'Хронология показала, что продажа велась 5 месяцев, всего передано ~1 200 записей с полными ПД. Это нарушение ст. 5 152-ФЗ (принцип минимизации), ст. 7 (конфиденциальность), ст. 9 (отсутствие согласий у 60% сотрудников).',
    },
    {
      id: 'm3_q5',
      question: 'Какие меры предписал Роскомнадзор по итогам проверки?',
      options: [
        { id: 'a', text: 'Только оштрафовать виновного сотрудника', correct: false },
        { id: 'b', text: 'Устранить нарушения в 30 дней, назначить ответственного за ПД, провести полный аудит процессов', correct: true, evidenceRef: 'ev_m3_012' },
        { id: 'c', text: 'Закрыть компанию', correct: false },
      ],
      explanation: 'По ст. 23 152-ФЗ Роскомнадзор вправе выдавать предписания об устранении нарушений. Компании предписано: назначить ответственного за организацию обработки ПД (ст. 22.1), провести аудит, внедрить технические меры защиты (ст. 19) и обеспечить наличие согласий (ст. 9).',
    },
  ],
};

const DeductionPhase = ({ foundEvidence, moduleId = 'module_1', onComplete }: DeductionPhaseProps) => {
  const navigate = useNavigate();
  const questions = MODULE_QUESTIONS[moduleId] || MODULE_QUESTIONS.module_1;
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { selected: string; correct: boolean }>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const question = questions[currentQ];

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
    if (currentQ < questions.length - 1) {
      setCurrentQ(prev => prev + 1);
    } else {
      setIsComplete(true);
    }
  };

  const correctCount = Object.values(answers).filter(a => a.correct).length;
  const score = Math.round((correctCount / questions.length) * 100);

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
              <p className="text-2xl font-bold text-foreground">{correctCount}/{questions.length}</p>
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
                    <AlertTriangle className="w-3 h-3 text-destructive shrink-0" />
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
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/game')}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Назад
            </button>
            <div className="w-px h-5 bg-border" />
            <Scale className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Расследование</span>
          </div>
          <span className="text-xs font-mono text-muted-foreground">
            Вопрос {currentQ + 1}/{questions.length}
          </span>
        </div>
      </header>

      {/* Progress */}
      <div className="max-w-3xl mx-auto w-full px-4 pt-6">
        <div className="h-1 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQ + (showExplanation ? 1 : 0)) / questions.length) * 100}%` }}
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
                      {currentQ < questions.length - 1 ? 'Следующий вопрос →' : 'Завершить расследование'}
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
