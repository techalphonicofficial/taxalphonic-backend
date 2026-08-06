import Media from "../models/Media.js";

export const findAllImages = () =>
  Media.findAll({
    where: { file_type: "image" },
    order: [["createdAt", "DESC"]],
    limit: 200,
  });

export const findById = (id) => Media.findByPk(id);

export const create = (values) => Media.create(values);

export async function update(id, values) {
  const media = await Media.findByPk(id);
  if (!media) return null;
  return media.update(values);
}

export const remove = (id) => Media.destroy({ where: { id } });
