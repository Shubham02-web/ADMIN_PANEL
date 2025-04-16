import Customer from "../models/Customer.js";
import { Op } from "sequelize";

const getCustomersByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "startDate and endDate are required" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Include entire end date

    const customers = await Customer.findAll({
      where: {
        createdAt: {
          [Op.between]: [start, end],
        },
        isDeleted: false,
      },
    });

    if (customers.length === 0) {
      return res
        .status(404)
        .json({ message: "No customers found in this date range." });
    }

    res.status(200).json({ success: true, data: customers });
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export default getCustomersByDateRange;
