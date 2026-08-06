import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const ServiceSubService = sequelize.define(
  "ServiceSubService",
  {
    service_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
    },
    sub_service_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    tableName: "service_sub_services",
    timestamps: false,
  },
);

export default ServiceSubService;
