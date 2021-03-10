require("dotenv").config({ path: '.env' });
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const app = express();
const sequelize = require("./database/database");

// TEST DATABASE CONNECTION
sequelize.testConnection();

// PORT
app.set('port', process.env.PORT || 4000);

// CORS OPTIONS
const corsOptions = {
  origin: process.env.FRONT_DOMAIN || 'http://localhost:3000',
  optionsSuccessStatus: 200
}

// MIDDLEWARES
app.use(express.json());
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(helmet());

// ROUTES
app.use("/api/users", require("./routes/user.routes"));

module.exports = app;