import "dotenv/config";

import connectDB from "./config/db.js";
import cloudinary from "./config/cloudinary.js";
import Post from "./model/post.js";
import User from "./model/user.js";
import Destination from "./model/destinations.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "./config/passport.js";

import express from "express";
import expressLayouts from "express-ejs-layouts";

import postRoutes from "./routes/postRoutes.js"; // upload the file on post collection and cloudinary
import destinationUpload from "./routes/destinationUpload.js"; //upload the data on destination collection and cloudinary
import uploadRoutes from "./routes/uploadRoutes.js"; //show the file upload page
import videoRoutes from "./routes/videoRoutes.js"; //show the vedio player page
import authRoutes from "./routes/authRoutes.js"; //show the login and signup page
import authApi from "./routes/authApi.js"; //validate the data comes from signIn and signUp form
import profileRoutes from "./routes/profileRoutes.js"; //show the profile when user is logged in
import destinationRoutes from "./routes/destinationRoutes.js"; //show the all-destinaton to the user
import contactRoute from "./routes/contactRoute.js";
import aboutRoute from "./routes/aboutRoute.js";
import feedbackRoute from "./routes/feedbackRoute.js";
import adminRoute from "./routes/adminRoute.js";
import currentUser from "./middleware/currentUser.js";

import path from "path";
import { fileURLToPath } from "url";
const app = express();

app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layouts/main");
app.set("trust proxy", 1);

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    name: "travel.sid", // custom cookie name
    secret: process.env.SESSION_SECRET || "superSecretKey",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }),
    cookie: {
      httpOnly: true,
      secure: false, // true only in HTTPS
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);
// Passport
app.use(passport.initialize());
app.use(passport.session());
app.use(currentUser);
connectDB();

// ROUTES
app.use("/api/upload", postRoutes);
app.use("/api/upload/destination", destinationUpload);
app.use("/api/feedback", feedbackRoute);
app.use("/api/contact", contactRoute);
app.use("/", uploadRoutes);
app.use("/", videoRoutes);
app.use("/auth", authRoutes);
app.use("/api/auth", authApi);
app.use("/admin/login", adminRoute);
app.use("/", profileRoutes);
app.use("/all-destination", destinationRoutes);
app.use("/contact", contactRoute);
app.use("/about", aboutRoute);
app.use("/feedback", feedbackRoute);

// HOME
app.get("/", async (req, res) => {
  const posts = await Post.find({ mediaType: "image" });

  const images = {};

  posts.forEach((post) => {
    const key = post.title.replace(/\s+/g, "").toLowerCase();

    images[key] = cloudinary.url(post.publicId, {
      secure: true,
      quality: "auto",
      fetch_format: "auto",
    });
  });
  const cards = await Destination.find().limit(6);

  res.render("pages/home", { images, cards });
});

app.get("/api/weather", async (req, res) => {
  try {
    let city = req.query.city;
    city = city.split(",")[0].trim();
    console.log("Weather request for:", city);
    const response = await fetch(
      `${process.env.API_URL}?q=${city}&appid=${process.env.API_KEY}&units=metric`
    );

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Weather fetch failed" });
  }
});
app.use((req, res) => {
  res.status(404).render("pages/404", {
    title: "Page Not Found",
  });
});

app.listen(process.env.PORT, () => {
  console.log("Server running on port " + process.env.PORT);
});
