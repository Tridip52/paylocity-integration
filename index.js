require('dotenv').config();
const express = require('express');
const employeeRoutes = require('./routes/paylocityRoutes');
const tokenRoutes = require('./routes/token');

const app = express();

// Global Middlewares
app.use(express.json());

// CORS Setup
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://app.bullhornstaffing.com');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(204); // Preflight response
    }

    next();
});

// API Routes
app.use('/', tokenRoutes);
app.use('/', paylocityRoutes);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
