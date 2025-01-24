const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mysql = require('mysql2')
const cors = require('cors')
const fs = require('fs')
const AWS = require('aws-sdk') // Import AWS SDK
require('dotenv').config() // Load environment variables

// Middleware
app.use(bodyParser.json())

// CORS configuration
app.use(cors())

// AWS Configuration
AWS.config.update({ region: 'us-east-1' }) // Ustaw odpowiedni region
const sns = new AWS.SNS()

// Database connection pool configuration for RDS
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
})

// Function to log messages to a file
const logMessage = (message) => {
    const log = `${new Date().toISOString()} - ${JSON.stringify(message)}\n`
    fs.appendFile('messages.log', log, (err) => {
        if (err) console.error('Error writing to log file:', err)
    })
}

// Function to send notification via SNS
const sendSNSNotification = (message) => {
    const params = {
        Message: `New contact form submission:\n\nName: ${message.name}\nEmail: ${message.email}\nMessage: ${message.message}`,
        Subject: 'New Contact Form Submission',
        TopicArn: 'arn:aws:sns:us-east-1:985539802934:ContactForm', 
    }

    sns.publish(params, (err, data) => {
        if (err) {
            console.error('Error sending SNS notification:', err)
        } else {
            console.log('SNS notification sent:', data)
        }
    })
}

// Endpoint to handle contact form submissions
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body

    // Validate input
    if (!name || !email || !message) {
        return res.status(400).send({ success: false, error: 'All fields are required' })
    }

    // Use pool to query the database
    const query = 'INSERT INTO messages (name, email, message) VALUES (?, ?, ?)'
    pool.query(query, [name, email, message], (err, result) => {
        if (err) {
            console.error('Error while saving the message:', err)
            res.status(500).send({ success: false, error: 'Server error' })
        } else {
            console.log('Message saved:', result)
            logMessage({ name, email, message }) // Log message to file
            sendSNSNotification({ name, email, message }) // Send SNS notification
            res.status(200).send({ success: true, message: 'Message saved!' })
        }
    })
})

// Endpoint to check if the backend is running
app.get('/', (req, res) => {
    res.send('Backend is running!')
})

// Start the server
const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
