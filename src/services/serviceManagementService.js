import sequelize from "../config/database.js";
import MainCategory from "../models/MainCategory.js";
import * as serviceRepository from "../repositories/serviceRepository.js";
import slugify from "../utils/slugify.js";

const httpError = (status, message) => Object.assign(new Error(message), { status });

const normalizeCategoryIds = (value) => {
  const values = Array.isArray(value) ? value : value == null ? [] : [value];
  return [...new Set(values.map(Number))]
    .filter((id) => Number.isInteger(id) && id > 0);
};

const normalize = (input = {}) => {
  const name = String(input.name || "").trim();
  if (!name) throw httpError(422, "Service name is required");
  if (name.length > 150) throw httpError(422, "Service name must be 150 characters or fewer");
  const slug = slugify(String(input.slug || name));
  if (!slug) throw httpError(422, "Enter a valid service name or slug");

  return {
    values: {
      name,
      slug,
      seo_tags: String(input.seo_tags || "").trim().slice(0, 1000000) || null,
    },
    mainCategoryIds: normalizeCategoryIds(input.main_category_ids),
  };
};

const ensureUniqueSlug = async (slug, currentId = null) => {
  const existing = await serviceRepository.findBySlug(slug);
  if (existing && existing.id !== currentId) {
    throw httpError(409, "A service with this slug already exists");
  }
};

const ensureCategoriesExist = async (ids) => {
  if (!ids.length) return;
  const count = await MainCategory.count({ where: { id: ids } });
  if (count !== ids.length) throw httpError(422, "One or more selected main categories are invalid");
};

export const listServices = () => serviceRepository.findAll();

export async function getService(id) {
  const service = await serviceRepository.findById(id);
  if (!service) throw httpError(404, "Service not found");
  return service;
}

export async function createService(input) {
  const { values, mainCategoryIds } = normalize(input);
  await ensureUniqueSlug(values.slug);
  await ensureCategoriesExist(mainCategoryIds);

  let serviceId;
  await sequelize.transaction(async (transaction) => {
    const service = await serviceRepository.create(values, { transaction });
    serviceId = service.id;
    await service.setMainCategories(mainCategoryIds, { transaction });
  });
  return getService(serviceId);
}

export async function updateService(id, input) {
  const service = await getService(id);
  const { values, mainCategoryIds } = normalize(input);
  await ensureUniqueSlug(values.slug, service.id);
  await ensureCategoriesExist(mainCategoryIds);

  await sequelize.transaction(async (transaction) => {
    await service.update(values, { transaction });
    await service.setMainCategories(mainCategoryIds, { transaction });
  });
  return getService(id);
}

export async function deleteService(id) {
  await getService(id);
  await serviceRepository.remove(id);
}
