import { Note, Subject, QuizHistoryEntry, StudySession, UserStats } from '../types';
import { INITIAL_NOTES, INITIAL_SUBJECTS } from '../data/initialData';

const NOTES_KEY = 'studymate_notes_v1';
const SUBJECTS_KEY = 'studymate_subjects_v1';
const QUIZ_HISTORY_KEY = 'studymate_quiz_history_v1';
const STUDY_SESSIONS_KEY = 'studymate_study_sessions_v1';
const USER_STATS_KEY = 'studymate_user_stats_v1';
const THEME_KEY = 'studymate_theme_v1';

export function getStoredNotes(): Note[] {
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    if (!raw) {
      localStorage.setItem(NOTES_KEY, JSON.stringify(INITIAL_NOTES));
      return INITIAL_NOTES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_NOTES;
  }
}

export function saveStoredNotes(notes: Note[]): void {
  try {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  } catch (err) {
    console.error('Failed to save notes:', err);
  }
}

export function getStoredSubjects(): Subject[] {
  try {
    const raw = localStorage.getItem(SUBJECTS_KEY);
    if (!raw) {
      localStorage.setItem(SUBJECTS_KEY, JSON.stringify(INITIAL_SUBJECTS));
      return INITIAL_SUBJECTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_SUBJECTS;
  }
}

export function saveStoredSubjects(subjects: Subject[]): void {
  try {
    localStorage.setItem(SUBJECTS_KEY, JSON.stringify(subjects));
  } catch (err) {
    console.error('Failed to save subjects:', err);
  }
}

export function getStoredQuizHistory(): QuizHistoryEntry[] {
  try {
    const raw = localStorage.getItem(QUIZ_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveQuizResult(entry: QuizHistoryEntry): void {
  try {
    const history = getStoredQuizHistory();
    const updated = [entry, ...history].slice(0, 50); // Keep last 50
    localStorage.setItem(QUIZ_HISTORY_KEY, JSON.stringify(updated));

    // Update stats
    const stats = getStoredUserStats();
    stats.quizzesCompleted += 1;
    saveStoredUserStats(stats);
  } catch (err) {
    console.error('Failed to save quiz result:', err);
  }
}

export function getStoredSessions(): StudySession[] {
  try {
    const raw = localStorage.getItem(STUDY_SESSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStudySession(session: StudySession): void {
  try {
    const sessions = getStoredSessions();
    const updated = [session, ...sessions].slice(0, 100);
    localStorage.setItem(STUDY_SESSIONS_KEY, JSON.stringify(updated));

    // Update stats
    const stats = getStoredUserStats();
    stats.totalStudyMinutes += session.durationMinutes;
    saveStoredUserStats(stats);
  } catch (err) {
    console.error('Failed to save session:', err);
  }
}

export function getStoredUserStats(): UserStats {
  try {
    const raw = localStorage.getItem(USER_STATS_KEY);
    const todayStr = new Date().toISOString().slice(0, 10);
    if (!raw) {
      const initial: UserStats = {
        totalStudyMinutes: 75,
        quizzesCompleted: 3,
        notesCreated: INITIAL_NOTES.length,
        currentStreak: 4,
        lastActiveDate: todayStr
      };
      localStorage.setItem(USER_STATS_KEY, JSON.stringify(initial));
      return initial;
    }
    const stats: UserStats = JSON.parse(raw);
    
    // Check streak
    if (stats.lastActiveDate !== todayStr) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().slice(0, 10);

      if (stats.lastActiveDate === yesterdayStr) {
        stats.currentStreak += 1;
      } else {
        // missed a day, reset or start fresh
        stats.currentStreak = 1;
      }
      stats.lastActiveDate = todayStr;
      localStorage.setItem(USER_STATS_KEY, JSON.stringify(stats));
    }
    return stats;
  } catch {
    return {
      totalStudyMinutes: 0,
      quizzesCompleted: 0,
      notesCreated: 0,
      currentStreak: 1,
      lastActiveDate: new Date().toISOString().slice(0, 10)
    };
  }
}

export function saveStoredUserStats(stats: UserStats): void {
  try {
    localStorage.setItem(USER_STATS_KEY, JSON.stringify(stats));
  } catch (err) {
    console.error('Failed to save stats:', err);
  }
}

export function getStoredThemeId(): string {
  try {
    return localStorage.getItem(THEME_KEY) || 'indigo-violet';
  } catch {
    return 'indigo-violet';
  }
}

export function saveStoredThemeId(id: string): void {
  try {
    localStorage.setItem(THEME_KEY, id);
  } catch (err) {
    console.error('Failed to save theme:', err);
  }
}
