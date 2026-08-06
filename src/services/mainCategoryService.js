import * as mainCategoryRepository from "../repositories/mainCategoryRepository.js";
import slugify from "../utils/slugify.js";

const httpError = (status, message) => Object.assign(new Error(message), { status });

const optionalText = (value, maxLength) => {
  const text = String(value || "").trim();
  return text ? text.slice(0, maxLength) : null;
};

const normalizeUrl = (value, fieldName) => {
  const url = optionalText(value, 500);
  if (url && !/^(\/(?!\/)|https?:\/\/)/i.test(url)) {
    throw httpError(422, `${fieldName} must be a relative path or full URL`);
  }
  return url;
};

const normalize = (input = {}) => {
  const name = String(input.name || "").trim();
  if (!name) throw httpError(422, "Main category name is required");
  if (name.length > 150) throw httpError(422, "Name must be 150 characters or fewer");

  const slug = slugify(String(input.slug || name));
  if (!slug) throw httpError(422, "Enter a valid name or slug");

  return {
    name,
    slug,
    image: normalizeUrl(input.image, "Image"),
    image_alt: optionalText(input.image_alt, 255),
    seo_title: optionalText(input.seo_title, 255),
    seo_description: optionalText(input.seo_description, 65535),
    seo_keywords: optionalText(input.seo_keywords, 65535),
    canonical_url: normalizeUrl(input.canonical_url, "Canonical URL"),
    seo_tags: optionalText(input.seo_tags, 1000000),
  };
};

const ensureUniqueSlug = async (slug, currentId = null) => {
  const existing = await mainCategoryRepository.findBySlug(slug);
  if (existing && existing.id !== currentId) {
    throw httpError(409, "A main category with this slug already exists");
  }
};

export const listMainCategories = () => mainCategoryRepository.findAll();

export async function getMainCategory(id) {
  const category = await mainCategoryRepository.findById(id);
  if (!category) throw httpError(404, "Main category not found");
  return category;
}

export async function createMainCategory(input) {
  const values = normalize(input);
  await ensureUniqueSlug(values.slug);
  return mainCategoryRepository.create(values);
}

export async function updateMainCategory(id, input) {
  const category = await getMainCategory(id);
  const values = normalize(input);
  await ensureUniqueSlug(values.slug, category.id);
  return category.update(values);
}

export async function deleteMainCategory(id) {
  await getMainCategory(id);
  await mainCategoryRepository.remove(id);
}
