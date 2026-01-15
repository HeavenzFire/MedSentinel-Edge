
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { ClinicalInsight } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeClinicalNote = async (noteContent: string): Promise<ClinicalInsight> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze the following clinical encounter. Provide a summary, extract medications/diagnoses/vitals, list risks with severity, and suggest a checklist. 
    
    CONTENT: ${noteContent}`,
    config: {
      systemInstruction: "You are the MedSentinel Edge Clinical Engine. You operate at the edge to support clinicians in low-resource environments. Provide high-accuracy structured medical data. Be concise.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          risks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                severity: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ["severity", "description"]
            }
          },
          structuredData: {
            type: Type.OBJECT,
            properties: {
              medications: { type: Type.ARRAY, items: { type: Type.STRING } },
              diagnoses: { type: Type.ARRAY, items: { type: Type.STRING } },
              vitals: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: { name: { type: Type.STRING }, value: { type: Type.STRING } }
                }
              }
            }
          },
          checklist: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["summary", "risks", "structuredData", "checklist"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("Empty response");
  return JSON.parse(text) as ClinicalInsight;
};

export const analyzeClinicalImage = async (base64Data: string, mimeType: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Data, mimeType } },
        { text: "Identify any clinical information in this image: medication labels, chart data, or visual symptoms. Be extremely clinical and precise." }
      ]
    }
  });
  return response.text || "No clinical data detected in image.";
};

export const connectLiveAssistant = (callbacks: any) => {
  const aiLive = new GoogleGenAI({ apiKey: process.env.API_KEY });
  return aiLive.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-12-2025',
    callbacks,
    config: {
      responseModalities: [Modality.AUDIO],
      systemInstruction: "You are a real-time clinical assistant for Dr. Hulse. Listen to his dictation during an encounter. Provide subtle verbal confirmations if asked, but primarily focus on transcribing and summarizing. If he mentions a medication dose that seems unusual, flag it gently.",
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } }
      }
    }
  });
};
