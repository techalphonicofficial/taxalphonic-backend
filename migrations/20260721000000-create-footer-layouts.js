export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("footer_layouts", {
    id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    name: { type: Sequelize.STRING(150), allowNull: false },
    slug: { type: Sequelize.STRING(180), allowNull: false, unique: true },
    layout: {
      type: Sequelize.JSON,
      allowNull: false,
      comment: "Footer logo, main section, and bottom section configuration",
    },
    custom_css: { type: Sequelize.TEXT("long"), allowNull: true },
    status: { type: Sequelize.STRING(30), allowNull: false, defaultValue: "draft" },
    is_default: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
    created_by: { type: Sequelize.INTEGER, allowNull: true },
    createdAt: { type: Sequelize.DATE, allowNull: false },
    updatedAt: { type: Sequelize.DATE, allowNull: false },
  });
  await queryInterface.addIndex("footer_layouts", ["status"]);
  await queryInterface.addIndex("footer_layouts", ["is_default"]);
}

export async function down(queryInterface) {
  await queryInterface.dropTable("footer_layouts");
}
