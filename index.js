const express = require('express');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

app.use('/api', authRoutes);

app.use('/api/products', productRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to My Product API');
});

app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});
