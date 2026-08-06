const SECTION_TYPES = ["main_category", "service", "sub_services", "page"];

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("dynamic_sections", {
    id: {
      type: Sequelize.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: Sequelize.STRING(40),
      allowNull: false,
      comment: "Parent content type: main_category, service, sub_services, or page",
    },
    parent_id: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      comment: "ID from the table selected by type",
    },
    extra_json: {
      type: Sequelize.JSON,
      allowNull: false,
      comment: "Reusable dynamic section content and settings",
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  });

  await queryInterface.addConstraint("dynamic_sections", {
    fields: ["type"],
    type: "check",
    name: "dynamic_sections_type_check",
    where: {
      type: SECTION_TYPES,
    },
  });
  await queryInterface.addIndex("dynamic_sections", ["type", "parent_id"]);
}

export async function down(queryInterface) {
  await queryInterface.dropTable("dynamic_sections");
}
