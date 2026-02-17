
import { GoogleGenAI } from "@google/genai";

// Ensure process.env.API_KEY is used exactly as per guidelines
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateReviewReply = async (review: string) => {
  const ai = getAI();
  const prompt = `
    You are an expert customer service manager for a business in Iraq.
    A customer left the following review on Google Business Profile: "${review}"
    
    Please generate a warm, professional, and friendly response.
    - Provide the response in both Modern Standard Arabic AND Iraqi Dialect (لهجة عراقية).
    - If the review is positive, thank them and invite them back.
    - If the review is negative, apologize professionally and ask them to contact support.
    - Keep it concise.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.9,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const generateGMBPost = async (businessType: string, event: string, city: string) => {
  const ai = getAI();
  const prompt = `
    Generate an engaging Google Business Profile post for a "${businessType}" located in "${city}".
    The post should be about: "${event}".
    
    Include:
    1. A catchy headline.
    2. Body text in a mix of professional Arabic and Iraqi dialect that appeals to the local market.
    3. A clear Call to Action (CTA).
    4. Relevant local and business hashtags (e.g., #بغداد #العراق #RanklyIQ).
    
    Format the output nicely with emojis.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.8,
        topP: 0.9,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
