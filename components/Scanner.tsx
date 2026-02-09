
import React, { useState, useRef } from 'react';
import { identifyClothingItem } from '../services/geminiService';
import { AnalysisResult, ClothingItem } from '../types';

interface ScannerProps {
  onItemAdded: (item: ClothingItem) => void;
}

const Scanner: React.FC<ScannerProps> = ({ onItemAdded }) => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setIsAnalyzing(true);
    try {
      const analysis = await identifyClothingItem(image);
      setResult(analysis);
    } catch (error) {
      console.error("Analysis failed:", error);
      alert("Failed to analyze image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = () => {
    if (!result || !image) return;
    // Added missing texture and vibe properties to conform to ClothingItem interface
    const newItem: ClothingItem = {
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
    };
    onItemAdded(newItem);
    setImage(null);
    setResult(null);
  };

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="serif text-3xl font-bold text-gray-800 mb-2">Scan Your Wardrobe</h2>
        <p className="text-gray-500">Capture your clothes from different angles. Our AI will recognize and categorize them for you.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        {!image ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-300 hover:bg-emerald-50 transition-all"
          >
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
            <p className="font-medium text-gray-700">Snap or Upload Photo</p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef} 
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="relative aspect-square rounded-2xl overflow-hidden group">
              <img src={image} alt="Preview" className="w-full h-full object-cover" />
              <button 
                onClick={() => setImage(null)}
                className="absolute top-4 right-4 bg-white/80 backdrop-blur p-2 rounded-full text-gray-600 hover:text-rose-500 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {!result && (
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full bg-gray-800 text-white py-4 rounded-xl font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Analyzing with Gemini...
                  </>
                ) : (
                  'Analyze Item'
                )}
              </button>
            )}

            {result && (
              <div className="animate-fade-in space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Type</p>
                    <p className="font-semibold text-gray-700">{result.name}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Eco Score</p>
                    {/* Fix: Use materialScore property from AnalysisResult interface */}
                    <p className={`font-semibold ${result.materialScore > 70 ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {result.materialScore}/100
                    </p>
                  </div>
                </div>

                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Sustainable Tip</p>
                  </div>
                  <p className="text-sm text-emerald-700 italic leading-relaxed">"{result.sustainabilityTip}"</p>
                </div>

                <button
                  onClick={handleSave}
                  className="w-full bg-emerald-600 text-white py-4 rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
                >
                  Save to Closet
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Scanner;
