
import React, { useState, useEffect } from 'react';
import { Star, Loader2, Sparkles, ChevronRight, BookOpen, Gift, Heart, Music } from 'lucide-react';
import { getAdventReflection } from '../services/geminiService';
import { Devotional } from '../types';

const ChristmasView: React.FC = () => {
  const [day, setDay] = useState(new Date().getDate());
  const [reflection, setReflection] = useState<Devotional | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Limit to December days 1-25
    const today = new Date();
    const currentDay = today.getMonth() === 11 ? Math.min(25, today.getDate()) : 25;
    loadDay(currentDay);
  }, []);

  const loadDay = async (selectedDay: number) => {
    setLoading(true);
    setDay(selectedDay);
    try {
      const data = await getAdventReflection(selectedDay);
      setReflection(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-10 pb-40">
      <div className="relative bg-red-800 rounded-[3rem] p-10 md:p-16 text-white overflow-hidden shadow-2xl christmas-glow">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-md">
            <div className="inline-flex items-center space-x-2 bg-red-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-6">
               <Star className="w-3 h-3 fill-current text-yellow-400" />
               <span>Advent Journey</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 italic leading-tight">The Promise Foretold.</h1>
            <p className="text-red-100 text-lg leading-relaxed">Celebrate the birth of Jesus Christ with a 25-day journey of scripture and reflection.</p>
          </div>
          
          <div className="grid grid-cols-5 gap-3 md:w-80">
            {Array.from({ length: 25 }).map((_, i) => {
              const d = i + 1;
              const isActive = d === day;
              const isPast = d < new Date().getDate() || new Date().getMonth() !== 11;
              
              return (
                <button
                  key={d}
                  onClick={() => loadDay(d)}
                  className={`aspect-square rounded-xl text-xs font-black flex items-center justify-center transition-all ${
                    isActive 
                      ? 'bg-yellow-400 text-red-900 scale-110 shadow-lg' 
                      : isPast 
                        ? 'bg-white/20 text-white' 
                        : 'bg-white/5 text-white/40 hover:bg-white/10'
                  }`}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden opacity-20">
           {Array.from({ length: 20 }).map((_, i) => (
             <div 
               key={i} 
               className="star-sparkle" 
               style={{ 
                 top: `${Math.random() * 100}%`, 
                 left: `${Math.random() * 100}%`, 
                 width: `${Math.random() * 4 + 2}px`, 
                 height: `${Math.random() * 4 + 2}px`,
                 animationDelay: `${Math.random() * 5}s`
               }} 
             />
           ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-12 h-12 text-red-700 animate-spin" />
          <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Unwrapping Day {day}...</p>
        </div>
      ) : reflection ? (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
           <div className="flex flex-col md:flex-row gap-12">
              <div className="flex-1 space-y-10">
                <section>
                  <h2 className="text-4xl font-black text-slate-900 mb-6">{reflection.title}</h2>
                  <div className="p-8 bg-red-50 border border-red-100 rounded-[2rem] relative">
                    <BookOpen className="w-8 h-8 text-red-700 absolute -top-4 -left-4 bg-white rounded-full p-1.5 shadow-sm" />
                    <p className="bible-font text-2xl font-bold italic text-red-900 leading-relaxed mb-2">
                      "{reflection.scripture}"
                    </p>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center uppercase tracking-widest">
                    <Sparkles className="w-5 h-5 text-yellow-500 mr-2" />
                    Reflection
                  </h3>
                  <div className="prose prose-red max-w-none">
                    <p className="text-slate-700 leading-loose text-lg whitespace-pre-wrap">
                      {reflection.reflection}
                    </p>
                  </div>
                </section>
              </div>

              <div className="md:w-80 space-y-6">
                <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm">
                   <h4 className="font-black text-red-700 uppercase tracking-widest text-xs mb-4 flex items-center">
                     <Gift className="w-4 h-4 mr-2" /> Daily Gift
                   </h4>
                   <p className="text-slate-600 italic leading-relaxed text-sm">
                     {reflection.application}
                   </p>
                </div>
                
                <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-xl shadow-slate-200">
                   <h4 className="font-black text-yellow-500 uppercase tracking-widest text-xs mb-4 flex items-center">
                     <Heart className="w-4 h-4 mr-2" /> Prayer
                   </h4>
                   <p className="text-slate-300 text-sm leading-relaxed italic">
                     {reflection.prayer}
                   </p>
                </div>
                
                <button className="w-full py-4 bg-red-700 text-white rounded-2xl font-black flex items-center justify-center hover:bg-red-800 transition-all shadow-lg group">
                  <Music className="w-5 h-5 mr-2" />
                  Christmas Audio
                  <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
           </div>
        </div>
      ) : (
        <div className="text-center py-20 text-slate-500 font-bold">Failed to load reflection. May the peace of Christ be with you.</div>
      )}
    </div>
  );
};

export default ChristmasView;
