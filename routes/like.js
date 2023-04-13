const verifyToken = require("../middlewares/verifyToken");
const Post = require("../models/Post");
const postController = require("express").Router();

postController.post("/:id", verifyToken, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const post = await Post.findById(req.params.id);

    // if the user has already liked the post, remove it.
    // Otherwise, add him into the likes array
    if (post.likes.includes(currentUserId)) {
      return res.status(200).json({ msg: "You already liked the post" });
    } else {
      post.likes.push(currentUserId);
      await post.save();
      return res.status(200).json({ msg: "Successfully liked the post" });
    }
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

module.exports = postController;
