const ExpressError = require("../ExpressError.js");
const Blogger = require("../modals/data.js");

module.exports.new = (req, res) => {
  res.render("new.ejs", { title: "Create", page: "Create" });
};

module.exports.newblog = async (req, res, next) => {
  try {
    const newblog = new Blogger(req.body);
    await newblog.save();
    res.redirect("/home");
  } catch {
    next(new ExpressError("Not Able to Post", 500));
  }
};
