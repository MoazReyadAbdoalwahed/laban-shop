import { addproduct, removeproduct, singleproduct, listproducts } from "../controllers/productController.js";
import express from "express";
import upload from "../middlewares/multer.js";
import userAuth from "../middlewares/userAuth.js";
const router = express.Router();

router.post("/addproduct", userAuth, upload.fields([{ name: "image1", maxCount: 1 }, { name: "image2", maxCount: 1 }, { name: "image3", maxCount: 1 }, { name: "image4", maxCount: 1 }]), addproduct);
router.delete("/removeproduct", userAuth, removeproduct);
router.get("/singleproduct", singleproduct);
router.get("/listproducts", listproducts);

export default router;
