// config/db.js
import sequelize from "./database.js";

export async function connectDB() {
    try {
        await sequelize.authenticate();
        console.log("Database connected successfully!");
        await sequelize.sync({ alter: true });
        console.log("Tables synced successfully!");
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
}