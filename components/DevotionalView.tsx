
import React, { useState, useEffect } from 'react';
import { Calendar, Loader2, Heart, Share2, Sparkles, BookOpen } from 'lucide-react';
import { getDailyDevotional } from '../services/geminiService';
import { Devotional } from '../types';

const DevotionalView: React.FC = () => {
  const [devotional, setDevotional] = useState<Devotional | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDevotional();
  }, []);

  const loadDevotional = async () => {
    setLoading(true);
    const data = await getDailyDevotional();
    setDevotional(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 space-y-4">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        <h2 className="text-2xl font-bold text-slate-900">Preparing today's bread...</h2>
        <p className="text-slate-500">Connecting with divine wisdom for your morning reflection.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-10 space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-8">
        <div>
          <div className="flex items-center space-x-2 text-indigo-600 mb-2">
            <Calendar className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-wider">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">{devotional?.title}</h1>
        </div>
        <div className="flex items-center space-x-2">
           <button className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all">
              <Share2 className="w-5 h-5" />
           </button>
           <button className="p-3 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-all">
              <Heart className="w-5 h-5" />
           </button>
        </div>
      </div>

      <div className="space-y-10">
        <section className="bg-indigo-50 border border-indigo-100 p-8 rounded-3xl relative overflow-hidden">
           <div className="relative z-10">
              <div className="flex items-center mb-4">
                <BookOpen className="w-6 h-6 text-indigo-600 mr-2" />
                <h3 className="font-bold text-indigo-900 uppercase tracking-widest text-sm">Key Scripture</h3>
              </div>
              <p className="bible-font text-2xl italic text-indigo-900 leading-relaxed font-semibold">
                "{devotional?.scripture}"
              </p>
           </div>
           <Sparkles className="absolute top-4 right-4 w-12 h-12 text-indigo-200/50" />
        </section>

        <section>
          <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
             <div className="w-2 h-8 bg-indigo-600 rounded-full mr-3"></div>
             Reflection
          </h3>
          <p className="text-slate-700 leading-loose text-lg whitespace-pre-wrap">
            {devotional?.reflection}
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
             <h3 className="font-bold text-slate-900 mb-4 uppercase tracking-widest text-sm text-indigo-600">Prayer</h3>
             <p className="text-slate-600 italic leading-relaxed">
               {devotional?.prayer}
             </p>
          </div>
          <div className="bg-slate-900 p-8 rounded-3xl shadow-xl shadow-slate-200">
             <h3 className="font-bold text-white mb-4 uppercase tracking-widest text-sm text-indigo-400">Daily Step</h3>
             <p className="text-slate-300 leading-relaxed">
               {devotional?.application}
             </p>
          </div>
        </section>
      </div>

      <div className="pt-20 pb-20 text-center">
         <button 
           onClick={loadDevotional}
           className="text-indigo-600 font-bold hover:underline"
         >
           Refresh for a new word
         </button>
      </div>
    </div>
  );
};

export default DevotionalView;
