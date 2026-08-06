import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const MainCategoryService = sequelize.define(
  "MainCategoryService",
  {
    main_category_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
    },
    service_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    tableName: "main_category_services",
    timestamps: false,
  },
);

export default MainCategoryService;
