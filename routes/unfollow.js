const User = require("../models/User");
const bcrypt = require("bcrypt");
const userController = require("express").Router();
const verifyToken = require("../middlewares/verifyToken");

// unfollow
userController.post("/:otherUserId", verifyToken, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const otherUserId = req.params.otherUserId;

    if (currentUserId === otherUserId) {
      return res
        .status(500)
        .json({ msg: "You can't unfollow yourself!" });
    }

    const currentUser = await User.findById(currentUserId);
    const otherUser = await User.findById(otherUserId);

    // if we don't follow user, we want to follow him, otherwise we unfollow him
    if (!currentUser.followings.includes(otherUserId)) {
      return res.status(200).json({ msg: "You don't follow the user!" });
    } else {
      currentUser.followings = currentUser.followings.filter(
        (id) => id !== otherUserId
      );
      otherUser.followers = otherUser.followers.filter(
        (id) => id !== currentUserId
      );
      await currentUser.save();
      await otherUser.save();
      return res
        .status(200)
        .json({ msg: "You have successfully unfollowed the user!" });
    }
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

module.exports = userController;
