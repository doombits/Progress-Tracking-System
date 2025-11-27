import { GoogleGenAI, Type } from "@google/genai";
import { User, Topic } from "../types";

const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

export const generateQuizQuestions = async (topic: Topic, count: number = 5) => {
  if (!apiKey) return mockQuestions(count);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate ${count} MCQs for "${topic.title}". Return STRICT JSON.`,
      config: {
        responseMimeType: 'application/json',
         responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctIndex: { type: Type.INTEGER }
                }
              }
            }
          }
        }
      }
    });

    const json = JSON.parse(response.text || '{}');
    return json.questions || mockQuestions(count);
  } catch (error) {
    console.error("AI Quiz Gen Error", error);
    return mockQuestions(count);
  }
};

export const getAdaptiveRecommendation = async (user: User, lastScore: number) => {
  if (!apiKey) return "Move to next module.";
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Student ${user.name} scored ${lastScore}%. Suggest next step (max 10 words).`
    });
    return response.text;
  } catch (e) {
    return "Review the previous chapter.";
  }
};

export const chatWithTutor = async (history: {role: string, parts: {text: string}[]}[], message: string) => {
    if (!apiKey) return "AI services are offline.";
    try {
        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            history: history.map(h => ({ role: h.role, parts: h.parts }))
        });
        const result = await chat.sendMessage({ message });
        return result.text;
    } catch (e) {
        return "I am having trouble connecting.";
    }
}

const mockQuestions = (n: number) => Array.from({ length: n }).map((_, i) => ({
  question: `Mock Question ${i + 1}: What is the core concept of ${i}?`,
  options: ['Optimization', 'Security', 'Latency', 'Redundancy'],
  correctIndex: 0
}));
