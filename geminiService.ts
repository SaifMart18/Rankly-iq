
import { GoogleGenAI } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export type ReplyTone = 'professional' | 'iraqi' | 'friendly' | 'short';

export const generateReviewReply = async (review: string, tone: ReplyTone = 'iraqi') => {
  const ai = getAI();
  
  const toneInstructions = {
    professional: "استخدم لغة عربية فصحى احترافية جداً، ركز على الامتنان والحلول العملية.",
    iraqi: "استخدم لهجة عراقية بغدادية محببة وودودة جداً، استخدم مفردات مثل 'عيني، تدلل، نورتنا، غالي'.",
    friendly: "مزيج بين الفصحى البسيطة والود، كأنك تتحدث مع صديق.",
    short: "رد سريع ومباشر جداً، لا يتجاوز جملتين."
  };

  const prompt = `
    أنت خبير خدمة عملاء وبراندينج في العراق تعمل لدى Rankly IQ.
    المهمة: توليد رد على تقييم عميل في "Google Business Profile".
    
    نص التقييم: "${review}"
    النبرة المطلوبة: ${toneInstructions[tone]}
    
    القواعد:
    1. ابدأ بالتحية باسم النشاط (إذا لم يذكر، افترض أنه 'مركزنا').
    2. إذا كان التقييم إيجابياً: عبر عن سعادة غامرة وادعُ العميل للزيارة القادمة.
    3. إذا كان التقييم سلبياً: كن متفهماً جداً، اعتذر بلباقة، واطلب منه التواصل خاص لحل المشكلة (بدون وعود كاذبة).
    4. اجعل الرد يبدو كأنه من إنسان وليس روبوت.
    5. لا تزد عن 3-4 جمل.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.8,
        topP: 0.95,
        thinkingConfig: { thinkingBudget: 0 } // تعطيل التفكير العميق لسرعة البرق في الردود البسيطة
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
