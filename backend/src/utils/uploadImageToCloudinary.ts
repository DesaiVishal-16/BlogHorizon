import cloudinary from "./cloudinary.js";

const uploadImageToCloudinary = async (
  imageData: string,
  index: number
): Promise<{
  url: string;
  publicId: string;
  width: number;
  height: number;
}> => {
  try {
    const result = await cloudinary.uploader.upload(imageData, {
      folder: "blog/articles/content",
      allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
      transformation: [
        { width: 1200, height: 675, crop: "limit", quality: "95" },
        { fetch_format: "auto" },
      ],
      public_id: `content-${Date.now()}-${index}`,
      resource_type: "image",
    });
    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    };
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw error;
  }
};

export default uploadImageToCloudinary;
