const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const createTables = async () => {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        const sql = fs.readFileSync(path.join(__dirname, 'tables.sql'), 'utf8');
        console.log(sql);
        await pool.query(sql);
        console.log('Tables created successfully.');
    } catch (err) {
        console.error('Error creating tables:', err);
    } finally {
        await pool.end();
    }
};

createTables();

