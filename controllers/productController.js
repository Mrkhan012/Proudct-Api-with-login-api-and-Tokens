const Product = require('../models/productModel');

const productController = {
    // Get All Products
    getProducts: (req, res) => {
        Product.getAll((err, results) => {
            if (err) {
                console.error('❌ Error fetching products:', err);
                return res.status(500).json({ message: 'Database error', error: err.message });
            }
            res.status(200).json(results);
        });
    },

    // Add a New Product
    addProduct: (req, res) => {
        const { name, price, image_url } = req.body;

        if (!name || !price || !image_url) {
            return res.status(400).json({ message: 'All fields are required (name, price, image_url)' });
        }

        Product.create({ name, price, image_url }, (err, result) => {
            if (err) {
                console.error('❌ Error adding product:', err);
                return res.status(500).json({ message: 'Database error', error: err.message });
            }
            res.status(201).json({ message: 'Product added successfully' });
        });
    }
};

module.exports = productController;
