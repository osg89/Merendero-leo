
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('../frontend'));

// Database setup
const db = new sqlite3.Database('database.sqlite', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        db.run(`CREATE TABLE IF NOT EXISTS reservations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            date TEXT NOT NULL
        )`);
    }
});

// Routes
app.get('/reservations', (req, res) => {
    db.all('SELECT * FROM reservations', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows.map(row => ({ title: row.name, start: row.date })));
        }
    });
});

app.post('/reserve', (req, res) => {
    const { name, date } = req.body;
    if (!name || !date) {
        res.status(400).json({ error: 'Name and date are required' });
        return;
    }
    db.run('INSERT INTO reservations (name, date) VALUES (?, ?)', [name, date], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(201).json({ id: this.lastID });
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
