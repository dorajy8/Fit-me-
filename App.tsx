
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import ClosetGrid from './components/ClosetGrid';
import ScannerModal from './components/ScannerModal';
import OutfitIdeas from './components/OutfitIdeas';
import OutfitLogView from './components/OutfitLog';
import StyleIdentity from './components/StyleIdentity';
import { ClothingItem, OutfitLog, UserStyleMood } from './types';

const ITEMS_KEY = 'eco_wardrobe_items_personalized';
const LOGS_KEY = 'eco_wardrobe_logs_personalized';
const MOODS_KEY = 'eco_wardrobe_moods_personalized';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'closet' | 'recommend' | 'log' | 'identity'>('closet');
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [logs, setLogs] = useState<OutfitLog[]>([]);
  const [moods, setMoods] = useState<UserStyleMood[]>([]);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  useEffect(() => {
    const savedItems = localStorage.getItem(ITEMS_KEY);
    const savedLogs = localStorage.getItem(LOGS_KEY);
    const savedMoods = localStorage.getItem(MOODS_KEY);
    if (savedItems) setItems(JSON.parse(savedItems));
    if (savedLogs) setLogs(JSON.parse(savedLogs));
    if (savedMoods) setMoods(JSON.parse(savedMoods));
  }, []);

  useEffect(() => {
    localStorage.setItem(ITEMS_KEY, JSON.stringify(items));
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
    localStorage.setItem(MOODS_KEY, JSON.stringify(moods));
  }, [items, logs, moods]);

  const handleItemAdded = (item: ClothingItem) => {
    setItems(prev => [item, ...prev]);
    setActiveTab('closet');
  };

  const handleRemoveItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleAddLog = (logData: Omit<OutfitLog, 'id'>) => {
    const newLog: OutfitLog = { ...logData, id: Math.random().toString(36).substr(2, 9) };
    setLogs(prev => [newLog, ...prev]);
    setItems(prev => prev.map(item => {
      if (logData.itemIds.includes(item.id)) {
        return { ...item, timesWorn: item.timesWorn + 1, lastWornAt: Date.now() };
      }
      return item;
    }));
  };

  const handleAddMood = (mood: Omit<UserStyleMood, 'id'>) => {
    const newMood: UserStyleMood = { ...mood, id: Math.random().toString(36).substr(2, 9) };
    setMoods(prev => [...prev, newMood]);
  };

  const handleRemoveMood = (id: string) => {
    setMoods(prev => prev.filter(m => m.id !== id));
  };

  return (
    <Layout 
      activeTab={activeTab === 'identity' ? 'closet' : activeTab as any} 
      onTabChange={(t) => {
        setActiveTab(t as any);
      }} 
      onOpenScanner={() => setIsScannerOpen(true)}
    >
      {/* Sub-nav for Items/Style */}
      {activeTab === 'closet' || activeTab === 'identity' ? (
        <div className="flex gap-8 mb-12 border-b border-gray-100">
           <button 
             onClick={() => setActiveTab('closet')}
             className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'closet' ? 'border-b-2 border-black text-black' : 'text-gray-300'}`}
           >
             My Items
           </button>
           <button 
             onClick={() => setActiveTab('identity')}
             className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'identity' ? 'border-b-2 border-black text-black' : 'text-gray-300'}`}
           >
             My Style
           </button>
        </div>
      ) : null}

      <div className="animate-fade-in pb-20">
        {activeTab === 'closet' && (
          <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h2 className="serif text-5xl font-bold text-gray-900">My Items</h2>
                <p className="text-gray-400 mt-2 font-medium italic">A curated collection of {items.length} pieces.</p>
              </div>
            </div>
            <ClosetGrid items={items} onRemove={handleRemoveItem} />
          </div>
        )}

        {activeTab === 'identity' && (
          <StyleIdentity moods={moods} onAddMood={handleAddMood} onRemoveMood={handleRemoveMood} />
        )}

        {activeTab === 'recommend' && (
          <OutfitIdeas items={items} moods={moods} />
        )}

        {activeTab === 'log' && (
          <OutfitLogView items={items} logs={logs} onAddLog={handleAddLog} />
        )}
      </div>

      <ScannerModal 
        isOpen={isScannerOpen} 
        onClose={() => setIsScannerOpen(false)} 
        onItemAdded={handleItemAdded} 
        existingItems={items}
      />
    </Layout>
  );
};

export default App;
