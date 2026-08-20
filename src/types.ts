export type ScreenId = 'home' | 'subjects' | 'notes' | 'quiz' | 'timer' | 'about';

export type SubjectCategory = 'All' | 'STEM' | 'Computing' | 'Humanities' | 'Languages' | 'Life Sciences';

export interface SubjectTopic {
  title: string;
  summary: string;
  keyPoints: string[];
  formulaOrExample?: string;
}

export interface Subject {
  id: string;
  name: string;
  category: SubjectCategory;
  description: string;
  color: string;
  gradient: string;
  bgLight: string;
  borderColor: string;
  iconName: string;
  topicsCount: number;
  topics: SubjectTopic[];
  studyTips: string[];
}

export interface Note {
  id: string;
  title: string;
  content: string;
  subjectId: string;
  colorTag: string; // hex or color token
  isPinned: boolean;
  createdAt: number;
  updatedAt: number;
  tags: string[];
  checklist?: { id: string; text: string; done: boolean }[];
}

export type QuestionType = 'multiple-choice' | 'identification' | 'solving' | 'numeration';

export interface QuizQuestion {
  id: string;
  subjectId: string;
  type: QuestionType;
  question: string;
  options?: string[]; // for multiple choice
  correctAnswer: string | string[]; // string or array for numeration/alternatives
  explanation: string;
  hint?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuizAnswerRecord {
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
  question: string;
  correctAnswer: string;
  explanation: string;
}

export interface QuizHistoryEntry {
  id: string;
  date: number;
  subjectId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  timeSpentSeconds: number;
  mode: string;
}

export type TimerMode = 'pomodoro' | 'short-break' | 'long-break' | 'custom' | 'stopwatch';

export interface StudySession {
  id: string;
  timestamp: number;
  durationMinutes: number;
  subjectId: string;
  mode: TimerMode;
  notes?: string;
}

export interface AppTheme {
  id: string;
  name: string;
  primary: string; // e.g. from-indigo-600 to-violet-600
  accent: string;
  badge: string;
  bgGlow: string;
}

export interface UserStats {
  totalStudyMinutes: number;
  quizzesCompleted: number;
  notesCreated: number;
  currentStreak: number;
  lastActiveDate: string;
}
