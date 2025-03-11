const db = require('../config/db');  

const Product = {
    getAll: (callback) => {
        db.query('SELECT * FROM products', callback);
    },

    create: (product, callback) => {
        const { name, price, image_url } = product;
        db.query('INSERT INTO products (name, price, image_url) VALUES (?, ?, ?)', 
            [name, price, image_url], callback);
    }
};

module.exports = Product;
