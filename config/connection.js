const development = {
  database: 'test_mysql',
  username: 'root',
  password: 'password',
  host: '127.0.0.1',
  dialect: 'mysql',
};

const testing = {
  database: 'databasename',
  username: 'username',
  password: 'password',
  host: '127.0.0.1',
  dialect: 'mysql',
};

// set process.env for Production??
const production = {
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST || '127.0.0.1',
  dialect: 'mysql',
};

module.exports = {
  development,
  testing,
  production,
};
