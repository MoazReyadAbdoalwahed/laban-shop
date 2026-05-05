import mongoose from "mongoose";
import userModel from "../models/userModel.js";

export const migrateOrderIds = async () => {
    // Use raw collection access to find orders missing _id
    const collection = mongoose.connection.collection('users');
    const users = await collection.find({}).toArray();

    let migrated = 0;

    for (const user of users) {
        if (!user.orders || user.orders.length === 0) continue;

        let changed = false;
        const updatedOrders = user.orders.map(order => {
            if (!order._id) {
                changed = true;
                return { ...order, _id: new mongoose.Types.ObjectId() };
            }
            return order;
        });

        if (changed) {
            await collection.updateOne(
                { _id: user._id },
                { $set: { orders: updatedOrders } }
            );
            migrated++;
        }
    }

    console.log(`Migration complete: ${migrated} users updated`);
};