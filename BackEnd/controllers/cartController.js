import usermodel from "../models/userModel.js";

const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        const userdata = await usermodel.findById(req.user.id);

        if (!userdata) {
            return res.status(404).json({ message: "User not found" });
        }

        if (userdata.cartData[productId]) {
            userdata.cartData[productId] += quantity;
        } else {
            userdata.cartData[productId] = quantity;
        }

        await usermodel.findByIdAndUpdate(req.user.id, { cartData: userdata.cartData }, { new: true });

        res.status(200).json({ message: "Item added to cart", cartData: userdata.cartData });
    } catch (error) {
        res.status(500).json({ message: "Error adding item to cart", error: error.message });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const userdata = await usermodel.findById(req.user.id);

        if (!userdata) {
            return res.status(404).json({ message: "User not found" });
        }

        delete userdata.cartData[productId];

        await usermodel.findByIdAndUpdate(req.user.id, { cartData: userdata.cartData }, { new: true });

        res.status(200).json({ message: "Item removed from cart", cartData: userdata.cartData });
    } catch (error) {
        res.status(500).json({ message: "Error removing item from cart", error: error.message });
    }
};

const updateCartItem = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userdata = await usermodel.findById(req.user.id);

        if (!userdata) {
            return res.status(404).json({ message: "User not found" });
        }

        if (userdata.cartData[productId]) {
            userdata.cartData[productId] = quantity;
        }

        await usermodel.findByIdAndUpdate(req.user.id, { cartData: userdata.cartData }, { new: true });

        res.status(200).json({ message: "Cart item updated", cartData: userdata.cartData });
    } catch (error) {
        res.status(500).json({ message: "Error updating cart item", error: error.message });
    }
};

const clearCart = async (req, res) => {
    try {
        const userdata = await usermodel.findById(req.user.id);

        if (!userdata) {
            return res.status(404).json({ message: "User not found" });
        }

        userdata.cartData = {};
        await usermodel.findByIdAndUpdate(req.user.id, { cartData: userdata.cartData }, { new: true });

        res.status(200).json({ message: "Cart cleared", cartData: userdata.cartData });
    } catch (error) {
        res.status(500).json({ message: "Error clearing cart", error: error.message });
    }
};

const getCartItems = async (req, res) => {
    try {
        const userdata = await usermodel.findById(req.user.id);

        if (!userdata) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ cartData: userdata.cartData });
    } catch (error) {
        res.status(500).json({ message: "Error fetching cart items", error: error.message });
    }
};

export { addToCart, removeFromCart, updateCartItem, getCartItems, clearCart };
