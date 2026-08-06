import { QueryTypes } from "sequelize";
import sequelize from "../config/database.js";

const scalar = async (sql) => {
  const [row] = await sequelize.query(sql, { type: QueryTypes.SELECT });
  return Number(row?.count || 0);
};

export async function getDashboardData() {
  const [
    articles,
    services,
    users,
    enquiries,
    categories,
    subCategories,
    authors,
    blogs,
    subscribers,
    recentArticles,
    recentEnquiries,
    serviceBreakdown,
  ] = await Promise.all([
    scalar("SELECT COUNT(*) AS count FROM articles"),
    scalar("SELECT COUNT(*) AS count FROM services"),
    scalar("SELECT COUNT(*) AS count FROM users"),
    scalar("SELECT COUNT(*) AS count FROM contact_forms"),
    scalar("SELECT COUNT(*) AS count FROM categories"),
    scalar("SELECT COUNT(*) AS count FROM sub_categories"),
    scalar("SELECT COUNT(*) AS count FROM authors"),
    scalar("SELECT COUNT(*) AS count FROM blogs"),
    scalar("SELECT COUNT(*) AS count FROM newsletter_subscribers WHERE status = 'subscribed'"),
    sequelize.query(
      `SELECT a.id, a.title, a.status, a.views, a.updatedAt,
              sc.name AS sub_category, c.name AS category
       FROM articles a
       JOIN sub_categories sc ON sc.id = a.sub_category_id
       JOIN categories c ON c.id = sc.category_id
       ORDER BY a.updatedAt DESC
       LIMIT 5`,
      { type: QueryTypes.SELECT },
    ),
    sequelize.query(
      `SELECT id, name, email, subject, status, createdAt
       FROM contact_forms
       ORDER BY createdAt DESC
       LIMIT 5`,
      { type: QueryTypes.SELECT },
    ),
    sequelize.query(
      `SELECT sc.name, COUNT(s.id) AS service_count
       FROM service_categories sc
       LEFT JOIN services s ON s.service_category_id = sc.id
       GROUP BY sc.id, sc.name
       ORDER BY service_count DESC, sc.name ASC
       LIMIT 5`,
      { type: QueryTypes.SELECT },
    ),
  ]);

  return {
    stats: { articles, services, users, enquiries },
    totals: { categories, subCategories, authors, blogs, subscribers },
    recentArticles,
    recentEnquiries,
    serviceBreakdown: serviceBreakdown.map((item) => ({
      ...item,
      service_count: Number(item.service_count),
    })),
  };
}
