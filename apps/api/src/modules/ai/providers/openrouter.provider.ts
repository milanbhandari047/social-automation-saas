import axios from "axios";

/**
 * =========================
 * OPENROUTER AI GENERATE
 * =========================
 */

export const openrouterGenerate = async (prompt: string) => {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini", // you can change model later
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000", // change in production
          "X-Title": "Social Automation SaaS",
        },
        timeout: 15000,
      }
    );

    const text = response.data?.choices?.[0]?.message?.content;

    if (!text) {
      throw new Error("Empty response from OpenRouter");
    }

    return text;
  } catch (error: any) {
    console.log("❌ OpenRouter Error:", error?.response?.data || error.message);

    return null;
  }
};
