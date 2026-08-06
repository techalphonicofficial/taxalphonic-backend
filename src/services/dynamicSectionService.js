import MainCategory from "../models/MainCategory.js";
import Page from "../models/Page.js";
import Service from "../models/Service.js";
import SubService from "../models/SubService.js";
import * as dynamicSectionRepository from "../repositories/dynamicSectionRepository.js";
import { DYNAMIC_SECTION_TYPES } from "../models/DynamicSection.js";

const httpError = (status, message) => Object.assign(new Error(message), { status });

const parentModels = {
  main_category: MainCategory,
  service: Service,
  sub_services: SubService,
  page: Page,
};

const parseJson = (value) => {
  if (value == null || value === "") return {};
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    throw httpError(422, "extra_json must be valid JSON");
  }
};

const normalize = (input = {}) => {
  const type = String(input.type || "").trim();
  if (!DYNAMIC_SECTION_TYPES.includes(type)) {
    throw httpError(422, `Type must be one of: ${DYNAMIC_SECTION_TYPES.join(", ")}`);
  }

  const parent_id = Number(input.parent_id);
  if (!Number.isInteger(parent_id) || parent_id <= 0) {
    throw httpError(422, "parent_id must be a valid positive ID");
  }

  return {
    type,
    parent_id,
    extra_json: parseJson(input.extra_json),
  };
};

const ensureParentExists = async (type, parentId) => {
  const model = parentModels[type];
  const count = await model.count({ where: { id: parentId } });
  if (!count) throw httpError(422, `Parent ${type} record was not found`);
};

export const listDynamicSections = (filters = {}) => {
  const type = filters.type ? String(filters.type).trim() : null;
  if (type && !DYNAMIC_SECTION_TYPES.includes(type)) {
    throw httpError(422, `Type must be one of: ${DYNAMIC_SECTION_TYPES.join(", ")}`);
  }

  const parent_id = filters.parent_id ? Number(filters.parent_id) : null;
  if (parent_id && (!Number.isInteger(parent_id) || parent_id <= 0)) {
    throw httpError(422, "parent_id must be a valid positive ID");
  }

  return dynamicSectionRepository.findAll({ type, parent_id });
};

export async function getDynamicSection(id) {
  const section = await dynamicSectionRepository.findById(id);
  if (!section) throw httpError(404, "Dynamic section not found");
  return section;
}

export async function createDynamicSection(input) {
  const values = normalize(input);
  await ensureParentExists(values.type, values.parent_id);
  return dynamicSectionRepository.create(values);
}

export async function updateDynamicSection(id, input) {
  await getDynamicSection(id);
  const values = normalize(input);
  await ensureParentExists(values.type, values.parent_id);
  return dynamicSectionRepository.update(id, values);
}

export async function deleteDynamicSection(id) {
  await getDynamicSection(id);
  await dynamicSectionRepository.remove(id);
}
