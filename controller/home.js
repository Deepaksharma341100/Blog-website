const ExpressError = require("../ExpressError");
const Blogger = require("../modals/data.js");
const mongoose = require("mongoose");
module.exports.functionname = async (req, res, next) => {
  try {
    //asyncoronous javascript we use to fetch the data
    const blogs = await Blogger.find(); //ajax use to fetch tha data although we had connect mongoose but have to use async await keywords
    res.render("home.ejs", { blogs, title: "home page", page: "Home" });
    //here i got error when i do not use async , await then i got blogs is not iterable
  } catch {
    next(new ExpressError("Home page not found", 404));
  }
};

module.exports.showfunc = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send("Invalid blog ID");
    }
    const blog = await Blogger.findById(id).populate("reviews");
    const currentuser = req.user ? req.user.username : null;
    res.render("show.ejs", {
      blog,
      currentuser,
      title: "home page",
      page: "Show",
    });
  } catch {
    next(new ExpressError("id not found", 400));
  }
};
