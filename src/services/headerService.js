import sequelize from "../config/database.js";
import * as headerRepository from "../repositories/headerRepository.js";
import slugify from "../utils/slugify.js";

const httpError = (status, message) => Object.assign(new Error(message), { status });

const allowedItemTypes = new Set(["category", "service", "sub_service", "custom"]);

const normalizeUrl = (value, fallback = "") => {
  const url = String(value || fallback).trim().slice(0, 500);
  if (!url) return "";
  if (!/^(\/(?!\/)|https?:\/\/|#)/i.test(url)) {
    throw httpError(422, "Enter a valid relative or absolute URL");
  }
  return url;
};

const normalizeLayout = (layout) => {
  if (typeof layout === "string") {
    try {
      layout = JSON.parse(layout);
    } catch {
      throw httpError(422, "Header layout contains invalid JSON");
    }
  }
  if (!layout || typeof layout !== "object") {
    throw httpError(422, "Header layout is invalid");
  }

  let totalItemCount = 0;
  const normalizeItems = (items, depth = 0) => {
    if (!Array.isArray(items) || !items.length) return [];
    if (depth > 2) throw httpError(422, "Header menu items can be nested up to 3 levels");
    totalItemCount += items.length;
    if (totalItemCount > 100) throw httpError(422, "A header can contain at most 100 menu items");

    return items.map((item) => {
      const type = String(item?.type || "");
      const name = String(item?.name || "").trim().slice(0, 150);
      if (!allowedItemTypes.has(type) || !name) {
        throw httpError(422, "A header menu item is invalid");
      }

      if (type === "custom") {
        const id = String(item?.id || `custom-${Date.now()}`).slice(0, 80);
        return {
          type,
          id,
          name,
          url: normalizeUrl(item?.url, "/"),
          children: normalizeItems(item?.children, depth + 1),
        };
      }

      const id = Number(item?.id);
      const slug = slugify(String(item?.slug || name));
      if (!Number.isInteger(id) || id < 1 || !slug) {
        throw httpError(422, "A header menu item is invalid");
      }
      return { type, id, name, slug, children: normalizeItems(item?.children, depth + 1) };
    });
  };

  return {
    version: 2,
    logo: {
      url: normalizeUrl(layout.logo?.url),
      alt: String(layout.logo?.alt || "").trim().slice(0, 180),
      href: normalizeUrl(layout.logo?.href, "/"),
    },
    top: normalizeItems(layout.top),
    main: normalizeItems(layout.main),
  };
};

const normalize = (input = {}) => {
  const name = input.name?.trim();
  if (!name) throw httpError(422, "Header name is required");
  const slug = slugify(input.slug?.trim() || name);
  if (!slug) throw httpError(422, "Enter a valid header name");
  return {
    name,
    slug,
    layout: normalizeLayout(input.layout),
    custom_css: null,
    status: input.status === "published" ? "published" : "draft",
    is_default: Boolean(input.is_default),
  };
};

const ensureUniqueSlug = async (slug, currentId = null) => {
  const existing = await headerRepository.findBySlug(slug);
  if (existing && existing.id !== currentId) {
    throw httpError(409, "A header with this slug already exists");
  }
};

export const listHeaders = () => headerRepository.findAll();

export async function getPublicHeader() {
  const header = await headerRepository.findPublished();
  if (!header){
     throw httpError(404, "No published header found");
  }

  return {
    id: header.id,
    name: header.name,
    slug: header.slug,
    layout: header.layout,
    is_default: Boolean(header.is_default),
    updated_at: header.updatedAt,
  };
}

export async function getHeader(id) {
  const header = await headerRepository.findById(id);
  if (!header) throw httpError(404, "Header not found");
  return header;
}

export async function createHeader(input) {
  const values = normalize(input);
  await ensureUniqueSlug(values.slug);
  return sequelize.transaction(async (transaction) => {
    if (values.is_default) await headerRepository.clearDefault(transaction);
    return headerRepository.create({ ...values, created_by: null }, { transaction });
  });
}

export async function updateHeader(id, input) {
  const header = await getHeader(id);
  const values = normalize(input);
  await ensureUniqueSlug(values.slug, header.id);
  return sequelize.transaction(async (transaction) => {
    if (values.is_default) await headerRepository.clearDefault(transaction);
    return header.update(values, { transaction });
  });
}

export async function deleteHeader(id) {
  const header = await getHeader(id);
  if (header.is_default) throw httpError(409, "Set another default header before deleting this one");
  await headerRepository.remove(id);
}
