const pg = require('pg');
const connectionString = process.env.DATABASE_URL;

const client = new pg.Client(connectionString);

client.connect();
client.query(`
CREATE TABLE IF NOT EXISTS users (
  id serial PRIMARY KEY,
  name VARCHAR(100),
  email text UNIQUE NOT NULL,
  entries BIGINT DEFAULT 0,
  joined TIMESTAMP NOT NULL
)

CREATE TABLE IF NOT EXISTS login (
  id serial PRIMARY KEY,
  hash VARCHAR(100) NOT NULL,
  email text UNIQUE NOT NULL
)
`, (err, res) => {
  if (err) {
    return console.error('Error with PostgreSQL Database', err);
  }
  client.end();
});

// client.connect();
// client.query(`
// CREATE TABLE IF NOT EXISTS login (
//   id serial PRIMARY KEY,
//   hash VARCHAR(100) NOT NULL,
//   email text UNIQUE NOT NULL
// )
// `, (err, res) => {
//   if (err) {
//     return console.error('Error with PostgreSQL Database', err);
//   }
//   client.end();
// });

