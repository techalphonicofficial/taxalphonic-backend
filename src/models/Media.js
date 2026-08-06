import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Media = sequelize.define(
  "Media",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    uploaded_by: { type: DataTypes.INTEGER, allowNull: true },
    name: { type: DataTypes.STRING(255), allowNull: false },
    file_name: { type: DataTypes.STRING(255), allowNull: false },
    path: { type: DataTypes.STRING(500), allowNull: false },
    mime_type: { type: DataTypes.STRING(120), allowNull: false },
    file_type: { type: DataTypes.STRING(30), allowNull: false },
    size: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
    alt_text: { type: DataTypes.STRING(255), allowNull: true },
  },
  { tableName: "media" },
);

export default Media;
