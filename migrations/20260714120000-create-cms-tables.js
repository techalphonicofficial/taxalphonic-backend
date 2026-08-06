export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("contents", {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: Sequelize.STRING(180), allowNull: false },
    slug: { type: Sequelize.STRING(200), allowNull: false, unique: true },
    excerpt: { type: Sequelize.TEXT, allowNull: true },
    body: { type: Sequelize.TEXT("long"), allowNull: true },
    type: { type: Sequelize.ENUM("post", "page"), allowNull: false, defaultValue: "post" },
    status: { type: Sequelize.ENUM("draft", "published"), allowNull: false, defaultValue: "draft" },
    category: { type: Sequelize.STRING(100), allowNull: true },
    author: { type: Sequelize.STRING(120), allowNull: false, defaultValue: "Admin" },
    publishedAt: { type: Sequelize.DATE, allowNull: true },
    createdAt: { type: Sequelize.DATE, allowNull: false },
    updatedAt: { type: Sequelize.DATE, allowNull: false },
  });

  await queryInterface.createTable("settings", {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    key: { type: Sequelize.STRING(100), allowNull: false, unique: true },
    value: { type: Sequelize.TEXT, allowNull: true },
    createdAt: { type: Sequelize.DATE, allowNull: false },
    updatedAt: { type: Sequelize.DATE, allowNull: false },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("settings");
  await queryInterface.dropTable("contents");
}
