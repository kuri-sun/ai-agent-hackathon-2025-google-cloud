import {
  HarmBlockThreshold,
  HarmCategory,
  VertexAI,
} from "@google-cloud/vertexai";
import { Review } from "../../models/review";

type GeminiReviewOutput = {
  reviews: Review[];
};

// (Gemini) Generate email review result
export const generateEmailReviewResultFromGemini = async (
  emailContent: string
): Promise<GeminiReviewOutput> => {
  try {
    const project = process.env.GOOGLE_CLOUD_PROJECT_ID;
    const location = "us-central1";
    const textModel = "gemini-1.5-flash";
    const vertexAI = new VertexAI({ project: project, location: location });

    const generativeModel = vertexAI.getGenerativeModel({
      model: textModel,
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.2,
        topP: 1,
        topK: 32,
      },
    });

    const prompt = `
        近年では、メールの誤送信、内容の不備、敬語の使い間違い、など、ビジネスの場面でのメールに関するミスが多発しています。
        1. メールの内容と送り先、CC、BCCのアドレスが文脈から予測するに、適しているかどうか
        2. メールの内容が適切かどうか
        3. 敬語の使い方が正しいかどうか
        4. 添付ファイルが正しいかどうか
        5. メールの文面が適切かどうか
        6. メールのフォーマットが適切かどうか
        7. メールの文法が正しいかどうか
        8. メールの内容が適切かどうか

        以下のメール内容を確認し, レビューの出力を\`{ "reviews": [ { level: "danger" | "warning" | "info"; confidence: number;  comment: string; }, ... ] }\`のJSON Objectのみ、でお願いします。(そのままJSON.stringfyできるような形):
        ${emailContent}
      `;

    const result = await generativeModel.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const interpretation =
      result.response.candidates?.[0]?.content?.parts?.[0]?.text ??
      "No interpretation found";

    // Convert the interpretation to a review result
    const regex = /```json([\s\S]*?)```/;
    const match = interpretation.match(regex);
    if (!match) {
      throw new Error(
        "Vertext AI Error: Error generating email review result: JSON not found:" +
          interpretation
      );
    }
    const jsonString = match[1].trim();
    const reviews = JSON.parse(jsonString);

    return reviews;
  } catch (error) {
    console.error("error", error);
    throw new Error(
      "Vertext AI Error: Error generating email review result: " + error
    );
  }
};
