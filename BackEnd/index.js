const express = require("express");
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors"); // Add this line
require("dotenv").config();

const app = express();
app.use(cors());
const port = process.env.PORT || 4000;

// MySQL connection
const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

db.connect((err) => {
  if (err) {
    // throw err;
    console.log("Error connecting to db, check your conenction");
  }
  console.log("Connected to MySQL");
});

app.use(express.json());

// ping route
app.get("/", (req, res) => {
  res.send("Ping pong , I am working");
});
// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
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
    const token = jwt.sign({ email }, process.env.SECRET_KEY, {
      expiresIn: "24h",
    });
    res.json({ token });
  });
});

app.get("/brewery/:id", verifyToken, (req, res) => {
  const breweryId = req.params.id;

  // Query to get all details related to every rating for a brewery
  const query =
    "SELECT rating, comment, users.email AS user_email FROM ratings RIGHT JOIN users ON ratings.user_email = users.email WHERE brewery_id = ?";

  db.query(query, [breweryId], (err, result) => {
    if (err) {
      return res.json({ avgRating: 0, reviewCount: 0, ratings: [] });
    }

    console.log(result);
    if (result.length === 0) {
      // No ratings found, return 0 and an empty list
      return res.json({ avgRating: 0, reviewCount: 0, ratings: [] });
    } else {
      // Return all details related to every rating
      return res.json({
        avgRating:
          result.reduce((acc, curr) => acc + curr.rating, 0) / result.length,
        reviewCount: result.length,
        ratings: result,
      });
    }
  });
});

app.post("/rating", verifyToken, (req, res) => {
  const { breweryId, rating, comment } = req.body;
  const userEmail = req.user.email;

  const checkQuery =
    "SELECT * FROM ratings WHERE brewery_id = ? AND user_email = ?";
  db.query(checkQuery, [breweryId, userEmail], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error checking rating" });
    }

    if (result.length > 0) {
      return res
        .status(400)
        .json({ message: "You have already rated this brewery" });
    }

    const insertQuery =
      "INSERT INTO ratings (brewery_id, rating, comment, user_email) VALUES (?, ?, ?, ?)";
    db.query(
      insertQuery,
      [breweryId, rating, comment, userEmail],
      (err, result) => {
        if (err) {
          return res.status(500).json({ message: "Error posting rating" });
        }

        res.status(201).json({ message: "Rating posted successfully" });
      }
    );
  });
});

// Edit a rating and comment route
app.put("/rating/:breweryId", verifyToken, (req, res) => {
  const breweryId = req.params.breweryId;
  const { rating, comment } = req.body;
  const userEmail = req.user.email;

  const query =
    "UPDATE ratings SET rating = ?, comment = ? WHERE brewery_id = ? AND user_email = ?";
  db.query(query, [rating, comment, breweryId, userEmail], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error updating rating" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "No rating found for this user and brewery" });
    }

    res.json({ message: "Rating updated successfully" });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
