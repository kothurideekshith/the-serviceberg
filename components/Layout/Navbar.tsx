import React from 'react';
import { Zap, MapPin, Search, ChevronDown, ChevronLeft, Settings, Briefcase } from 'lucide-react';

interface NavbarProps {
  location: string;
  onLocationClick: () => void;
  onNavigate: (view: 'home' | 'category' | 'provider' | 'jobs' | 'admin' | 'auth', categoryId?: string | null, providerId?: string | null, authMode?: 'login' | 'signup' | 'partner') => void;
  currentView: string;
}

export const Navbar: React.FC<NavbarProps> = ({ location, onLocationClick, onNavigate, currentView }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 px-6 py-6 md:px-12">
      <div className="mx-auto max-w-[1472px] flex items-center justify-between bg-white/90 backdrop-blur-xl border border-smoke px-6 py-3 rounded-full shadow-lg shadow-black/5">
        <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => onNavigate('home')}>
          <div className="h-10 w-10 rounded-xl bg-lemon flex items-center justify-center text-ink/70 shadow-sm">
            <Zap size={22} fill="currentColor" strokeWidth={0} />
          </div>
          <span className="text-xl font-bold tracking-tighter text-ink hidden sm:inline">Serviceberg</span>
        </div>

        <div className="hidden lg:flex items-center gap-4 flex-1 justify-center max-w-2xl px-8">
          <button 
            onClick={onLocationClick} 
            className="flex items-center gap-3 border border-smoke rounded-xl px-5 py-2.5 hover:bg-pearl transition-all group shrink-0"
          >
            <MapPin size={18} className="text-ink/40 group-hover:text-ink" />
            <span className="text-sm font-bold text-ink/60 group-hover:text-ink">{location}</span>
            <ChevronDown size={18} className="text-ink/30" />
          </button>
          <div className="flex items-center gap-3 border border-smoke rounded-xl px-5 py-2.5 bg-white flex-1 focus-within:border-lemon transition-all">
            <Search size={18} className="text-ink/40" />
            <input 
              type="text" 
              placeholder="Search for premium services..." 
              className="bg-transparent border-none outline-none text-sm font-bold text-ink w-full" 
            />
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {currentView !== 'home' && (
            <button 
              onClick={() => onNavigate('home')} 
              className="flex items-center gap-2 rounded-xl border border-smoke px-4 py-2.5 text-sm font-bold hover:bg-pearl transition-all"
            >
              <ChevronLeft size={16} /> Back
            </button>
          )}

          <div className="hidden md:flex items-center gap-2 mr-2">
            <button 
              onClick={() => onNavigate('auth', null, null, 'login')}
              className="px-4 py-2.5 rounded-xl text-sm font-bold text-ink hover:bg-pearl transition-all"
            >
              Log in
            </button>
            <button 
              onClick={() => onNavigate('auth', null, null, 'signup')}
              className="px-5 py-2.5 rounded-xl text-sm font-bold bg-ink text-white hover:bg-ink/90 transition-all shadow-lg shadow-ink/10"
            >
              Sign up
            </button>
          </div>
          
          <button 
            onClick={() => onNavigate('admin')}
            className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition-all group ${currentView === 'admin' ? 'bg-ink text-white border-ink' : 'border-smoke hover:bg-pearl text-ink/40 hover:text-ink'}`}
          >
            <Settings size={16} className={currentView === 'admin' ? 'text-white' : 'text-ink/40 group-hover:text-ink'} />
            <span className="hidden sm:inline">Admin</span>
          </button>

          <button 
            onClick={() => onNavigate('jobs')}
            className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition-all group ${currentView === 'jobs' ? 'bg-ink text-white border-ink' : 'border-smoke hover:bg-pearl text-ink/40 hover:text-ink'}`}
          >
            <Briefcase size={16} className={currentView === 'jobs' ? 'text-white' : 'text-ink/40 group-hover:text-ink'} />
            <span className="hidden sm:inline">Apply for jobs</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
