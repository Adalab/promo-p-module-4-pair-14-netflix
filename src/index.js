const express = require('express');
const cors = require('cors');
// const allMovies = require('./assets/allMovies.json');
// const users = require('./data/users.json');
const Database = require('better-sqlite3');

// create and config server
const server = express();
server.use(cors());
server.use(express.json());
server.set('view engine', 'ejs');

// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});
//--------endpoints

const baseImagePath = `http://localhost:${serverPort}/`;

//filter movies endpoint
server.get('/movies', (req, res) => {
  const query = db.prepare('SELECT id,title,gender,image FROM movies');
  const dataMovies = query.all();

  const response = {
    success: true,
    movies: dataMovies,
  };
  res.json(response);
});

//get movies id endpoint
server.get('/movie/:movieId', (req, res) => {
  const query = db.prepare(
    'SELECT id,title,gender,image FROM movies where id = ?'
  );
  let foundMovie = query.get(req.params.movieId);
  //foundMovie.image = baseImagePath + foundMovie.image;

  const response = {
    baseImagePath: baseImagePath,
    foundMovie: foundMovie,
  };

  res.render('movie', response);
});

//users endpoint
server.post('/login', (req, res) => {
  const query = db.prepare(
    'SELECT id,email,password,name FROM users where users.email = ?'
  );
  console.log(foundUser);
  const foundUser = query.get(req.body.email);

  if (!foundUser) {
    return res.status(404).json({
      success: false,
      errorMessage: 'Usuaria/o no encontrada/o',
    });
  }
  return res.status(200).json({
    success: true,
    userId: foundUser.id,
  });
});

//users singup
server.post('/sign-up', (req, res) => {
  const userSignUpInsert = db.prepare(
    `SELECT * FROM users WHERE email = ? AND password = ? AND name = ?`
  );
  const foundUser = userSignUpInsert.get(
    req.body.email,
    req.body.password,
    req.body.name
  );

  if (foundUser === undefined) {
    const userSignUpInsert = db.prepare(
      'INSERT INTO users (email, password, name) VALUES (?, ?, ?)'
    );
    const userSignUp = userSignUpInsert.run(
      req.body.email,
      req.body.password,
      req.body.name
    );

    res.json({
      success: true,
      userId: userSignUp.lastInsertRowid,
    });
  } else {
    res.json({
      success: false,
      errorMessage: 'Usuaria/o ya existente',
    });
  }
});

//--

// // Registro de nuevas usuarias en el back
// server.post("/sign-up", (req, res) => {
//   // body params
//   const emailSignUpParam = req.body.email;
//   const passwordSignUpParam = req.body.password;

//   const userSignUpInsert = db.prepare(
//     `SELECT * FROM users WHERE email = ? AND password = ?`
//   );
//   const foundUser = userSignUpInsert.get(emailSignUpParam, passwordSignUpParam);

//   if (foundUser === undefined) {
//     const query = db.prepare(
//       "INSERT INTO users (email, password) VALUES (?, ?)"
//     );
//     const userSignUp = query.run(emailSignUpParam, passwordSignUpParam);

//     res.json({
//       success: true,
//       userId: userSignUp.lastInsertRowid,
//     });
//   } else {
//     res.json({
//       success: false,
//       errorMessage: "Usuaria/o ya existente",
//     });
//   }
// });

//static server

const staticServerPathAdmin = './src/public-react';
server.use(express.static(staticServerPathAdmin));

const staticServerPathAdmin2 = './src/public-movies-images';
server.use(express.static(staticServerPathAdmin2));

const staticServerPathAdminStyles = './src/publicStyles';
server.use(express.static(staticServerPathAdminStyles));

//dataBase

const db = new Database('./src/db/database.db', {
  verbose: console.log,
});
