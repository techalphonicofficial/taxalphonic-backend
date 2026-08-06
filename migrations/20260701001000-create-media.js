export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("media", {
    id: {
      type: Sequelize.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    uploaded_by: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    name: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    file_name: {
      type: Sequelize.STRING(255),
      allowNull: false,
      unique: true,
    },
    path: {
      type: Sequelize.STRING(500),
      allowNull: false,
      unique: true,
    },
    mime_type: {
      type: Sequelize.STRING(120),
      allowNull: false,
    },
    file_type: {
      type: Sequelize.STRING(30),
      allowNull: false,
      defaultValue: "image",
    },
    size: {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: true,
    },
    alt_text: {
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

  await queryInterface.addIndex("media", ["file_type"]);
  await queryInterface.addIndex("media", ["createdAt"]);
}

export async function down(queryInterface) {
  await queryInterface.dropTable("media");
}
