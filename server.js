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
app.use(
	cors({
		origin: 'https://www.crow-project.click',
		methods: ['POST', 'GET'],
		allowedHeaders: ['Content-Type'],
	})
)

setInterval(() => {
	database.query('SELECT 1', err => {
		if (err) {
			console.error('Keep-alive query failed:', err.message)
		} else {
			console.log('Keep-alive query successful.')
		}
	})
}, 60000)

app.get('/', (req, res) => {
	res.send('Server is running! Welcome to the portfolio backend.')
})

app.post('/contact', (req, res) => {
	const { name, email, message } = req.body
	console.log('Received data:', { name, email, message })

	if (!name || !email || !message) {
		return res.status(400).send('Missing required fields!')
	}

	if (!validator.isEmail(email)) {
		return res.status(400).send('Invalid email address.')
	}

	console.log('All data is valid. Saving to the database:', { name, email, message })

	const query = 'INSERT INTO messages (name, email, message) VALUES (?, ?, ?)'
	database.query(query, [name, email, message], (err, result) => {
		if (err) {
			console.error('Error saving to the database:', err.message, err.stack)
			return res.status(500).send('Database error')
		}
		console.log('Message saved! ID:', result.insertId)
		res.send('Message saved!')
	})
})

// Użycie HTTPS
const options = {
	key: fs.readFileSync('/etc/letsencrypt/live/api.crow-project.click/privkey.pem'), // Klucz prywatny
	cert: fs.readFileSync('/etc/letsencrypt/live/api.crow-project.click/fullchain.pem'), // Certyfikat
}

https.createServer(options, app).listen(PORT, () => {
	console.log(`Server is running on https://localhost:${PORT}`)
})
