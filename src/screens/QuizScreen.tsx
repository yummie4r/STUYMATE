import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  Award, 
  ArrowRight, 
  Clock, 
  Sparkles, 
  Lightbulb, 
  Check, 
  ChevronRight, 
  Zap, 
  BookOpen, 
  BarChart2, 
  Shuffle,
  Trophy,
  Filter
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuizQuestion, Subject, QuizAnswerRecord, QuizHistoryEntry, ScreenId } from '../types';
import { INITIAL_QUESTIONS } from '../data/initialData';
import { soundFx } from '../utils/audio';

interface QuizScreenProps {
  subjects: Subject[];
  onSaveQuizResult: (entry: QuizHistoryEntry) => void;
  quizHistory: QuizHistoryEntry[];
  initialSubjectFilter?: string | null;
  onNavigate: (screen: ScreenId) => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({
  subjects,
  onSaveQuizResult,
  quizHistory,
  initialSubjectFilter,
  onNavigate
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(initialSubjectFilter || 'all');
  const [activeQuizQuestions, setActiveQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [isQuizFinished, setIsQuizFinished] = useState(false);

  // Answering state
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [textInputAnswer, setTextInputAnswer] = useState<string>('');
  const [hasSubmittedCurrent, setHasSubmittedCurrent] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [answersLog, setAnswersLog] = useState<QuizAnswerRecord[]>([]);

  // Timer state
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [activeTab, setActiveTab] = useState<'take' | 'history'>('take');

  // Count available questions
  const availableQuestions = INITIAL_QUESTIONS.filter(q =>
    selectedSubjectId === 'all' ? true : q.subjectId === selectedSubjectId
  );

  // Timer tick during quiz
  useEffect(() => {
    let interval: number | undefined;
    if (isQuizActive && !isQuizFinished) {
      interval = window.setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isQuizActive, isQuizFinished]);

  const startQuiz = (subjectId = selectedSubjectId) => {
    soundFx.playPop();
    const pool = INITIAL_QUESTIONS.filter(q =>
      subjectId === 'all' ? true : q.subjectId === subjectId
    );

    if (pool.length === 0) return;

    // Shuffle questions
    const shuffled = [...pool].sort(() => Math.random() - 0.5);

    setActiveQuizQuestions(shuffled);
    setCurrentIndex(0);
    setAnswersLog([]);
    setSelectedOption('');
    setTextInputAnswer('');
    setHasSubmittedCurrent(false);
    setShowHint(false);
    setElapsedSeconds(0);
    setIsQuizFinished(false);
    setIsQuizActive(true);
  };

  const currentQ = activeQuizQuestions[currentIndex];

  const handleCheckAnswer = () => {
    if (!currentQ) return;

    let answerGiven = '';
    let isCorrect = false;

    if (currentQ.type === 'multiple-choice') {
      if (!selectedOption) return;
      answerGiven = selectedOption;
      isCorrect = selectedOption.trim() === String(currentQ.correctAnswer).trim();
    } else {
      if (!textInputAnswer.trim()) return;
      answerGiven = textInputAnswer.trim();

      // Normalize check for identification/numeration/solving
      const userNorm = answerGiven.toLowerCase().replace(/[^a-z0-9]/g, '');
      const correctNorm = String(currentQ.correctAnswer).toLowerCase().replace(/[^a-z0-9]/g, '');
      
      // Also allow matches with simple string inclusion or numeric equal
      isCorrect = userNorm === correctNorm ||
        (Array.isArray(currentQ.correctAnswer) &&
          currentQ.correctAnswer.some(a => a.toLowerCase().replace(/[^a-z0-9]/g, '') === userNorm));
    }

    if (isCorrect) {
      soundFx.playSuccess();
    } else {
      soundFx.playError();
    }

    const record: QuizAnswerRecord = {
      questionId: currentQ.id,
      userAnswer: answerGiven,
      isCorrect,
      question: currentQ.question,
      correctAnswer: Array.isArray(currentQ.correctAnswer) ? currentQ.correctAnswer.join(' / ') : currentQ.correctAnswer,
      explanation: currentQ.explanation
    };

    setAnswersLog(prev => [...prev, record]);
    setHasSubmittedCurrent(true);
  };

  const handleNextQuestion = () => {
    soundFx.playPop();
    if (currentIndex + 1 < activeQuizQuestions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption('');
      setTextInputAnswer('');
      setHasSubmittedCurrent(false);
      setShowHint(false);
    } else {
      // Quiz Finished!
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setIsQuizFinished(true);
    setIsQuizActive(false);

    // Trigger confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignore
    }

    soundFx.playSuccess();

    // Calculate score
    const total = activeQuizQuestions.length;
    const correctCount = answersLog.filter(a => a.isCorrect).length;
    const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;

    const resultEntry: QuizHistoryEntry = {
      id: 'quiz-res-' + Date.now(),
      date: Date.now(),
      subjectId: selectedSubjectId,
      score: correctCount,
      totalQuestions: total,
      percentage,
      timeSpentSeconds: elapsedSeconds,
      mode: selectedSubjectId === 'all' ? 'All Subjects Mixed' : 'Subject Focused'
    };

    onSaveQuizResult(resultEntry);
  };

  // Helper formatting for timer
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  // Score calculation
  const correctCount = answersLog.filter(a => a.isCorrect).length;
  const totalCount = activeQuizQuestions.length;
  const percentage = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      {/* Header */}
      {!isQuizActive && !isQuizFinished && (
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-amber-600" />
              <span>Study Quiz & Tests</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              Practice multiple-choice, identification, and problem solving
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl text-xs font-bold">
            <button
              onClick={() => {
                soundFx.playPop();
                setActiveTab('take');
              }}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'take' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              Quiz Hub
            </button>
            <button
              onClick={() => {
                soundFx.playPop();
                setActiveTab('history');
              }}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'history' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              History ({quizHistory.length})
            </button>
          </div>
        </div>
      )}

      {/* VIEW 1: QUIZ SELECTION HUB */}
      {!isQuizActive && !isQuizFinished && activeTab === 'take' && (
        <div className="space-y-6">
          {/* Quick Start Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-xl shadow-amber-500/20 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-200" />
                <span className="text-xs font-bold uppercase tracking-wider text-amber-100">
                  Adaptive Practice
                </span>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/20">
                {INITIAL_QUESTIONS.length} Questions Ready
              </span>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-black">
                Comprehensive Knowledge Test
              </h2>
              <p className="text-xs sm:text-sm text-white/90 mt-1">
                Covers Mathematics, Calculus, Physics, Biology, Computer Studies, Chemistry, and English.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-2.5">
              <button
                onClick={() => {
                  setSelectedSubjectId('all');
                  startQuiz('all');
                }}
                className="px-5 py-3 rounded-2xl bg-white text-slate-900 font-extrabold text-xs sm:text-sm shadow-md hover:bg-slate-50 active:scale-95 transition-all flex items-center gap-2"
                id="btn-start-full-quiz"
              >
                <Shuffle className="w-4 h-4 text-amber-600" />
                <span>Start All-Subjects Mixed Quiz</span>
              </button>
            </div>
          </div>

          {/* Subject-Specific Quizzes Grid */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-600" />
              <span>Subject Specific Quizzes</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {subjects.map(subject => {
                const subQuestions = INITIAL_QUESTIONS.filter(q => q.subjectId === subject.id);
                const hasQuestions = subQuestions.length > 0;

                return (
                  <div
                    key={subject.id}
                    className={`p-4 rounded-3xl border bg-white flex items-center justify-between gap-3 transition-all ${
                      hasQuestions
                        ? 'border-slate-200/90 hover:border-amber-400 hover:shadow-sm'
                        : 'border-slate-100 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-xs shadow-2xs"
                        style={{ backgroundColor: subject.color }}
                      >
                        {subject.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900">
                          {subject.name}
                        </h4>
                        <p className="text-xs text-slate-500">
                          {subQuestions.length} practice questions
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedSubjectId(subject.id);
                        startQuiz(subject.id);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-white font-bold text-xs hover:bg-amber-600 active:scale-95 transition-all shadow-xs"
                      id={`btn-start-quiz-${subject.id}`}
                    >
                      Start
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: QUIZ HISTORY LOG */}
      {!isQuizActive && !isQuizFinished && activeTab === 'history' && (
        <div className="space-y-4">
          <h3 className="font-extrabold text-base text-slate-900">
            Past Quiz Attempts
          </h3>

          {quizHistory.length === 0 ? (
            <div className="text-center py-12 px-4 bg-white rounded-3xl border border-slate-200">
              <Award className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h4 className="font-bold text-slate-800 text-sm">No quiz attempts yet</h4>
              <p className="text-xs text-slate-500 mt-1">
                Complete a quiz to review your scores, time taken, and accuracy!
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {quizHistory.map(entry => (
                <div
                  key={entry.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200/90 flex items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900">
                        {entry.mode}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {new Date(entry.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-2">
                      <span>Time: {formatTime(entry.timeSpentSeconds)}</span>
                      <span>•</span>
                      <span>Score: {entry.score}/{entry.totalQuestions} questions</span>
                    </p>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-lg font-black ${
                        entry.percentage >= 80
                          ? 'text-emerald-600'
                          : entry.percentage >= 60
                          ? 'text-amber-600'
                          : 'text-rose-600'
                      }`}
                    >
                      {entry.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW 3: ACTIVE QUIZ IN PROGRESS */}
      {isQuizActive && currentQ && (
        <div className="space-y-5 animate-in zoom-in-95 duration-200">
          {/* Top Quiz Bar */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-amber-100 text-amber-900">
                Question {currentIndex + 1} of {activeQuizQuestions.length}
              </span>
              <span className="text-xs uppercase font-bold text-slate-500 hidden sm:inline">
                {currentQ.type.replace('-', ' ')}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-xl">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>{formatTime(elapsedSeconds)}</span>
              </div>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to quit this quiz session?')) {
                    setIsQuizActive(false);
                  }
                }}
                className="text-xs font-bold text-slate-400 hover:text-rose-600 transition-colors"
              >
                Exit
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-600 transition-all duration-300"
              style={{
                width: `${((currentIndex + (hasSubmittedCurrent ? 1 : 0)) / activeQuizQuestions.length) * 100}%`
              }}
            />
          </div>

          {/* Question Card */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-md space-y-5">
            {/* Subject badge & Difficulty */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg">
                {subjects.find(s => s.id === currentQ.subjectId)?.name || 'General'}
              </span>
              <span className="text-[11px] font-semibold text-slate-400 capitalize">
                {currentQ.difficulty} Level
              </span>
            </div>

            {/* Question Text */}
            <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
              {currentQ.question}
            </h2>

            {/* Multiple Choice Options */}
            {currentQ.type === 'multiple-choice' && currentQ.options && (
              <div className="space-y-2.5 pt-2">
                {currentQ.options.map((opt, optIndex) => {
                  const isSelected = selectedOption === opt;
                  let optStyle = 'border-slate-200 hover:border-amber-400 hover:bg-amber-50/30';

                  if (hasSubmittedCurrent) {
                    if (opt === currentQ.correctAnswer) {
                      optStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold';
                    } else if (isSelected && opt !== currentQ.correctAnswer) {
                      optStyle = 'border-rose-400 bg-rose-50 text-rose-950 font-bold';
                    } else {
                      optStyle = 'border-slate-100 opacity-50';
                    }
                  } else if (isSelected) {
                    optStyle = 'border-amber-500 bg-amber-50 text-slate-900 font-bold ring-2 ring-amber-500/20';
                  }

                  return (
                    <button
                      key={optIndex}
                      disabled={hasSubmittedCurrent}
                      onClick={() => {
                        soundFx.playPop();
                        setSelectedOption(opt);
                      }}
                      className={`w-full p-4 rounded-2xl border text-left text-sm font-medium transition-all flex items-center justify-between gap-3 ${optStyle}`}
                    >
                      <span>{opt}</span>
                      {hasSubmittedCurrent && opt === currentQ.correctAnswer && (
                        <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                      )}
                      {hasSubmittedCurrent && isSelected && opt !== currentQ.correctAnswer && (
                        <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Text / Solving / Identification Input */}
            {currentQ.type !== 'multiple-choice' && (
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Enter Your Answer:
                </label>
                <input
                  type="text"
                  disabled={hasSubmittedCurrent}
                  value={textInputAnswer}
                  onChange={(e) => setTextInputAnswer(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !hasSubmittedCurrent) {
                      e.preventDefault();
                      handleCheckAnswer();
                    }
                  }}
                  placeholder="Type your answer here..."
                  className={`w-full px-4 py-3 rounded-2xl border text-base font-semibold focus:outline-none focus:ring-2 ${
                    hasSubmittedCurrent
                      ? answersLog[currentIndex]?.isCorrect
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                        : 'border-rose-500 bg-rose-50 text-rose-900'
                      : 'border-slate-300 focus:ring-amber-500/20 focus:border-amber-500'
                  }`}
                  id="input-quiz-answer"
                />

                {hasSubmittedCurrent && !answersLog[currentIndex]?.isCorrect && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900">
                    <span className="font-bold">Correct answer: </span>
                    {Array.isArray(currentQ.correctAnswer) ? currentQ.correctAnswer.join(' or ') : currentQ.correctAnswer}
                  </div>
                )}
              </div>
            )}

            {/* Hint Box */}
            {currentQ.hint && (
              <div className="pt-1">
                {showHint ? (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Hint:</strong> {currentQ.hint}</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      soundFx.playPop();
                      setShowHint(true);
                    }}
                    className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>Need a hint?</span>
                  </button>
                )}
              </div>
            )}

            {/* Explanation box after submitting */}
            {hasSubmittedCurrent && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 animate-in fade-in">
                <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-slate-700">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Explanation & Solution Steps</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {currentQ.explanation}
                </p>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">
                {currentIndex + 1} of {activeQuizQuestions.length} questions
              </span>

              {!hasSubmittedCurrent ? (
                <button
                  onClick={handleCheckAnswer}
                  disabled={currentQ.type === 'multiple-choice' ? !selectedOption : !textInputAnswer.trim()}
                  className="px-6 py-2.5 rounded-xl bg-amber-600 text-white font-extrabold text-xs sm:text-sm hover:bg-amber-700 active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-sm transition-all"
                  id="btn-check-answer"
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-extrabold text-xs sm:text-sm hover:bg-slate-800 active:scale-95 shadow-md flex items-center gap-2 transition-all"
                  id="btn-next-question"
                >
                  <span>{currentIndex + 1 < activeQuizQuestions.length ? 'Next Question' : 'View Results'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: QUIZ FINISHED / SCORECARD */}
      {isQuizFinished && (
        <div className="space-y-6 animate-in zoom-in-95 duration-200">
          {/* Result Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white text-center space-y-4 shadow-xl">
            <div className="w-16 h-16 rounded-3xl bg-amber-500 text-white mx-auto flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Trophy className="w-8 h-8 animate-bounce" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Quiz Completed!
              </span>
              <h2 className="text-3xl sm:text-4xl font-black">
                {percentage >= 80 ? 'Outstanding Job! 🎉' : percentage >= 60 ? 'Well Done! 👏' : 'Keep Practicing! 💪'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto">
                You scored <strong className="text-white font-bold">{correctCount}</strong> out of <strong className="text-white font-bold">{totalCount}</strong> questions ({percentage}%).
              </p>
            </div>

            {/* Score Badges */}
            <div className="grid grid-cols-3 gap-2.5 max-w-md mx-auto pt-2">
              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md">
                <p className="text-xl font-black text-amber-400">{percentage}%</p>
                <p className="text-[10px] text-slate-300 font-semibold uppercase">Accuracy</p>
              </div>
              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md">
                <p className="text-xl font-black text-emerald-400">{correctCount}/{totalCount}</p>
                <p className="text-[10px] text-slate-300 font-semibold uppercase">Score</p>
              </div>
              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md">
                <p className="text-xl font-black text-cyan-400">{formatTime(elapsedSeconds)}</p>
                <p className="text-[10px] text-slate-300 font-semibold uppercase">Time Taken</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 flex items-center justify-center gap-3">
              <button
                onClick={() => startQuiz(selectedSubjectId)}
                className="px-5 py-2.5 rounded-2xl bg-amber-500 text-white font-bold text-xs sm:text-sm hover:bg-amber-600 active:scale-95 shadow-md flex items-center gap-2 transition-all"
                id="btn-retry-quiz"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retry Quiz</span>
              </button>
              <button
                onClick={() => {
                  soundFx.playPop();
                  setIsQuizFinished(false);
                  setIsQuizActive(false);
                  setActiveTab('take');
                }}
                className="px-5 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs sm:text-sm transition-all"
                id="btn-back-quiz-hub"
              >
                Quiz Hub
              </button>
            </div>
          </div>

          {/* Detailed Question Review List */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-base text-slate-900">
              Detailed Question Review ({answersLog.length})
            </h3>

            <div className="space-y-3">
              {answersLog.map((ans, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl bg-white border ${
                    ans.isCorrect ? 'border-emerald-200' : 'border-rose-200'
                  } space-y-2`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {ans.isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                      )}
                      <span className="font-bold text-sm text-slate-900">
                        {idx + 1}. {ans.question}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs space-y-1 pl-7">
                    <p className="text-slate-600">
                      <strong>Your answer:</strong>{' '}
                      <span className={ans.isCorrect ? 'text-emerald-700 font-semibold' : 'text-rose-600 font-semibold'}>
                        {ans.userAnswer}
                      </span>
                    </p>
                    {!ans.isCorrect && (
                      <p className="text-slate-600">
                        <strong>Correct answer:</strong>{' '}
                        <span className="text-emerald-700 font-semibold">{ans.correctAnswer}</span>
                      </p>
                    )}
                    <p className="text-slate-500 mt-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <strong>Explanation:</strong> {ans.explanation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
