import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Pin, 
  Trash2, 
  Edit3, 
  Tag, 
  X, 
  Check, 
  Square, 
  CheckSquare, 
  Copy, 
  Share2, 
  Sparkles,
  Layers,
  Calendar,
  Filter
} from 'lucide-react';
import { Note, Subject, ScreenId } from '../types';
import { soundFx } from '../utils/audio';

interface NotesScreenProps {
  notes: Note[];
  subjects: Subject[];
  onSaveNote: (note: Note) => void;
  onDeleteNote: (noteId: string) => void;
  onTogglePin: (noteId: string) => void;
  filterSubjectId?: string | null;
  onNavigate: (screen: ScreenId) => void;
}

const COLOR_PALETTE = [
  { name: 'Purple', hex: '#8B5CF6', bg: 'bg-purple-50', border: 'border-purple-200' },
  { name: 'Blue', hex: '#3B82F6', bg: 'bg-blue-50', border: 'border-blue-200' },
  { name: 'Emerald', hex: '#10B981', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  { name: 'Amber', hex: '#F59E0B', bg: 'bg-amber-50', border: 'border-amber-200' },
  { name: 'Pink', hex: '#EC4899', bg: 'bg-pink-50', border: 'border-pink-200' },
  { name: 'Indigo', hex: '#6366F1', bg: 'bg-indigo-50', border: 'border-indigo-200' },
  { name: 'Rose', hex: '#E11D48', bg: 'bg-rose-50', border: 'border-rose-200' }
];

export const NotesScreen: React.FC<NotesScreenProps> = ({
  notes,
  subjects,
  onSaveNote,
  onDeleteNote,
  onTogglePin,
  filterSubjectId
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>(filterSubjectId || 'all');
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formSubjectId, setFormSubjectId] = useState<string>('math');
  const [formColor, setFormColor] = useState<string>('#8B5CF6');
  const [formTags, setFormTags] = useState<string>('');
  const [formChecklist, setFormChecklist] = useState<{ id: string; text: string; done: boolean }[]>([]);
  const [newChecklistText, setNewChecklistText] = useState('');

  // Filter notes
  const filteredNotes = notes.filter(n => {
    const matchesSubject = selectedSubjectFilter === 'all' || n.subjectId === selectedSubjectFilter;
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSubject && matchesSearch;
  });

  // Sort pinned first, then newest
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.updatedAt - a.updatedAt;
  });

  const openNewNoteModal = () => {
    soundFx.playPop();
    setFormTitle('');
    setFormContent('');
    setFormSubjectId(selectedSubjectFilter !== 'all' ? selectedSubjectFilter : (subjects[0]?.id || 'math'));
    setFormColor(COLOR_PALETTE[0].hex);
    setFormTags('');
    setFormChecklist([]);
    setEditingNote(null);
    setIsCreatingNew(true);
  };

  const openEditNoteModal = (note: Note) => {
    soundFx.playPop();
    setEditingNote(note);
    setFormTitle(note.title);
    setFormContent(note.content);
    setFormSubjectId(note.subjectId);
    setFormColor(note.colorTag || '#8B5CF6');
    setFormTags(note.tags ? note.tags.join(', ') : '');
    setFormChecklist(note.checklist || []);
    setIsCreatingNew(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const parsedTags = formTags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const now = Date.now();
    const noteToSave: Note = {
      id: editingNote ? editingNote.id : 'note-' + now,
      title: formTitle.trim(),
      content: formContent.trim(),
      subjectId: formSubjectId,
      colorTag: formColor,
      isPinned: editingNote ? editingNote.isPinned : false,
      createdAt: editingNote ? editingNote.createdAt : now,
      updatedAt: now,
      tags: parsedTags,
      checklist: formChecklist
    };

    onSaveNote(noteToSave);
    soundFx.playSuccess();
    setIsCreatingNew(false);
    setEditingNote(null);
  };

  const handleAddChecklistItem = () => {
    if (!newChecklistText.trim()) return;
    setFormChecklist(prev => [
      ...prev,
      { id: 'item-' + Date.now(), text: newChecklistText.trim(), done: false }
    ]);
    setNewChecklistText('');
  };

  const handleToggleChecklistItem = (note: Note, itemId: string) => {
    soundFx.playPop();
    const updatedChecklist = (note.checklist || []).map(item =>
      item.id === itemId ? { ...item, done: !item.done } : item
    );
    onSaveNote({
      ...note,
      checklist: updatedChecklist,
      updatedAt: Date.now()
    });
  };

  const handleCopyNote = (note: Note) => {
    const textToCopy = `${note.title}\n\n${note.content}${
      note.checklist && note.checklist.length > 0
        ? '\n\nChecklist:\n' + note.checklist.map(c => `[${c.done ? 'x' : ' '}] ${c.text}`).join('\n')
        : ''
    }`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(note.id);
    soundFx.playSuccess();
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-600" />
            <span>Study Notes</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Create, organize, and review your personal study notes offline
          </p>
        </div>

        <button
          onClick={openNewNoteModal}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-emerald-600 text-white text-xs font-bold shadow-sm shadow-emerald-500/25 hover:bg-emerald-700 active:scale-95 transition-all"
          id="btn-create-new-note"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Note</span>
          <span className="sm:hidden">Write</span>
        </button>
      </div>

      {/* Search and Subject Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes by keyword, tag, or formula..."
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-2xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-2xs"
            id="input-search-notes"
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

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-semibold">
          <button
            onClick={() => {
              soundFx.playPop();
              setSelectedSubjectFilter('all');
            }}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
              selectedSubjectFilter === 'all'
                ? 'bg-slate-900 text-white font-bold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Notes ({notes.length})
          </button>
          {subjects.map(s => {
            const count = notes.filter(n => n.subjectId === s.id).length;
            const isSelected = selectedSubjectFilter === s.id;
            return (
              <button
                key={s.id}
                onClick={() => {
                  soundFx.playPop();
                  setSelectedSubjectFilter(s.id);
                }}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-slate-900 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: s.color }}
                />
                <span>{s.name} ({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Notes List */}
      {sortedNotes.length === 0 ? (
        <div className="text-center py-12 px-4 bg-white rounded-3xl border border-slate-200 space-y-3">
          <FileText className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">No notes found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery
              ? 'No notes match your search term. Try searching something else.'
              : 'You have not written any notes for this subject yet. Tap "New Note" to create one!'}
          </p>
          <button
            onClick={openNewNoteModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Note</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedNotes.map(note => {
            const noteSubject = subjects.find(s => s.id === note.subjectId);
            const totalTasks = note.checklist?.length || 0;
            const doneTasks = note.checklist?.filter(c => c.done).length || 0;

            return (
              <div
                key={note.id}
                className="group relative p-5 rounded-3xl bg-white border border-slate-200/90 hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between"
                id={`note-card-${note.id}`}
              >
                <div>
                  {/* Top Note Row */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full shrink-0 shadow-2xs"
                        style={{ backgroundColor: note.colorTag || '#8B5CF6' }}
                      />
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {noteSubject?.name || 'General'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Pin Button */}
                      <button
                        onClick={() => {
                          soundFx.playPop();
                          onTogglePin(note.id);
                        }}
                        className={`p-1.5 rounded-lg transition-colors ${
                          note.isPinned
                            ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
                            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                        }`}
                        title={note.isPinned ? 'Unpin note' : 'Pin note to top'}
                      >
                        <Pin className={`w-3.5 h-3.5 ${note.isPinned ? 'fill-amber-500' : ''}`} />
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() => openEditNoteModal(note)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        title="Edit note"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this study note?')) {
                            soundFx.playPop();
                            onDeleteNote(note.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Note Title */}
                  <h3 className="font-extrabold text-base text-slate-900 leading-snug">
                    {note.title}
                  </h3>

                  {/* Note Content Preview */}
                  <div className="mt-2 text-xs text-slate-600 leading-relaxed font-normal whitespace-pre-line line-clamp-4">
                    {note.content}
                  </div>

                  {/* Checklist Items inside Note */}
                  {note.checklist && note.checklist.length > 0 && (
                    <div className="mt-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                        <span>Checklist</span>
                        <span>{doneTasks}/{totalTasks} done</span>
                      </div>
                      <div className="space-y-1">
                        {note.checklist.map(item => (
                          <div
                            key={item.id}
                            onClick={() => handleToggleChecklistItem(note, item.id)}
                            className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:text-slate-900"
                          >
                            {item.done ? (
                              <CheckSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            ) : (
                              <Square className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            )}
                            <span className={item.done ? 'line-through text-slate-400' : 'font-medium'}>
                              {item.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {note.tags && note.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {note.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 flex items-center gap-1"
                        >
                          <Tag className="w-2.5 h-2.5 text-slate-400" />
                          <span>{tag}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Card Footer */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                  </span>

                  <button
                    onClick={() => handleCopyNote(note)}
                    className="flex items-center gap-1 text-slate-500 hover:text-slate-800 font-semibold"
                    title="Copy note text"
                  >
                    {copiedId === note.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-600 font-bold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Note Modal */}
      {isCreatingNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-black text-lg text-slate-900">
                {editingNote ? 'Edit Study Note' : 'Create New Study Note'}
              </h3>
              <button
                onClick={() => {
                  setIsCreatingNew(false);
                  setEditingNote(null);
                }}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
              {/* Note Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Note Title *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Physics: Thermodynamics Cheat Sheet"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  id="input-note-title"
                />
              </div>

              {/* Subject & Color Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Associated Subject
                  </label>
                  <select
                    value={formSubjectId}
                    onChange={(e) => setFormSubjectId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Color Accent
                  </label>
                  <div className="flex items-center gap-2 pt-1">
                    {COLOR_PALETTE.map(c => (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => setFormColor(c.hex)}
                        className={`w-6 h-6 rounded-full transition-transform ${
                          formColor === c.hex ? 'scale-125 ring-2 ring-slate-800 ring-offset-2' : ''
                        }`}
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Note Content Textarea */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Note Content & Key Formulas *
                </label>
                <textarea
                  rows={6}
                  required
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Write your study notes, definitions, steps, key equations, or exam summaries here..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  id="textarea-note-content"
                />
              </div>

              {/* Checklist Section */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Study Checklist / Action Items
                </label>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newChecklistText}
                    onChange={(e) => setNewChecklistText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddChecklistItem();
                      }
                    }}
                    placeholder="e.g. Solve problem set #4, Memorize 5 vocab words..."
                    className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddChecklistItem}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-900"
                  >
                    Add Task
                  </button>
                </div>

                {formChecklist.length > 0 && (
                  <div className="space-y-1 pt-1">
                    {formChecklist.map((item, idx) => (
                      <div key={item.id} className="flex items-center justify-between gap-2 text-xs bg-white p-2 rounded-lg border border-slate-100">
                        <span className="font-medium text-slate-700">{item.text}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setFormChecklist(prev => prev.filter((_, i) => i !== idx));
                          }}
                          className="text-slate-400 hover:text-rose-500 p-0.5"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tags Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  placeholder="e.g. Exam 1, Formulas, Chapter 3"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              {/* Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingNew(false);
                    setEditingNote(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-sm shadow-emerald-500/20"
                  id="btn-save-note-submit"
                >
                  {editingNote ? 'Update Note' : 'Save Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
