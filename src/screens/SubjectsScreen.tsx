import React, { useState } from 'react';
import { 
  Search, 
  BookOpen, 
  Sparkles, 
  HelpCircle, 
  FileText, 
  Plus, 
  X, 
  ChevronRight, 
  Lightbulb, 
  Check, 
  Layers, 
  ExternalLink,
  GraduationCap
} from 'lucide-react';
import { Subject, SubjectCategory, ScreenId } from '../types';
import { soundFx } from '../utils/audio';

interface SubjectsScreenProps {
  subjects: Subject[];
  onAddSubject: (subject: Subject) => void;
  onNavigate: (screen: ScreenId, extra?: string) => void;
  initialSelectedSubjectId?: string | null;
}

const CATEGORIES: SubjectCategory[] = [
  'All',
  'STEM',
  'Life Sciences',
  'Computing',
  'Languages',
  'Humanities'
];

export const SubjectsScreen: React.FC<SubjectsScreenProps> = ({
  subjects,
  onAddSubject,
  onNavigate,
  initialSelectedSubjectId
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SubjectCategory>('All');
  const [activeSubject, setActiveSubject] = useState<Subject | null>(() => {
    if (initialSelectedSubjectId) {
      return subjects.find(s => s.id === initialSelectedSubjectId) || null;
    }
    return null;
  });
  const [showAddModal, setShowAddModal] = useState(false);

  // Form for custom subject
  const [newSubName, setNewSubName] = useState('');
  const [newSubCat, setNewSubCat] = useState<SubjectCategory>('STEM');
  const [newSubDesc, setNewSubDesc] = useState('');
  const [newSubColor, setNewSubColor] = useState('#3B82F6');

  // Filtered list
  const filteredSubjects = subjects.filter(subject => {
    const matchesCat = selectedCategory === 'All' || subject.category === selectedCategory;
    const matchesSearch =
      subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.topics.some(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName.trim()) return;

    const newSubject: Subject = {
      id: 'custom-' + Date.now(),
      name: newSubName.trim(),
      category: newSubCat,
      description: newSubDesc.trim() || 'Custom study subject added by student.',
      color: newSubColor,
      gradient: 'from-blue-600 to-indigo-700',
      bgLight: 'bg-blue-50 text-blue-800',
      borderColor: 'border-blue-200 hover:border-blue-400',
      iconName: 'BookOpen',
      topicsCount: 1,
      topics: [
        {
          title: 'Introduction & Key Notes',
          summary: 'Student study notes and key principles for ' + newSubName,
          keyPoints: ['Review definitions', 'Memorize foundational concepts', 'Practice active recall']
        }
      ],
      studyTips: ['Break study material into 25-minute Pomodoro blocks', 'Create study flashcards']
    };

    onAddSubject(newSubject);
    soundFx.playSuccess();
    setShowAddModal(false);
    setNewSubName('');
    setNewSubDesc('');
    setActiveSubject(newSubject);
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            <span>Subjects Catalog</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Click any subject card to explore topics, formulas & cheat sheets
          </p>
        </div>

        <button
          onClick={() => {
            soundFx.playPop();
            setShowAddModal(true);
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-indigo-600 text-white text-xs font-bold shadow-sm shadow-indigo-500/25 hover:bg-indigo-700 active:scale-95 transition-all"
          id="btn-add-subject"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Subject</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search subjects, topics, formulas (e.g. Calculus, Newton, DNA)..."
          className="w-full pl-10 pr-4 py-2.5 bg-white rounded-2xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-2xs transition-all"
          id="input-search-subjects"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-semibold">
        {CATEGORIES.map(cat => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => {
                soundFx.playPop();
                setSelectedCategory(cat);
              }}
              className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-xs font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Subjects Grid */}
      {filteredSubjects.length === 0 ? (
        <div className="text-center py-12 px-4 bg-white rounded-3xl border border-slate-200">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="font-bold text-slate-800 text-sm">No subjects found</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search or category filter
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {filteredSubjects.map(sub => (
            <div
              key={sub.id}
              onClick={() => {
                soundFx.playPop();
                setActiveSubject(sub);
              }}
              className="group relative p-4 rounded-3xl bg-white border border-slate-200/80 hover:border-indigo-400/80 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
              id={`subject-card-${sub.id}`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-xs group-hover:scale-105 transition-transform"
                    style={{ backgroundColor: sub.color }}
                  >
                    {sub.name.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {sub.category}
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {sub.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {sub.description}
                </p>
              </div>

              {/* Topic chips preview */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-medium text-slate-500 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{sub.topics.length} Topic Guides</span>
                </span>
                <span className="font-bold text-indigo-600 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                  <span>Explore</span>
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Subject Detail Drawer / Modal */}
      {activeSubject && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full sm:max-w-2xl max-h-[88vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-200">
            {/* Modal Header */}
            <div
              className="p-5 text-white flex items-start justify-between gap-4 relative overflow-hidden"
              style={{ backgroundColor: activeSubject.color }}
            >
              <div className="relative z-10">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white">
                  {activeSubject.category}
                </span>
                <h2 className="text-xl sm:text-2xl font-black mt-1">
                  {activeSubject.name}
                </h2>
                <p className="text-xs sm:text-sm text-white/90 mt-1 max-w-lg">
                  {activeSubject.description}
                </p>
              </div>

              <button
                onClick={() => setActiveSubject(null)}
                className="relative z-10 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                id="btn-close-subject-modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-5 flex-1">
              {/* Quick Action Shortcuts */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => {
                    soundFx.playPop();
                    setActiveSubject(null);
                    onNavigate('quiz', activeSubject.id);
                  }}
                  className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 font-bold text-xs hover:bg-amber-100 transition-colors"
                >
                  <HelpCircle className="w-4 h-4 text-amber-600" />
                  <span>Take {activeSubject.name} Quiz</span>
                </button>

                <button
                  onClick={() => {
                    soundFx.playPop();
                    setActiveSubject(null);
                    onNavigate('notes', activeSubject.id);
                  }}
                  className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold text-xs hover:bg-emerald-100 transition-colors"
                >
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>View Notes for Subject</span>
                </button>
              </div>

              {/* Topics & Cheat Sheets */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-indigo-600" />
                  <span>Core Topics & Study Cheat Sheets</span>
                </h4>

                <div className="space-y-3">
                  {activeSubject.topics.map((topic, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2"
                    >
                      <h5 className="font-bold text-sm text-slate-900">
                        {topic.title}
                      </h5>
                      <p className="text-xs text-slate-600 font-medium">
                        {topic.summary}
                      </p>

                      {/* Key Points */}
                      <ul className="space-y-1 pt-1">
                        {topic.keyPoints.map((pt, j) => (
                          <li
                            key={j}
                            className="text-xs text-slate-700 flex items-start gap-2"
                          >
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Formula / Code / Example Box */}
                      {topic.formulaOrExample && (
                        <div className="mt-2.5 p-2.5 rounded-xl bg-slate-900 text-amber-300 font-mono text-xs shadow-inner">
                          <span className="text-slate-400 text-[10px] block uppercase font-sans font-bold">
                            Formula / Key Rule:
                          </span>
                          {topic.formulaOrExample}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Study Tips */}
              {activeSubject.studyTips && activeSubject.studyTips.length > 0 && (
                <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-indigo-600" />
                    <span>Study Tips & Memorization Strategies</span>
                  </h4>
                  <ul className="space-y-1.5">
                    {activeSubject.studyTips.map((tip, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-indigo-950 font-medium flex items-start gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActiveSubject(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Subject Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-black text-lg text-slate-900">
                Add New Subject
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubject} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Subject Name *
                </label>
                <input
                  type="text"
                  required
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  placeholder="e.g. World Geography, Organic Chemistry..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  id="input-new-subject-name"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Category
                </label>
                <select
                  value={newSubCat}
                  onChange={(e) => setNewSubCat(e.target.value as SubjectCategory)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value="STEM">STEM (Math, Science, Physics)</option>
                  <option value="Life Sciences">Life Sciences (Bio, Anatomy)</option>
                  <option value="Computing">Computing & IT</option>
                  <option value="Languages">Languages & Literature</option>
                  <option value="Humanities">Humanities & Social Studies</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Brief Description
                </label>
                <textarea
                  rows={2}
                  value={newSubDesc}
                  onChange={(e) => setNewSubDesc(e.target.value)}
                  placeholder="Overview of this study subject..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Color Accent
                </label>
                <div className="flex items-center gap-2">
                  {['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EC4899', '#6366F1', '#E11D48', '#14B8A6'].map(col => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setNewSubColor(col)}
                      className={`w-7 h-7 rounded-full transition-transform ${
                        newSubColor === col ? 'scale-125 ring-2 ring-slate-800 ring-offset-2' : ''
                      }`}
                      style={{ backgroundColor: col }}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shadow-sm"
                  id="btn-submit-new-subject"
                >
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
