import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Question = sequelize.define(
  "Question",
  {
    question_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    question: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    answer: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "questions",
    timestamps: true,
    createdAt: "createtime",
    updatedAt: "updatetime",
  }
);

export default Question;
