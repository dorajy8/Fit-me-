
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'closet' | 'recommend' | 'log';
  onTabChange: (tab: 'closet' | 'recommend' | 'log') => void;
  onOpenScanner: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, onOpenScanner }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-8 py-6 flex justify-between items-center">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onTabChange('closet')}>
          {/* T-shirt shaped icon with white background fill and E inside */}
          <div className="relative w-10 h-10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg 
              viewBox="0 0 24 24" 
              className="w-full h-full fill-white stroke-black stroke-[1.5] drop-shadow-sm" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M7.5 3L4 7V11H6V21H18V11H20V7L16.5 3H7.5Z" strokeLinejoin="round" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-black font-black text-lg pointer-events-none pb-0.5">E</span>
          </div>
          
          <div className="flex flex-col -space-y-1">
            <h1 className="serif text-2xl font-black text-gray-900 tracking-tighter">fit-me</h1>
            <p className="cute text-[10px] font-bold text-gray-400 tracking-tight lowercase">| ecowardrobe organizer</p>
          </div>
        </div>
        
        <nav className="hidden md:flex gap-10 items-center">
          <button 
            onClick={() => onTabChange('closet')}
            className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'closet' ? 'text-black' : 'text-gray-300 hover:text-black'}`}
          >
            My Items
          </button>
          <button 
            onClick={() => onTabChange('recommend')}
            className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'recommend' ? 'text-black' : 'text-gray-300 hover:text-black'}`}
          >
            Stylist
          </button>
          <button 
            onClick={() => onTabChange('log')}
            className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'log' ? 'text-black' : 'text-gray-300 hover:text-black'}`}
          >
            Activity
          </button>
          <button 
            onClick={onOpenScanner}
            className="ml-6 bg-black text-white px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-black/20"
          >
            Scan Item
          </button>
        </nav>

        <div className="md:hidden">
           <button onClick={onOpenScanner} className="bg-black text-white p-3 rounded-full shadow-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
           </button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 py-12 max-w-7xl">
        {children}
      </main>

      <nav className="md:hidden fixed bottom-8 left-1/2 -translate-x-1/2 glass border border-gray-100 flex gap-10 px-10 py-4 rounded-full z-50 shadow-2xl">
        <button onClick={() => onTabChange('closet')} className={activeTab === 'closet' ? 'text-black' : 'text-gray-300'}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
        </button>
        <button onClick={() => onTabChange('recommend')} className={activeTab === 'recommend' ? 'text-black' : 'text-gray-300'}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
        </button>
        <button onClick={() => onTabChange('log')} className={activeTab === 'log' ? 'text-black' : 'text-gray-300'}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 00-2 2z" /></svg>
        </button>
      </nav>
    </div>
  );
};

export default Layout;
