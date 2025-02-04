require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const MongoStore = require("connect-mongo");
const path = require("path");
const Blogger = require("./modals/data.js");
const ExpressError = require("./ExpressError.js");
const methodOverride = require("method-override");
const Review = require("./modals/review.js");
const routeropen = require("./router.js");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const db_url = process.env.DB_URL;
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use("/", routeropen);
app.use(cookieParser());

mongoose
  .connect(db_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "mysecret",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.DB_URL, // Your MongoDB connection string
      collectionName: "sessions",
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

app.post("/show/:id/reviews", async (req, res, next) => {
  try {
    const { id } = req.params;
    const blog = await Blogger.findById(id);
    const review = new Review(req.body.review);
    review.reviewdby = req.user;
    blog.reviews.push(review);
    await blog.save();
    await review.save();
    res.redirect(`/show/${blog._id}`);
  } catch {
    next(new ExpressError("cannot add review", 401));
  }
});

app.delete("/show/:id/reviews/:reviewid", async (req, res) => {
  const { id, reviewid } = req.params;
  await Blogger.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
  await Review.findByIdAndDelete(reviewid);
  res.redirect(`/show/${id}`);
});

app.all("*", (err, req, res, next) => {
  next(new ExpressError("something went wrong", 401));
});
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  if (!err.message) err.message = "something went wrong";
  res.status(err.statusCode).render("err.ejs", { err });
});
app.listen(port, () => {
  console.log("ok done");
});
