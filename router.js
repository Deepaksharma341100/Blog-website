const express = require("express");
const ejsMate = require("ejs-mate");
const ExpressError = require("./ExpressError.js");
const crud = require("./controller/crud.js");
const router = express.Router();
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const Blogger = require("./modals/data.js");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./modals/user.js");
const homefunc = require("./controller/home.js");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
router.use(express.static(path.join(__dirname, "public"))); //because static files were not include in router
router.use(cookieParser());

const db_url = process.env.DB_URL;

router.use(
  session({
    secret: process.env.SESSION_SECRET || "mysecret",
    resave: false,
    saveUninitialized: true,
    proxy: true,
    store: MongoStore.create({
      mongoUrl: db_url,
      collectionName: "sessions",
    }),
    cookie: {
      secure: true,
      httpOnly: true,
      sameSite: "None",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); // User is authenticated, proceed to the next middleware/route handler
  } else {
    res.redirect("/login"); // User is not authenticated, redirect to login page
  }
}

router.use(passport.initialize());
router.use(passport.session());
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      // Use await to find the user
      const user = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: "Incorrect username." });
      }

      // Assuming you have a comparePassword method on your user model
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return done(null, false, { message: "Incorrect password." });
      }

      return done(null, user);
    } catch (err) {
      return done(err); // Handle errors
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

const cloudname = process.env.cloud_name;
const apikey = process.env.API_KEY;
const apisecret = process.env.API_SECRET;

cloudinary.config({
  cloud_name: cloudname,
  api_key: apikey,
  api_secret: apisecret,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "user_profiles", // Folder in Cloudinary to store profile photos
    allowed_formats: ["jpg", "jpeg", "png"], // Restrict file types
    public_id: (req, file) => `${Date.now()}_${file.originalname}`, // Generate a unique filename
  },
});

const upload = multer({ storage });
router.get("/register", async (req, res) => {
  res.render("register.ejs", { title: "registration", page: "Registration" });
});
router.post("/register", upload.single("image"), async (req, res) => {
  const { username, password, email, bio, address } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).send("User already exists");
    }
    const imageurl = req.file ? req.file.path : null;
    user = new User({
      username,
      password,
      email,
      bio,
      address,
      image: imageurl,
    });
    await user.save();
    res.redirect("/login");
  } catch (err) {
    console.error(err);

    res.status(500).send("Server error");
  }
});

router.get("/login", async (req, res) => {
  res.render("login.ejs", { title: "Login", page: "Login" });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err); // Handle errors during logout
    }
    req.session.destroy(); // Destroy session if using session-based auth
    res.redirect("/login"); // Redirect to login or another page
  });
});

//due to i do not include complete process of flash in router i did not get proper result , once i add complete steps in router file as well i can get result.
router.get("/home", ensureAuthenticated, homefunc.functionname);
router.get("/show/:id", homefunc.showfunc);
router.get("/new", crud.new);
router.post("/new", crud.newblog);
router.get("/profile", (req, res) => {
  const u = req.user;
  res.render("profile.ejs", { u, title: "Profile INfo", page: "Profile" });
});
router.delete("/show/:id", async (req, res) => {
  const { id } = req.params;
  const blog = await Blogger.findByIdAndDelete(id);
  res.redirect("/home");
});

router.get("/edit/:id", async (req, res) => {
  const { id } = req.params;
  /*
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send("Invalid blog ID");
  }
    */
  try {
    const editblog = await Blogger.findById(id);
    res.render("Edit.ejs", { editblog, title: "Edit", page: "Edit" });
  } catch (err) {
    res.status(400).send("problem occur");
  }
});
router.put("/edit/:id", async (req, res) => {
  const { id } = req.params;
  const editblog = await Blogger.findByIdAndUpdate(id, req.body);
  await editblog.save();
  res.redirect(`/home`);
});

router.get("/profile", (req, res) => {
  res.render("profile.ejs", { title: "user profile", page: "profile page" });
});

module.exports = router;
