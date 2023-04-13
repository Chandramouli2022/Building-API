const express = require("express");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const app = express();

// connect db
mongoose.connect(process.env.MONGO_URL, () =>
  console.log("Db connected successfully")
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const registerRouter = require("./routes/register");
const authRoute = require("./routes/authenticate");
const followRoute = require("./routes/follow");
const unfollowRoute = require("./routes/unfollow");

const userRoute = require("./routes/user");

const postRoute = require("./routes/posts");
const likeRoute = require("./routes/like");
const unlikeRoute = require("./routes/unlike");

const commentRoute = require("./routes/comment");

const allpostsRoute=require("./routes/allposts");

app.use("/api/register", registerRouter);
app.use("/api/authenticate", authRoute);

// //separate route for follow and unfollow
app.use("/api/follow", followRoute);
app.use("/api/unfollow", unfollowRoute);

// //user details
app.use("/api/user", userRoute);

// //operations on posts
app.use("/api/posts", postRoute);
app.use("/api/like", likeRoute);
app.use("/api/unlike", unlikeRoute);

app.use("/api/comment", commentRoute);

//all posts
app.use("/api/all_posts", allpostsRoute);

app.listen(process.env.PORT, () =>
  console.log("Server connected successfully")
);
