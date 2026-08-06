export async function up(queryInterface, Sequelize) {
  const pagesTable = await queryInterface.describeTable("pages");
  if (!pagesTable.created_at) {
    await queryInterface.addColumn("pages", "created_at", {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.sequelize.query(
      "UPDATE pages SET created_at = createdAt WHERE created_at IS NULL"
    );
  }
  if (!pagesTable.updated_at) {
    await queryInterface.addColumn("pages", "updated_at", {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.sequelize.query(
      "UPDATE pages SET updated_at = updatedAt WHERE updated_at IS NULL"
    );
  }

  await queryInterface.createTable("page_details", {
    id: {
      type: Sequelize.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    page_id: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: "pages", key: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    json_data: {
      type: Sequelize.JSON,
      allowNull: false,
      comment: "Structured JSON data blocks and components for the page",
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

  await queryInterface.addIndex("page_details", ["page_id"]);
}

export async function down(queryInterface) {
  await queryInterface.dropTable("page_details");
  const pagesTable = await queryInterface.describeTable("pages");
  if (pagesTable.created_at) {
    await queryInterface.removeColumn("pages", "created_at");
  }
  if (pagesTable.updated_at) {
    await queryInterface.removeColumn("pages", "updated_at");
  }
}
