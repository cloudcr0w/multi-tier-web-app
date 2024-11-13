const express = require('express');
const mysql = require('mysql');
const app = express();
const PORT = process.env.PORT || 3000;


const db = mysql.createConnection({
    host: 'portfoliodb.c18s48a0gb7h.us-east-1.rds.amazonaws.com', 
    user: 'admin', 
    password: 'Admin1234!', 
    database: 'portfolioDB' 
});


db.connect((err) => {
    if (err) throw err;
    console.log('Połączono z bazą danych MySQL');
});

app.use(express.json());


app.get('/', (req, res) => {
    res.send('Server działa! Witamy na backendzie portfolia.');
});


app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;

   
    if (!name || !email || !message) {
        return res.status(400).send('Brak wymaganych danych!');
    }

    const query = 'INSERT INTO messages (name, email, message) VALUES (?, ?, ?)';
    db.query(query, [name, email, message], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Błąd bazy danych');
        }
        res.send('Wiadomość zapisana!');
    });
});

app.listen(PORT, () => {
    console.log(`Serwer uruchomiony na porcie ${PORT}`);
});
