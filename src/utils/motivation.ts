import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,   
});

export async function getMotivationMessage(reps: number): Promise<string> {
  try {
    const prompt = `
      Generate a short, powerful, motivational one-liner (2-5 words) celebrating
      the completion of ${reps} reps. 
      It should feel like a fitness trainer speaking.
      Please give only one message. No stars or anything needed. 
      Just plain message with puntuation wherever needed.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });


    const text = response.text || "Great job! Keep pushing!";
    return text;

  } catch (error) {
    console.error("Gemini Error:", error);
    return "Great job! Keep pushing!";
  }
}
