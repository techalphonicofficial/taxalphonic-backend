export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("main_categories", "seo_tags", {
    type: Sequelize.TEXT("long"),
    allowNull: true,
    after: "canonical_url",
    comment: "Raw title, meta, canonical, Open Graph, and JSON-LD tags",
  });
}

export async function down(queryInterface) {
  await queryInterface.removeColumn("main_categories", "seo_tags");
}
