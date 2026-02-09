
import React, { useState } from 'react';
import { ClothingItem, Category } from '../types';

interface ClosetGridProps {
  items: ClothingItem[];
  onRemove: (id: string) => void;
}

const ClosetGrid: React.FC<ClosetGridProps> = ({ items, onRemove }) => {
  const [filter, setFilter] = useState<Category | 'All'>('All');

  const calculateUtilityScore = (item: ClothingItem) => {
    // 5 points per wear, max 100
    return Math.min(100, item.timesWorn * 10);
  };

  const calculateTotalScore = (item: ClothingItem) => {
    // 40% material, 60% utility
    const utility = calculateUtilityScore(item);
    return Math.round((item.materialScore * 0.4) + (utility * 0.6));
  };

  const filteredItems = filter === 'All' 
    ? items 
    : items.filter(item => item.category === filter);

  return (
    <div className="space-y-8">
      <div className="flex overflow-x-auto pb-2 gap-3 no-scrollbar">
        {['All', ...Object.values(Category)].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat as any)}
            className={`px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all cute ${
              filter === cat 
                ? 'bg-black text-white shadow-md' 
                : 'bg-white text-gray-400 border border-gray-100 hover:border-gray-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
          <p className="text-gray-400 font-medium">No treasures found here yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
          {filteredItems.map((item) => {
            const totalScore = calculateTotalScore(item);
            return (
              <div key={item.id} className="group flex flex-col">
                <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden bg-gray-100 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
                  <img src={item.imageUrl} className="w-full h-full object-cover" alt={item.name} />
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-black text-white shadow-sm ${totalScore > 70 ? 'bg-emerald-500' : 'bg-black/60 backdrop-blur'}`}>
                       {totalScore}
                    </span>
                  </div>
                  <button 
                    onClick={() => onRemove(item.id)}
                    className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-rose-500"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                  <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur rounded-2xl p-3 transform translate-y-12 group-hover:translate-y-0 transition-transform">
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Utility Score</p>
                     <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${calculateUtilityScore(item)}%` }} />
                     </div>
                     <p className="text-[10px] font-bold mt-1">Worn {item.timesWorn} times</p>
                  </div>
                </div>
                <div className="mt-4 px-1">
                  <h3 className="font-bold text-gray-900 truncate leading-tight">{item.name}</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{item.material}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ClosetGrid;
