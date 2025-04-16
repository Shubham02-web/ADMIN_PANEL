import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Content = sequelize.define(
  "Content",
  {
    content_type: {
      type: DataTypes.ENUM(
        "about us",
        "privacy policy",
        "terms and condition",
        "android app url",
        "ios app url"
      ),
      allowNull: false,
      unique: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    tableName: "content",
    underscored: true,
  }
);

export default Content;
