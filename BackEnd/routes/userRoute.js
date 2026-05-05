import express from "express";
import { userLogin, userRegister, adminLogin } from "../controllers/userController.js";


const router = express.Router();

// User routes
router.post('/login', userLogin);
router.post('/register', userRegister);

// Admin routes
router.post('/admin/login', adminLogin);

export default router;