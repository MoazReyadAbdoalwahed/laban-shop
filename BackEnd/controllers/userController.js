import User from '../models/userModel.js';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


const generatejwt = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }
        const token = generatejwt(user._id);

        // Remove password from user object before sending response
        const { password: _, ...userWithoutPassword } = user.toObject();

        // Split name into firstName/lastName for frontend compatibility
        const nameParts = userWithoutPassword.name ? userWithoutPassword.name.split(' ') : ['', ''];
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        res.status(200).json({
            token,
            user: {
                id: userWithoutPassword._id,
                email: userWithoutPassword.email,
                firstName,
                lastName,
            }
        });
    } catch (error) {
        res.status(500).json({ status: "error", msg: "Error logging in user", error: error.message });

    }
}

const userRegister = async (req, res) => {
    try {
        console.log("my req body", req.body);
        const { firstName, lastName, email, password } = req.body;

        // Combine firstName and lastName into name for storage
        const name = `${firstName || ''} ${lastName || ''}`.trim();

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create new user
        const newUser = new User({ name, email, password: hashedPassword });

        await newUser.save();

        const token = generatejwt(newUser._id);

        // Remove password from user object before sending response
        const { password: __, ...userWithoutPassword } = newUser.toObject();

        res.status(201).json({
            token,
            user: {
                id: userWithoutPassword._id,
                email: userWithoutPassword.email,
                firstName: firstName || '',
                lastName: lastName || '',
            }
        });
    } catch (error) {
        res.status(500).json({ status: "error", msg: "Error registering user", error: error.message });
    }
}

const adminLogin = async (req, res) => {

    const { email, password } = req.body;

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(200).json({ status: "success", data: { token } });
    } else {
        res.status(401).json({ status: "error", msg: "Invalid admin credentials" });
    }
}

export { userLogin, userRegister, adminLogin };