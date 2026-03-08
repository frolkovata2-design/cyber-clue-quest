import directorsOffice from '@/assets/scenes/directors-office.jpg';
import hrDepartment from '@/assets/scenes/hr-department.jpg';
import serverRoom from '@/assets/scenes/server-room.jpg';
import meetingRoom from '@/assets/scenes/meeting-room.jpg';
import boardroom from '@/assets/scenes/boardroom.jpg';

export const MODULES = [
  {
    id: 'module_1',
    title: 'Операция: Цифровой След',
    description: 'Расследование утечки персональных данных из крупной компании. Найдите виновных и предотвратите катастрофу.',
    estimatedTime: 60,
    difficulty: 'Средняя' as const,
    chapters: 5,
    totalEvidence: 10,
    status: 'available' as const,
  },
  {
    id: 'module_2',
    title: 'Тень в сети',
    description: 'Атака на инфраструктуру и похищение клиентской базы. Восстановите цепочку событий.',
    estimatedTime: 45,
    difficulty: 'Высокая' as const,
    chapters: 4,
    totalEvidence: 8,
    status: 'locked' as const,
  },
  {
    id: 'module_3',
    title: 'Протокол «Феникс»',
    description: 'Внутренний саботаж и нарушение процедуры обработки ПД. Разоблачите инсайдера.',
    estimatedTime: 50,
    difficulty: 'Высокая' as const,
    chapters: 5,
    totalEvidence: 12,
    status: 'locked' as const,
  },
];

export const SCENE_IMAGES: Record<string, string> = {
  directors_office: directorsOffice,
  hr_department: hrDepartment,
  server_room: serverRoom,
  meeting_room: meetingRoom,
  boardroom: boardroom,
};

export const CHAPTERS = [
  {
    id: 'ch_1',
    moduleId: 'module_1',
    title: 'Точка входа',
    location: 'Кабинет директора',
    locationKey: 'directors_office',
    type: 'narrative' as const,
    description: 'Утро понедельника. Вы получаете срочный вызов от генерального директора компании «НоваТех».',
    hotspots: [
      { id: 'hs_1', evidenceId: 'ev_001', x: 28, y: 58, radius: 40, label: 'Документы на столе', hint: 'Подозрительные документы' },
      { id: 'hs_2', evidenceId: 'ev_003', x: 72, y: 38, radius: 35, label: 'Экран ноутбука', hint: 'Открытое письмо на экране' },
    ],
  },
  {
    id: 'ch_2',
    moduleId: 'module_1',
    title: 'Люди в системе',
    location: 'Отдел кадров',
    locationKey: 'hr_department',
    type: 'dialogue' as const,
    description: 'Вам нужно опросить ключевых сотрудников и выяснить, кто имел доступ к данным.',
    hotspots: [
      { id: 'hs_3', evidenceId: 'ev_005', x: 52, y: 50, radius: 35, label: 'Стикеры на мониторе', hint: 'Записки на мониторе' },
      { id: 'hs_4', evidenceId: 'ev_006', x: 22, y: 55, radius: 35, label: 'Документы на столе', hint: 'Личное дело сотрудника' },
    ],
  },
  {
    id: 'ch_3',
    moduleId: 'module_1',
    title: 'Цифровые следы',
    location: 'Серверная комната',
    locationKey: 'server_room',
    type: 'evidence' as const,
    description: 'Изучите серверные логи и найдите аномалии в системе доступа.',
    hotspots: [
      { id: 'hs_5', evidenceId: 'ev_002', x: 82, y: 50, radius: 40, label: 'Монитор с логами', hint: 'Серверные логи на экране' },
      { id: 'hs_6', evidenceId: 'ev_004', x: 88, y: 72, radius: 30, label: 'Стикер с паролями', hint: 'Что-то приклеено к монитору' },
    ],
  },
  {
    id: 'ch_4',
    moduleId: 'module_1',
    title: 'Допрос',
    location: 'Переговорная',
    locationKey: 'meeting_room',
    type: 'dialogue' as const,
    description: 'Время для решающего разговора с главным подозреваемым.',
    hotspots: [
      { id: 'hs_7', evidenceId: 'ev_007', x: 42, y: 68, radius: 35, label: 'Документы на столе', hint: 'Разбросанные бумаги' },
      { id: 'hs_8', evidenceId: 'ev_008', x: 50, y: 30, radius: 35, label: 'Доска с диаграммами', hint: 'Схема доступа к данным' },
    ],
  },
  {
    id: 'ch_5',
    moduleId: 'module_1',
    title: 'Финальное решение',
    location: 'Зал совещаний',
    locationKey: 'boardroom',
    type: 'narrative' as const,
    description: 'Представьте результаты расследования и примите окончательное решение.',
    hotspots: [
      { id: 'hs_9', evidenceId: 'ev_009', x: 50, y: 55, radius: 40, label: 'Папка с отчётом', hint: 'Итоговый отчёт аудита' },
      { id: 'hs_10', evidenceId: 'ev_010', x: 30, y: 65, radius: 35, label: 'Документы на столе', hint: 'Политика конфиденциальности' },
    ],
  },
];

