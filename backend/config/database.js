const { Sequelize } = require('sequelize');
require('dotenv').config();

function getDatabaseUrl() {
  // Render auto-injects DATABASE_URL from attached DB
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;

  // Fallback: construct from individual env vars (Render internal)
  const host = process.env.DB_HOST || 'localhost';
  const port = process.env.DB_PORT || '5432';
  const user = process.env.DB_USER || process.env.DB_USERNAME || 'postgres';
  const pass = process.env.DB_PASSWORD || 'postgres';
  const name = process.env.DB_NAME || process.env.DB_DATABASE || 'rullzye_store';
  return `postgresql://${user}:${pass}@${host}:${port}/${name}`;
}

let sequelize;

if (process.env.DB_DIALECT === 'sqlite' || (!process.env.DATABASE_URL && process.env.NODE_ENV !== 'production')) {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_STORAGE || './database.sqlite',
    logging: false,
  });
} else {
  const dbUrl = getDatabaseUrl();
  sequelize = new Sequelize(dbUrl, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: process.env.NODE_ENV === 'production' ? {
        require: true,
        rejectUnauthorized: false,
      } : false,
    },
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
}

module.exports = sequelize;
