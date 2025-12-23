
import React, { useState } from 'react';
import { Loader2, CheckCircle2, XCircle, Award, RefreshCcw, ChevronRight } from 'lucide-react';
import { generateQuiz } from '../services/geminiService';
import { QuizQuestion } from '../types';
import { BOOKS } from '../services/bibleService';

const QuizView: React.FC = () => {
  const [book, setBook] = useState('Genesis');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const startQuiz = async () => {
    setLoading(true);
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsFinished(false);
    try {
      const data = await generateQuiz(book);
      setQuestions(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    if (index === questions[currentIndex].correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(c => c + 1);
      setSelectedAnswer(null);
    } else {
      setIsFinished(true);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 space-y-4">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        <h2 className="text-2xl font-bold text-slate-900">Crafting your quiz...</h2>
        <p className="text-slate-500">Searching the scrolls of {book} for questions.</p>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="max-w-2xl mx-auto p-6 md:p-10 text-center space-y-8">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-amber-100 rounded-full mb-4">
          <Award className="w-12 h-12 text-amber-600" />
        </div>
        <h2 className="text-4xl font-bold text-slate-900">Well Done!</h2>
        <p className="text-slate-500 text-lg">You scored {score} out of {questions.length} on the {book} quiz.</p>
        <div className="flex justify-center space-x-4">
          <button 
            onClick={startQuiz}
            className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-all flex items-center"
          >
            <RefreshCcw className="w-5 h-5 mr-2" /> Try Again
          </button>
          <button 
            onClick={() => setQuestions([])}
            className="px-8 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
          >
            Pick New Book
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6 md:p-10 text-center space-y-10">
        <div className="space-y-4">
          <Award className="w-16 h-16 text-amber-500 mx-auto" />
          <h2 className="text-3xl font-black text-slate-900">Scripture Knowledge</h2>
          <p className="text-slate-500">Choose a book of the Bible to challenge your understanding.</p>
        </div>
        <div className="flex flex-col items-center space-y-4">
          <select 
            value={book}
            onChange={(e) => setBook(e.target.value)}
            className="w-full max-w-sm px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 focus:ring-4 focus:ring-indigo-500/10 outline-none"
          >
            {BOOKS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          <button 
            onClick={startQuiz}
            className="w-full max-w-sm px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center"
          >
            Start Quiz <ChevronRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    );
  }

  const current = questions[currentIndex];

  return (
    <div className="max-w-2xl mx-auto p-6 md:p-10 space-y-10">
      <div className="flex items-center justify-between mb-8">
         <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest">Question {currentIndex + 1} of {questions.length}</span>
         <span className="text-sm font-bold text-slate-400">Score: {score}</span>
      </div>

      <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
        <h3 className="text-2xl font-bold text-slate-900 mb-8">{current.question}</h3>
        <div className="space-y-4">
          {current.options.map((opt, i) => {
            let style = "bg-slate-50 border-transparent text-slate-700 hover:bg-slate-100";
            if (selectedAnswer !== null) {
              if (i === current.correctAnswer) style = "bg-emerald-50 border-emerald-500 text-emerald-700";
              else if (i === selectedAnswer) style = "bg-rose-50 border-rose-500 text-rose-700";
              else style = "opacity-50 bg-slate-50 grayscale";
            }

            return (
              <button
                key={i}
                disabled={selectedAnswer !== null}
                onClick={() => handleAnswer(i)}
                className={`w-full text-left px-6 py-4 rounded-2xl border-2 transition-all font-medium flex items-center justify-between group ${style}`}
              >
                {opt}
                {selectedAnswer !== null && i === current.correctAnswer && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                {selectedAnswer !== null && i === selectedAnswer && i !== current.correctAnswer && <XCircle className="w-5 h-5 text-rose-500" />}
              </button>
            );
          })}
        </div>
      </div>

      {selectedAnswer !== null && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-6 bg-slate-900 text-white rounded-3xl">
            <h4 className="font-bold mb-2 uppercase tracking-widest text-xs text-indigo-400">Context</h4>
            <p className="text-slate-300 text-sm leading-relaxed">{current.explanation}</p>
          </div>
          <button 
            onClick={nextQuestion}
            className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center"
          >
            {currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            <ChevronRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizView;
