
import React, { useState, useEffect } from 'react';
import { Loader2, ArrowLeft, Sparkles, BookOpen, Quote } from 'lucide-react';
import { getVerseExplanation } from '../services/geminiService';

interface ExplainerViewProps {
  reference: string;
  text: string;
  onBack: () => void;
}

const ExplainerView: React.FC<ExplainerViewProps> = ({ reference, text, onBack }) => {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExplanation();
  }, [reference]);

  const loadExplanation = async () => {
    setLoading(true);
    const res = await getVerseExplanation(reference, text);
    setExplanation(res || "Failed to generate explanation.");
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-10">
      <button 
        onClick={onBack}
        className="flex items-center text-slate-500 hover:text-indigo-600 font-bold transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" /> Back to Reader
      </button>

      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-6">
            <Sparkles className="w-6 h-6 text-indigo-200" />
            <h2 className="text-lg font-bold uppercase tracking-widest">AI Scripture Insights</h2>
          </div>
          <div className="flex space-x-4">
             <Quote className="w-10 h-10 text-indigo-400/50 flex-shrink-0" />
             <div>
                <h1 className="text-3xl font-black mb-4">{reference}</h1>
                <p className="bible-font text-2xl italic text-indigo-50 leading-relaxed">
                  {text}
                </p>
             </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
      </div>

      <div className="bg-white border border-slate-100 rounded-3xl p-8 md:p-12 shadow-sm min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
            <p className="text-slate-500 font-medium">Analyzing theology and context...</p>
          </div>
        ) : (
          <div className="prose prose-slate max-w-none">
            {explanation?.split('\n').map((line, i) => (
              <p key={i} className="mb-4 text-slate-700 leading-relaxed text-lg">
                {line}
              </p>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-center pb-20">
         <button 
           onClick={loadExplanation}
           className="text-slate-400 hover:text-indigo-600 text-sm font-bold flex items-center transition-colors"
         >
           <Loader2 className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
           Regenerate Insights
         </button>
      </div>
    </div>
  );
};

export default ExplainerView;
