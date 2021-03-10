const { DataTypes } = require("sequelize");
const sequelize = require("../database/database");
const User = require("./User");
const Anime = require("./Anime");

const UsersAnimes = sequelize.define("UsersAnimes", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  animeId: {
    type:DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Anime,
      key: 'id'
    }
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "not_added"
  },
  score: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  progress: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize,
  timestamps: false,
  tableName: 'users_animes'
});

User.belongsToMany(Anime, { through: UsersAnimes });
Anime.belongsToMany(User, { through: UsersAnimes });

module.exports = UsersAnimes;