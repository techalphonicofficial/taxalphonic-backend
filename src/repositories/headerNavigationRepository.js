import { QueryTypes } from "sequelize";
import sequelize from "../config/database.js";

export async function getTaxpediaNavigation() {
  const categories = await sequelize.query(
    `SELECT id, name, slug, image AS icon
     FROM main_categories
     ORDER BY name ASC`,
    { type: QueryTypes.SELECT },
  );

  return categories.map((category) => ({ ...category, children: [] }));
}

export async function getServiceNavigation() {
  const tables = (await sequelize.getQueryInterface().showAllTables())
    .map((table) => String(table).toLowerCase());
  if (
    !tables.includes("main_categories")
    || !tables.includes("services")
    || !tables.includes("main_category_services")
  ) {
    return [];
  }

  const hasSubServices = tables.includes("sub_services")
    && tables.includes("service_sub_services");

  const [categories, services, subServices] = await Promise.all([
    sequelize.query(
      `SELECT id, name, slug, image AS icon
       FROM main_categories
       ORDER BY name ASC`,
      { type: QueryTypes.SELECT },
    ),
    sequelize.query(
      `SELECT s.id, mcs.main_category_id, s.name, s.slug
       FROM services s
       INNER JOIN main_category_services mcs ON mcs.service_id = s.id
       ORDER BY s.name ASC`,
      { type: QueryTypes.SELECT },
    ),
    hasSubServices
      ? sequelize.query(
        `SELECT ss.id, sss.service_id, ss.name, ss.slug
         FROM sub_services ss
         INNER JOIN service_sub_services sss ON sss.sub_service_id = ss.id
         ORDER BY ss.name ASC`,
        { type: QueryTypes.SELECT },
      )
      : Promise.resolve([]),
  ]);

  return categories.map((category) => ({
    ...category,
    children: services
      .filter((item) => item.main_category_id === category.id)
      .map((service) => ({
        ...service,
        children: subServices.filter((item) => item.service_id === service.id),
      })),
  }));
}
