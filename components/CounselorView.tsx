
import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Loader2, Info } from 'lucide-react';
import { getCounselingResponse } from '../services/geminiService';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const CounselorView: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Welcome. I am your Biblical Counselor. Whatever burden you carry, or whatever question you have about life's journey, let us explore it through the wisdom of God's Word. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const response = await getCounselingResponse(userMsg, messages);
      setMessages(prev => [...prev, { role: 'model', text: response || "I'm sorry, I couldn't process that request right now." }]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: 'model', text: "An error occurred while connecting to the Word. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col p-4 md:p-6">
      <div className="bg-indigo-600 rounded-2xl p-6 text-white mb-6 shadow-xl flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Biblical Counselor</h2>
            <p className="text-indigo-100 text-sm">Empathetic guidance from Scripture</p>
          </div>
        </div>
        <div className="hidden sm:block">
           <Info className="w-5 h-5 text-indigo-300 cursor-help" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-6 mb-4 px-2" ref={scrollRef}>
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 ${
                m.role === 'user' ? 'bg-indigo-100 text-indigo-600 ml-3' : 'bg-slate-100 text-slate-600 mr-3'
              }`}>
                {m.role === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              </div>
              <div className={`p-4 rounded-2xl ${
                m.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none shadow-md' 
                  : 'bg-white text-slate-800 rounded-tl-none border border-slate-100 shadow-sm'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</p>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-2">
                <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
                <span className="text-xs font-medium text-slate-500 italic">Praying for the right words...</span>
             </div>
          </div>
        )}
      </div>

      <div className="relative">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="I'm feeling anxious about my future..."
          className="w-full pl-6 pr-14 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm"
        />
        <button 
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:bg-slate-300 transition-all"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
      <p className="text-center text-[10px] text-slate-400 mt-4 uppercase tracking-widest font-bold">
        Always consult with your local pastor and healthcare professionals for complex matters.
      </p>
    </div>
  );
};

export default CounselorView;
