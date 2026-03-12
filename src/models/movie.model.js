const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewSchema = new Schema(
  {
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must be at most 5"],
    },
  },
  { timestamps: true },
);

const movieSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
  },
  types: {
    type: [String],
    validate: {
      validator: (types) => Array.isArray(types) && types.length > 0,
      message: "Invalid types",
    },
  },
  averageRating: {
    type: Number,
    default: 0,
  },
  reviews: [reviewSchema],
});

movieSchema.pre("save", function () {
  if (this.reviews.length > 0) {
    const ratingSum = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = ratingSum / this.reviews.length;
    this.averageRating = +averageRating.toFixed(2);
  }
});

module.exports = mongoose.model("Movie", movieSchema);