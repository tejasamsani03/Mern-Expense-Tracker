const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { readdirSync } = require('fs');
const { db } = require('./db/db');

// Load environment variables
dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());

// CORS Configuration
const corsOptions = {
    origin: process.env.CLIENT_URL,
    optionsSuccessStatus: 200 // For legacy browser support
};
app.use(cors(corsOptions));

// Middleware to handle favicon.ico requests
app.get('/favicon.ico', (req, res) => {
    res.status(204).send();
});

// Routes (example)
readdirSync('./routes').map((route) => app.use('/api/v1', require('./routes/' + route)));

const server = () => {
    db(); // Connect to database
    app.listen(PORT, () => {
        console.log('listening to port:', PORT);
    });
};

server();