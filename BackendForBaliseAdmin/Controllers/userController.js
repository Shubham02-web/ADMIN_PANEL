import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../Models/User.js";
import dotenv from "dotenv";
dotenv.config();

const register = async(req, res) => {
    const { username, email, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ username, email, password: hashedPassword, role });
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const login = async(req, res) => {
    const { email, password } = req.body;
    try {
        // const user = await User.findOne({ email });
        const user = await User.findOne({ where: { email: req.body.email } });
        if (!user) return res.status(404).json({ error: "User not found" });
        console.log(user);
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

        const token = jwt.sign({ id: user.id, role: user.role },
            process.env.JWT_SECRET, { expiresIn: "1h" }
        );
        res.json({ success: true, user, token, role: user.role });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

async function getAllUsers(req, res) {
    try {
        const users = await User.findAll({
            attributes: ["id", "username", "email", "role"],
        });
        res.status(200).json(users);
    } catch (error) {
        res
            .status(500)
            .json({ message: "Something went wrong", error: error.message });
    }
}

export { register, login, getAllUsers };