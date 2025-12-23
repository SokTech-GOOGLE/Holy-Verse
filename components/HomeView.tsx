
import React from 'react';
import { AppRoute } from '../types';
import { 
  BookOpen, 
  MessageCircle, 
  Sparkles, 
  Heart, 
  Clock, 
  ChevronRight,
  Star,
  Award
} from 'lucide-react';

interface HomeViewProps {
  onNavigate: (route: AppRoute) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-10">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-red-800 p-8 md:p-12 text-white shadow-2xl christmas-glow">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center space-x-2 text-yellow-400 mb-4 font-black uppercase tracking-widest text-sm">
            <Star className="w-4 h-4 fill-current" />
            <span>Christmas Season</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">Glory to God in the Highest.</h2>
          <p className="text-red-100 text-lg mb-8 leading-relaxed italic">
            "And she shall bring forth a son, and thou shalt call his name JESUS: for he shall save his people from their sins." — Matthew 1:21
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => onNavigate(AppRoute.CHRISTMAS)}
              className="bg-yellow-500 text-red-900 px-8 py-3 rounded-xl font-black flex items-center shadow-lg hover:bg-yellow-400 transition-all transform hover:scale-105"
            >
              <Star className="w-5 h-5 mr-2 fill-current" />
              Advent Journey
            </button>
            <button 
              onClick={() => onNavigate(AppRoute.READER)}
              className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-6 py-3 rounded-xl font-bold flex items-center hover:bg-white/20 transition-all"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Read Gospels
            </button>
          </div>
        </div>
        {/* Decorative Assets */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-red-600 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 right-0 translate-y-1/2 translate-x-1/4 w-96 h-96 bg-red-900 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute top-10 right-10 animate-pulse text-yellow-400 opacity-20 hidden md:block">
           <Star size={120} className="fill-current" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-slate-900">Featured Features</h3>
              <button className="text-sm font-black text-red-700 hover:text-red-800 uppercase tracking-wider">Explore All</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FeatureCard 
                title="Advent Devotion" 
                desc="Daily steps towards the manger." 
                icon={Star} 
                color="red"
                onClick={() => onNavigate(AppRoute.CHRISTMAS)}
              />
              <FeatureCard 
                title="Jesus Counselor" 
                desc="Biblical guidance for your life." 
                icon={MessageCircle} 
                color="blue"
                onClick={() => onNavigate(AppRoute.COUNSELOR)}
              />
              <FeatureCard 
                title="Scripture Quiz" 
                desc="Test your knowledge of the Word." 
                icon={Award} 
                color="amber"
                onClick={() => onNavigate(AppRoute.QUIZ)}
              />
              <FeatureCard 
                title="Topic Explorer" 
                desc="Find hope, peace, and salvation." 
                icon={Sparkles} 
                color="emerald"
                onClick={() => onNavigate(AppRoute.READER)}
              />
            </div>
          </section>

          <section>
             <h3 className="text-2xl font-black text-slate-900 mb-6">Recommended Readings</h3>
             <div className="bg-white rounded-3xl border border-slate-100 p-8 flex items-start space-x-6 hover:shadow-xl transition-all group cursor-pointer">
               <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-red-700 transition-colors">
                  <BookOpen className="text-red-700 w-7 h-7 group-hover:text-white" />
               </div>
               <div className="flex-1">
                 <div className="flex items-center justify-between mb-2">
                    <h4 className="font-black text-xl text-slate-900">The Birth of the King</h4>
                    <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full uppercase">Popular</span>
                 </div>
                 <p className="text-slate-500 mb-6 leading-relaxed">Dive into the historical and spiritual account of Christ's arrival in the Book of Luke.</p>
                 <button className="text-sm font-black text-red-700 flex items-center group-hover:translate-x-2 transition-transform">
                   Start Reading <ChevronRight className="w-4 h-4 ml-1" />
                 </button>
               </div>
             </div>
          </section>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center mb-6">
              <Clock className="w-5 h-5 text-red-700 mr-2" />
              <h3 className="font-black text-slate-900">Recent Steps</h3>
            </div>
            <ul className="space-y-5">
              <ActivityItem text="Read Matthew 1" time="15m ago" />
              <ActivityItem text="Day 3 Advent Completed" time="3h ago" />
              <ActivityItem text="Bookmarked John 1:1" time="Yesterday" />
            </ul>
          </div>

          <div className="bg-gradient-to-br from-red-900 to-red-950 rounded-3xl p-8 text-white relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="font-black text-xl mb-3">Nativity Reflection</h3>
              <p className="text-red-200 text-sm mb-6 leading-relaxed">Let Christos AI write a personalized family reflection for your Christmas dinner.</p>
              <button 
                onClick={() => onNavigate(AppRoute.COUNSELOR)}
                className="w-full py-3 bg-white text-red-900 rounded-xl text-sm font-black hover:bg-red-50 transition-all shadow-lg"
              >
                Generate Reflection
              </button>
            </div>
            <Star className="absolute -bottom-6 -right-6 text-red-800 w-32 h-32 opacity-20 group-hover:scale-125 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ title, desc, icon: Icon, color, onClick }: any) => {
  const colors: any = {
    red: 'bg-red-50 text-red-700 group-hover:bg-red-700',
    blue: 'bg-blue-50 text-blue-700 group-hover:bg-blue-700',
    amber: 'bg-amber-50 text-amber-700 group-hover:bg-amber-700',
    emerald: 'bg-emerald-50 text-emerald-700 group-hover:bg-emerald-700',
  };
  return (
    <button 
      onClick={onClick}
      className="text-left bg-white p-6 rounded-3xl border border-slate-100 hover:border-red-100 hover:shadow-2xl hover:shadow-red-500/5 transition-all group"
    >
      <div className={`w-12 h-12 ${colors[color]} rounded-xl flex items-center justify-center mb-5 transition-all group-hover:text-white group-hover:scale-110`}>
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="font-black text-slate-900 mb-1 text-lg">{title}</h4>
      <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
    </button>
  );
};

const ActivityItem = ({ text, time }: { text: string, time: string }) => (
  <li className="flex items-center justify-between group cursor-pointer border-b border-slate-50 pb-3 last:border-0 last:pb-0">
    <span className="text-sm text-slate-700 group-hover:text-red-700 font-medium transition-colors">{text}</span>
    <span className="text-[10px] text-slate-400 uppercase font-black">{time}</span>
  </li>
);

export default HomeView;
