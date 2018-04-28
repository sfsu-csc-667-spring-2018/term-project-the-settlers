const pgp = require('pg-promise')();
console.log("process.env.DATABASE_URL:" + process.env.DATABASE_URL);
const connection = pgp(process.env.DATABASE_URL);
const cn = {
    host: 'localhost', // 'localhost' is the default;
    port: 5432, // 5432 is the default;
    database: 'catan',
    user: 'postgres',
    password: '1234'
};

const db = pgp(cn);



exports = module.exports;
exports.users = require('./users/')(connection);

