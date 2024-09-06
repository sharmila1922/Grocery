const mysql = require('mysql2');
const express = require('express');
const cors = require('cors'); // Import CORS
const app = express();
const port = 3000;

// Use CORS middleware
app.use(cors()); // Configure CORS

// Create a connection to the database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'product_db'
});

// Connect to the database
connection.connect();

// Define a route to get products
app.get('/api/products', (req, res) => {
  connection.query('SELECT * FROM products', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
