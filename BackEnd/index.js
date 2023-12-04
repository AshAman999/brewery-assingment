const express = require("express");
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors"); // Add this line

const app = express();
app.use(cors()); // And this line
const port = 4000;

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "brewry",
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Connected to MySQL");
});

app.use(express.json());

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, "your_secret_key", (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  });
};

// Sign up route
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  // Check if user already exists
  const checkUserQuery = "SELECT * FROM users WHERE email = ?";
  db.query(checkUserQuery, [email], async (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error checking user" });
    }

    if (result.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the database
    const insertUserQuery = "INSERT INTO users (email, password) VALUES (?, ?)";
    db.query(insertUserQuery, [email, hashedPassword], (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Error creating user" });
      }

      res.status(201).json({ message: "User created successfully" });
    });
  });
});

// Sign in route
app.post("/signin", (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], async (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error checking user" });
    }

    if (result.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check password
    const match = await bcrypt.compare(password, result[0].password);
    if (!match) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Create and return JWT token
    const token = jwt.sign({ email }, "your_secret_key", { expiresIn: "24h" });
    res.json({ token });
  });
});

// Get brewery rating and reviews route
app.get("/brewery/:id", verifyToken, (req, res) => {
  const breweryId = req.params.id;

  // Query to get average rating and reviews for a brewery
  const query =
    "SELECT AVG(rating) AS avgRating, COUNT(*) AS reviewCount FROM ratings WHERE brewery_id = ?";
  db.query(query, [breweryId], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error fetching brewery rating and reviews" });
    }

    const { avgRating, reviewCount } = result[0];
    res.json({ avgRating, reviewCount });
  });
});

// Post a rating and comment route
app.post("/rating", verifyToken, (req, res) => {
  const { breweryId, rating, comment } = req.body;

  const query =
    "INSERT INTO ratings (brewery_id, rating, comment) VALUES (?, ?, ?)";
  db.query(query, [breweryId, rating, comment], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error posting rating" });
    }

    res.status(201).json({ message: "Rating posted successfully" });
  });
});

// Edit a rating and comment route
app.put("/rating/:id", verifyToken, (req, res) => {
  const ratingId = req.params.id;
  const { rating, comment } = req.body;

  const query = "UPDATE ratings SET rating = ?, comment = ? WHERE id = ?";
  db.query(query, [rating, comment, ratingId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error updating rating" });
    }

    res.json({ message: "Rating updated successfully" });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
