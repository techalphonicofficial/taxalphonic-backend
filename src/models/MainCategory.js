import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const MainCategory = sequelize.define(
  "MainCategory",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    slug: {
      type: DataTypes.STRING(180),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        is: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      },
    },
    image: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "Path or URL selected from the media gallery",
    },
    image_alt: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    seo_title: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    seo_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    seo_keywords: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    canonical_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    seo_tags: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      comment: "Raw title, meta, canonical, Open Graph, and JSON-LD tags",
    },
  },
  {
    tableName: "main_categories",
    indexes: [{ fields: ["name"] }],
  },
);

export default MainCategory;
