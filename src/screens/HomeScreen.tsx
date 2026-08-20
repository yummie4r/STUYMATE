import React, { useState } from 'react';
import { 
  BookOpen, 
  FileText, 
  HelpCircle, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  Flame, 
  Trophy, 
  CheckCircle2, 
  RefreshCw, 
  Play, 
  Plus, 
  Bookmark, 
  TrendingUp, 
  Quote
} from 'lucide-react';
import { ScreenId, AppTheme, UserStats, Subject, Note } from '../types';
import { MOTIVATIONAL_QUOTES } from '../data/initialData';
import { soundFx } from '../utils/audio';

interface HomeScreenProps {
  onNavigate: (screen: ScreenId, extra?: string) => void;
  stats: UserStats;
  currentTheme: AppTheme;
  subjects: Subject[];
  notes: Note[];
  onOpenSubject: (subjectId: string) => void;
  onQuickStartTimer: (minutes: number) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  stats,
  currentTheme,
  subjects,
  notes,
  onOpenSubject,
  onQuickStartTimer
}) => {
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Time-of-day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const nextQuote = () => {
    soundFx.playPop();
    setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
  };

  const currentQuote = MOTIVATIONAL_QUOTES[quoteIndex];
  const recentNotes = notes.slice(0, 3);

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">
      {/* Hero Welcome Banner */}
      <section className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${currentTheme.primary} p-6 sm:p-7 text-white shadow-xl shadow-indigo-500/15`}>
        {/* Background ambient elements */}
        <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-2 right-6 opacity-20 pointer-events-none">
          <Sparkles className="w-24 h-24" />
        </div>

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-white/95">
            <Flame className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            <span>{stats.currentStreak} Day Study Streak Active!</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
            {getGreeting()}, Student! 👋
          </h1>
          <p className="text-sm sm:text-base text-white/85 max-w-lg leading-relaxed font-medium">
            Welcome to <strong className="text-white font-bold">StudyMate</strong>. Organize your subjects, manage your notes, test your knowledge, and focus with your study timer.
          </p>

          {/* Quick Action Button within Hero */}
          <div className="pt-2 flex flex-wrap gap-2.5">
            <button
              onClick={() => {
                soundFx.playPop();
                onQuickStartTimer(25);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-slate-900 font-bold text-xs sm:text-sm shadow-md hover:bg-slate-50 active:scale-95 transition-all"
              id="btn-hero-quick-pomodoro"
            >
              <Play className="w-4 h-4 text-indigo-600 fill-indigo-600" />
              <span>Start 25m Pomodoro</span>
            </button>
            <button
              onClick={() => {
                soundFx.playPop();
                onNavigate('quiz');
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold text-xs sm:text-sm active:scale-95 transition-all"
              id="btn-hero-quick-quiz"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Quick Quiz Test</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Feature Cards Grid */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base sm:text-lg font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <span>Study Hub</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">Select a tool to begin</span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {/* Card 1: Subjects */}
          <button
            onClick={() => {
              soundFx.playPop();
              onNavigate('subjects');
            }}
            className="group relative flex flex-col justify-between p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50/70 border border-blue-200/80 hover:border-blue-400 text-left transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]"
            id="card-hub-subjects"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25 group-hover:scale-110 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900 leading-tight">
                  Subjects
                </h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                  Math, Physics, Calculus, Biology, CS & more
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs font-bold text-blue-700">
              <span>{subjects.length} Subjects</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Card 2: Notes */}
          <button
            onClick={() => {
              soundFx.playPop();
              onNavigate('notes');
            }}
            className="group relative flex flex-col justify-between p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50/70 border border-emerald-200/80 hover:border-emerald-400 text-left transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]"
            id="card-hub-notes"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/25 group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900 leading-tight">
                  Study Notes
                </h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                  Organize, write & review saved study materials
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs font-bold text-emerald-700">
              <span>{notes.length} Notes Saved</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Card 3: Quiz */}
          <button
            onClick={() => {
              soundFx.playPop();
              onNavigate('quiz');
            }}
            className="group relative flex flex-col justify-between p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50/70 border border-amber-200/80 hover:border-amber-400 text-left transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]"
            id="card-hub-quiz"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-md shadow-amber-500/25 group-hover:scale-110 transition-transform">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900 leading-tight">
                  Quiz & Tests
                </h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                  Multiple choice, numeration, solving & ID
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs font-bold text-amber-800">
              <span>Test Knowledge</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Card 4: Study Timer */}
          <button
            onClick={() => {
              soundFx.playPop();
              onNavigate('timer');
            }}
            className="group relative flex flex-col justify-between p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50/70 border border-purple-200/80 hover:border-purple-400 text-left transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]"
            id="card-hub-timer"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-500/25 group-hover:scale-110 transition-transform">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900 leading-tight">
                  Study Timer
                </h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                  Pomodoro focus timer & ambient sounds
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs font-bold text-purple-700">
              <span>Focus Mode</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </section>

      {/* Motivational Daily Quote Card */}
      <section className="relative overflow-hidden rounded-2xl bg-slate-900 text-white p-4 sm:p-5 shadow-md">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-white/10 text-amber-300">
              <Quote className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase font-bold tracking-wider text-amber-400">
                Daily Motivation
              </p>
              <p className="text-sm font-medium italic text-slate-100">
                "{currentQuote.text}"
              </p>
              <p className="text-xs text-slate-400 font-semibold">
                — {currentQuote.author}
              </p>
            </div>
          </div>
          <button
            onClick={nextQuote}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Next quote"
            id="btn-refresh-quote"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Quick Study Stats Summary */}
      <section className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">
              Your Learning Stats
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">Stored Locally</span>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100">
            <p className="text-lg sm:text-xl font-black text-indigo-700">
              {stats.totalStudyMinutes}m
            </p>
            <p className="text-[11px] font-medium text-slate-600 mt-0.5">
              Focus Time
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-100">
            <p className="text-lg sm:text-xl font-black text-amber-700">
              {stats.currentStreak}d
            </p>
            <p className="text-[11px] font-medium text-slate-600 mt-0.5">
              Streak
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100">
            <p className="text-lg sm:text-xl font-black text-emerald-700">
              {stats.quizzesCompleted}
            </p>
            <p className="text-[11px] font-medium text-slate-600 mt-0.5">
              Quizzes
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-purple-50/70 border border-purple-100">
            <p className="text-lg sm:text-xl font-black text-purple-700">
              {notes.length}
            </p>
            <p className="text-[11px] font-medium text-slate-600 mt-0.5">
              Notes
            </p>
          </div>
        </div>
      </section>

      {/* Quick Subject Quick-Access Cards */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base font-bold text-slate-900">
            Popular Subjects
          </h2>
          <button
            onClick={() => {
              soundFx.playPop();
              onNavigate('subjects');
            }}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <span>See all {subjects.length}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {subjects.slice(0, 4).map(sub => (
            <button
              key={sub.id}
              onClick={() => {
                soundFx.playPop();
                onOpenSubject(sub.id);
              }}
              className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm text-left transition-all group"
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold mb-2 shadow-xs"
                style={{ backgroundColor: sub.color }}
              >
                {sub.name.slice(0, 2).toUpperCase()}
              </div>
              <p className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                {sub.name}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {sub.topics.length} topics
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Recent Notes Preview */}
      {recentNotes.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-base font-bold text-slate-900">
              Recent Notes
            </h2>
            <button
              onClick={() => {
                soundFx.playPop();
                onNavigate('notes');
              }}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <span>Manage Notes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {recentNotes.map(note => (
              <div
                key={note.id}
                onClick={() => {
                  soundFx.playPop();
                  onNavigate('notes');
                }}
                className="p-3.5 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 hover:shadow-xs cursor-pointer transition-all flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div
                    className="w-2.5 h-10 rounded-full shrink-0"
                    style={{ backgroundColor: note.colorTag }}
                  />
                  <div className="overflow-hidden">
                    <p className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                      {note.title}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {note.content.replace(/[#*`\n]/g, ' ').slice(0, 60)}...
                    </p>
                  </div>
                </div>
                <Bookmark className="w-4 h-4 text-slate-400 shrink-0" />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
