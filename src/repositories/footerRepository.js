import FooterLayout from "../models/FooterLayout.js";

export const findAll = () =>
  FooterLayout.findAll({ order: [["is_default", "DESC"], ["updatedAt", "DESC"]] });

export const findById = (id) => FooterLayout.findByPk(id);

export const findBySlug = (slug) => FooterLayout.findOne({ where: { slug } });

export const findPublished = () =>
  FooterLayout.findOne({
    where: { status: "published" },
    order: [["is_default", "DESC"], ["updatedAt", "DESC"]],
  });

export const create = (values, options = {}) => FooterLayout.create(values, options);

export const clearDefault = (transaction) =>
  FooterLayout.update({ is_default: false }, { where: {}, transaction });

export const remove = (id) => FooterLayout.destroy({ where: { id } });
