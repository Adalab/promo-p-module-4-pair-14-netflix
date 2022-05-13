const express = require('express');
const cors = require('cors');
const allMovies = require('./assets/allMovies.json');

// create and config server
const server = express();
server.use(cors());
server.use(express.json());

// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

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

//static server

const staticServerPathAdmin = './src/public-react';
server.use(express.static(staticServerPathAdmin));

//const staticServerPathAdmin2 = './src/public-movies-images';
//server.use(express.static(staticServerPathAdmin2));
