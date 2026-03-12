const mongoose = require("mongoose");

const idValidator = (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({
      message: "Id not found",
    });
  }
  next();
};

module.exports = idValidator;
