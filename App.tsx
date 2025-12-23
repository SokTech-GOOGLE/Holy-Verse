
import React, { useState, useEffect } from 'react';
import { 
  Book, 
  Search, 
  Heart, 
  MessageSquare, 
  Home, 
  Bookmark, 
  HelpCircle, 
  Volume2, 
  Sparkles,
  Menu,
  X,
  Star,
  ChevronRight
} from 'lucide-react';
import { AppRoute, Bookmark as BookmarkType } from './types';
import HomeView from './components/HomeView';
import ReaderView from './components/ReaderView';
import CounselorView from './components/CounselorView';
import DevotionalView from './components/DevotionalView';
import BookmarksView from './components/BookmarksView';
import QuizView from './components/QuizView';
import ExplainerView from './components/ExplainerView';
import ChristmasView from './components/ChristmasView';

const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(AppRoute.HOME);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
  const [selectedReference, setSelectedReference] = useState<{ref: string, text: string} | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('christos_bookmarks');
    if (saved) setBookmarks(JSON.parse(saved));
  }, []);

  const toggleBookmark = (ref: string, text: string) => {
    const exists = bookmarks.find(b => b.reference === ref);
    let updated;
    if (exists) {
      updated = bookmarks.filter(b => b.reference !== ref);
    } else {
      updated = [...bookmarks, { 
        id: Math.random().toString(36).substr(2, 9), 
        reference: ref, 
        text, 
        timestamp: Date.now() 
      }];
    }
    setBookmarks(updated);
    localStorage.setItem('christos_bookmarks', JSON.stringify(updated));
  };

  const navigate = (route: AppRoute) => {
    setCurrentRoute(route);
    setIsSidebarOpen(false);
  };

  const NavItem = ({ icon: Icon, label, route, badge }: { icon: any, label: string, route: AppRoute, badge?: string }) => (
    <button
      onClick={() => navigate(route)}
      className={`flex items-center w-full px-4 py-3 mb-2 rounded-xl transition-all ${
        currentRoute === route 
          ? 'bg-red-700 text-white shadow-lg shadow-red-100' 
          : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      <Icon className="w-5 h-5 mr-3" />
      <span className="font-medium">{label}</span>
      {badge && <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded-full uppercase">{badge}</span>}
      {currentRoute === route && <ChevronRight className="ml-auto w-4 h-4" />}
    </button>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden" 
          onClick={() => setIsSidebarOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:relative z-50 w-72 h-full bg-white border-r border-slate-100 transition-transform duration-300
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center mb-10 px-2 cursor-pointer" onClick={() => navigate(AppRoute.HOME)}>
            <div className="w-10 h-10 bg-red-700 rounded-xl flex items-center justify-center mr-3 shadow-lg transform rotate-3">
              <Star className="text-yellow-400 w-6 h-6 fill-current" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 italic">Christos</h1>
          </div>

          <nav className="flex-1 overflow-y-auto no-scrollbar">
            <NavItem icon={Home} label="Home" route={AppRoute.HOME} />
            <NavItem icon={Star} label="Advent Journey" route={AppRoute.CHRISTMAS} badge="Special" />
            <NavItem icon={Book} label="Bible Reader" route={AppRoute.READER} />
            <NavItem icon={MessageSquare} label="Counselor" route={AppRoute.COUNSELOR} />
            <NavItem icon={Heart} label="Devotionals" route={AppRoute.DEVOTIONAL} />
            <NavItem icon={HelpCircle} label="Bible Quiz" route={AppRoute.QUIZ} />
            <NavItem icon={Bookmark} label="Bookmarks" route={AppRoute.BOOKMARKS} />
            <div className="my-6 border-t border-slate-100"></div>
            <NavItem icon={Volume2} label="Audio Bible" route={AppRoute.READER} />
          </nav>

          <div className="mt-auto pt-6">
            <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
              <p className="text-[10px] font-black text-red-700 uppercase tracking-widest mb-2">Christ is Born</p>
              <p className="text-sm italic text-slate-700 leading-relaxed font-medium">
                "For unto us a child is born, unto us a son is given..."
              </p>
              <p className="text-xs text-slate-500 mt-2 font-bold uppercase">Isaiah 9:6</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-30">
          <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 text-slate-600">
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex-1 max-w-xl mx-4 relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search scripture or ask Christos AI..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-full text-sm focus:bg-white focus:ring-2 focus:ring-red-500/20 transition-all outline-none"
              onClick={() => navigate(AppRoute.READER)}
            />
          </div>

          <div className="flex items-center space-x-4">
             <button 
              onClick={() => navigate(AppRoute.CHRISTMAS)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors relative"
            >
              <Star className="w-5 h-5 fill-current text-yellow-500" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-red-900 border-2 border-white shadow-sm"></div>
          </div>
        </header>

        {/* Dynamic Route Rendering */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {currentRoute === AppRoute.HOME && <HomeView onNavigate={navigate} />}
          {currentRoute === AppRoute.READER && (
            <ReaderView 
              bookmarks={bookmarks} 
              onToggleBookmark={toggleBookmark} 
              onExplain={(ref, text) => {
                setSelectedReference({ref, text});
                setCurrentRoute(AppRoute.EXPLAINER);
              }}
            />
          )}
          {currentRoute === AppRoute.COUNSELOR && <CounselorView />}
          {currentRoute === AppRoute.DEVOTIONAL && <DevotionalView />}
          {currentRoute === AppRoute.BOOKMARKS && (
            <BookmarksView 
              bookmarks={bookmarks} 
              onNavigate={(ref) => {
                navigate(AppRoute.READER);
              }}
            />
          )}
          {currentRoute === AppRoute.QUIZ && <QuizView />}
          {currentRoute === AppRoute.CHRISTMAS && <ChristmasView />}
          {currentRoute === AppRoute.EXPLAINER && selectedReference && (
            <ExplainerView reference={selectedReference.ref} text={selectedReference.text} onBack={() => setCurrentRoute(AppRoute.READER)} />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
