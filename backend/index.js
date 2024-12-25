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
const WebSocket = require('ws');

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
const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

/*  NOTES:-
data from finnhub: {
  "data": [
    {
      "p": 7296.89,
      "s": "BINANCE:BTCUSDT",
      "t": 1575526691134,
      "v": 0.011467
    }
  ],
  "type": "trade"
}
  
stock symbols: https://finnhub.io/api/v1/stock/symbol?exchange=US&token=${process.env.FINNHUB_API_KEY}

*/

// WebSocket server
const wss = new WebSocket.Server({ server });

const socket = new WebSocket(`wss://ws.finnhub.io?token=${process.env.FINNHUB_API_KEY}`);

// Unsubscribe function
const unsubscribe = function(symbol) {
    socket.send(JSON.stringify({ 'type': 'unsubscribe', 'symbol': symbol }));
};

// Connection opened -> Subscribe
socket.addEventListener('open', function(event) {
    socket.send(JSON.stringify({ 'type': 'subscribe', 'symbol': 'BINANCE:BTCUSDT' }));
    socket.send(JSON.stringify({ 'type': 'subscribe', 'symbol': 'AAPL' }));
    socket.send(JSON.stringify({ 'type': 'subscribe', 'symbol': 'GOOG' }));
    socket.send(JSON.stringify({ 'type': 'subscribe', 'symbol': 'AMZN' }));
});

// Listen for messages
socket.addEventListener('message', function(event) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(event.data);
        }
    });
});

// Close connection
socket.addEventListener('close', function(event) {
    unsubscribe('AAPL');
    unsubscribe('GOOG');
    unsubscribe('AMZN');
});

exports.server = server;