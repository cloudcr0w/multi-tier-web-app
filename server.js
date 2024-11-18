
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
    connectTimeout: 10000, // Connection timeout
};

// Function to handle the database connection
let db;

function handleDbConnection() {
    db = mysql.createConnection(dbConfig);

    // Attempt to connect to the database
    db.connect((err) => {
        if (err) {
            console.error('Database connection error:', err.message);
            // Retry the connection after 5 seconds if it fails
            setTimeout(handleDbConnection, 5000);
        } else {
            console.log('Connected to the MySQL database');
        }
    });

    // Handle database errors
    db.on('error', (err) => {
        console.error('Database error:', err.message);
        // Reconnect if the connection was lost
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('Database connection lost. Reconnecting...');
            handleDbConnection();
        } else {
            throw err;
        }
    });
}

// Initialize the database connection
handleDbConnection();

// Middleware to parse JSON request bodies
app.use(express.json());

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
    db.query(query, [name, email, message], (err, result) => {
        if (err) {
            console.error('Error saving to the database:', err.message);
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
