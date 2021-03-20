CREATE DATABASE animelist;

USE animelist;

CREATE TABLE users(
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  terms_accepted TINYINT NOT NULL,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW() ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE animes(
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  mal_id INT UNIQUE NOT NULL,
  title VARCHAR(100) NOT NULL,
  episodes INT NULL DEFAULT 0,
  image_url VARCHAR(100) NOT NULL,
  type VARCHAR(10) NOT NULL
);

CREATE TABLE users_animes(
  userId INT NOT NULL,
  animeId INT NOT NULL,
  status VARCHAR(20) NOT NULL,
  score FLOAT NOT NULL,
  progress INT NOT NULL,
  FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY(animeId) REFERENCES animes(id) ON DELETE CASCADE,
  PRIMARY KEY(userId, animeId)
);

-- SELECT users.username, animes.title, users_animes.status
--   FROM users_animes
--   INNER JOIN animes 
--     ON users_animes.animeId = animes.id
--   INNER JOIN users
--     ON users_animes.userId = users.id;

-- -- Members
-- SELECT animes.title, count(*) as n_members
--   FROM users_animes
--   INNER JOIN animes 
--     ON users_animes.animeId = animes.id
--   INNER JOIN users
--     ON users_animes.userId = users.id GROUP BY animes.title;

-- -- number by status
-- SELECT animes.title, users_animes.status, count(*) as n_status
--   FROM users_animes
--   INNER JOIN animes
--     ON animes.id = users_animes.animeId
--   GROUP BY users_animes.status, animes.title;

-- SELECT * FROM users_animes
--   INNER JOIN animes 
--     ON animes.id = users_animes.animeId;