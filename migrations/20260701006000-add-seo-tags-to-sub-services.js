export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("sub_services", "seo_tags", {
    type: Sequelize.TEXT("long"),
    allowNull: true,
    after: "image_alt",
    comment: "Raw title, meta, canonical, Open Graph, and JSON-LD tags",
  });
}

export async function down(queryInterface) {
  await queryInterface.removeColumn("sub_services", "seo_tags");
}
