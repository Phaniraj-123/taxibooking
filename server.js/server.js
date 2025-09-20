const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ✅ MySQL connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",  // 🔹 put your actual MySQL password here
    database: "taxibook"       // 🔹 make sure this DB exists in MySQL
});

db.connect(err => {
    if (err) {
        console.error("❌ MySQL connection failed:", err);
    } else {
        console.log("✅ MySQL connected...");
    }
});

// ✅ Signup route
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/signup", (req, res) => {
    const { name, email, mobile, password } = req.body;

    const sql = "INSERT INTO users (name, email, mobile, password) VALUES (?, ?, ?, ?)";
    db.query(sql, [name, email, mobile, password], (err, result) => {
        if (err) {
            console.error("❌ Error inserting user:", err);
            return res.status(500).send("Error saving user");
        }
        res.send("✅ User registered successfully!");
    });
});

app.listen(5000, () => {
    console.log("🚀 Server running on http://localhost:5000");
});

// ✅ Login route
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    db.query(sql, [email, password], (err, results) => {
        if (err) {
            console.error("❌ Error checking login:", err);
            return res.status(500).send("Error during login");
        }

        if (results.length > 0) {
            res.send("✅ Login successful!");
        } else {
            res.status(401).send("❌ Invalid email or password");
        }
    });
});
