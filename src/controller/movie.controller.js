const movies = [];

let nextMovieId = 1;
let nextReviewId = 1;

const getMovieById = (req, res, next) => {
  const { id: movieId } = req.params;
  const movie = movies.find((movie) => movie.id === Number(movieId));

  if (!movie) {
    return res.status(404).json(`Movie ${movieId} not found`);
  }

  res.json(movie);
};

const getAllMovies = (req, res, next) => {
  const { keyword, sort, page, limit } = req.query;
  const parsedPage = parseInt(page) || 1;
  const parsedLimit = parseInt(limit) || 10;

  let filteredMovies = [...movies];

  if (keyword) {
    filteredMovies = filteredMovies.filter(
      (movie) =>
        movie.title.toLowerCase().includes(keyword.toLowerCase()) ||
        movie.description.toLowerCase().includes(keyword.toLowerCase()),
    );
  }

  if (sort === "rating") {
    filteredMovies.sort((a, b) => a.averageRating - b.averageRating);
  } else if (sort === "-rating") {
    filteredMovies.sort((a, b) => b.averageRating - a.averageRating);
  }

  const startIndex = (parsedPage - 1) * parsedLimit;
  const endIndex = startIndex + parsedLimit;

  res.json(filteredMovies.slice(startIndex, endIndex));
};

const getMovieReviewsById = (req, res, next) => {
  const { id: movieId } = req.params;
  const movie = movies.find((movie) => movie.id === Number(movieId));

  if (!movie) {
    return res.status(404).json(`Movie ${movieId} not found`);
  }

  res.json(movie.reviews);
};

const createMovie = (req, res, next) => {
  const { title, description, types } = req.body;

  if (!title || !description || !Array.isArray(types) || types.length === 0) {
    return res.status(400).json("Title, description and types are required");
  }

  const newMovie = {
    id: nextMovieId++,
    title,
    description,
    types,
    averageRating: 0,
    reviews: [],
  };

  movies.unshift(newMovie);

  res.status(201).json(newMovie);
};

const createMovieReview = (req, res, next) => {
  const { id: movieId } = req.params;

  const movie = movies.find((movie) => movie.id === Number(movieId));

  if (!movie) {
    return res.status(404).json(`Movie ${movieId} not found`);
  }

  const { content, rating } = req.body;

  if (!content || !rating || Number(rating) < 1 || Number(rating) > 5) {
    return res.status(400).json("Content is required and rating must be between 1 and 5");
  }

  const newReview = {
    id: nextReviewId++,
    content,
    rating: Number(rating),
  };

  movie.reviews.push(newReview);

  const ratingSum = movie.reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = ratingSum / movie.reviews.length;
  movie.averageRating = +averageRating.toFixed(2);

  res.status(201).json(newReview);
};

const updateMovieById = (req, res, next) => {
  const { id: movieId } = req.params;
  const movie = movies.find((movie) => movie.id === Number(movieId));

  if (!movie) {
    return res.status(404).json(`Movie ${movieId} not found`);
  }

  const { title, description, types } = req.body;

  if (title) {
    movie.title = title;
  }

  if (description) {
    movie.description = description;
  }

  if (types) {
    if (!Array.isArray(types) || types.length === 0) {
      return res.status(400).json("Types must be a non-empty array");
    }
    movie.types = types;
  }

  res.json(movie);
};

const deleteMovieById = (req, res, next) => {
  const { id: movieId } = req.params;
  const movieIndex = movies.findIndex((movie) => movie.id === Number(movieId));

  if (movieIndex === -1) {
    return res.status(404).json(`Movie ${movieId} not found`);
  }

  movies.splice(movieIndex, 1);
  res.sendStatus(204);
};

module.exports = {
  getMovieById,
  getAllMovies,
  getMovieReviewsById,
  createMovie,
  createMovieReview,
  updateMovieById,
  deleteMovieById,
};
