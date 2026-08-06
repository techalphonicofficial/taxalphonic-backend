import * as categoryRepository from "../repositories/categoryRepository.js";
import slugify from "../utils/slugify.js";

const httpError = (status, message) => Object.assign(new Error(message), { status });

const normalize = (input = {}) => {
  const name = input.name?.trim();
  if (!name) throw httpError(422, "Category name is required");

  const slug = slugify(input.slug?.trim() || name);
  if (!slug) throw httpError(422, "Enter a valid category name or slug");

  const color = input.color?.trim() || null;
  if (color && !/^#[0-9a-f]{6}$/i.test(color)) {
    throw httpError(422, "Color must be a six-digit hex value");
  }

  const displayOrder = Number.parseInt(input.display_order, 10);
  return {
    name,
    slug,
    icon: input.icon?.trim() || null,
    color,
    display_order: Number.isNaN(displayOrder) ? 0 : Math.max(displayOrder, 0),
    status: input.status === "inactive" ? "inactive" : "active",
  };
};

const ensureUniqueSlug = async (slug, currentId = null) => {
  const existing = await categoryRepository.findBySlug(slug);
  if (existing && existing.id !== currentId) {
    throw httpError(409, "A category with this slug already exists");
  }
};

export const listCategories = () => categoryRepository.findAll();

export async function createCategory(input) {
  const values = normalize(input);
  await ensureUniqueSlug(values.slug);
  return categoryRepository.create(values);
}

export async function updateCategory(id, input) {
  const category = await categoryRepository.findById(id);
  if (!category) throw httpError(404, "Category not found");

  const values = normalize(input);
  await ensureUniqueSlug(values.slug, category.id);
  return category.update(values);
}

export async function deleteCategory(id) {
  const category = await categoryRepository.findById(id);
  if (!category) throw httpError(404, "Category not found");

  const childCount = await categoryRepository.countSubCategories(id);
  if (childCount > 0) {
    throw httpError(409, `Remove the ${childCount} linked subcategor${childCount === 1 ? "y" : "ies"} first`);
  }

  await categoryRepository.remove(id);
}
