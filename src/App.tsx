import React, { useState, useEffect } from 'react';
import { ScreenId, Subject, Note, QuizHistoryEntry, StudySession, UserStats, AppTheme } from './types';
import { APP_THEMES } from './data/initialData';
import { 
  getStoredNotes, 
  saveStoredNotes, 
  getStoredSubjects, 
  saveStoredSubjects, 
  getStoredQuizHistory, 
  saveQuizResult, 
  getStoredSessions, 
  saveStudySession, 
  getStoredUserStats, 
  saveStoredUserStats, 
  getStoredThemeId, 
  saveStoredThemeId 
} from './utils/storage';
import { soundFx } from './utils/audio';
import { TopBar } from './components/TopBar';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './screens/HomeScreen';
import { SubjectsScreen } from './screens/SubjectsScreen';
import { NotesScreen } from './screens/NotesScreen';
import { QuizScreen } from './screens/QuizScreen';
import { TimerScreen } from './screens/TimerScreen';
import { AboutScreen } from './screens/AboutScreen';
import { Wifi, Battery, Signal } from 'lucide-react';

export default function App() {
  // Navigation State
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('home');
  const [filterSubjectId, setFilterSubjectId] = useState<string | null>(null);
  const [timerQuickMinutes, setTimerQuickMinutes] = useState<number | null>(null);

  // Persistence State
  const [subjects, setSubjects] = useState<Subject[]>(getStoredSubjects);
  const [notes, setNotes] = useState<Note[]>(getStoredNotes);
  const [quizHistory, setQuizHistory] = useState<QuizHistoryEntry[]>(getStoredQuizHistory);
  const [studySessions, setStudySessions] = useState<StudySession[]>(getStoredSessions);
  const [userStats, setUserStats] = useState<UserStats>(getStoredUserStats);
  
  // Theme & Settings
  const [themeId, setThemeId] = useState<string>(getStoredThemeId);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isDeviceFrame, setIsDeviceFrame] = useState<boolean>(false);

  const currentTheme: AppTheme = 
    APP_THEMES.find(t => t.id === themeId) || APP_THEMES[0];

  // Sync state to local storage
  useEffect(() => {
    saveStoredNotes(notes);
  }, [notes]);

  useEffect(() => {
    saveStoredSubjects(subjects);
  }, [subjects]);

  const handleSelectTheme = (theme: AppTheme) => {
    setThemeId(theme.id);
    saveStoredThemeId(theme.id);
  };

  const handleToggleSound = () => {
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    soundFx.soundEnabled = nextVal;
  };

  const handleNavigate = (screen: ScreenId, extraSubjectId?: string) => {
    if (extraSubjectId) {
      setFilterSubjectId(extraSubjectId);
    } else {
      setFilterSubjectId(null);
    }
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Notes operations
  const handleSaveNote = (savedNote: Note) => {
    setNotes(prev => {
      const exists = prev.some(n => n.id === savedNote.id);
      if (exists) {
        return prev.map(n => n.id === savedNote.id ? savedNote : n);
      } else {
        const updated = [savedNote, ...prev];
        // update stats
        setUserStats(s => {
          const newStats = { ...s, notesCreated: updated.length };
          saveStoredUserStats(newStats);
          return newStats;
        });
        return updated;
      }
    });
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(n => n.id !== noteId));
  };

  const handleTogglePin = (noteId: string) => {
    setNotes(prev => prev.map(n => n.id === noteId ? { ...n, isPinned: !n.isPinned } : n));
  };

  // Subject operations
  const handleAddSubject = (newSubject: Subject) => {
    setSubjects(prev => [newSubject, ...prev]);
  };

  // Quiz operations
  const handleSaveQuizResult = (entry: QuizHistoryEntry) => {
    saveQuizResult(entry);
    setQuizHistory(getStoredQuizHistory());
    setUserStats(getStoredUserStats());
  };

  // Timer operations
  const handleSaveSession = (session: StudySession) => {
    saveStudySession(session);
    setStudySessions(getStoredSessions());
    setUserStats(getStoredUserStats());
  };

  const handleQuickStartTimer = (minutes: number) => {
    setTimerQuickMinutes(minutes);
    setCurrentScreen('timer');
  };

  const handleOpenSubjectFromHome = (subjectId: string) => {
    setFilterSubjectId(subjectId);
    setCurrentScreen('subjects');
  };

  // Render current active screen
  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <HomeScreen
            onNavigate={handleNavigate}
            stats={userStats}
            currentTheme={currentTheme}
            subjects={subjects}
            notes={notes}
            onOpenSubject={handleOpenSubjectFromHome}
            onQuickStartTimer={handleQuickStartTimer}
          />
        );
      case 'subjects':
        return (
          <SubjectsScreen
            subjects={subjects}
            onAddSubject={handleAddSubject}
            onNavigate={handleNavigate}
            initialSelectedSubjectId={filterSubjectId}
          />
        );
      case 'notes':
        return (
          <NotesScreen
            notes={notes}
            subjects={subjects}
            onSaveNote={handleSaveNote}
            onDeleteNote={handleDeleteNote}
            onTogglePin={handleTogglePin}
            filterSubjectId={filterSubjectId}
            onNavigate={handleNavigate}
          />
        );
      case 'quiz':
        return (
          <QuizScreen
            subjects={subjects}
            onSaveQuizResult={handleSaveQuizResult}
            quizHistory={quizHistory}
            initialSubjectFilter={filterSubjectId}
            onNavigate={handleNavigate}
          />
        );
      case 'timer':
        return (
          <TimerScreen
            subjects={subjects}
            onSaveSession={handleSaveSession}
            sessions={studySessions}
            quickStartMinutes={timerQuickMinutes}
          />
        );
      case 'about':
        return <AboutScreen onNavigate={handleNavigate} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col items-center justify-start p-0 sm:p-4 selection:bg-indigo-500 selection:text-white font-sans antialiased">
      {/* Container - switches between full width responsive and Phone Mockup View */}
      <div
        className={`w-full bg-slate-50 transition-all duration-300 relative flex flex-col ${
          isDeviceFrame
            ? 'max-w-[420px] my-4 rounded-[42px] shadow-2xl border-[10px] border-slate-900 overflow-hidden min-h-[820px] ring-1 ring-slate-900/10'
            : 'max-w-3xl min-h-screen sm:min-h-[92vh] sm:my-3 sm:rounded-3xl sm:border sm:border-slate-200/80 sm:shadow-lg overflow-hidden'
        }`}
      >
        {/* Mobile Phone Status Bar Simulation (when in device frame mode) */}
        {isDeviceFrame && (
          <div className="bg-white px-6 pt-3 pb-1 flex items-center justify-between text-xs text-slate-800 font-semibold border-b border-slate-50 select-none">
            <span>9:41</span>
            <div className="w-20 h-4 bg-slate-900 rounded-full mx-auto" />
            <div className="flex items-center gap-1.5 text-slate-700">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>
        )}

        {/* Top App Bar */}
        <TopBar
          currentScreen={currentScreen}
          onNavigate={handleNavigate}
          stats={userStats}
          currentTheme={currentTheme}
          onSelectTheme={handleSelectTheme}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          isDeviceFrame={isDeviceFrame}
          onToggleDeviceFrame={() => setIsDeviceFrame(!isDeviceFrame)}
        />

        {/* Main Content Area */}
        <main className="flex-1 px-4 sm:px-6 pt-4 max-w-4xl w-full mx-auto">
          {renderScreen()}
        </main>

        {/* Bottom Navigation */}
        <BottomNav
          currentScreen={currentScreen}
          onNavigate={handleNavigate}
          currentTheme={currentTheme}
          notesCount={notes.length}
        />
      </div>
    </div>
  );
}
