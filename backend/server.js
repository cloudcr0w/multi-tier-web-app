const fs = require('fs')
const https = require('https')
const express = require('express')
const mysql = require('mysql')
const validator = require('validator')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 3000

const dbConfig = {
	host: 'portfoliodb.c18s48a0gb7h.us-east-1.rds.amazonaws.com',
	user: 'admin',
	password: 'Admin1234!',
	database: 'portfolioDB',
	connectTimeout: 10000,
	multipleStatements: true,
	connectionLimit: 10,
}

const database = mysql.createPool(dbConfig)

app.use(express.json())

// CORS configuration
app.use(
	cors({
		origin: ['https://crow-project.click', 'https://www.crow-project.click'], // Dodane obie domeny
		methods: ['GET', 'POST', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization'],
		credentials: true,
	})
)

// Security headers
app.use((req, res, next) => {
	res.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
	res.header('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self';")
	res.header('X-Content-Type-Options', 'nosniff')
	res.header('X-Frame-Options', 'DENY')
	res.header('Referrer-Policy', 'no-referrer')
	next()
})

// OPTIONS preflight handling
app.options('*', (req, res) => {
	res.header('Access-Control-Allow-Origin', req.headers.origin || 'https://crow-project.click')
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
	res.sendStatus(204)
})

// Routes
app.get('/', (req, res) => {
	res.send('Server is running! Welcome to the portfolio backend.')
})

app.post('/contact', (req, res) => {
	const { name, email, message } = req.body
	console.log('Received data:', { name, email, message })

	// Validation
	if (!name || !email || !message) {
		console.error('Validation error: Missing fields.')
		return res.status(400).send('Missing required fields!')
	}

	if (!validator.isEmail(email)) {
		console.error('Validation error: Invalid email.')
		return res.status(400).send('Invalid email address.')
	}

	// Database insertion
	const query = 'INSERT INTO messages (name, email, message) VALUES (?, ?, ?)'
	database.query(query, [name, email, message], (err, result) => {
		if (err) {
			console.error('Database error:', err.message)
			return res.status(500).send('Database error: Unable to save message.')
		}
		console.log('Message saved! ID:', result.insertId)
		res.send('Message saved successfully.')
	})
})

// HTTPS server
const options = {
	key: fs.readFileSync('/etc/letsencrypt/live/api.crow-project.click/privkey.pem'),
	cert: fs.readFileSync('/etc/letsencrypt/live/api.crow-project.click/fullchain.pem'),
}

https.createServer(options, app).listen(PORT, () => {
	console.log(`Server is running on https://localhost:${PORT}`)
})
