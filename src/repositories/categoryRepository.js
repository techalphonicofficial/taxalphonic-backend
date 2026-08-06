import { QueryTypes } from "sequelize";
import sequelize from "../config/database.js";
import Category from "../models/Category.js";

export const findAll = () =>
  Category.findAll({ order: [["display_order", "ASC"], ["name", "ASC"]] });

export const findById = (id) => Category.findByPk(id);

export const findBySlug = (slug) => Category.findOne({ where: { slug } });

export const create = (values) => Category.create(values);

export const countSubCategories = async (categoryId) => {
  const [row] = await sequelize.query(
    "SELECT COUNT(*) AS count FROM sub_categories WHERE category_id = :categoryId",
    { replacements: { categoryId }, type: QueryTypes.SELECT },
  );
  return Number(row?.count || 0);
};

export const remove = (id) => Category.destroy({ where: { id } });
