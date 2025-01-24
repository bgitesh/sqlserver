const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send('Server is Working!');
});


// Database connection
const db = new sqlite3.Database('./db/database.sqlite', (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to SQLite database');
  }
});

// API to execute SQL queries
app.post('/execute', (req, res) => {
  const { query } = req.body;

  // Validate the query
  if (!query || query.trim() === '') {
    return res.status(400).json({ 
      success: false,
      error: 'SQL query is required.' 
    });
  }

  // Execute the query
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('SQL Execution Error:', err.message);
      return res.status(400).json({ 
        success: false,
        error: `Error executing query: ${err.message}` 
      });
    }

    // Respond with query results
    res.status(200).json({ 
      success: true,
      message: 'Query executed successfully.',
      result: rows 
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
