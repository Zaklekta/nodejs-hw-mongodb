import { v2 as cloudinary } from "cloudinary";
import { env } from "./env.js";
import { unlink } from "node:fs/promises";

const cloud_name = env("CLOUDINARY_CLOUD_NAME");
const api_key = env("CLOUDINARY_API_KEY");
const api_secret = env("CLOUDINARY_API_SECRET");
cloudinary.config({
  cloud_name,
  api_key,
  api_secret,
});
export const saveFileToCloudinary = async (file, folder) => {
  try {
    const response = await cloudinary.uploader.upload(file.path, { folder });
    return response.secure_url;
  } catch (error) {
    console.log(error.message);
  } finally {
    await unlink(file.path);
  }
};
