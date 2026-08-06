import MainCategory from "../models/MainCategory.js";
import Service from "../models/Service.js";

const includeCategories = {
  model: MainCategory,
  as: "mainCategories",
  attributes: ["id", "name", "slug"],
  through: { attributes: [] },
};

export const findAll = () =>
  Service.findAll({
    include: [includeCategories],
    order: [["name", "ASC"]],
  });

export const findById = (id) =>
  Service.findByPk(id, { include: [includeCategories] });

export const findBySlug = (slug) => Service.findOne({ where: { slug } });

export const create = (values, options = {}) => Service.create(values, options);

export const remove = (id) => Service.destroy({ where: { id } });
