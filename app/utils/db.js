
const { Pool } = require('pg');

const pool = new Pool({
    user: "twuuser",
    host: process.env.DB_HOST || "localhost",
    database: "twudb",
    password: "twupw",
    port: "5432",
});

module.exports = pool;
