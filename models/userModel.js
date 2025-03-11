const db = require('../config/db');  
const User = {
    findByEmail: (email, callback) => {
        db.query('SELECT * FROM users WHERE email = ?', [email], callback);
    },

    create: (user, callback) => {
        db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', 
        [user.username, user.email, user.password], callback);
    },

    saveRefreshToken: (userId, refreshToken, callback) => {
        db.query('UPDATE users SET refresh_token = ? WHERE id = ?', [refreshToken, userId], callback);
    },

    getRefreshToken: (userId, callback) => {
        db.query('SELECT refresh_token FROM users WHERE id = ?', [userId], callback);
    }
};

module.exports = User;
