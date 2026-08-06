import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import MainCategory from "./MainCategory.js";
import MainCategoryService from "./MainCategoryService.js";

const Service = sequelize.define(
  "Service",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: { notEmpty: true },
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
    seo_tags: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
  },
  {
    tableName: "services",
    indexes: [{ fields: ["name"] }],
  },
);

Service.belongsToMany(MainCategory, {
  as: "mainCategories",
  through: MainCategoryService,
  foreignKey: "service_id",
  otherKey: "main_category_id",
});

MainCategory.belongsToMany(Service, {
  as: "services",
  through: MainCategoryService,
  foreignKey: "main_category_id",
  otherKey: "service_id",
});

export default Service;
