
import React, { useState } from 'react';
import { ClothingItem, OutfitRecommendation, UserStyleMood } from '../types';
import { getPersonalizedRecommendations } from '../services/geminiService';

interface OutfitIdeasProps {
  items: ClothingItem[];
  moods: UserStyleMood[];
}

const OutfitIdeas: React.FC<OutfitIdeasProps> = ({ items, moods }) => {
  const [selectedMood, setSelectedMood] = useState<UserStyleMood | null>(null);
  const [recommendations, setRecommendations] = useState<OutfitRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetIdeas = async (mood: UserStyleMood) => {
    if (items.length < 2) return;
    setSelectedMood(mood);
    setIsLoading(true);
    try {
      const ideas = await getPersonalizedRecommendations(items, mood, items);
      setRecommendations(ideas);
    } catch (error) {
      console.error(error);
      alert("Personalized styling unavailable.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="text-center">
        <h2 className="serif text-4xl font-bold text-gray-800 mb-2">Discover new fits everyday</h2>
        <p className="text-gray-500 italic">Select a vibe to curate combinations based on texture and atmosphere.</p>
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        {moods.length === 0 && (
          <p className="text-amber-600 bg-amber-50 px-6 py-3 rounded-full text-sm font-bold">
            Define your "Style" first in the My Style section to unlock personalized ideas.
          </p>
        )}
        {moods.map(mood => (
          <button 
            key={mood.id}
            onClick={() => handleGetIdeas(mood)}
            disabled={isLoading}
            className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
              selectedMood?.id === mood.id 
                ? 'bg-black text-white shadow-lg' 
                : 'bg-white text-gray-400 border border-gray-100 hover:border-black hover:text-black'
            }`}
          >
            {mood.name}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
           <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin" />
           <p className="serif text-xl italic font-bold">Curation in progress...</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {!isLoading && recommendations.map((rec) => (
          <div key={rec.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 flex flex-col hover:shadow-xl transition-all duration-500">
            <div className="p-8 flex-1 space-y-6">
              <div>
                <h3 className="serif text-2xl font-bold text-gray-900 leading-tight mb-2">{rec.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed italic">"{rec.description}"</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {rec.itemIds.map(id => {
                  const item = items.find(i => i.id === id);
                  return item ? (
                    <div key={id} className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-50">
                      <img src={item.imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={item.name} />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                         <span className="text-[10px] text-white font-bold uppercase">{item.texture}</span>
                      </div>
                    </div>
                  ) : null;
                })}
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Atmospheric Synergy</p>
                <p className="text-xs text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-2xl border-l-2 border-black italic">
                  {rec.vibeAlignment}
                </p>
              </div>
            </div>
            
            <div className="px-8 py-4 bg-black text-white/60 flex items-center justify-between">
               <span className="text-[10px] font-bold uppercase tracking-widest italic">{rec.sustainabilityNote}</span>
               <button className="text-white hover:underline text-[10px] font-black uppercase">Log Wear</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OutfitIdeas;
