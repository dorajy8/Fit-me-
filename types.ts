
export enum Category {
  TOPS = 'Tops',
  BOTTOMS = 'Bottoms',
  OUTERWEAR = 'Outerwear',
  SHOES = 'Shoes',
  ACCESSORIES = 'Accessories',
  DRESSES = 'Dresses'
}

export interface UserStyleMood {
  id: string;
  name: string; // e.g., "My Version of Casual"
  description: string; // e.g., "Oversized silhouettes, soft linens, muted tones"
  keywords: string[];
  moodImageUrl?: string; // New: visual reference for the vibe
}

export interface ClothingItem {
  id: string;
  name: string;
  category: Category;
  color: string;
  material: string;
  texture: string; // New: focus on tactile feel
  vibe: string; // New: focus on atmosphere
  imageUrl: string;
  materialScore: number;
  timesWorn: number;
  lastWornAt?: number;
  tags: string[];
  addedAt: number;
}

export interface OutfitLog {
  id: string;
  date: string;
  itemIds: string[];
  moodName?: string;
}

export interface OutfitRecommendation {
  id: string;
  title: string;
  description: string;
  itemIds: string[];
  vibeAlignment: string; // Explanation of why the textures/vibe match
  sustainabilityNote: string;
}

export interface AnalysisResult {
  name: string;
  category: Category;
  color: string;
  material: string;
  texture: string;
  vibe: string;
  tags: string[];
  materialScore: number;
  sustainabilityTip: string;
}
