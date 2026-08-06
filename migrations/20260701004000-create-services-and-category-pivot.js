export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("services", {
    id: {
      type: Sequelize.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING(150),
      allowNull: false,
    },
    slug: {
      type: Sequelize.STRING(180),
      allowNull: false,
      unique: true,
    },
    seo_tags: {
      type: Sequelize.TEXT("long"),
      allowNull: true,
      comment: "Raw title, meta, canonical, Open Graph, and JSON-LD tags",
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  });

  await queryInterface.addIndex("services", ["name"]);

  await queryInterface.createTable("main_category_services", {
    main_category_id: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      references: { model: "main_categories", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    service_id: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      references: { model: "services", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  });

  await queryInterface.addIndex("main_category_services", ["service_id"]);
}

export async function down(queryInterface) {
  await queryInterface.dropTable("main_category_services");
  await queryInterface.dropTable("services");
}
