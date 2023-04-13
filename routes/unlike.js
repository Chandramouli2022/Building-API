const verifyToken = require('../middlewares/verifyToken')
const Post = require('../models/Post')
const postController = require('express').Router()

postController.post("/:id", verifyToken, async(req, res) => {
    try {
        const currentUserId = req.user.id
        const post = await Post.findById(req.params.id)

        // if the user has already liked the post, remove it.
        // Otherwise, add him into the likes array
        if(post.likes.includes(currentUserId)){
           post.likes = post.likes.filter((id) => id !== currentUserId)
           await post.save()
           return res.status(200).json({msg: "Successfully unliked the post"})
        } else {
           return res.status(200).json({msg: "Successfully already unliked the post"})
        }
    } catch (error) {
        return res.status(500).json(error.message) 
    }
})

module.exports = postController