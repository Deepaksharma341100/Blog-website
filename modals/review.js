const mongoose = require("mongoose");

const reviewschema = new mongoose.Schema({
  body: {
    type: String,
    // required: true,
  },
  reviewdby: {
    type: String,
  },
});

module.exports = mongoose.model("Review", reviewschema);
