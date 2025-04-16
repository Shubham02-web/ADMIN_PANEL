// seeders/seedAnalytics.js
import sequelize from "../config/database.js";
import UserAnalytics from "../models/UserAnalytics.js";

const seedAnalytics = async () => {
  await sequelize.sync({ force: false });

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = [2020, 2021, 2022, 2023, 2024, 2025];

  // Monthly data for 2024
  const monthlyData = months.map((month) => ({
    userCount: Math.floor(Math.random() * 200 + 50),
    type: "monthly",
    month,
    year: 2024,
  }));

  // Yearly data
  const yearlyData = years.map((year) => ({
    userCount: Math.floor(Math.random() * 2000 + 500),
    type: "yearly",
    year,
  }));

  await UserAnalytics.bulkCreate([...monthlyData, ...yearlyData]);
  console.log("Analytics data seeded!");
};

seedAnalytics();
