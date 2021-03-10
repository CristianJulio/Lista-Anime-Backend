const { Sequelize } = require("sequelize");

const db = process.env.DB_NAME;
const user = process.env.DB_USER;
const pass = process.env.DB_PASS;
const host = process.env.DB_HOST;

const sequelize = new Sequelize(db, user, pass, {
  host,
  dialect: 'mysql',
  logging: false
});

sequelize.testConnection = async function() {
  try {
    await sequelize.authenticate();
    console.log("Database connected")
  } catch (error) {
    console.log(`Unable to connect to the database: ${error}`);
  }
}

module.exports = sequelize;