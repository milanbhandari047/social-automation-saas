import { groqGenerate } from "./providers/groq.provider";
import { geminiGenerate } from "./providers/gemini.provider";
import { buildCaptionPrompt } from "./prompts/caption.prompt";

export const generateCaptionAI = async ({
  topic,
  tone,
  platform,
}: {
  topic: string;
  tone: string;
  platform: string;
}) => {
  const prompt = buildCaptionPrompt({
    topic,
    tone,
    platform,
  });

  // =========================
  // PRIMARY AI => GROQ
  // =========================

  try {
    console.log("🔥 Trying Groq...");

    const result = await groqGenerate(prompt);

    if (result) {
      return {
        caption: result,
        provider: "groq",
      };
    }
  } catch (error) {
    console.log("⚠️ Groq failed, switching to Gemini...");
  }

  // =========================
  // FALLBACK AI => GEMINI
  // =========================

  try {
    console.log("🔥 Trying Gemini...");

    const result = await geminiGenerate(prompt);

    if (result) {
      return {
        caption: result,
        provider: "gemini",
      };
    }
  } catch (error) {
    console.log("❌ Gemini also failed");
  }

  throw new Error("All AI providers failed");
};
