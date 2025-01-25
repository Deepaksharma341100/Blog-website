const mongoose = require("mongoose");
const dschema = new mongoose.Schema({
  bloggername: {
    type: String,
    // required: true,
  },

  blogname: {
    type: String,
    // required: true,S
  },
  description: {
    type: String,
    //  required: true,
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],

  author: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("Blogger", dschema);
