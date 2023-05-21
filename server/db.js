const mysql = require("mysql2/promise");
const config = require('config').get('database');

module.exports = mysql.createPool({
    connectionLimit: 10,
    user: config.user,
    password: config.password,
    database: config.database,
    host: config.host,
    port: config.port,
});