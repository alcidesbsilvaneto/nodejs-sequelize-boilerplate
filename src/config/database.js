require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? process.env.PWD + '/.env.test' : process.env.PWD + '/.env'
});

module.exports = {
  "username": process.env.DB_USER,
  "password": process.env.DB_PASS,
  "database": process.env.DB_NAME,
  "host": process.env.DB_HOST,
  "dialect": process.env.DB_DIALECT,
  "logging": false,
  "define": {
    "timestamps": true,
    "underscored": true,
    "underscored_all": true
  },
}