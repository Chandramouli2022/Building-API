const verifyToken = require('../middlewares/verifyToken')
const Comment = require('../models/Comment')
const commentController = require('express').Router()

// get all comments from post
commentController.get("/:postId", async(req, res) => {
    try {
       const comments = await Comment.find({postId: req.params.postId}) 

       return res.status(200).json(comments)
    } catch (error) {
        return res.status(500).json(error.message)
    }
})

// get a comment
commentController.get('/find/:commentId', async(req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId)
        
        return res.status(200).json(comment)
    } catch (error) {
        return res.status(500).json(error.message)
    }
})
// create a comment
commentController.post('/', verifyToken, async(req, res) => {
    try {
        const createdComment = await Comment.create({...req.body, userId: req.user.id})

        return res.status(201).json(createdComment)
    } catch (error) {
        return res.status(500).json(error.message)
    }
})
// update a comment
commentController.put('/:commentId', verifyToken, async(req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId)
        if(!comment){
            return res.status(500).json({msg: "No such comment"})
        }
        if(comment.userId === req.user.id){
            comment.commentText = req.body.commentText
            await comment.save()
            return res.status(200).json({comment, msg: "Comment has been successfully updated"})
        } else {
            return res.status(403).json({msg: "You can update only your own comments"})
        }
    } catch (error) {
        return res.status(500).json(error.message) 
    }
})
// delete a comment
commentController.delete('/:commentId', verifyToken, async(req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId)

        if(comment.userId === req.user.id){
          await Comment.findByIdAndDelete(req.params.commentId)
          return res.status(200).json({msg: "Comment has been succesfully deleted"})
        } else {
            return res.status(403).json({msg: "You can delete only your own comments"})
        }
    } catch (error) {
        return res.status(500).json(error.message) 
    }
})
// like/unlike comment
commentController.put("/likeDislike/:commentId", verifyToken, async(req, res) => {
    try {
        const currentUserId = req.user.id
        const comment = await Comment.findById(req.params.commentId)

        if(!comment.likes.includes(currentUserId)){
            comment.likes.push(currentUserId)
            await comment.save()
            return res.status(200).json({msg: "Comment has been successfully liked!"})
        } else {
            comment.likes = comment.likes.filter((id) => id !== currentUserId)
            await comment.save()
            return res.status(200).json({msg: "Comment has been successfully unliked"})
        }
    } catch (error) {
        return res.status(500).json(error.message) 
    }
})

module.exports = commentController