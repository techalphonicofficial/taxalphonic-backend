import DynamicSection from "../models/DynamicSection.js";

export const findAll = ({ type, parent_id } = {}) => {
  const where = {};
  if (type) where.type = type;
  if (parent_id) where.parent_id = parent_id;

  return DynamicSection.findAll({
    where,
    order: [
      ["created_at", "ASC"],
      ["id", "ASC"],
    ],
  });
};

export const findById = (id) => DynamicSection.findByPk(id);

export const create = (values) => DynamicSection.create(values);

export const update = async (id, values) => {
  const section = await DynamicSection.findByPk(id);
  if (!section) return null;
  return section.update(values);
};

export const remove = (id) => DynamicSection.destroy({ where: { id } });
