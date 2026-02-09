
import React, { useState, useRef } from 'react';
import { UserStyleMood } from '../types';

interface StyleIdentityProps {
  moods: UserStyleMood[];
  onAddMood: (mood: Omit<UserStyleMood, 'id'>) => void;
  onRemoveMood: (id: string) => void;
}

const StyleIdentity: React.FC<StyleIdentityProps> = ({ moods, onAddMood, onRemoveMood }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newKeywords, setNewKeywords] = useState('');
  const [moodImage, setMoodImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMoodImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newDesc) return;
    onAddMood({
      name: newName,
      description: newDesc,
      keywords: newKeywords.split(',').map(s => s.trim()),
      moodImageUrl: moodImage || undefined,
    });
    setNewName('');
    setNewDesc('');
    setNewKeywords('');
    setMoodImage(null);
    setIsAdding(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="text-center">
        <h2 className="serif text-4xl font-bold mb-3">My Style</h2>
        <p className="text-gray-500 max-w-lg mx-auto italic">Define your unique aesthetic. These vibes guide the AI stylist in curating your looks.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {moods.map(mood => (
          <div key={mood.id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm relative group overflow-hidden flex flex-col hover:shadow-xl transition-all duration-500">
            {mood.moodImageUrl && (
              <div className="h-48 w-full overflow-hidden">
                <img src={mood.moodImageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={mood.name} />
              </div>
            )}
            <div className="p-8 relative flex-1">
              <button 
                onClick={() => onRemoveMood(mood.id)}
                className="absolute top-6 right-6 p-2 bg-white/80 backdrop-blur rounded-full text-gray-300 hover:text-rose-500 transition-colors z-10"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
              <h3 className="serif text-2xl font-bold text-gray-800 mb-2">{mood.name}</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-6 italic">"{mood.description}"</p>
              <div className="flex flex-wrap gap-2">
                {mood.keywords.map(kw => (
                  <span key={kw} className="text-[10px] font-black bg-gray-50 text-gray-400 px-3 py-1.5 rounded-full uppercase tracking-[0.15em] border border-gray-100">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}

        {isAdding ? (
          <form onSubmit={handleSubmit} className="bg-black text-white p-8 rounded-[2.5rem] space-y-6 animate-fade-in shadow-2xl relative">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`aspect-video w-full rounded-2xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-all overflow-hidden relative group`}
            >
              {moodImage ? (
                <>
                  <img src={moodImage} className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" alt="Mood preview" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-[10px] font-black uppercase tracking-widest bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">Change Image</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mb-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                  <p className="font-bold text-sm">Visual Inspiration</p>
                  <p className="text-[10px] text-white/40 mt-1">Optional image to anchor the vibe</p>
                </>
              )}
              <input 
                type="file" 
                className="hidden" 
                ref={fileInputRef} 
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            <div className="space-y-4">
              <input 
                autoFocus
                className="w-full bg-transparent border-b border-white/20 px-0 py-2 focus:border-white outline-none text-2xl font-bold serif transition-colors"
                placeholder="Vibe Name (e.g., Ethereal Utility)"
                value={newName}
                onChange={e => setNewName(e.target.value)}
              />
              <textarea 
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-white outline-none text-sm leading-relaxed min-h-[120px] transition-colors"
                placeholder="What does this mean to you?"
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
              />
              <input 
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-white outline-none text-[10px] font-black tracking-widest uppercase"
                placeholder="Keywords (silk, heavy, tech, flowing)"
                value={newKeywords}
                onChange={e => setNewKeywords(e.target.value)}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button type="submit" className="flex-1 bg-white text-black py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] transition-transform">
                Save Outfit
              </button>
              <button 
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setMoodImage(null);
                }} 
                className="px-6 text-white/40 font-black uppercase tracking-widest text-[10px] hover:text-white"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button 
            onClick={() => setIsAdding(true)}
            className="border-2 border-dashed border-gray-200 rounded-[2.5rem] p-12 flex flex-col items-center justify-center gap-4 text-gray-400 hover:bg-gray-50 hover:border-black/20 hover:text-black transition-all group min-h-[400px]"
          >
            <div className="w-16 h-16 bg-gray-50 group-hover:bg-black group-hover:text-white rounded-full flex items-center justify-center transition-all shadow-sm">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            </div>
            <div className="text-center">
              <p className="font-black uppercase tracking-[0.2em] text-xs">Define a New Vibe</p>
              <p className="text-[10px] mt-1 opacity-60">Add images & keywords for your next era</p>
            </div>
          </button>
        )}
      </div>
    </div>
  );
};

export default StyleIdentity;
