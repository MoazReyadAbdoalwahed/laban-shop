import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    image: {
        type: Array,
        required: true
    },
    subcategory: {
        type: String,
        required: true
    },
    date: {
        type: Number,
        required: true
    },
    bestseller: {
        type: Boolean,
        required: true
    }
});

const Product = mongoose.model('Product', productSchema, 'products');
export default Product;