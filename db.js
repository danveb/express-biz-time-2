/** Database setup for BizTime. */

// require('pg') and we're going to use Client 
const { Client } = require("pg"); // easiest

let DB_URI;

if (process.env.NODE_ENV === "test") {
    // setup db for testing
  DB_URI = "postgresql:///biztime_test";
} else {
    // setup db for main application and development
  DB_URI = "postgresql:///biztime";
}

let db = new Client({
    // Postgres connects to our database (usersdb)
  connectionString: DB_URI
});

db.connect(); // starts connection to database

module.exports = db; // export module to use elsewhere