// models/Broadcast.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Broadcast = sequelize.define(
  "Broadcast",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    customerList: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

export default Broadcast;
