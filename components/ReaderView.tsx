
import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Settings, 
  Bookmark, 
  Share2, 
  Volume2, 
  Sparkles,
  Loader2
} from 'lucide-react';
import { fetchChapter, BOOKS } from '../services/bibleService';
import { speakVerse, decode, decodeAudioData } from '../services/geminiService';
import { BibleChapter, Bookmark as BookmarkType, BibleVerse } from '../types';

interface ReaderViewProps {
  bookmarks: BookmarkType[];
  onToggleBookmark: (ref: string, text: string) => void;
  onExplain: (ref: string, text: string) => void;
}

const ReaderView: React.FC<ReaderViewProps> = ({ bookmarks, onToggleBookmark, onExplain }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<BibleChapter | null>(null);
  const [book, setBook] = useState('John');
  const [chapter, setChapter] = useState(3);
  const [fontSize, setFontSize] = useState(18);
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    loadContent();
  }, [book, chapter]);

  const loadContent = async () => {
    setLoading(true);
    const res = await fetchChapter(book, chapter);
    setData(res);
    setLoading(false);
  };

  const handleSpeech = async (verseRef: string, text: string) => {
    if (isSpeaking === verseRef) return;
    setIsSpeaking(verseRef);
    
    try {
      const base64 = await speakVerse(text);
      if (base64) {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        const ctx = audioContextRef.current;
        const decoded = decode(base64);
        const buffer = await decodeAudioData(decoded, ctx, 24000, 1);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.onended = () => setIsSpeaking(null);
        source.start();
      }
    } catch (e) {
      console.error(e);
      setIsSpeaking(null);
    }
  };

  const nextChapter = () => setChapter(c => c + 1);
  const prevChapter = () => setChapter(c => Math.max(1, c - 1));

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-full bg-white md:bg-transparent">
      {/* Controls */}
      <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-10 sm:rounded-b-2xl sm:shadow-sm">
        <div className="flex items-center space-x-2">
          <select 
            value={book} 
            onChange={(e) => { setBook(e.target.value); setChapter(1); }}
            className="bg-slate-100 border-none rounded-lg px-3 py-1.5 font-bold text-slate-800 focus:ring-2 focus:ring-red-500/20"
          >
            {BOOKS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          <input 
            type="number" 
            value={chapter}
            onChange={(e) => setChapter(parseInt(e.target.value) || 1)}
            className="w-16 bg-slate-100 border-none rounded-lg px-3 py-1.5 font-bold text-slate-800 focus:ring-2 focus:ring-red-500/20"
          />
        </div>

        <div className="flex items-center space-x-1">
          <button onClick={() => setFontSize(f => Math.max(14, f - 2))} className="p-2 text-slate-400 hover:text-slate-600">A-</button>
          <button onClick={() => setFontSize(f => Math.min(32, f + 2))} className="p-2 text-slate-400 hover:text-slate-600 font-bold">A+</button>
          <div className="w-px h-6 bg-slate-100 mx-2"></div>
          <button className="p-2 text-slate-400 hover:text-slate-600"><Settings className="w-5 h-5" /></button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 md:p-10 bg-white sm:rounded-t-2xl sm:mt-4 shadow-xl shadow-slate-200/50 overflow-y-auto min-h-screen">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
            <p className="text-slate-500 font-medium">Opening the Word...</p>
          </div>
        ) : data ? (
          <div className="bible-font" style={{ fontSize: `${fontSize}px` }}>
            <h1 className="text-4xl font-bold mb-10 text-slate-900 border-b pb-6 border-slate-50">{data.reference}</h1>
            <div className="space-y-6">
              {data.verses.map((v: BibleVerse) => {
                // Use the parent data.reference to build the verse reference to avoid property issues
                const ref = `${data.reference}:${v.verse}`;
                const isBookmarked = bookmarks.some(b => b.reference === ref);
                
                return (
                  <div key={v.verse} className="relative group verse-container transition-colors rounded-xl p-4 -mx-4 hover:bg-slate-50/80">
                    <p className="leading-[1.8] text-slate-800">
                      <sup className="text-red-600 font-bold mr-2 text-[0.6em]">{v.verse}</sup>
                      {v.text}
                    </p>
                    
                    {/* Verse Actions */}
                    <div className="mt-4 flex items-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onToggleBookmark(ref, v.text)}
                        className={`flex items-center text-xs font-bold ${isBookmarked ? 'text-red-600' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        <Bookmark className={`w-3.5 h-3.5 mr-1 ${isBookmarked ? 'fill-current' : ''}`} />
                        Bookmark
                      </button>
                      <button 
                        onClick={() => handleSpeech(ref, v.text)}
                        className="flex items-center text-xs font-bold text-slate-400 hover:text-slate-600"
                      >
                        {isSpeaking === ref ? (
                          <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5 mr-1" />
                        )}
                        Listen
                      </button>
                      <button 
                         onClick={() => onExplain(ref, v.text)}
                        className="flex items-center text-xs font-bold text-red-600 hover:text-red-700"
                      >
                        <Sparkles className="w-3.5 h-3.5 mr-1" />
                        AI Explain
                      </button>
                      <button className="flex items-center text-xs font-bold text-slate-400 hover:text-slate-600">
                        <Share2 className="w-3.5 h-3.5 mr-1" />
                        Share
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="mt-20 flex items-center justify-between pt-10 border-t border-slate-50 mb-20">
              <button 
                onClick={prevChapter}
                className="flex items-center px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all"
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Previous
              </button>
              <button 
                onClick={nextChapter}
                className="flex items-center px-6 py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all shadow-lg"
              >
                Next Chapter
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 text-slate-500">Failed to load content. Please check your connection.</div>
        )}
      </div>
    </div>
  );
};

export default ReaderView;
