import jwt from "jsonwebtoken";

const authuser = (req, res, next) => {
    console.log("Authenticating user...", req.headers.authorization);
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ status: "error", message: "No token provided" });
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ status: "error", message: "Invalid token format" });
        }
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ status: "error", message: "JWT Secret not configured" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ status: "error", message: "Invalid token", error: error.message });
    }
};

export default authuser;