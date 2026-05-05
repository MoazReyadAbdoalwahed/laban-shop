import userModel from "../models/userModel.js";
import mongoose from "mongoose";

const createOrder = async (req, res) => {
    try {
        const { products, totalAmount, address } = req.body;
        const user = await userModel.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.orders.push({
            products,
            amount: totalAmount,
            address: address || user.address || {},
            status: 'pending',
            date: Date.now()
        });
        user.cartData = {};
        await user.save({ validateBeforeSave: false });

        const savedOrder = user.orders[user.orders.length - 1];
        res.status(201).json({ message: "Order created successfully", order: savedOrder });
    } catch (error) {
        res.status(500).json({ message: "Error creating order", error: error.message });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ orders: user.orders });
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error: error.message });
    }
};

const getAdminOrders = async (req, res) => {
    try {
        const users = await userModel.find({}, { password: 0 });
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: "Error fetching admin orders", error: error.message });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, userId } = req.body;

        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const user = userId
            ? await userModel.findById(userId)
            : await userModel.findOne({ 'orders._id': new mongoose.Types.ObjectId(id) });

        if (!user) return res.status(404).json({ message: "User not found" });

        const order = user.orders.id(id);
        if (!order) return res.status(404).json({ message: "Order not found" });

        order.status = status;
        await user.save({ validateBeforeSave: false });

        res.status(200).json({ message: "Order status updated", order });
    } catch (error) {
        res.status(500).json({ message: "Error updating order status", error: error.message });
    }
};

export { createOrder, getAllOrders, getAdminOrders, updateOrderStatus };