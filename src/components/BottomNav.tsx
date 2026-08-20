import React from 'react';
import { Home, BookOpen, FileText, HelpCircle, Clock } from 'lucide-react';
import { ScreenId, AppTheme } from '../types';
import { soundFx } from '../utils/audio';

interface BottomNavProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  currentTheme: AppTheme;
  notesCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentScreen,
  onNavigate,
  currentTheme,
  notesCount
}) => {
  const navItems = [
    { id: 'home' as ScreenId, label: 'Home', icon: Home },
    { id: 'subjects' as ScreenId, label: 'Subjects', icon: BookOpen },
    { id: 'notes' as ScreenId, label: 'Notes', icon: FileText, badge: notesCount },
    { id: 'quiz' as ScreenId, label: 'Quiz', icon: HelpCircle },
    { id: 'timer' as ScreenId, label: 'Timer', icon: Clock }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 px-2 py-1.5 shadow-lg max-w-4xl mx-auto md:rounded-t-2xl">
      <div className="flex items-center justify-around">
        {navItems.map(item => {
          const isActive = currentScreen === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                soundFx.playPop();
                onNavigate(item.id);
              }}
              className="relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 group flex-1 max-w-[80px]"
              id={`nav-item-${item.id}`}
            >
              {/* Active Pill Indicator */}
              <div
                className={`relative px-4 py-1 rounded-full transition-all duration-200 flex items-center justify-center ${
                  isActive
                    ? `bg-gradient-to-r ${currentTheme.primary} text-white shadow-sm shadow-indigo-500/20 scale-105`
                    : 'text-slate-500 group-hover:text-slate-800 group-hover:bg-slate-100/70'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-105 stroke-[2.5]' : 'stroke-[1.75]'}`} />
                {item.badge !== undefined && item.badge > 0 && !isActive && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center shadow-xs">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[11px] mt-1 font-semibold tracking-tight transition-colors ${
                  isActive ? 'text-slate-900 font-bold' : 'text-slate-500 group-hover:text-slate-700'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
