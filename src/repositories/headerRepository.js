import HeaderLayout from "../models/HeaderLayout.js";

export const findAll = () =>
  HeaderLayout.findAll({ order: [["is_default", "DESC"], ["updatedAt", "DESC"]] });

export const findById = (id) => HeaderLayout.findByPk(id);

export const findBySlug = (slug) => HeaderLayout.findOne({ where: { slug } });

export const findPublished = () =>
  HeaderLayout.findOne({
    where: { status: "published" },
    order: [["is_default", "DESC"], ["updatedAt", "DESC"]],
  });

export const create = (values, options = {}) => HeaderLayout.create(values, options);

export const clearDefault = (transaction) =>
  HeaderLayout.update({ is_default: false }, { where: {}, transaction });

export const remove = (id) => HeaderLayout.destroy({ where: { id } });
