const User = require("../models/User");
const userController = require("express").Router();
const verifyToken = require("../middlewares/verifyToken");

// get one
userController.get("/",verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(500).json({ msg: "No such user, wrong id!" });
    }

    const { password, ...others } = user._doc;

    return res.status(200).json({ 
      UserName:user.username,
      Followers: user.followers.length,
      Followings:user.followings.length
     });
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

module.exports = userController;
