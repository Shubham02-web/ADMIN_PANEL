import sequelize from "../config/database.js";
import Customer from "../Models/Customer.js";
import { Op } from "sequelize";

const currentYear = new Date().getFullYear();

export const monthly = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();

    const results = await Customer.findAll({
      attributes: [
        [sequelize.fn("MONTH", sequelize.col("createdAt")), "month"],
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
        [
          sequelize.fn(
            "SUM",
            sequelize.literal("CASE WHEN gender = 'male' THEN 1 ELSE 0 END")
          ),
          "male",
        ],
        [
          sequelize.fn(
            "SUM",
            sequelize.literal("CASE WHEN gender = 'female' THEN 1 ELSE 0 END")
          ),
          "female",
        ],
        [
          sequelize.fn(
            "SUM",
            sequelize.literal("CASE WHEN status = 'active' THEN 1 ELSE 0 END")
          ),
          "active",
        ],
      ],
      where: {
        isDeleted: false,
        createdAt: {
          [Op.between]: [
            // Corrected operator usage
            new Date(`${currentYear}-01-01`),
            new Date(`${currentYear}-12-31`),
          ],
        },
      },
      group: [sequelize.fn("MONTH", sequelize.col("createdAt"))],
      order: [[sequelize.fn("MONTH", sequelize.col("createdAt")), "ASC"]],
      raw: true,
    });

    // Rest of the code remains the same
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const monthData = results.find((r) => r.month === i + 1) || {};
      return {
        total: monthData.count || 0,
        male: monthData.male || 0,
        female: monthData.female || 0,
        active: monthData.active || 0,
      };
    });

    res.json({
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      data: monthlyData,
    });
  } catch (error) {
    console.error("Monthly analytics error:", error);
    res.status(500).json({
      error: "Failed to fetch monthly analytics",
      details: error.message,
    });
  }
};
// Yearly analytics with status breakdown
export const yearly = async (req, res) => {
  try {
    const results = await Customer.findAll({
      attributes: [
        [sequelize.fn("YEAR", sequelize.col("createdAt")), "year"],
        [sequelize.fn("COUNT", sequelize.col("id")), "total"],
        [
          sequelize.fn(
            "SUM",
            sequelize.literal("CASE WHEN status = 'active' THEN 1 ELSE 0 END")
          ),
          "active",
        ],
        [
          sequelize.fn(
            "SUM",
            sequelize.literal("CASE WHEN status = 'deactive' THEN 1 ELSE 0 END")
          ),
          "deactive",
        ],
      ],
      where: { isDeleted: false },
      group: ["year"],
      order: [[sequelize.fn("YEAR", sequelize.col("createdAt"))]],
      raw: true,
    });

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Additional analytics endpoints
export const demographics = async (req, res) => {
  try {
    const results = await Customer.findAll({
      attributes: [
        "countryCode",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
        [
          sequelize.fn(
            "AVG",
            sequelize.literal("TIMESTAMPDIFF(YEAR, createdAt, NOW())")
          ),
          "average_age",
        ],
      ],
      where: { isDeleted: false },
      group: ["countryCode"],
      raw: true,
    });

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
