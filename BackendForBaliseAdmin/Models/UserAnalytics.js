// models/UserAnalytics.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const UserAnalytics = sequelize.define(
  "UserAnalytics",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("monthly", "yearly"),
      allowNull: false,
    },
    month: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "user_analytics",
    timestamps: true,
  }
);

export default UserAnalytics;
