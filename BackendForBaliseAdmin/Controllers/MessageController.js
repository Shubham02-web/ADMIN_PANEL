import Customer from "../Models/Customer.js";
import Message from "../Models/Message.js";

const addMessage = async (req, res) => {
  try {
    const { id, message } = req.body;
    const customer = await Customer.findByPk(id);
    if (!customer) return res.status(404).json({ error: "Customer not found" });

    const newMessage = await Message.create({
      customerName: customer.username,
      customerEmail: customer.email,
      message,
    });
    res.status(201).json({ success: true, message: newMessage });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getAllMessage = async (req, res) => {
  try {
    const messages = await Message.findAll({
      include: [Customer],
    });
    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getMessageById = async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.id, {
      include: [{ model: Customer, as: "customer" }],
    });
    if (!message) return res.status(404).json({ error: "Message not found" });
    res.json({ success: true, message });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const updateMessage = async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.id);
    if (!message) return res.status(404).json({ error: "Message not found" });

    message.reply = req.body.reply;
    message.status = "replied";
    await message.save();

    res.json({ success: true, message });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export { addMessage, getAllMessage, getMessageById, updateMessage };
