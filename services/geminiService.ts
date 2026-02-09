
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, Category, ClothingItem, OutfitRecommendation, UserStyleMood } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const identifyClothingItem = async (base64Image: string): Promise<AnalysisResult> => {
  const ai = getAI();
  const model = 'gemini-3-flash-preview';

  const prompt = `Analyze this clothing item for a gender-neutral digital wardrobe. 
  Focus on TEXTURE (tactile feel) and VIBE (atmosphere/aesthetic).
  Provide the result in JSON.
  
  Constraints:
  - category: ${Object.values(Category).join(', ')}
  - materialScore: 1-100 based on ecological impact.
  - texture: Describe how it feels (e.g., 'heavy-knit', 'sheer-flowing', 'stiff-utilitarian').
  - vibe: Describe the atmosphere (e.g., 'minimalist-industrial', 'earthy-bohemian', 'sharp-editorial').`;

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        { text: prompt },
        { inlineData: { data: base64Image.split(',')[1], mimeType: 'image/jpeg' } }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          category: { type: Type.STRING },
          color: { type: Type.STRING },
          material: { type: Type.STRING },
          texture: { type: Type.STRING },
          vibe: { type: Type.STRING },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } },
          materialScore: { type: Type.NUMBER },
          sustainabilityTip: { type: Type.STRING }
        },
        required: ["name", "category", "color", "material", "texture", "vibe", "tags", "materialScore", "sustainabilityTip"]
      }
    }
  });

  return JSON.parse(response.text || '{}') as AnalysisResult;
};

export const getPersonalizedRecommendations = async (
  items: ClothingItem[],
  mood: UserStyleMood,
  inventory: ClothingItem[]
): Promise<OutfitRecommendation[]> => {
  const ai = getAI();
  const model = 'gemini-3-pro-preview';

  const inventoryDescription = inventory.map(item => 
    `- [ID: ${item.id}] ${item.name} (Texture: ${item.texture}, Vibe: ${item.vibe}, Worn: ${item.timesWorn})`
  ).join('\n');

  const prompt = `User Style Identity: "${mood.name}"
  User's definition of this mood: "${mood.description}"
  Keywords: ${mood.keywords.join(', ')}

  Current Wardrobe:
  ${inventoryDescription}

  Task: Suggest 3 outfits that strictly align with the user's PERSONAL definition of this mood. 
  Focus on matching TEXTURES and ATMOSPHERE. 
  Explain the 'vibeAlignment' based on how the textures complement each other.
  Avoid all gendered language. Use only the IDs provided.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            itemIds: { type: Type.ARRAY, items: { type: Type.STRING } },
            vibeAlignment: { type: Type.STRING },
            sustainabilityNote: { type: Type.STRING }
          },
          required: ["id", "title", "description", "itemIds", "vibeAlignment", "sustainabilityNote"]
        }
      }
    }
  });

  return JSON.parse(response.text || '[]') as OutfitRecommendation[];
};

export const getTryOnRecommendations = async (
  newItem: AnalysisResult,
  inventory: ClothingItem[]
): Promise<OutfitRecommendation[]> => {
  const ai = getAI();
  const model = 'gemini-3-pro-preview';

  const inventoryText = inventory.map(i => `- [ID: ${i.id}] ${i.name} (Texture: ${i.texture}, Vibe: ${i.vibe})`).join('\n');

  const prompt = `Considering a new item: ${newItem.name} (Texture: ${newItem.texture}, Vibe: ${newItem.vibe}).
  Current Closet:
  ${inventoryText}

  Show the user how this item integrates into their current aesthetic. Focus on "Atmospheric Synergy"—how this new texture interacts with their existing ones. 
  Avoid gendered terms. Return 2 outfit ideas.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            itemIds: { type: Type.ARRAY, items: { type: Type.STRING } },
            vibeAlignment: { type: Type.STRING },
            sustainabilityNote: { type: Type.STRING }
          },
          required: ["id", "title", "description", "itemIds", "vibeAlignment", "sustainabilityNote"]
        }
      }
    }
  });

  return JSON.parse(response.text || '[]') as OutfitRecommendation[];
};
