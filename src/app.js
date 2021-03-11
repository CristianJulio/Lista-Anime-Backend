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
  origin: process.env.FRONT_DOMAIN,
  optionsSuccessStatus: 200
}

// MIDDLEWARES
app.use(express.json());
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(helmet());

// ROUTES
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/users_animes", require("./routes/usersAnimes.routes"));

module.exports = app;