
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Devotional, QuizQuestion } from '../types';

// Declare process for the TypeScript compiler in the browser context
declare var process: {
  env: {
    API_KEY?: string;
  };
};

const getAI = () => {
  const apiKey = process.env.API_KEY || '';
  return new GoogleGenAI({ apiKey });
};

export const getVerseExplanation = async (reference: string, text: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `As a biblical scholar, explain the historical context, theological significance, and modern application of this verse: "${reference}: ${text}". Use Markdown for formatting.`,
    config: { thinkingConfig: { thinkingBudget: 0 } }
  });
  return response.text;
};

export const getDailyDevotional = async (theme?: string): Promise<Devotional> => {
  const ai = getAI();
  const prompt = theme 
    ? `Create a structured daily devotional focused on the theme: ${theme}. Include a title, a key scripture reference, a reflective passage, a short prayer, and a practical application step.`
    : "Create a structured daily devotional for today. Include a title, a key scripture reference, a reflective passage, a short prayer, and a practical application step.";
    
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          scripture: { type: Type.STRING },
          reflection: { type: Type.STRING },
          prayer: { type: Type.STRING },
          application: { type: Type.STRING },
        },
        required: ["title", "scripture", "reflection", "prayer", "application"]
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const getAdventReflection = async (day: number): Promise<Devotional> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Create a Christmas Advent Devotional for Day ${day} of December. Focus on the coming of Jesus Christ, the prophecies leading to His birth, and the joy of Christmas. Include a title, key scripture, reflection, prayer, and application.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          scripture: { type: Type.STRING },
          reflection: { type: Type.STRING },
          prayer: { type: Type.STRING },
          application: { type: Type.STRING },
        },
        required: ["title", "scripture", "reflection", "prayer", "application"]
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const generateQuiz = async (book: string): Promise<QuizQuestion[]> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate 5 multiple-choice questions about the Bible book of ${book}. Provide the question, 4 options, the index of the correct answer (0-3), and a brief explanation of the answer.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswer: { type: Type.INTEGER },
            explanation: { type: Type.STRING }
          },
          required: ["question", "options", "correctAnswer", "explanation"]
        }
      }
    }
  });
  return JSON.parse(response.text || '[]');
};

export const getCounselingResponse = async (userMessage: string, chatHistory: {role: 'user'|'model', text: string}[]) => {
  const ai = getAI();
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: 'You are a compassionate, wise, and knowledgeable Biblical Counselor named Christos AI. Provide guidance based strictly on Biblical principles and the teachings of Jesus Christ. Be empathetic, encouraging, and clear. Always quote relevant verses to support your advice.',
    }
  });
  const response = await chat.sendMessage({ message: userMessage });
  return response.text;
};

export const speakVerse = async (text: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Read this scripture verse clearly and reverently: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });
  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  return base64Audio || null;
};

export function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
