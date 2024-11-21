const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const app = express()

const dbConfig = {
	host: 'portfoliodb.c18s48a0gb7h.us-east-1.rds.amazonaws.com',
	user: 'admin',
	password: 'Admin1234!',
	database: 'portfolioDB',
}

const database = mysql.createPool(dbConfig)

app.use(express.json())
app.use(
	cors({
		origin: 'https://crow-project.click',
		methods: ['POST'],
		allowedHeaders: ['Content-Type'],
	})
)

app.post('/contact', (req, res) => {
	const { name, email, message } = req.body

	if (!name || !email || !message) {
		return res.status(400).send('Missing required fields!')
	}

	if (!validator.isEmail(email)) {
		return res.status(400).send('Invalid email address.')
	}

	const query = 'INSERT INTO messages (name, email, message) VALUES (?, ?, ?)'
	database.query(query, [name, email, message], (err, result) => {
		if (err) {
			console.error('Database error:', err)
			return res.status(500).send('Database error')
		}
		res.send('Message saved!')
	})
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`)
})
