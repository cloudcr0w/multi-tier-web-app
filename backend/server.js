const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mysql = require('mysql2')
const cors = require('cors')
const fs = require('fs')
require('dotenv').config() // Load environment variables

// Middleware
app.use(bodyParser.json())

// CORS configuration
app.use(cors())

// Database connection configuration for RDS
const db = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
})

// Connect to the database
db.connect(err => {
	if (err) {
		console.error('Failed to connect to the database:', err)
		process.exit(1) // Exit the process if connection fails
	} else {
		console.log('Connected to the database!')
	}
})

// Function to log messages to a file
const logMessage = message => {
	const log = `${new Date().toISOString()} - ${JSON.stringify(message)}\n`
	fs.appendFile('messages.log', log, err => {
		if (err) console.error('Error writing to log file:', err)
	})
}

// Endpoint to handle contact form submissions
app.post('/api/contact', (req, res) => {
	const { name, email, message } = req.body

	// Validate input
	if (!name || !email || !message) {
		return res.status(400).send({ success: false, error: 'All fields are required' })
	}

	const query = 'INSERT INTO messages (name, email, message) VALUES (?, ?, ?)'
	db.query(query, [name, email, message], (err, result) => {
		if (err) {
			console.error('Error while saving the message:', err)
			res.status(500).send({ success: false, error: 'Server error' })
		} else {
			console.log('Message saved:', result)
			logMessage({ name, email, message }) // Log message to file
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
