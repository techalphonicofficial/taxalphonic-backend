import Page from "../models/Page.js";
import PageDetail from "../models/PageDetail.js";

export const findAll = () =>
  Page.findAll({
    order: [
      ["display_order", "ASC"],
      ["createdAt", "DESC"],
    ],
    include: [{ model: PageDetail, as: "pageDetails" }],
  });

export const findById = (id) =>
  Page.findByPk(id, {
    include: [{ model: PageDetail, as: "pageDetails" }],
  });

export const findBySlug = (slug) =>
  Page.findOne({
    where: { slug },
    include: [{ model: PageDetail, as: "pageDetails" }],
  });

export const create = async (values, json_data = []) => {
  const page = await Page.create(values);
  if (json_data !== undefined && json_data !== null) {
    await PageDetail.create({
      page_id: page.id,
      json_data,
      created_at: values.created_at || new Date(),
      updated_at: new Date(),
    });
  }
  return findById(page.id);
};

export const update = async (id, values, json_data) => {
  const page = await Page.findByPk(id);
  if (!page) return null;
  await page.update(values);

  if (json_data !== undefined && json_data !== null) {
    const detail = await PageDetail.findOne({ where: { page_id: id } });
    if (detail) {
      await detail.update({
        json_data,
        updated_at: new Date(),
      });
    } else {
      await PageDetail.create({
        page_id: id,
        json_data,
        created_at: page.createdAt || new Date(),
        updated_at: new Date(),
      });
    }
  }

  return findById(id);
};

export const remove = (id) => Page.destroy({ where: { id } });
