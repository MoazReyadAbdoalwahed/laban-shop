import express from "express";
import { createOrder, getAllOrders, getAdminOrders, updateOrderStatus } from "../controllers/orderController.js";
import userAuth from "../middlewares/userAuth.js";
const router = express.Router();

router.post("/create", userAuth, createOrder);
router.get("/all", userAuth, getAllOrders);
router.get("/admin/all", userAuth, getAdminOrders);
router.patch("/:id/status", userAuth, updateOrderStatus);


export default router;
