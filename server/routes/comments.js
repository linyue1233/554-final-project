const express = require('express');
const fs = require('fs');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink);
const router = express.Router();
const data = require('../data');
const commentData = data.comments;
const userData = data.users;
const verify = require('../data/verify');
const xss = require('xss');

// get comment by commentId
router.get('/:commentId', async (req, res) => {
    // get comment by commentId
    try {
        const comment = await commentData.getCommentByCommentId(req.params.commentId);
        res.status(200).json(comment);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});
// get all comments by userId
router.get('/user/:userId', async (req, res) => {
    // get all comments by userId
    try {
        const comments = await commentData.getAllCommentsByUserId(req.params.userId);
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});
// get all comments by videoId
router.get('/video/:videoId', async (req, res) => {
    // get all comments by videoId
    try {
        const comments = await commentData.getAllCommentsByVideoId(req.params.videoId);
        for(let comment of comments) {
            let tempUser = await userData.getUserById(comment.userId);
            comment.avatar = tempUser.avatar;
        }
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});
// delete one comment by commentId
router.delete('/:commentId', async (req, res) => {
    // delete one comment by commentId
    try {
        const comment = await commentData.deleteOneCommentByCommentId(req.params.commentId);
        res.status(200).json(comment);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});
// // delete all comments by userId
// router.delete('/user/:userId', async (req, res) => {
//     // delete all comments by userId
//     try {
//         const comments = await commentData.deleteAllCommentsByUserId(req.params.userId);
//         res.status(200).json(comments);
//     } catch (error) {
//         res.status(500).json({ error: error });
//     }
// });
// // delete all comments by videoId
// router.delete('/video[Peace]ideoId', async (req, res) => {
//     // delete all comments by videoId
//     try {
//         const comments = await commentData.deleteAllCommentsByVideoId(req.params.videoId);
//         res.status(200).json(comments);
//     } catch (error) {
//         res.status(500).json({ error: error });
//     }
// });
// update one comment by commentId

module.exports = router;

