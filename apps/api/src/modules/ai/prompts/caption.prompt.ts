export const buildCaptionPrompt = ({
  topic,
  tone,
  platform,
}: {
  topic: string;
  tone: string;
  platform: string;
}) => {
  return `
You are a social media marketing expert.

Create a high-quality caption.

Topic: ${topic}
Tone: ${tone}
Platform: ${platform}

Rules:
- engaging
- emojis allowed
- include hashtags
- include CTA
- platform optimized

Return ONLY caption text.
`;
};
