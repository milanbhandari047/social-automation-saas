import { openrouterGenerate } from "./providers/openrouter.provider";
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
  // PRIMARY AI => OPENROUTER
  // =========================
  try {
    console.log("🔥 Trying OpenRouter...");

    const result = await openrouterGenerate(prompt);

    if (result) {
      return {
        caption: result,
        provider: "openrouter",
      };
    }
  } catch (error: any) {
    console.log(
      "⚠️ OpenRouter failed, switching to Groq...",
      error?.response?.data || error.message
    );
  }

  // =========================
  // FALLBACK 1 => GROQ
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
  } catch (error: any) {
    console.log(
      "⚠️ Groq failed, switching to Gemini...",
      error?.response?.data || error.message
    );
  }

  // =========================
  // FALLBACK 2 => GEMINI
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
  } catch (error: any) {
    console.log(
      "❌ Gemini also failed:",
      error?.response?.data || error.message
    );
  }

  throw new Error("All AI providers failed");
};
