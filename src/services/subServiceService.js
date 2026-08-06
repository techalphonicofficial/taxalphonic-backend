import sequelize from "../config/database.js";
import Service from "../models/Service.js";
import * as subServiceRepository from "../repositories/subServiceRepository.js";
import slugify from "../utils/slugify.js";

const httpError = (status, message) => Object.assign(new Error(message), { status });

const normalizeServiceIds = (value) => {
  const values = Array.isArray(value) ? value : value == null ? [] : [value];
  return [...new Set(values.map(Number))]
    .filter((id) => Number.isInteger(id) && id > 0);
};

const normalizeImage = (value) => {
  const image = String(value || "").trim().slice(0, 500);
  if (image && !/^(\/(?!\/)|https?:\/\/)/i.test(image)) {
    throw httpError(422, "Featured image must be selected from Media Gallery");
  }
  return image || null;
};

const normalize = (input = {}) => {
  const name = String(input.name || "").trim();
  if (!name) throw httpError(422, "Sub service name is required");
  if (name.length > 150) throw httpError(422, "Sub service name must be 150 characters or fewer");
  const slug = slugify(String(input.slug || name));
  if (!slug) throw httpError(422, "Enter a valid sub service name or slug");

  return {
    values: {
      name,
      slug,
      featured_image: normalizeImage(input.featured_image),
      image_alt: String(input.image_alt || "").trim().slice(0, 255) || null,
      seo_tags: String(input.seo_tags || "").trim().slice(0, 1000000) || null,
    },
    serviceIds: normalizeServiceIds(input.service_ids),
  };
};

const ensureUniqueSlug = async (slug, currentId = null) => {
  const existing = await subServiceRepository.findBySlug(slug);
  if (existing && existing.id !== currentId) {
    throw httpError(409, "A sub service with this slug already exists");
  }
};

const ensureServicesExist = async (ids) => {
  if (!ids.length) return;
  const count = await Service.count({ where: { id: ids } });
  if (count !== ids.length) throw httpError(422, "One or more selected services are invalid");
};

export const listSubServices = () => subServiceRepository.findAll();

export async function getSubService(id) {
  const subService = await subServiceRepository.findById(id);
  if (!subService) throw httpError(404, "Sub service not found");
  return subService;
}

export async function createSubService(input) {
  const { values, serviceIds } = normalize(input);
  await ensureUniqueSlug(values.slug);
  await ensureServicesExist(serviceIds);
  let subServiceId;
  await sequelize.transaction(async (transaction) => {
    const subService = await subServiceRepository.create(values, { transaction });
    subServiceId = subService.id;
    await subService.setServices(serviceIds, { transaction });
  });
  return getSubService(subServiceId);
}

export async function updateSubService(id, input) {
  const subService = await getSubService(id);
  const { values, serviceIds } = normalize(input);
  await ensureUniqueSlug(values.slug, subService.id);
  await ensureServicesExist(serviceIds);
  await sequelize.transaction(async (transaction) => {
    await subService.update(values, { transaction });
    await subService.setServices(serviceIds, { transaction });
  });
  return getSubService(id);
}

export async function deleteSubService(id) {
  await getSubService(id);
  await subServiceRepository.remove(id);
}
