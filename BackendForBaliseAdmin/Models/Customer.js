import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Customer = sequelize.define(
    "Customer", {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        mobile: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: { isEmail: true },
        },
        status: {
            type: DataTypes.ENUM("active", "deactive"),
            defaultValue: "active",
        },
        gender: {
            type: DataTypes.ENUM("male", "female"),
            allowNull: true,
        },
        bio: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        profilePicture: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        countryCode: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "91", // Default to India
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    }, {
        tableName: "customers",
        timestamps: true,
    }
);

export default Customer;