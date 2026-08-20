import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  Square, 
  Plus, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  CheckCircle2, 
  Coffee, 
  Flame, 
  CloudRain, 
  Headphones, 
  Waves,
  Timer as StopwatchIcon,
  BookOpen
} from 'lucide-react';
import { TimerMode, Subject, StudySession } from '../types';
import { soundFx } from '../utils/audio';

interface TimerScreenProps {
  subjects: Subject[];
  onSaveSession: (session: StudySession) => void;
  sessions: StudySession[];
  quickStartMinutes?: number | null;
}

export const TimerScreen: React.FC<TimerScreenProps> = ({
  subjects,
  onSaveSession,
  sessions,
  quickStartMinutes
}) => {
  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [totalSeconds, setTotalSeconds] = useState(quickStartMinutes ? quickStartMinutes * 60 : 25 * 60);
  const [remainingSeconds, setRemainingSeconds] = useState(quickStartMinutes ? quickStartMinutes * 60 : 25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || 'math');
  const [ambientSound, setAmbientSound] = useState<'none' | 'rain' | 'lofi' | 'whitenoise' | 'clock'>('none');
  const [completedSessionsCount, setCompletedSessionsCount] = useState(0);

  // Custom minute input
  const [customInputMins, setCustomInputMins] = useState(30);

  // Stopwatch state
  const [stopwatchSeconds, setStopwatchSeconds] = useState(0);

  const timerRef = useRef<number | null>(null);

  // Preset switch
  const selectMode = (newMode: TimerMode, durationMins: number) => {
    soundFx.playPop();
    setIsRunning(false);
    setMode(newMode);
    const secs = durationMins * 60;
    setTotalSeconds(secs);
    setRemainingSeconds(secs);
    setStopwatchSeconds(0);
  };

  // Main countdown effect
  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        if (mode === 'stopwatch') {
          setStopwatchSeconds(prev => prev + 1);
        } else {
          setRemainingSeconds(prev => {
            if (prev <= 1) {
              // Timer Complete!
              handleTimerComplete();
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    soundFx.playAlarmChime();
    setCompletedSessionsCount(prev => prev + 1);

    const studyMins = Math.max(1, Math.round(totalSeconds / 60));
    const session: StudySession = {
      id: 'session-' + Date.now(),
      timestamp: Date.now(),
      durationMinutes: studyMins,
      subjectId: selectedSubjectId,
      mode: mode
    };
    onSaveSession(session);
  };

  // Controls
  const handleStart = () => {
    soundFx.playPop();
    setIsRunning(true);
    if (ambientSound !== 'none') {
      soundFx.playAmbient(ambientSound as 'rain' | 'lofi' | 'whitenoise' | 'clock');
    }
  };

  const handlePause = () => {
    soundFx.playPop();
    setIsRunning(false);
  };

  const handleReset = () => {
    soundFx.playPop();
    setIsRunning(false);
    setRemainingSeconds(totalSeconds);
    setStopwatchSeconds(0);
  };

  const handleStop = () => {
    soundFx.playPop();
    if (isRunning && remainingSeconds < totalSeconds) {
      const elapsedMins = Math.round((totalSeconds - remainingSeconds) / 60);
      if (elapsedMins >= 1) {
        onSaveSession({
          id: 'session-' + Date.now(),
          timestamp: Date.now(),
          durationMinutes: elapsedMins,
          subjectId: selectedSubjectId,
          mode
        });
      }
    }
    setIsRunning(false);
    setRemainingSeconds(totalSeconds);
  };

  const handleAddMinutes = (mins: number) => {
    soundFx.playPop();
    const addedSecs = mins * 60;
    setTotalSeconds(prev => prev + addedSecs);
    setRemainingSeconds(prev => prev + addedSecs);
  };

  const handleToggleAmbient = (sound: 'none' | 'rain' | 'lofi' | 'whitenoise' | 'clock') => {
    soundFx.playPop();
    if (ambientSound === sound || sound === 'none') {
      soundFx.stopAmbient();
      setAmbientSound('none');
    } else {
      setAmbientSound(sound);
      if (isRunning) {
        soundFx.playAmbient(sound);
      }
    }
  };

  // Calculations for display
  const displaySeconds = mode === 'stopwatch' ? stopwatchSeconds : remainingSeconds;
  const mins = Math.floor(displaySeconds / 60);
  const secs = displaySeconds % 60;
  const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const progressPercent =
    mode === 'stopwatch'
      ? 100
      : totalSeconds > 0
      ? ((totalSeconds - remainingSeconds) / totalSeconds) * 100
      : 0;

  const currentSubject = subjects.find(s => s.id === selectedSubjectId);

  // SVG Circular Ring calculations
  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Clock className="w-6 h-6 text-purple-600" />
            <span>Study Timer</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Focus with the Pomodoro technique & ambient study soundscapes
          </p>
        </div>

        {/* Sessions badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-2xl bg-purple-50 border border-purple-200 text-purple-800 text-xs font-bold">
          <Flame className="w-3.5 h-3.5 text-purple-600" />
          <span>{completedSessionsCount} Done</span>
        </div>
      </div>

      {/* Mode Presets Bar */}
      <div className="flex items-center justify-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl text-xs font-bold overflow-x-auto no-scrollbar">
        <button
          onClick={() => selectMode('pomodoro', 25)}
          className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
            mode === 'pomodoro' ? 'bg-white text-purple-700 shadow-xs font-extrabold' : 'text-slate-600 hover:text-slate-900'
          }`}
          id="btn-mode-pomodoro"
        >
          25m Focus
        </button>
        <button
          onClick={() => selectMode('short-break', 5)}
          className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
            mode === 'short-break' ? 'bg-white text-emerald-700 shadow-xs font-extrabold' : 'text-slate-600 hover:text-slate-900'
          }`}
          id="btn-mode-short-break"
        >
          5m Break
        </button>
        <button
          onClick={() => selectMode('long-break', 15)}
          className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
            mode === 'long-break' ? 'bg-white text-blue-700 shadow-xs font-extrabold' : 'text-slate-600 hover:text-slate-900'
          }`}
          id="btn-mode-long-break"
        >
          15m Long Break
        </button>
        <button
          onClick={() => selectMode('custom', customInputMins)}
          className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
            mode === 'custom' ? 'bg-white text-amber-700 shadow-xs font-extrabold' : 'text-slate-600 hover:text-slate-900'
          }`}
          id="btn-mode-custom"
        >
          Custom
        </button>
        <button
          onClick={() => selectMode('stopwatch', 0)}
          className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
            mode === 'stopwatch' ? 'bg-white text-slate-900 shadow-xs font-extrabold' : 'text-slate-600 hover:text-slate-900'
          }`}
          id="btn-mode-stopwatch"
        >
          Stopwatch
        </button>
      </div>

      {/* Main Timer Display Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-md flex flex-col items-center justify-center space-y-6 relative overflow-hidden">
        {/* Subject tag selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-bold">Studying:</span>
          <select
            value={selectedSubjectId}
            onChange={(e) => {
              soundFx.playPop();
              setSelectedSubjectId(e.target.value);
            }}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            id="select-timer-subject"
          >
            {subjects.map(s => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Circular SVG Timer with Pulse */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 240 240">
            {/* Background Track */}
            <circle
              cx="120"
              cy="120"
              r={radius}
              stroke="currentColor"
              strokeWidth="10"
              className="text-slate-100"
              fill="transparent"
            />
            {/* Progress Stroke */}
            <circle
              cx="120"
              cy="120"
              r={radius}
              stroke="currentColor"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={`transition-all duration-1000 ${
                mode === 'short-break' || mode === 'long-break'
                  ? 'text-emerald-500'
                  : 'text-purple-600'
              }`}
              fill="transparent"
            />
          </svg>

          {/* Time digits & Status in center */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="font-mono text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
              {formattedTime}
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">
              {isRunning ? (mode === 'stopwatch' ? 'Counting Up' : 'Focus In Session') : 'Ready'}
            </span>
          </div>
        </div>

        {/* Quick +1m and +5m buttons */}
        {mode !== 'stopwatch' && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleAddMinutes(1)}
              className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              +1 min
            </button>
            <button
              onClick={() => handleAddMinutes(5)}
              className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              +5 min
            </button>
          </div>
        )}

        {/* Custom duration slider if in custom mode */}
        {mode === 'custom' && !isRunning && (
          <div className="w-full max-w-xs space-y-1">
            <div className="flex justify-between text-xs font-bold text-slate-600">
              <span>Duration:</span>
              <span>{customInputMins} minutes</span>
            </div>
            <input
              type="range"
              min="1"
              max="120"
              value={customInputMins}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setCustomInputMins(val);
                setTotalSeconds(val * 60);
                setRemainingSeconds(val * 60);
              }}
              className="w-full accent-purple-600"
            />
          </div>
        )}

        {/* Main Action Control Buttons */}
        <div className="flex items-center gap-3">
          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="p-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 active:scale-95 transition-all"
            title="Reset Timer"
            id="btn-timer-reset"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          {/* Start / Pause Button */}
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-sm shadow-lg shadow-purple-500/25 hover:from-purple-700 hover:to-indigo-700 active:scale-95 flex items-center gap-2 transition-all"
              id="btn-timer-start"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>Start Focus</span>
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="px-8 py-3.5 rounded-2xl bg-amber-500 text-white font-extrabold text-sm shadow-lg shadow-amber-500/25 hover:bg-amber-600 active:scale-95 flex items-center gap-2 transition-all"
              id="btn-timer-pause"
            >
              <Pause className="w-5 h-5 fill-white" />
              <span>Pause</span>
            </button>
          )}

          {/* Stop Button */}
          <button
            onClick={handleStop}
            className="p-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-rose-50 hover:text-rose-600 active:scale-95 transition-all"
            title="Stop & Save Session"
            id="btn-timer-stop"
          >
            <Square className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Ambient Soundscapes Synthesizer */}
      <div className="p-5 rounded-3xl bg-slate-900 text-white shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Headphones className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-300">
              Ambient Focus Sound Generator
            </h3>
          </div>
          {ambientSound !== 'none' && (
            <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full animate-pulse">
              Playing {ambientSound}
            </span>
          )}
        </div>

        <p className="text-xs text-slate-400">
          Synthesized relaxing background noise to mask distractions while you study:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          <button
            onClick={() => handleToggleAmbient('rain')}
            className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              ambientSound === 'rain'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <CloudRain className="w-4 h-4 text-sky-400" />
            <span>Gentle Rain</span>
          </button>

          <button
            onClick={() => handleToggleAmbient('lofi')}
            className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              ambientSound === 'lofi'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Waves className="w-4 h-4 text-indigo-400" />
            <span>Warm Lo-Fi</span>
          </button>

          <button
            onClick={() => handleToggleAmbient('whitenoise')}
            className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              ambientSound === 'whitenoise'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>White Noise</span>
          </button>

          <button
            onClick={() => handleToggleAmbient('clock')}
            className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              ambientSound === 'clock'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>Rhythm Tick</span>
          </button>
        </div>
      </div>

      {/* Focus History Log */}
      {sessions.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-extrabold text-base text-slate-900">
            Recent Study Sessions
          </h3>

          <div className="space-y-2">
            {sessions.slice(0, 5).map(sess => {
              const sub = subjects.find(s => s.id === sess.subjectId);
              return (
                <div
                  key={sess.id}
                  className="p-3.5 rounded-2xl bg-white border border-slate-200/90 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: sub?.color || '#8B5CF6' }}
                    />
                    <span className="font-bold text-slate-800">
                      {sub?.name || 'General Study'}
                    </span>
                    <span className="text-slate-400">({sess.mode})</span>
                  </div>
                  <div className="flex items-center gap-2 font-bold text-slate-600">
                    <span>{sess.durationMinutes} mins</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      {new Date(sess.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
