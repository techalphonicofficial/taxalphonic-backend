import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Service from "./Service.js";
import ServiceSubService from "./ServiceSubService.js";

const SubService = sequelize.define(
  "SubService",
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
    featured_image: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "Path or URL selected from the media gallery",
    },
    image_alt: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    seo_tags: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      comment: "Raw title, meta, canonical, Open Graph, and JSON-LD tags",
    },
  },
  {
    tableName: "sub_services",
    indexes: [{ fields: ["name"] }],
  },
);

SubService.belongsToMany(Service, {
  as: "services",
  through: ServiceSubService,
  foreignKey: "sub_service_id",
  otherKey: "service_id",
});

Service.belongsToMany(SubService, {
  as: "subServices",
  through: ServiceSubService,
  foreignKey: "service_id",
  otherKey: "sub_service_id",
});

export default SubService;
