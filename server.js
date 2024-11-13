const express = require('express');
const mysql = require('mysql');
const app = express();
const PORT = process.env.PORT || 3000;

// Ustawienia bazy danych MySQL
const db = mysql.createConnection({
    host: 'portfoliodb.c18s48a0gb7h.us-east-1.rds.amazonaws.com', // Zastąp tym endpointem bazy danych RDS
    user: 'admin', // Nazwa użytkownika bazy danych
    password: 'Admin1234!', // Hasło do bazy danych
    database: 'portfolioDB' // Nazwa bazy danych
});

// Połączenie z bazą danych
db.connect((err) => {
    if (err) throw err;
    console.log('Połączono z bazą danych MySQL');
});

app.use(express.json());

// Endpoint testowy
app.get('/', (req, res) => {
    res.send('Server działa! Witamy na backendzie portfolia.');
});

// Endpoint POST /contact do zapisu wiadomości kontaktowych
app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;

    // Sprawdzenie, czy wszystkie wymagane dane są w zapytaniu
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

app.listen(3000, '0.0.0.0', () => {
    console.log(`Serwer uruchomiony na porcie ${PORT}`);
});
