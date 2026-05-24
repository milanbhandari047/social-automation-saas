import sharp from "sharp";

export const optimizeImage = async (buffer: Buffer) => {
  return await sharp(buffer)
    .resize({
      width: 1080,
      withoutEnlargement: true,
    })
    .jpeg({
      quality: 80,
    })
    .toBuffer();
};
