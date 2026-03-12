const Movie = require("../models/movie.model");

const movies = [
  // {
  //   id: 1,
  //   title: "Inception",
  //   description:
  //     "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.",
  //   types: ["Action", "Sci-Fi", "Thriller"],
  //   averageRating: 4.5,
  //   reviews: [
  //     {
  //       id: 1,
  //       content: "Amazing movie with a mind-bending plot!",
  //       rating: 5,
  //     },
  //     {
  //       id: 2,
  //       content: "Great visuals and story, but a bit confusing at times.",
  //       rating: 4,
  //     },
  //   ],
  // },
];

let nextMovieId = 1;
let nextReviewId = 1;

const getMovieById = async (req, res, next) => {
  try {
    const { id: movieId } = req.params;
    // const movie = movies.find((movie) => movie.id === Number(movieId));
    const movie = await Movie.findById(movieId).exec();

    if (!movie) {
      return res.status(404).json(`Movie ${movieId} not found`);
    }

    res.json(movie);
  } catch (error) {
    next(error);
  }
};

const getAllMovies = async (req, res, next) => {
  try {
    const { keyword, sort, page, limit } = req.query;
    const parsedPage = parseInt(page) || 1;
    const parsedLimit = parseInt(limit) || 10;

    // let filteredMovies = [...movies];

    const filter = {};

    if (keyword) {
      // filteredMovies = filteredMovies.filter(
      //   (movie) =>
      //     movie.title.toLowerCase().includes(keyword.toLowerCase()) ||
      //     movie.description.toLowerCase().includes(keyword.toLowerCase()),
      // );
      filter.$or = [
        {
          title: { $regex: keyword, $options: "i" },
        },
        {
          description: { $regex: keyword, $options: "i" },
        },
      ];
    }

    const sortOption = {};
    if (sort === "rating") {
      // filteredMovies.sort((a, b) => a.averageRating - b.averageRating);
      sortOption.averageRating = 1;
    } else if (sort === "-rating") {
      // filteredMovies.sort((a, b) => b.averageRating - a.averageRating);
      sortOption.averageRating = -1;
    }

    const startIndex = (parsedPage - 1) * parsedLimit;
    // const endIndex = startIndex + parsedLimit;

    const filteredMovies = await Movie.find(filter).sort(sortOption).skip(startIndex).limit(parsedLimit).exec();

    res.json(filteredMovies);
  } catch (error) {
    next(error);
  }
};

const getMovieReviewsById = async (req, res, next) => {
  try {
    const { id: movieId } = req.params;
    // const movie = movies.find((movie) => movie.id === Number(movieId));
    const movie = await Movie.findById(movieId).exec();

    if (!movie) {
      return res.status(404).json(`Movie ${movieId} not found`);
    }

    res.json(movie.reviews);
  } catch (error) {
    next(error);
  }
};

const createMovie = async (req, res, next) => {
  try {
    const { title, description, types } = req.body;

    if (!title || !description || !Array.isArray(types) || types.length === 0) {
      return res.status(400).json("Title, description and types are required");
    }

    // const newMovie = {
    //   id: nextMovieId++,
    //   title,
    //   description,
    //   types,
    //   averageRating: 0,
    //   reviews: [],
    // };

    // movies.unshift(newMovie);

    const newMovie = await Movie.create({ title, description, types });

    res.status(201).json(newMovie);
  } catch (error) {
    next(error);
  }
};

const createMovieReview = async (req, res, next) => {
  try {
    const { id: movieId } = req.params;

    // const movie = movies.find((movie) => movie.id === Number(movieId));
    const movie = await Movie.findById(movieId).exec();

    if (!movie) {
      return res.status(404).json(`Movie ${movieId} not found`);
    }

    const { content, rating } = req.body;

    if (!content || !rating || Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json("Content is required and rating must be between 1 and 5");
    }

    const newReview = {
      // id: nextReviewId++,
      content,
      rating,
    };

    movie.reviews.push(newReview);

    // const ratingSum = movie.reviews.reduce((sum, review) => sum + review.rating, 0);
    // const averageRating = ratingSum / movie.reviews.length;
    // movie.averageRating = +averageRating.toFixed(2);

    await movie.save();

    res.status(201).json(movie.reviews[movie.reviews.length - 1]);
  } catch (error) {
    next(error);
  }
};

const updateMovieById = async (req, res, next) => {
  try {
    const { id: movieId } = req.params;
    // const movie = movies.find((movie) => movie.id === Number(movieId));
    const movie = await Movie.findById(movieId).exec();

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

    await movie.save();

    res.json(movie);
  } catch (error) {
    next(error);
  }
};

const deleteMovieById = async (req, res, next) => {
  try {
    const { id: movieId } = req.params;
    // const movieIndex = movies.findIndex((movie) => movie.id === Number(movieId));
    const movie = await Movie.findById(movieId).exec();

    if (!movie) {
      return res.status(404).json(`Movie ${movieId} not found`);
    }

    // movies.splice(movieIndex, 1);
    await Movie.findByIdAndDelete(movieId).exec();

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
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
