import express from "express";
import {
    registerCustomer,
    getAllCustomers,
    getDeletedCustomers,
    deleteCustomer,
    viewCustomer,
    toggleCustomerStatus,
} from "../Controllers/CustomerController.js";
import { authenticateToken } from "../Middleware/Auth.js";
import { isAdmin } from "../Middleware/Auth.js";
import upload from "../Middleware/Upload.js";

const customerRouters = express.Router();
customerRouters.post(
    "/register",
    upload.single("profilePicture"),
    registerCustomer
);
customerRouters.get("/", getAllCustomers);
customerRouters.get("/deleted", getDeletedCustomers);
customerRouters.delete("/:id", deleteCustomer);
customerRouters.get("/:id", viewCustomer);
customerRouters.post("/:id", toggleCustomerStatus);

export default customerRouters;