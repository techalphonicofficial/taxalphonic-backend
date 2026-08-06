import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const HeaderLayout = sequelize.define(
  "HeaderLayout",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING(150), allowNull: false },
    slug: { type: DataTypes.STRING(180), allowNull: false, unique: true },
    layout: {
      type: DataTypes.JSON,
      allowNull: false,
      get() {
        const value = this.getDataValue("layout");
        if (typeof value !== "string") return value;
        try {
          const parsed = JSON.parse(value);
          this.setDataValue("layout", parsed);
          return parsed;
        } catch {
          return value;
        }
      },
    },
    custom_css: { type: DataTypes.TEXT("long"), allowNull: true },
    status: { type: DataTypes.STRING(30), allowNull: false, defaultValue: "draft" },
    is_default: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    created_by: { type: DataTypes.INTEGER, allowNull: true },
  },
  { tableName: "header_layouts" },
);

export default HeaderLayout;
