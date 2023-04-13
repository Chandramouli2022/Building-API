const verifyToken = require("../middlewares/verifyToken");
const Comment = require("../models/Comment");
const commentController = require("express").Router();
const Post = require("../models/Post");

// create a comment
commentController.post("/:postid", verifyToken, async (req, res) => {
  try {
    const createdComment = await Comment.create({
      ...req.body,
      postId: req.params.postid,
      userId: req.user.id,
    });

    //adding comment to the post in its comment
    const post = await Post.findById(req.params.postid);
    post.comment.push(req.body.comment);
    await post.save();


    return res.status(201).json({ CommentID: createdComment._id });
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

module.exports = commentController;
