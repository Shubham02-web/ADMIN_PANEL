import { Op } from "sequelize";
import BroadcastModel from "../Models/Broadcast.js";
import UserModel from "../Models/User.js";

export const sendBroadcast = async (req, res) => {
  const { subject, message, user_type, select_arr } = req.body;
  const transaction = await BroadcastModel.sequelize.transaction();

  try {
    // Validation
    if (!subject || !message || !user_type) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Validate users if specific type
    let users = [];
    if (user_type === "specific") {
      const userIds = JSON.parse(select_arr || "[]");
      users = await UserModel.findAll({
        where: {
          id: {
            [Op.in]: userIds,
          },
        },
        transaction,
      });

      if (users.length !== userIds.length) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: "One or more users not found",
        });
      }
    }

    // Create broadcast
    const broadcast = await BroadcastModel.create(
      {
        subject,
        message,
        user_type,
        selected_users:
          user_type === "specific" ? JSON.parse(select_arr) : null,
      },
      { transaction }
    );

    await transaction.commit();

    // Add your notification sending logic here

    res.json({
      success: true,
      message: "Broadcast sent successfully",
      data: broadcast,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Broadcast error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getCustomers = async (req, res) => {
  try {
    const users = await UserModel.findAll({
      attributes: ["id", "username", "email"], // Include necessary fields
    });
    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
