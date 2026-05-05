import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    products: { type: Array, default: [] },
    amount: { type: Number, default: 0 },
    address: { type: Object, default: {} },
    status: { type: String, default: 'pending' },
    date: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    googleId: { type: String, unique: true, sparse: true },
    facebookId: { type: String, unique: true, sparse: true },
    profilePicture: { type: String },
    cartData: { type: Object, default: {} },
    address: { type: Object, default: {} },
    orders: { type: [orderSchema], default: [] }
});

export default mongoose.model('User', userSchema, 'users');