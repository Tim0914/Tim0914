import React, { useState } from 'react';
import { Gift, Users, List, Sparkles } from 'lucide-react';
import { AppView, Participant } from './types';
import { InputModule } from './components/InputModule';
import { LuckyDrawModule } from './components/LuckyDrawModule';
import { GroupModule } from './components/GroupModule';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('input');
  const [participants, setParticipants] = useState<Participant[]>([]);

  const NavButton = ({ view, icon: Icon, label }: { view: AppView; icon: any; label: string }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`
        flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
        ${currentView === view 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
          : 'text-gray-600 hover:bg-white hover:text-indigo-600'}
      `}
    >
      <Icon className="w-4 h-4 mr-2" />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              HR 工具箱
            </h1>
          </div>

          <nav className="hidden md:flex items-center space-x-2 bg-slate-100/50 p-1 rounded-xl">
            <NavButton view="input" icon={List} label="名單管理" />
            <NavButton view="draw" icon={Gift} label="幸運抽籤" />
            <NavButton view="groups" icon={Users} label="自動分組" />
          </nav>

          <div className="flex items-center gap-2">
             <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                總人數: {participants.length}
             </span>
          </div>
        </div>
        
        {/* Mobile Nav */}
        <div className="md:hidden flex justify-around border-t border-gray-100 bg-white p-2">
            <NavButton view="input" icon={List} label="名單" />
            <NavButton view="draw" icon={Gift} label="抽籤" />
            <NavButton view="groups" icon={Users} label="分組" />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'input' && (
          <InputModule 
            participants={participants} 
            setParticipants={setParticipants} 
            onNext={() => setCurrentView('draw')}
          />
        )}
        
        {currentView === 'draw' && (
          <LuckyDrawModule participants={participants} />
        )}
        
        {currentView === 'groups' && (
          <GroupModule participants={participants} />
        )}
      </main>
      
    </div>
  );
};

export default App;