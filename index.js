import express from "express";
import cors from "cors";
import multer from "multer";
import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const upload = multer({ storage: multer.memoryStorage() });

app.post("/chat", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({
      success: false,
      data: null,
      message: "Prompt harus diisi dan berupa string!",
    });
  }

  try {
    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
    const aiResponse = await model.generateContent(prompt);

    res.status(200).json({
      success: true,
      data: aiResponse.response.text(),
      message: "Berhasil ditanggapi oleh Google Gemini Flash!",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      data: null,
      message: e.message || "Ada masalah di server!",
    });
  }
});

app.post("/jelasingambar", upload.single("image"), async (req, res) => {
  try {
    const { prompt } = req.body;
    const imageBase64 = req.file.buffer.toString("base64");

    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

    const resp = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: req.file.mimetype,
                data: imageBase64,
              },
            },
          ],
        },
      ],
    });

    const resultText = resp.response.text();
    res.json({ success: true, result: resultText });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Entry point
app.listen(3000, () => {
  console.log("🚀 Chatbot Gemini jalan di http://localhost:3000");
});
