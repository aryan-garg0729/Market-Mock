const { Pool } = require('pg');

// current db: docker run --name my-postgres -d -p 5432:5432 -e POSTGRES_PASSWORD=mypassword postgres

// Create a connection pool using the connection string from the environment variables
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max:20,
    idleTimeoutMillis:5000,
    connectionTimeoutMillis:5000
});

// Test the database connection
const testConnection = async () => {
    try {
        const res = await pool.query('SELECT NOW()'); // Simple query to check the connection
        console.log('Database connected successfully:', res.rows[0]);
    } catch (err) {
        console.error('Error connecting to the database:', err);
    }
};

// Run the test connection
testConnection();

// Export the pool to use in other parts of the application
module.exports = pool;
