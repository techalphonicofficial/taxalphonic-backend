export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("sub_services", {
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
    featured_image: {
      type: Sequelize.STRING(500),
      allowNull: true,
      comment: "Path or URL selected from the media gallery",
    },
    image_alt: {
      type: Sequelize.STRING(255),
      allowNull: true,
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

  await queryInterface.addIndex("sub_services", ["name"]);

  await queryInterface.createTable("service_sub_services", {
    service_id: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      references: { model: "services", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    sub_service_id: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      references: { model: "sub_services", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  });

  await queryInterface.addIndex("service_sub_services", ["sub_service_id"]);
}

export async function down(queryInterface) {
  await queryInterface.dropTable("service_sub_services");
  await queryInterface.dropTable("sub_services");
}
