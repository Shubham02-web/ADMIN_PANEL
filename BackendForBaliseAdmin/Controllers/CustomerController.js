import Customer from "../Models/Customer.js";

const registerCustomer = async (req, res) => {
  try {
    const { username, mobile, email, gender, bio, countryCode } = req.body;
    const profilePicture = req.file ? req.file.filename : null;
    const customer = await Customer.create({
      username,
      mobile,
      email,
      gender,
      bio,
      countryCode,
      profilePicture,
    });

    res
      .status(201)
      .json({ message: "Customer registered successfully", customer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll({ where: { isDeleted: false } });
    res.status(200).json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getDeletedCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll({ where: { isDeleted: true } });
    res.status(200).json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id)
      return res.json({
        success: false,
        message: "cant get ID",
      });
    const customer = await Customer.findByPk(id);
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });

    customer.isDeleted = true;
    await customer.save();

    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const viewCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findByPk(id);
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });

    res.status(200).json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const toggleCustomerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findByPk(id);
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });

    if (customer.status === "active") {
      customer.status = "deactive";
    } else {
      customer.status = "active";
    }
    await customer.save();

    res
      .status(200)
      .json({ message: `Customer is now ${customer.status}`, customer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export {
  registerCustomer,
  getAllCustomers,
  getDeletedCustomers,
  deleteCustomer,
  viewCustomer,
  toggleCustomerStatus,
};
