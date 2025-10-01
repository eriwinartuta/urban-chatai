// proses import dependency ke dalam file index.js
import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

import "dotenv/config";

const app = express();
const ai = new GoogleGenAI({});

app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  const { body } = req;
  const { prompt } = body;

  if (!prompt || typeof prompt !== "string") {
    res.status(400).json({
      message: "Prompt harus diisi dan berupa string!",
      data: null,
      success: false,
    });
    return;
  }

  try {
    const aiResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    });

    res.status(200).json({
      success: true,
      data: aiResponse.text,
      message: "Berhasil ditanggapi oleh Google Gemini Flash!",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      data: null,
      message: e.message || "Ada masalah di server!",
    });
  }
});

// entry point-nya
app.listen(3000, () => {
  console.log("Chatbot Gemini Mantap !!");
});
