export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("main_categories", {
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
    image: {
      type: Sequelize.STRING(500),
      allowNull: true,
      comment: "Path or URL selected from the media gallery",
    },
    image_alt: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },
    seo_title: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },
    seo_description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    seo_keywords: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    canonical_url: {
      type: Sequelize.STRING(500),
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

  await queryInterface.addIndex("main_categories", ["name"]);
}

export async function down(queryInterface) {
  await queryInterface.dropTable("main_categories");
}
