import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Customer from "./Customer.js";

const Message = sequelize.define(
  "Message",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    customerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customerEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    reply: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "replied"),
      defaultValue: "pending",
    },
  },
  {
    timestamps: true,
  }
);

Customer.hasMany(Message, {
  foreignKey: "customerEmail",
  sourceKey: "email",
});

Message.belongsTo(Customer, {
  foreignKey: "customerEmail",
  targetKey: "email",
});

export default Message;
