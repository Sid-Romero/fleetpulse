import { GoogleGenAI } from "@google/genai";
import { Vehicle } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateFleetInsight = async (vehicles: Vehicle[]): Promise<string> => {
  if (!apiKey) {
    return "API Key not configured. Unable to generate AI insights.";
  }

  try {
    const dataSummary = vehicles.map(v => 
      `${v.model} (${v.status}): Battery ${v.batteryLevel}%, Speed ${v.speed}km/h, Efficiency ${v.efficiency}`
    ).join('\n');

    const prompt = `
      Act as a senior fleet manager AI. Analyze the following fleet status data and provide a concise, strategic insight (max 2 sentences) focusing on optimization or immediate attention items.
      Keep the tone professional and "quiet luxury".
      
      Data:
      ${dataSummary}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Fleet operating within normal parameters.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to generate insight at this time.";
  }
};
