import { GoogleGenAI, Modality } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function editImage(base64ImageData: string, mimeType: string, prompt: string): Promise<{base64: string, mimeType: string} | null> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: [
        {
          inlineData: {
            data: base64ImageData,
            mimeType: mimeType,
          },
        },
        {
          text: prompt,
        },
      ],
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    // Extract the image data from the response
    const firstCandidate = response.candidates?.[0];
    const imagePart = firstCandidate?.content?.parts?.find(part => part.inlineData);

    if (imagePart && imagePart.inlineData) {
      return {
          base64: imagePart.inlineData.data,
          mimeType: imagePart.inlineData.mimeType,
      };
    }

    return null;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the Gemini API.");
  }
}