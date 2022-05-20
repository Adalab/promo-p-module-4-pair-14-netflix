const express = require('express');
const cors = require('cors');
const allMovies = require('./assets/allMovies.json');
const users = require('./data/users.json');

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

//filter movies endpoint
server.get('/movies', (req, res) => {
  const genderFilterParams = req.query['gender'];
  let filteredMovies = [...allMovies];

  if (genderFilterParams !== '') {
    filteredMovies = allMovies.filter(
      (movie) => movie.gender === genderFilterParams
    );
  }

  const response = {
    success: true,
    movies: filteredMovies,
  };
  res.json(response);
});

//get movies id endpoint
server.get('/movie/:movieId', (req, res) => {
  const foundMovie = allMovies.find((movie) => movie.id === req.params.movieId);
  res.render('movie', foundMovie);
});

//users endpoint
server.post('/login', (req, res) => {
  let exist = users.find((user) => {
    if (user.email === req.body.email && user.password === req.body.password) {
      return user;
    }
    console.log(user.email);
    console.log(user.password);
    return null;
  });

  if (!exist) {
    return res.status(404).json({
      success: false,
      errorMessage: 'Usuaria/o no encontrada/o',
    });
  }
  return res.status(200).json({
    success: true,
    userId: exist.id,
  });
});

//static server

const staticServerPathAdmin = './src/public-react';
server.use(express.static(staticServerPathAdmin));

const staticServerPathAdmin2 = './src/public-movies-images';
server.use(express.static(staticServerPathAdmin2));

const staticServerPathAdminStyles = './src/publicStyles';
server.use(express.static(staticServerPathAdminStyles));
