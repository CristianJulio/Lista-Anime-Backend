const { DataTypes } = require("sequelize");
const sequelize = require("../database/database");

const Anime = sequelize.define("Anime", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  mal_id: {
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  episodes: {
    type: DataTypes.INTEGER,
    defaultValue: null
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  timestamps: false
});

module.exports = Anime;