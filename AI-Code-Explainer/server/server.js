const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gemini AI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Route to explain code
app.post("/explain", async (req, res) => {
  const { code, codeLanguage, level, explaining } = req.body;

  if (!code) {
    return res.status(400).json({
      error:
        explaining === "english"
          ? "Code is required."
          : "కోడ్ అవసరం.",
    });
  }

  const langInstructions =
    explaining === "english"
      ? `Explain the following ${codeLanguage} code at a ${level} level:`
      : `ఈ క్రింది ${codeLanguage} కోడ్‌ను ${level} స్థాయి వద్ద వివరించండి:`;

  const prompt = `
You are a helpful assistant that explains code.

${langInstructions}

Explanation level: ${level}
Programming language: ${codeLanguage}

Explain the code clearly and concisely, including how it works and its purpose.

Code:
${code}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text =
      response.candidates?.[0]?.content?.parts?.[0]?.text;

    res.status(200).json({
      explanation: text || "No explanation generated.",
    });
  } catch (error) {
    console.error("Error explaining code:", error);
    res.status(500).json({
      error:
        explaining === "english"
          ? "Failed to explain the code."
          : "కోడ్‌ను వివరించడంలో విఫలమైంది.",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
