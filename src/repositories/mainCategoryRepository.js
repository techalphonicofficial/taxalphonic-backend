import MainCategory from "../models/MainCategory.js";

export const findAll = () =>
  MainCategory.findAll({ order: [["name", "ASC"]] });

export const findById = (id) => MainCategory.findByPk(id);

export const findBySlug = (slug) => MainCategory.findOne({ where: { slug } });

export const create = (values) => MainCategory.create(values);

export const remove = (id) => MainCategory.destroy({ where: { id } });
