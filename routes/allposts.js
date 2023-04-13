const Post = require("../models/Post");
const postController = require("express").Router();

// get all
postController.get("/", async (req, res) => {
  try {
    const posts = await Post.find({});

    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json(error.message);
  }
  //   res.status(200).json("Every thing allright");
});

module.exports = postController;
