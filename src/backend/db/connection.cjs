const { Pool } = require('pg');
const ENV = process.env.NODE_ENV || 'development';

const development = `${__dirname}/../.env.${ENV}`;

const config = {};

if (ENV === 'production') {
  config.connectionString = process.env.DATABASE_URL;
  config.max = 2;
}

require('dotenv').config({
  path: development,
});

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error('PGDATABASE or DATABASE_URL not configured');
}

const db = new Pool(config);

module.exports = db;
