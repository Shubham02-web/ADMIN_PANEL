import Customer from "../Models/Customer.js";
import Broadcast from "../Models/Broadcast.js";

export const sendBroadcast = async (req, res) => {
  try {
    const { title, message, selectedCustomerIds, select_arr, user_type } =
      req.body;

    if (!title || !message) {
      return res
        .status(400)
        .json({ success: false, message: "Title and message are required." });
    }

    const customerIds = selectedCustomerIds || select_arr || [];

    const isAllCustomers = user_type === "all" || customerIds.length === 0;

    console.log("Customer selection:", {
      selectedCustomerIds,
      select_arr,
      user_type,
    });

    let customers;
    if (isAllCustomers) {
      customers = await Customer.findAll({
        attributes: ["id", "username", "email"],
      });
    } else {
      customers = await Customer.findAll({
        where: { id: customerIds },
        attributes: ["id", "username", "email"],
      });
    }

    if (!customers || customers.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No valid customers found." });
    }

    await Broadcast.create({
      title,
      message,
      customerList: customers.map((c) => ({
        id: c.id,
        name: c.username,
        email: c.email,
      })),
    });

    res
      .status(201)
      .json({ success: true, message: "Broadcast sent successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll({
      attributes: ["id", "username", "email"],
    });

    res.status(200).json({ success: true, customers });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getAllBroadcasts = async (req, res) => {
  try {
    const broadcasts = await Broadcast.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ success: true, broadcasts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBroadcastById = async (req, res) => {
  try {
    const { id } = req.params;
    const broadcast = await Broadcast.findByPk(id);

    if (!broadcast) {
      return res
        .status(404)
        .json({ success: false, message: "Broadcast not found" });
    }

    res.status(200).json({ success: true, broadcast });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBroadcast = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Broadcast.destroy({ where: { id } });

    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Broadcast not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Broadcast deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
