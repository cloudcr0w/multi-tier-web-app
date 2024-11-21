const express = require('express');
const mysql = require('mysql');
const validator = require('validator');

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection configuration
const dbConfig = {
    host: 'portfoliodb.c18s48a0gb7h.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'Admin1234!',
    database: 'portfolioDB',
    connectTimeout: 10000,
    multipleStatements: true,
    connectionLimit: 10, 
};

// Create a connection pool
const database = mysql.createPool(dbConfig);

// Middleware to parse JSON request bodies
app.use(express.json());

// Keep-alive query to maintain the database connection
setInterval(() => {
    database.query('SELECT 1', (err) => {
        if (err) {
            console.error('Keep-alive query failed:', err.message);
        } else {
            console.log('Keep-alive query successful.');
        }
    });
}, 60000); // Co 60 sekund

// Test endpoint to confirm the server is running
app.get('/', (req, res) => {
    res.send('Server is running! Welcome to the portfolio backend.');
});

// Endpoint to handle contact form submissions
app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;
    console.log('Received data:', { name, email, message });

    // Validate input data
    if (!name || !email || !message) {
        return res.status(400).send('Missing required fields!');
    }

    if (!validator.isEmail(email)) {
        return res.status(400).send('Invalid email address.');
    }

    console.log('All data is valid. Saving to the database:', { name, email, message });

    // Query to insert data into the "messages" table
    const query = 'INSERT INTO messages (name, email, message) VALUES (?, ?, ?)';
    database.query(query, [name, email, message], (err, result) => {
        if (err) {
            console.error('Error saving to the database:', err.message, err.stack);
            return res.status(500).send('Database error');
        }
        console.log('Message saved! ID:', result.insertId);
        res.send('Message saved!');
    });
});

// Start the server and listen for requests
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
