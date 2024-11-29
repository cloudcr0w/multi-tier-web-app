const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mysql = require('mysql2')

app.use(bodyParser.json())
// Database connection configuration for RDS
const db = mysql.createConnection({
	host: 'portfolio-db.c18s48a0gb7h.us-east-1.rds.amazonaws.com',
	user: 'admin',
	password: 'Admin1234',
	database: 'contact_form',
})

// Connect to the database
db.connect(err => {
	if (err) {
		console.error('Failed to connect to the database:', err)
	} else {
		console.log('Connected to the database!')
	}
})

app.post('/api/contact', (req, res) => {
	const { name, email, message } = req.body

	const query = 'INSERT INTO messages (name, email, message) VALUES (?, ?, ?)'
	db.query(query, [name, email, message], (err, result) => {
		if (err) {
			console.error('Error while saving the message:', err)
			res.status(500).send({ success: false, error: 'Server error' })
		} else {
			console.log('Message saved:', result)
			res.status(200).send({ success: true, message: 'Message saved!' })
		}
	})
})

// Endpoint to check if the backend is running
app.get('/', (req, res) => {
	res.send('Backend is running!')
})

// Endpoint to handle contact form submissions
app.post('/api/contact', (req, res) => {
	const { name, email, message } = req.body
	console.log(`Received message: ${name}, ${email}, ${message}`)
	res.status(200).send({ success: true, message: 'Message received!' })
})

const PORT = 3000
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`)
})
