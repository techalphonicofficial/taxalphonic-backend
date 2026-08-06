import Service from "../models/Service.js";
import SubService from "../models/SubService.js";

const includeServices = {
  model: Service,
  as: "services",
  attributes: ["id", "name", "slug"],
  through: { attributes: [] },
};

export const findAll = () =>
  SubService.findAll({
    include: [includeServices],
    order: [["name", "ASC"]],
  });

export const findById = (id) =>
  SubService.findByPk(id, { include: [includeServices] });

export const findBySlug = (slug) => SubService.findOne({ where: { slug } });

export const create = (values, options = {}) => SubService.create(values, options);

export const remove = (id) => SubService.destroy({ where: { id } });
