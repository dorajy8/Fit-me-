
import React, { useState, useRef } from 'react';
import { identifyClothingItem, getTryOnRecommendations } from '../services/geminiService';
import { AnalysisResult, ClothingItem, OutfitRecommendation } from '../types';

interface ScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onItemAdded: (item: ClothingItem) => void;
  existingItems: ClothingItem[];
}

const ScannerModal: React.FC<ScannerModalProps> = ({ isOpen, onClose, onItemAdded, existingItems }) => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [tryOnOutfits, setTryOnOutfits] = useState<OutfitRecommendation[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setIsAnalyzing(true);
    try {
      const analysis = await identifyClothingItem(image);
      setResult(analysis);
      const suggestions = await getTryOnRecommendations(analysis, existingItems);
      setTryOnOutfits(suggestions);
    } catch (error) {
      console.error(error);
      alert("Vibe check failed.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = () => {
    if (!result || !image) return;
    onItemAdded({
      id: Math.random().toString(36).substr(2, 9),
      name: result.name,
      category: result.category,
      color: result.color,
      material: result.material,
      texture: result.texture,
      vibe: result.vibe,
      imageUrl: image,
      materialScore: result.materialScore,
      timesWorn: 0,
      tags: result.tags,
      addedAt: Date.now()
    });
    reset();
    onClose();
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setTryOnOutfits([]);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl p-6 md:p-12">
        <button onClick={onClose} className="absolute top-8 right-8 text-gray-400 hover:text-black">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        {!image ? (
          <div className="text-center space-y-8 py-12">
            <h2 className="serif text-4xl font-bold">New Aesthetic Input</h2>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="aspect-video max-w-2xl mx-auto border-4 border-dashed border-gray-100 rounded-[3rem] flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-black/10 transition-all"
            >
              <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center mb-6 shadow-xl">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
              </div>
              <p className="font-bold text-xl serif">Input Visual Evidence</p>
              <input type="file" className="hidden" ref={fileInputRef} accept="image/*" onChange={handleFileChange} />
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
               <div className="aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl">
                 <img src={image} className="w-full h-full object-cover" alt="Input" />
               </div>
               {!result && (
                 <button 
                  onClick={handleAnalyze} 
                  disabled={isAnalyzing}
                  className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-widest disabled:opacity-50 transition-all hover:scale-[1.02]"
                >
                  {isAnalyzing ? "Analyzing Texture & Vibe..." : "Execute Vibe Check"}
                </button>
               )}
               {result && (
                 <button onClick={handleSave} className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-widest">
                   Confirm to Closet
                 </button>
               )}
            </div>

            <div className="space-y-10">
              {result && (
                <div className="animate-fade-in space-y-6">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Style Analysis</span>
                    <h3 className="serif text-3xl font-bold mt-1">{result.name}</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-4 bg-gray-50 rounded-2xl">
                        <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Texture</p>
                        <p className="font-bold italic text-gray-800">{result.texture}</p>
                     </div>
                     <div className="p-4 bg-gray-50 rounded-2xl">
                        <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Atmosphere</p>
                        <p className="font-bold italic text-gray-800">{result.vibe}</p>
                     </div>
                  </div>

                  <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 italic text-sm text-emerald-800">
                     "{result.sustainabilityTip}"
                  </div>
                </div>
              )}

              {result && tryOnOutfits.length > 0 && (
                <div className="space-y-6 animate-fade-in pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                     <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Atmospheric Synergy Preview</span>
                  </div>
                  <div className="space-y-4">
                    {tryOnOutfits.map(outfit => (
                      <div key={outfit.id} className="bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:border-black transition-colors">
                        <p className="font-black text-xs uppercase tracking-widest mb-2">{outfit.title}</p>
                        <p className="text-xs text-gray-500 leading-relaxed italic">"{outfit.vibeAlignment}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScannerModal;
