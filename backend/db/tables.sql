-- Create the users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,                     -- Unique user ID
    email VARCHAR(255) UNIQUE NOT NULL,       -- User's email, must be unique
    username VARCHAR(50) NOT NULL,            -- User's username
    password VARCHAR(255) NOT NULL,           -- Hashed password
    balance NUMERIC(10,2) NOT NULL DEFAULT 1000000,         -- User's account balance
    invested NUMERIC(10,2) NOT NULL DEFAULT 0, -- Amount invested by the user
    market_value NUMERIC(10,2) NOT NULL DEFAULT 0,         -- User's market value
);

CREATE TABLE stocks (
    id SERIAL PRIMARY KEY,                     -- Unique stock ID
    symbol VARCHAR(10) UNIQUE NOT NULL,        -- Stock symbol (e.g., AAPL, TSLA)
    name VARCHAR(255) NOT NULL,                -- Full name of the company
    exchange VARCHAR(50) NOT NULL,             -- Stock exchange (e.g., NSE, BSE, NASDAQ)
    sector VARCHAR(100),                       -- Industry sector (e.g., Technology, Finance)
    last_price NUMERIC(10, 2) DEFAULT 0.00,    -- Last recorded price
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp of the last update
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    stock_symbol VARCHAR(10) REFERENCES stocks(symbol), -- Foreign key to stocks table
    order_type VARCHAR(10) NOT NULL,                    -- BUY or SELL
    quantity INT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING', -- Fixed this line
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the portfolio table
CREATE TABLE portfolios (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,       -- Foreign key to users table
    stock_symbol VARCHAR(10) REFERENCES stocks(symbol),      -- Foreign key to stocks table
    quantity INT NOT NULL,
    average_price NUMERIC(10, 2) NOT NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for faster queries
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_portfolios_user_id ON portfolios(user_id);
