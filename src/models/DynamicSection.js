import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

export const DYNAMIC_SECTION_TYPES = ["main_category", "service", "sub_services", "page"];

const DynamicSection = sequelize.define(
  "DynamicSection",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING(40),
      allowNull: false,
      validate: {
        isIn: [DYNAMIC_SECTION_TYPES],
      },
    },
    parent_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    extra_json: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {},
      get() {
        const value = this.getDataValue("extra_json");
        if (typeof value !== "string") return value || {};
        try {
          const parsed = JSON.parse(value);
          this.setDataValue("extra_json", parsed);
          return parsed;
        } catch {
          return {};
        }
      },
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "dynamic_sections",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [{ fields: ["type", "parent_id"] }],
  },
);

export default DynamicSection;
