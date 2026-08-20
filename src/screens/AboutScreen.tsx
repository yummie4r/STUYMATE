import React from 'react';
import { 
  Sparkles, 
  BookOpen, 
  FileText, 
  HelpCircle, 
  Clock, 
  ShieldCheck, 
  HardDrive, 
  GraduationCap, 
  Lightbulb, 
  Heart, 
  Zap, 
  Smartphone,
  ArrowRight
} from 'lucide-react';
import { ScreenId } from '../types';
import { soundFx } from '../utils/audio';

interface AboutScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const AboutScreen: React.FC<AboutScreenProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      {/* Hero Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-violet-950 text-white shadow-xl space-y-4 text-center">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-500 to-violet-500 text-white mx-auto flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <Sparkles className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            About StudyMate
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200 max-w-md mx-auto leading-relaxed">
            Your all-in-one, lightweight, and modern student study companion built to make learning organized, interactive, and fun.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-white/90">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>100% Offline & Private • No Account Required</span>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="space-y-3">
        <h2 className="text-base font-extrabold text-slate-900">
          What’s Inside StudyMate
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Subjects */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 space-y-2">
            <div className="flex items-center gap-2 text-blue-600 font-extrabold text-sm">
              <BookOpen className="w-4 h-4" />
              <span>Subjects & Cheat Sheets</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Curated guides for Mathematics, Calculus, Physics, Biology, CS, Chemistry, English, and History with core formulas and definitions.
            </p>
          </div>

          {/* Notes */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 font-extrabold text-sm">
              <FileText className="w-4 h-4" />
              <span>Local Study Notes & Checklists</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Create, edit, pin, and tag custom study notes and checklists. Everything is stored directly in your browser or phone storage.
            </p>
          </div>

          {/* Quizzes */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 space-y-2">
            <div className="flex items-center gap-2 text-amber-600 font-extrabold text-sm">
              <HelpCircle className="w-4 h-4" />
              <span>Interactive Quizzes & Practice</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Test your knowledge with multiple-choice, identification, numeration, and problem-solving exercises with immediate explanations.
            </p>
          </div>

          {/* Timer */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 space-y-2">
            <div className="flex items-center gap-2 text-purple-600 font-extrabold text-sm">
              <Clock className="w-4 h-4" />
              <span>Pomodoro Study Timer & Ambience</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Improve focus with customizable interval timers and browser-synthesized ambient sounds (rain, lo-fi drone, and white noise).
            </p>
          </div>
        </div>
      </div>

      {/* Scientific Learning Principles */}
      <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200/90 space-y-3">
        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-indigo-600" />
          <span>Evidence-Based Study Techniques</span>
        </h3>

        <div className="space-y-2 text-xs text-slate-700">
          <div className="p-3 bg-white rounded-xl border border-slate-100">
            <strong className="text-slate-900 font-bold">1. Active Recall:</strong> Don't just re-read notes passively. Use the Quiz screen to test your memory, forcing the brain to retrieve information.
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-100">
            <strong className="text-slate-900 font-bold">2. Pomodoro Technique:</strong> Study with high intensity for 25 minutes, then rest for 5 minutes. This prevents cognitive burnout and maintains peak alertness.
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-100">
            <strong className="text-slate-900 font-bold">3. Feynman Technique:</strong> Write concepts in your own simplified terms inside the Notes screen as if explaining to a 10-year-old.
          </div>
        </div>
      </div>

      {/* Local Storage & Privacy Notice */}
      <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-3">
        <HardDrive className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-indigo-900">
            Offline & Secure Storage
          </h4>
          <p className="text-[11px] text-indigo-950/80 leading-relaxed">
            All your notes, custom subjects, test scores, and study streak data are saved locally via your browser's persistent LocalStorage. No tracking or external servers are used.
          </p>
        </div>
      </div>

      {/* Back to Home Action */}
      <div className="text-center pt-2">
        <button
          onClick={() => {
            soundFx.playPop();
            onNavigate('home');
          }}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm"
        >
          <span>Return to Home Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
