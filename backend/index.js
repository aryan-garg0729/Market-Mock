require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const pool = require('./db/connection');
const z = require("zod");
const jwt = require("jsonwebtoken");
const auth = require("./middlewares/auth");

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

// Zod schema for email validation
const emailSchema = z.string().email({ message: "Invalid email address" });

// Root route
app.get("/", (req, res) => {
    res.send("Hello World");
});

// Register route
app.post("/register", async (req, res) => {
    const { email, password, username } = req.body;

    // Validate email format
    if (!emailSchema.safeParse(email).success) {
        return res.status(400).json({ message: "Wrong data format" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        // Check if user already exists
        const user = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
        if (user.rows.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Insert new user into the database
        const response = await pool.query("INSERT INTO users (email, password, username) VALUES ($1, $2, $3) RETURNING *", [email, hashedPassword, username]);
        console.log(response.rows[0]);

        // Generate JWT token and set cookie
        const token = jwt.sign({ email: email }, process.env.JWT_SECRET);
        res.cookie("token", token);
        res.status(200).json({ message: "User created successfully" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Login route
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // Validate email format
    if (!emailSchema.safeParse(email).success) {
        return res.status(400).json({ message: "Wrong data format" });
    }

    try {
        // Check if user exists
        const user = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
        if (user.rows.length === 0) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Compare password
        const match = await bcrypt.compare(password, user.rows[0].password);
        if (!match) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT token and set cookie
        const token = jwt.sign({ email: email }, process.env.JWT_SECRET);
        res.cookie("token", token);
        res.status(200).json({ message: "Login successful" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Logout route
app.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
});

// get profile route
app.get("/profile",auth, async (req, res) => {
    
    try {
        const email = req.body.email;
        const user = await pool.query("SELECT email,username,balance,market_value,invested FROM users WHERE email=$1", [email]);
        console.log(user.rows[0])
        res.status(200).json(user.rows[0]);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "internal server error" });
    }
});



// Start the server
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});