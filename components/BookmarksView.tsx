
import React from 'react';
import { Bookmark as BookmarkType } from '../types';
import { Bookmark, Clock, BookOpen, Trash2, ArrowRight } from 'lucide-react';

interface BookmarksViewProps {
  bookmarks: BookmarkType[];
  onNavigate: (ref: string) => void;
}

const BookmarksView: React.FC<BookmarksViewProps> = ({ bookmarks, onNavigate }) => {
  if (bookmarks.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
          <Bookmark className="w-10 h-10 text-slate-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">No bookmarks yet</h2>
          <p className="text-slate-500 max-w-xs mt-2">Save verses that speak to your heart while reading the Bible.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-slate-900">Your Bookmarks</h2>
        <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          {bookmarks.length} Total
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 pb-20">
        {[...bookmarks].sort((a, b) => b.timestamp - a.timestamp).map((b) => (
          <div key={b.id} className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center mr-3">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{b.reference}</h3>
                  <div className="flex items-center text-slate-400 text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    {new Date(b.timestamp).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 text-slate-400 hover:text-rose-600 transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <p className="bible-font text-xl text-slate-700 italic leading-relaxed mb-8 border-l-4 border-indigo-100 pl-6">
              "{b.text}"
            </p>

            <button 
              onClick={() => onNavigate(b.reference)}
              className="flex items-center text-indigo-600 font-bold text-sm group/btn"
            >
              Read in Context
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookmarksView;