export const SAMPLE_DIALOGUE = [
  {
    id: 'line_1',
    speaker: 'character' as const,
    characterName: 'Директор Петров',
    emotion: 'nervous' as const,
    text: 'Спасибо, что приехали так быстро. У нас серьёзная проблема — данные 50 000 клиентов оказались в открытом доступе.',
  },
  {
    id: 'line_2',
    speaker: 'character' as const,
    characterName: 'Директор Петров',
    emotion: 'nervous' as const,
    text: 'Мы обнаружили утечку сегодня утром. Служба безопасности пока не нашла источник.',
  },
  {
    id: 'line_3',
    speaker: 'player' as const,
    characterName: 'Вы',
    emotion: 'neutral' as const,
    text: '',
    choices: [
      { id: 'c1', label: 'Когда именно произошла утечка?', next: 'line_4a' },
      { id: 'c2', label: 'Кто имеет доступ к базе клиентов?', next: 'line_4b' },
      { id: 'c3', label: 'Уведомили ли вы Роскомнадзор?', next: 'line_4c' },
    ],
  },
  {
    id: 'line_4a',
    speaker: 'character' as const,
    characterName: 'Директор Петров',
    emotion: 'nervous' as const,
    text: 'По логам — в ночь с пятницы на субботу. Но заметили только сегодня утром, когда клиенты начали звонить...',
  },
  {
    id: 'line_4b',
    speaker: 'character' as const,
    characterName: 'Директор Петров',
    emotion: 'neutral' as const,
    text: 'Отдел продаж, техподдержка, HR и IT-отдел. Всего около 15 человек с различными уровнями доступа.',
  },
  {
    id: 'line_4c',
    speaker: 'character' as const,
    characterName: 'Директор Петров',
    emotion: 'nervous' as const,
    text: 'Нет, ещё нет. А нужно? У нас есть 72 часа по закону, верно?',
    evidenceUnlock: 'ev_001',
  },
];

export const SAMPLE_EVIDENCE = [
  {
    id: 'ev_001',
    title: 'Нарушение сроков уведомления',
    type: 'document' as const,
    description: 'Директор не знал о необходимости уведомить Роскомнадзор в течение 24 часов (не 72). Нарушение ст.21 152-ФЗ.',
    chapter: 1,
    connections: ['ev_003'],
    violationRef: 'Ст. 21 152-ФЗ',
    isSecret: false,
  },
  {
    id: 'ev_002',
    title: 'Серверные логи за 11.03',
    type: 'log' as const,
    description: 'Обнаружен массовый экспорт данных через API в 02:47. IP-адрес принадлежит внутренней сети.',
    chapter: 3,
    connections: ['ev_001', 'ev_004'],
    violationRef: 'Ст. 19 152-ФЗ',
    isSecret: false,
  },
  {
    id: 'ev_003',
    title: 'Письмо от неизвестного',
    type: 'email' as const,
    description: 'Анонимное письмо с угрозой публикации данных. Отправлено с временного почтового сервиса.',
    chapter: 1,
    connections: ['ev_001'],
    violationRef: undefined,
    isSecret: false,
  },
  {
    id: 'ev_004',
    title: 'Стикер с паролями',
    type: 'file' as const,
    description: 'На мониторе сотрудника Зотова обнаружен стикер с паролями от API и базы данных.',
    chapter: 3,
    connections: ['ev_002'],
    violationRef: 'Ст. 19 152-ФЗ',
    isSecret: true,
  },
  {
    id: 'ev_005',
    title: 'Список доступов сотрудников',
    type: 'document' as const,
    description: 'Таблица с правами доступа: 5 сотрудников имели полный доступ к клиентской базе без ограничений.',
    chapter: 2,
    connections: ['ev_002', 'ev_006'],
    violationRef: 'Ст. 18.1 152-ФЗ',
    isSecret: false,
  },
  {
    id: 'ev_006',
    title: 'Личное дело Зотова И.П.',
    type: 'document' as const,
    description: 'Сотрудник Зотов получил административный доступ 2 месяца назад. Согласия на обработку ПД в деле нет.',
    chapter: 2,
    connections: ['ev_004', 'ev_005'],
    violationRef: 'Ст. 9 152-ФЗ',
    isSecret: false,
  },
  {
    id: 'ev_007',
    title: 'Показания Зотова',
    type: 'testimony' as const,
    description: '«Я работал из дома в ночь на субботу. Проверял отчёты. Пароль? Он у всех на виду.»',
    chapter: 4,
    connections: ['ev_004', 'ev_002'],
    violationRef: undefined,
    isSecret: false,
  },
  {
    id: 'ev_008',
    title: 'Схема архитектуры доступа',
    type: 'file' as const,
    description: 'На доске нарисована схема: API-шлюз не имеет ограничения по количеству запросов (rate limiting).',
    chapter: 4,
    connections: ['ev_002'],
    violationRef: 'Ст. 19 152-ФЗ',
    isSecret: false,
  },
  {
    id: 'ev_009',
    title: 'Отчёт внешнего аудита',
    type: 'document' as const,
    description: 'Аудиторы предупреждали о рисках 3 месяца назад. Рекомендации по шифрованию были проигнорированы.',
    chapter: 5,
    connections: ['ev_001', 'ev_008'],
    violationRef: 'Ст. 19 152-ФЗ',
    isSecret: true,
  },
  {
    id: 'ev_010',
    title: 'Устаревшая политика конфиденциальности',
    type: 'document' as const,
    description: 'Политика конфиденциальности не обновлялась 2 года. Не содержит информации о трансграничной передаче ПД.',
    chapter: 5,
    connections: ['ev_001', 'ev_006'],
    violationRef: 'Ст. 18.1 152-ФЗ',
    isSecret: false,
  },
];

