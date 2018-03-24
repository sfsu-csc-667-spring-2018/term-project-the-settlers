const pgp = require('pg-promise')();
require('dotenv').config();
console.log("Database_url: " + process.env.DATABASE_URL);
const connection = pgp(process.env.DATABASE_URL);

module.exports = connection;