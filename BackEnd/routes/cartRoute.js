import express from "express";
import { addToCart, removeFromCart, getCartItems, updateCartItem, clearCart } from "../controllers/cartController.js";
import userAuth from "../middlewares/userAuth.js";


const router = express.Router();
router.post("/addtocart", userAuth, addToCart);
router.post("/removefromcart", userAuth, removeFromCart);
router.post("/updatecartitem", userAuth, updateCartItem);
router.post("/clearcart", userAuth, clearCart);
router.get("/getcartitems", userAuth, getCartItems);

export default router;
