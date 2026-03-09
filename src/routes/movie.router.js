const { Router } = require("express");
const {
  getAllMovies,
  getMovieById,
  getMovieReviewsById,
  createMovie,
  createMovieReview,
  updateMovieById,
  deleteMovieById,
} = require("../controller/movie.controller");

const movieRouter = Router();

movieRouter.get("/", getAllMovies);

movieRouter.get("/:id", getMovieById);

movieRouter.get("/:id/reviews", getMovieReviewsById);

movieRouter.post("/", createMovie);

movieRouter.post("/:id/reviews", createMovieReview);

movieRouter.put("/:id", updateMovieById);

movieRouter.delete("/:id", deleteMovieById);

module.exports = movieRouter;