// Easter eggs - fun hidden discoveries in each scene
export const EASTER_EGGS: Record<string, Array<{ id: string; x: number; y: number; emoji: string; text: string }>> = {
  directors_office: [
    { id: 'ee_1', x: 15, y: 25, emoji: '🐱', text: 'Под столом спит офисный кот Баг!' },
    { id: 'ee_2', x: 85, y: 70, emoji: '🎮', text: 'Директор прячет геймпад в ящике…' },
  ],
  hr_department: [
    { id: 'ee_3', x: 80, y: 30, emoji: '🌵', text: 'Кактус с именем «Роскомнадзор»' },
    { id: 'ee_4', x: 10, y: 75, emoji: '☕', text: 'Кружка «Я ♥ 152-ФЗ» — мечта HR-а' },
  ],
  server_room: [
    { id: 'ee_5', x: 35, y: 25, emoji: '🕷️', text: 'Паутина на старом сервере… буквально web-сервер' },
    { id: 'ee_6', x: 60, y: 80, emoji: '🍕', text: 'Коробка от пиццы. Кто-то тут ночевал…' },
  ],
  meeting_room: [
    { id: 'ee_7', x: 75, y: 20, emoji: '📌', text: 'На доске: «P@ssw0rd — НЕ ИСПОЛЬЗОВАТЬ!!!»' },
    { id: 'ee_8', x: 15, y: 40, emoji: '🧸', text: 'Чей-то плюшевый антистресс-медведь' },
  ],
  boardroom: [
    { id: 'ee_9', x: 70, y: 35, emoji: '🖼️', text: 'На картине: «Мы не храним куки... или храним?»' },
    { id: 'ee_10', x: 20, y: 80, emoji: '📎', text: 'Скрепыш: «Похоже, вам нужна помощь с ПД!»' },
  ],
};

// Evidence matching data: pair evidence to conclusions
export const EVIDENCE_MATCHES = [
  {
    id: 'match_1',
    conclusion: 'Утечка произошла через внутренний API без ограничений',
    correctEvidence: ['ev_002', 'ev_008'],
    hint: 'Какие улики указывают на метод утечки?',
  },
  {
    id: 'match_2',
    conclusion: 'Виновник — сотрудник с небезопасным хранением паролей',
    correctEvidence: ['ev_004', 'ev_007'],
    hint: 'Кто допустил утечку учётных данных?',
  },
  {
    id: 'match_3',
    conclusion: 'Руководство знало о рисках, но не приняло мер',
    correctEvidence: ['ev_009', 'ev_001'],
    hint: 'Какие улики говорят о системной халатности?',
  },
  {
    id: 'match_4',
    conclusion: 'Нарушен принцип минимизации доступа к ПД',
    correctEvidence: ['ev_005', 'ev_006'],
    hint: 'Какие документы указывают на избыточный доступ?',
  },
];
