import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

function authenticateToken(req, res, next) {
    const token = req.headers["authorization"];
    if (!token) return res.status(401).json({ error: "No token provided" });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: "Invalid token" });
        req.user = user;
        next();
    });
}

function isAdmin(req, res, next) {
    try {
        if (req.user && req.user.role === "admin") {
            next();
        } else {
            return res.status(403).json({ message: "Access denied: Admins only" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
}

export { authenticateToken, isAdmin };