import { optimizeImage } from "./services/optimizer.service";
import { uploadToCloudinary } from "./services/cloudinary.service";

export const handleMediaUpload = async (file: Express.Multer.File) => {
  if (!file) {
    throw new Error("File is required");
  }

  let fileBuffer = file.buffer;

  /**
   * 🖼 Optimize images only
   */
  if (file.mimetype.startsWith("image/")) {
    fileBuffer = await optimizeImage(file.buffer);
  }

  const optimizedFile = {
    ...file,
    buffer: fileBuffer,
  };

  const result: any = await uploadToCloudinary(optimizedFile);

  return {
    url: result.secure_url,
    publicId: result.public_id,
    type: result.resource_type,
  };
};
