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
const idValidator = require("../middleware/validateId.middleware");

const movieRouter = Router();

movieRouter.get("/", getAllMovies);

movieRouter.get("/:id", idValidator, getMovieById);

movieRouter.get("/:id/reviews", idValidator, getMovieReviewsById);

movieRouter.post("/", createMovie);

movieRouter.post("/:id/reviews", idValidator, createMovieReview);

movieRouter.put("/:id", idValidator, updateMovieById);

movieRouter.delete("/:id", idValidator, deleteMovieById);

module.exports = movieRouter;