const User = require('../models/User')
const bcrypt = require("bcrypt")
const userController = require('express').Router()
const verifyToken = require('../middlewares/verifyToken')

// get one
userController.get('/find/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)

        if (!user) {
            return res.status(500).json({ msg: 'No such user, wrong id!' })
        }

        const { password, ...others } = user._doc

        return res.status(200).json({ user: others })
    } catch (error) {
        return res.status(500).json(error.message)
    }
})

// get all
userController.get('/findAll', async (req, res) => {
    try {
        const users = await User.find()

        const formattedUsers = users.map((user) => {
            return { username: user.username, email: user.email, _id: user._id, createdAt: user.createdAt }
        })

        return res.status(200).json({ user: formattedUsers })
    } catch (error) {
        return res.status(500).json(error.message)
    }
})
// update
userController.put("/updateUser/:userId", verifyToken, async (req, res) => {
    if (req.params.userId === req.user.id) {
        try {
          if(req.body.password){
            req.body.password = await bcrypt.hash(req.body.password, 10)
          }
          const updatedUser = await User.findByIdAndUpdate(req.params.userId, {$set: req.body}, {new: true})
          return res.status(200).json(updatedUser)
        } catch (error) {
            return res.status(500).json(error.message)
        }
    } else {
        return res.status(403).json({ msg: "You can only change your own profile" })
    }
})
// delete
userController.delete("/deleteUser/:userId", verifyToken, async(req, res) => {
    if(req.params.userId === req.user.id){
        try {
            await User.findByIdAndDelete(req.params.userId)
            return res.status(200).json({msg: "User has been successfully deleted"})
        } catch (error) {
            return res.status(500).json(error.message)
        }
    } else {
        return res.status(403).json({msg: "You can delete only your own profile"})
    }
})

// follow/unfollow
userController.put('/toggleFollow/:otherUserId', verifyToken, async(req, res) => {
    try{
       const currentUserId = req.user.id
       const otherUserId = req.params.otherUserId

       if(currentUserId === otherUserId){
        return res.status(500).json({msg: "You can't follow yourself!!!!!!!!"})
       }

       const currentUser = await User.findById(currentUserId)
       const otherUser = await User.findById(otherUserId)

       // if we don't follow user, we want to follow him, otherwise we unfollow him
       if(!currentUser.followings.includes(otherUserId)){
        currentUser.followings.push(otherUserId)
        otherUser.followers.push(currentUserId)
        await currentUser.save()
        await otherUser.save()
        return res.status(200).json({msg: "You have successfully followed the user!"})
       } else {
        currentUser.followings = currentUser.followings.filter((id) => id !== otherUserId)
        otherUser.followers = otherUser.followers.filter((id) => id !== currentUserId)
        await currentUser.save()
        await otherUser.save()
        return res.status(200).json({msg: "You have successfully unfollowed the user!"})
       }
    } catch(error){
        return res.status(500).json(error.message)
    }
})

module.exports = userController