import * as pageRepository from "../repositories/pageRepository.js";
import slugify from "../utils/slugify.js";

const httpError = (status, message) => Object.assign(new Error(message), { status });

const optionalText = (value, maxLength) => {
  const text = String(value || "").trim();
  return text ? (maxLength ? text.slice(0, maxLength) : text) : null;
};

const normalize = (input = {}) => {
  const title = String(input.title || "").trim();
  if (!title) throw httpError(422, "Page title is required");
  if (title.length > 255) throw httpError(422, "Title must be 255 characters or fewer");

  const slug = slugify(String(input.slug || title));
  if (!slug) throw httpError(422, "Enter a valid title or slug");

  let created_at = null;
  if (input.created_at) {
    const parsedDate = new Date(input.created_at);
    if (!isNaN(parsedDate.getTime())) {
      created_at = parsedDate;
    }
  }

  let json_data = input.json_data || input.pageDetails || [];
  if (typeof json_data === "string") {
    try {
      json_data = JSON.parse(json_data);
    } catch {
      json_data = [];
    }
  }

  return {
    values: {
      parent_id: input.parent_id ? Number(input.parent_id) : null,
      title,
      slug,
      page_type: optionalText(input.page_type, 50) || "page",
      icon: optionalText(input.icon, 500),
      content: optionalText(input.content),
      status: String(input.status || "draft").toLowerCase() === "published" ? "published" : "draft",
      display_order: Number.isFinite(Number(input.display_order)) ? Number(input.display_order) : 0,
      ...(created_at ? { created_at, createdAt: created_at } : {}),
    },
    json_data,
  };
};

const ensureUniqueSlug = async (slug, currentId = null) => {
  const existing = await pageRepository.findBySlug(slug);
  if (existing && existing.id !== currentId) {
    throw httpError(409, "A page with this slug already exists");
  }
};

export const listPages = () => pageRepository.findAll();

export async function getPage(id) {
  const page = await pageRepository.findById(id);
  if (!page) throw httpError(404, "Page not found");
  return page;
}

export async function createPage(input) {
  const { values, json_data } = normalize(input);
  await ensureUniqueSlug(values.slug);
  return pageRepository.create(values, json_data);
}

export async function updatePage(id, input) {
  const page = await getPage(id);
  const { values, json_data } = normalize(input);
  await ensureUniqueSlug(values.slug, page.id);
  return pageRepository.update(id, values, json_data);
}

export async function deletePage(id) {
  await getPage(id);
  await pageRepository.remove(id);
}
