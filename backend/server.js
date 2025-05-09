require('dotenv').config()

const express = require('express')
const AWS = require('aws-sdk')
const cloudwatch = new AWS.CloudWatch()
const bodyParser = require('body-parser')
const mysql = require('mysql2')
const cors = require('cors')
const fs = require('fs')
const morgan = require('morgan')

const app = express()

// AWS Configuration
AWS.config.update({ region: 'us-east-1' })
const sns = new AWS.SNS()

// ===== Middleware =====
app.use(cors())
app.use(morgan('combined'))

// Middleware to send response time metrics to CloudWatch
app.use((req, res, next) => {
    const start = Date.now()

    res.on('finish', () => {
        const duration = Date.now() - start

        const params = {
            MetricData: [
                {
                    MetricName: 'ResponseTime',
                    Dimensions: [
                        { Name: 'Path', Value: req.path },
                        { Name: 'Method', Value: req.method }
                    ],
                    Unit: 'Milliseconds',
                    Value: duration
                }
            ],
            Namespace: 'MultiTierApp'
        }

        cloudwatch.putMetricData(params, (err) => {
            if (err) console.error('CloudWatch metric error:', err)
        })
    })

    next()
})

app.use(bodyParser.json())

// ===== Database =====
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
})

// ===== Helper Functions =====
const logMessage = (message) => {
    const log = `${new Date().toISOString()} - ${JSON.stringify(message)}\n`
    fs.appendFile('messages.log', log, (err) => {
        if (err) console.error('Error writing to log file:', err)
    })
}

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

// ===== Routes =====
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body

    if (!name || !email || !message) {
        return res.status(400).send({ success: false, error: 'All fields are required' })
    }

    const query = 'INSERT INTO messages (name, email, message) VALUES (?, ?, ?)'
    pool.query(query, [name, email, message], (err, result) => {
        if (err) {
            console.error('Error while saving the message:', err)
            res.status(500).send({ success: false, error: 'Server error' })
        } else {
            console.log('Message saved:', result)
            logMessage({ name, email, message })
            sendSNSNotification({ name, email, message })
            res.status(200).send({ success: true, message: 'Message saved!' })
        }
    })
})

app.get('/', (req, res) => {
    res.send('Backend is running!')
})

// ===== Start Server =====
const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
