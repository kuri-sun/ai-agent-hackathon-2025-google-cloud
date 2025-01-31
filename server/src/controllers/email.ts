import { Request, Response } from "express";
import {
  HarmBlockThreshold,
  HarmCategory,
  VertexAI,
} from "@google-cloud/vertexai";

export const getEmails = async (req: Request, res: Response) => {
  try {
    // const query = req.query.q ? JSON.parse(req.query.q as string) : {};
    // const sortIn = req.query.sort_in || "desc";
    // const sortBy = req.query.sort_by || "createdAt";
    // const page = parseInt(req.query.page as string) || 1;
    // const limit = parseInt(req.query.limit as string) || 20;

    // TODO: Call Gmail API to get emails

    res.status(200).json({ message: "Get all emails" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const getEmail = async (req: Request, res: Response) => {
  try {
    // TODO: Call Gmail API to get emails

    res.status(200).json({ message: "Get all emails" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const generateEmailReviewResult = async (
  req: Request,
  res: Response
) => {
  try {
    const { emailContent } = req.body;

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
      generationConfig: { maxOutputTokens: 256 },
      systemInstruction: {
        role: "system",
        parts: [
          // FIXME: This should be based on each tenant's use case.
          {
            text: `サイマル・ダイレクトは、シカゴに本社を置く、オンラインのダイレクト・トゥ・コンシューマー(D2C)型のフットウェアおよびアパレル小売業者です。2008年に設立されたサイマル・ダイレクト(旧社名:アンターン)は、フェアトレードおよびB Corp認証を受けたサステナビリティに重点を置く企業であり、綿花農家と協力して地域社会に再投資を行っています。サイマルの衣料品の価格帯は、通常50ドルから300ドルの間です。2010年、サイマル・グループが若い世代の買い物客にアピールするデジタルに精通したビジネスに注力するようになると、同ホールディング会社はアンターンを買収し、サイマル・ダイレクトと改名しました。2019年、サイマル・ダイレクトは年間売上高700万ドルを報告し、従業員数は合計32名でした。サイマル・ダイレクトは、デジタルネイティブな小売業者です。あなたは、サイマル社のパーソナライズされたウィキです。`,
          },
        ],
      },
    });

    const prompt = `
        以下の顧客からのメールに対する返信を作成してください。
        敬語を使って、丁寧に対応してください。
        もしも、話から逸れてしまった場合は、適切な返信を作成してください。
        もしも、返信が難しい場合は、適切な返信を作成してください。

        顧客からのメール:
        ${emailContent}
      `;

    const result = await generativeModel.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const interpretation =
      result.response.candidates?.[0]?.content?.parts?.[0]?.text ??
      "No interpretation found";

    // TODO: Create ReviewResult data in the DB.

    res.status(200).json({ data: { interpretation } });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: error });
  }
};

export const replyEmail = async (req: Request, res: Response) => {
  try {
    // TODO: Call Gmail API to get emails

    res.status(200).json({ message: "Get all emails" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
