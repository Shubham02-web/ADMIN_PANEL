import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Blog = sequelize.define(
    "Blog", {
        categoryName: {
            type: DataTypes.ENUM(
                "Traveling",
                "Food",
                "Technology",
                "Lifestyle",
                "Other"
            ),
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        bannerImage: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    }, {
        tableName: "blogs",
        timestamps: true,
    }
);

export default Blog;