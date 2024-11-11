const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Endpoint testowy
app.get('/', (req, res) => {
    res.send('Server działa! Witamy na backendzie portfolia.');
});

app.listen(PORT, () => {
    console.log(`Serwer uruchomiony na porcie ${PORT}`);
});
