const mysql = require("mysql2");

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
    port: 3306
})


module.exports = {
    pool,
};