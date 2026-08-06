import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import PageDetail from "./PageDetail.js";

const Page = sequelize.define(
  "Page",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    parent_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: { notEmpty: true },
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: { notEmpty: true },
    },
    page_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "page",
    },
    icon: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: "draft",
    },
    display_order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "createdAt",
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "updatedAt",
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "pages",
    timestamps: true,
    hooks: {
      beforeSave: (instance) => {
        if (instance.createdAt && !instance.created_at) {
          instance.created_at = instance.createdAt;
        }
        if (instance.created_at && !instance.createdAt) {
          instance.createdAt = instance.created_at;
        }
        if (instance.updatedAt) {
          instance.updated_at = instance.updatedAt;
        }
        if (instance.updated_at && !instance.updatedAt) {
          instance.updatedAt = instance.updated_at;
        }
      },
    },
  },
);

Page.hasMany(PageDetail, {
  as: "pageDetails",
  foreignKey: "page_id",
  onDelete: "CASCADE",
});

PageDetail.belongsTo(Page, {
  as: "page",
  foreignKey: "page_id",
});

export default Page;
