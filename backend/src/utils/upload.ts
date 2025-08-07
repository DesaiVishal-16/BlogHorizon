import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "./cloudinary.js";
import { v4 as uuidv4 } from "uuid";
import { Request } from "express";

const thumbnailStorage = new CloudinaryStorage({
  cloudinary,
  params: (_req: Request, _file: Express.Multer.File) => ({
    folder: `blog/articles/thumbnails`,
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
    transformation: [
      {
        width: 400,
        height: 225,
        crop: "fill",
        gravity: "center",
        quality: "90",
        format: "webp",
      },
      {
        width: 800,
        height: 450,
        crop: "fill",
        gravity: "center",
        quality: "95",
        format: "webp",
      },
      { fetch_format: "webp", quality: "95" },
    ],
    public_id: `thumb-${uuidv4()}`,
  }),
});

const thumbnailImageUpload = multer({ storage: thumbnailStorage });

export { thumbnailImageUpload };
