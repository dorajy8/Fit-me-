
import React, { useState } from 'react';
import { ClothingItem, OutfitLog } from '../types';

interface OutfitLogProps {
  items: ClothingItem[];
  logs: OutfitLog[];
  onAddLog: (log: Omit<OutfitLog, 'id'>) => void;
}

const OutfitLogView: React.FC<OutfitLogProps> = ({ items, logs, onAddLog }) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);

  const toggleItem = (id: string) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleSave = () => {
    if (selectedItems.length === 0) return;
    onAddLog({
      date: new Date().toISOString().split('T')[0],
      itemIds: selectedItems,
    });
    setSelectedItems([]);
    setShowForm(false);
  };

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center">
        <h2 className="serif text-4xl font-bold mb-3">Maximize Your Utility</h2>
        <p className="text-gray-500">The most sustainable item is the one you wear often.</p>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-8">
           <h3 className="font-bold text-lg">Activity Log</h3>
           <button 
             onClick={() => setShowForm(!showForm)}
             className="text-sm font-bold bg-gray-100 px-4 py-2 rounded-full hover:bg-black hover:text-white transition-all"
           >
             {showForm ? 'Cancel' : 'Log Today\'s Outfit'}
           </button>
        </div>

        {showForm && (
          <div className="mb-10 space-y-6 animate-fade-in bg-gray-50 p-6 rounded-3xl">
             <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Select what you wore today:</p>
             <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
               {items.map(item => (
                 <button 
                   key={item.id}
                   onClick={() => toggleItem(item.id)}
                   className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${selectedItems.includes(item.id) ? 'border-black' : 'border-transparent'}`}
                 >
                   <img src={item.imageUrl} className="w-full h-full object-cover" />
                   {selectedItems.includes(item.id) && (
                     <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                     </div>
                   )}
                 </button>
               ))}
             </div>
             <button 
               onClick={handleSave}
               className="w-full bg-black text-white py-3 rounded-xl font-bold"
             >
               Confirm Outfit
             </button>
          </div>
        )}

        <div className="grid grid-cols-7 gap-2">
          {last7Days.map(date => {
            const dayLogs = logs.filter(l => l.date === date);
            const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
            return (
              <div key={date} className="text-center space-y-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase">{dayName}</span>
                <div className={`aspect-square rounded-2xl border-2 flex items-center justify-center transition-all ${dayLogs.length > 0 ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-100 bg-gray-50'}`}>
                  {dayLogs.length > 0 ? (
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                  ) : (
                    <span className="text-xs text-gray-300">{new Date(date).getDate()}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OutfitLogView;
