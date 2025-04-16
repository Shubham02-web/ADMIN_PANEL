import Sequelize from "sequelize";
import sequelize from "../config/database.js";
import Category from "./Category.js";

const Blog = sequelize.define("Blog", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  image: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  CategoryName: {
    type: Sequelize.STRING(100),
    field: "CategoryName",
    allowNull: false,
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  },
  updatedAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  },
});

Blog.belongsTo(Category, {
  foreignKey: "CategoryName",
  targetKey: "CategoryName",
  as: "category",
  foreignKeyConstraint: true,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

export default Blog;
