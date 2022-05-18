const express = require("express");
const cors = require("cors");
const allMovies = require("./assets/allMovies.json");

// create and config server
const server = express();
server.use(cors());
server.use(express.json());
server.set("view engine", "ejs");

// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

server.get("/movies", (req, res) => {
  const genderFilterParams = req.query["gender"];
  let filteredMovies = [...allMovies];

  if (genderFilterParams !== "") {
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

server.get("/movie/:movieId", (req, res) => {
  const foundMovie = allMovies.find((movie) => movie.id === req.params.movieId);
  res.render("movie", foundMovie);
});

//static server

const staticServerPathAdmin = "./src/public-react";
server.use(express.static(staticServerPathAdmin));

const staticServerPathAdmin2 = "./src/public-movies-images";
server.use(express.static(staticServerPathAdmin2));

const staticServerPathAdminStyles = "./src/public-styles";
server.use(express.static(staticServerPathAdminStyles));
