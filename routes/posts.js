const verifyToken = require("../middlewares/verifyToken");
const Post = require("../models/Post");
const postController = require("express").Router();
const Comment = require("../models/Comment");

//get the post

postController.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(500).json({ msg: "No such post with this id!" });
    } else {
      const comments = await Comment.find({ postId: req.params.id });
      const commentExtract= comments.map((c)=>c.comment);
      return res.status(200).json({
        Title: post.title,
        Description: post.description,
        Likes: post.likes.length,
        Comments: commentExtract,
      });
    }
  } catch (error) {
    return res.status(500).json(error.message);
  }
});
// create
postController.post("/", verifyToken, async (req, res) => {
  try {
    const newPost = await Post.create({ ...req.body, userId: req.user.id });

    return res.status(201).json({
      PostID: newPost._id,
      Title: newPost.title,
      Description: newPost.description,
      CreatedTime: newPost.createdAt,
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

// delete
postController.delete("/:id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(500).json({ msg: "No such post" });
    } else if (post.userId !== req.user.id) {
      return res
        .status(403)
        .json({ msg: "You can delete only your own posts" });
    } else {
      await Post.findByIdAndDelete(req.params.id);
      return res.status(200).json({ msg: "Post is successfully deleted" });
    }
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

module.exports = postController;
