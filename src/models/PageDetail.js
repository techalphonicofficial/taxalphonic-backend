import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const PageDetail = sequelize.define(
  "PageDetail",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    page_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    json_data: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
      get() {
        const value = this.getDataValue("json_data");
        if (typeof value !== "string") return value || [];
        try {
          const parsed = JSON.parse(value);
          this.setDataValue("json_data", parsed);
          return parsed;
        } catch {
          return value || [];
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
    tableName: "page_details",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

export default PageDetail;
