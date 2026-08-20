import React, { useState } from 'react';
import { Sparkles, Volume2, VolumeX, Palette, Info, Flame, Smartphone, Monitor } from 'lucide-react';
import { AppTheme, ScreenId, UserStats } from '../types';
import { APP_THEMES } from '../data/initialData';
import { soundFx } from '../utils/audio';

interface TopBarProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  stats: UserStats;
  currentTheme: AppTheme;
  onSelectTheme: (theme: AppTheme) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isDeviceFrame: boolean;
  onToggleDeviceFrame: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentScreen,
  onNavigate,
  stats,
  currentTheme,
  onSelectTheme,
  soundEnabled,
  onToggleSound,
  isDeviceFrame,
  onToggleDeviceFrame
}) => {
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-3 shadow-xs">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Logo & Brand */}
        <button
          onClick={() => {
            soundFx.playPop();
            onNavigate('home');
          }}
          className="flex items-center gap-2.5 text-left group transition-transform active:scale-95"
          id="btn-logo-home"
        >
          <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${currentTheme.primary} flex items-center justify-center text-white shadow-sm shadow-indigo-500/20 group-hover:scale-105 transition-transform`}>
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-slate-800">
                StudyMate
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                Companion
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              Student Study Assistant
            </p>
          </div>
        </button>

        {/* Right Action Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Streak Indicator */}
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-bold shadow-2xs"
            title={`${stats.currentStreak} day study streak!`}
            id="badge-study-streak"
          >
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-bounce" />
            <span>{stats.currentStreak}d</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              onToggleSound();
              soundFx.playPop();
            }}
            className={`p-2 rounded-xl transition-all ${
              soundEnabled
                ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                : 'text-slate-400 bg-slate-100/80'
            }`}
            title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            id="btn-toggle-sound"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Theme Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                soundFx.playPop();
                setShowThemeMenu(!showThemeMenu);
              }}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              title="Change Color Theme"
              id="btn-theme-picker"
            >
              <Palette className="w-4 h-4 text-indigo-600" />
            </button>

            {showThemeMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowThemeMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 px-2 py-1">
                    Student Themes
                  </p>
                  <div className="space-y-1 mt-1">
                    {APP_THEMES.map(theme => {
                      const isActive = theme.id === currentTheme.id;
                      return (
                        <button
                          key={theme.id}
                          onClick={() => {
                            onSelectTheme(theme);
                            setShowThemeMenu(false);
                            soundFx.playSuccess();
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                            isActive
                              ? 'bg-slate-100 text-slate-900 shadow-2xs font-bold'
                              : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-3.5 h-3.5 rounded-full bg-gradient-to-r ${theme.primary} shadow-xs`}
                            />
                            <span>{theme.name}</span>
                          </div>
                          {isActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Device Frame View Toggle (Mobile mockup vs Full screen) */}
          <button
            onClick={() => {
              onToggleDeviceFrame();
              soundFx.playPop();
            }}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors border border-slate-200/70"
            title={isDeviceFrame ? 'Switch to Fullscreen Responsive View' : 'Switch to Phone Mockup View'}
            id="btn-toggle-device-view"
          >
            {isDeviceFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-indigo-600" />
                <span className="text-[11px]">Wide</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
                <span className="text-[11px]">Mobile</span>
              </>
            )}
          </button>

          {/* About Screen Button */}
          <button
            onClick={() => {
              soundFx.playPop();
              onNavigate('about');
            }}
            className={`p-2 rounded-xl transition-colors ${
              currentScreen === 'about'
                ? 'bg-indigo-50 text-indigo-600 font-bold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
            title="About StudyMate"
            id="btn-nav-about"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
