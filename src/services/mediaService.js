import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as mediaRepository from "../repositories/mediaRepository.js";

const httpError = (status, message) => Object.assign(new Error(message), { status });
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDirectory = path.resolve(__dirname, "../../public");
const mediaDirectory = path.resolve(publicDirectory, "uploads/media");

export const listImages = () => mediaRepository.findAllImages();

export async function createImage(file, input = {}) {
  if (!file) throw httpError(422, "Choose an image to upload");
  const name = input.name?.trim() || file.originalname.replace(/\.[^.]+$/, "");
  return mediaRepository.create({
    uploaded_by: null,
    name,
    file_name: file.filename,
    path: `/uploads/media/${file.filename}`,
    mime_type: file.mimetype,
    file_type: "image",
    size: file.size,
    alt_text: input.alt_text?.trim() || name,
  });
}

export async function updateImage(id, input = {}) {
  const altText = input.alt_text?.trim();
  if (!altText) throw httpError(422, "Alternative text is required");
  if (altText.length > 255) {
    throw httpError(422, "Alternative text must be 255 characters or fewer");
  }
  const media = await mediaRepository.update(id, { alt_text: altText });
  if (!media) throw httpError(404, "Media item not found");
  return media;
}

export async function deleteImage(id) {
  const media = await mediaRepository.findById(id);
  if (!media) throw httpError(404, "Media item not found");
  await mediaRepository.remove(id);
  const filePath = path.resolve(publicDirectory, media.path.replace(/^[/\\]+/, ""));
  if (filePath.startsWith(mediaDirectory + path.sep)) {
    await fs.unlink(filePath).catch((error) => {
      if (error.code !== "ENOENT") console.error("Unable to delete media file:", error);
    });
  }
  return media;
}
