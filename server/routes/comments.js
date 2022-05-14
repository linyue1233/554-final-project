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
const redis = require('../util/redisUtil')

// get comment by commentId
router.get('/:commentId', async (req, res) => {
    // get comment by commentId
    if(req.session.user){
        try{
            let ans = await redis.getKey(req.session.user);
            if(ans !== null){
                // update redis session
                let userKey = req.session.user;
                redis.setExpire(userKey,userKey,60*30);
            }
        }catch(error){
            return res.status(403).json({ status:"403",message:"Please login firstly."})
        }
    }
    try {
        const comment = await commentData.getCommentByCommentId(xss(req.params.commentId));
        res.status(200).json(comment);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});
// get all comments by userId
router.get('/user/:userId', async (req, res) => {
    // get all comments by userId
    if(req.session.user){
        try{
            let ans = await redis.getKey(req.session.user);
            if(ans !== null){
                // update redis session
                let userKey = req.session.user;
                redis.setExpire(userKey,userKey,60*30);
            }
        }catch(error){
            return res.status(403).json({ status:"403",message:"Please login firstly."})
        }
    }
    try {
        const comments = await commentData.getAllCommentsByUserId(xss(req.params.userId));
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});
// get all comments by videoId
router.get('/video/:videoId', async (req, res) => {
    // get all comments by videoId
    if(req.session.user){
        try{
            let ans = await redis.getKey(req.session.user);
            if(ans !== null){
                // update redis session
                let userKey = req.session.user;
                redis.setExpire(userKey,userKey,60*30);
            }
        }catch(error){
            return res.status(403).json({ status:"403",message:"Please login firstly."})
        }
    }
    try {
        const comments = await commentData.getAllCommentsByVideoId(xss(req.params.videoId));
        if(comments.length === 0){
            res.status(200).json({status:200, data:comments});
            return;
        }
        for(let comment of comments) {
            let tempUser = await userData.getUserById(comment.userId);
            comment.avatar = tempUser.avatar;
        }
        return res.status(200).json({status:200, data:comments});
    } catch (error) {
        return res.status(500).json({status:500, message:error});
    }
});
// delete one comment by commentId
router.delete('/:commentId', async (req, res) => {
    if(req.session.user){
        try{
            let ans = await redis.getKey(req.session.user);
            if(ans === null){
                // delete session
                req.session.destroy();
                return res.status(401).json({ status:"401",message:"Your status is expired."})
            }else{
                let userKey = req.session.user;
                redis.setExpire(userKey,userKey,60*30);
            }
        }catch(error){
            return res.status(403).json({ status:"403",message:"Please login firstly."})
        }
    }
    if(!req.session.user){
        return res.status(403).json({ status:"403",message:"Please login firstly."})
    }
    // delete one comment by commentId
    try{
        const user = await userData.getUserByEmail(req.session.user);
        if(!user.isAdmin) {
            const comment = await commentData.getCommentByCommentId(xss(req.params.commentId));
            if(!comment.userId === user.userId){
                return res.status(500).json({ status:"500", message: "Unauthorized request"});
            }
        }
    }catch(e) {
        return res.status(500).json({ status:"500", message: e});
    }

    try {
        const user = await userData.getUserByEmail(req.session.user);
        const comment = await commentData.deleteOneCommentByCommentId(xss(req.params.commentId), user);
        res.status(200).json(comment);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});
//create one comment
// createComment(content, userId, userName, videoId)
router.post('/', async (req, res) => {
    // create one comment
    if(req.session.user){
        try{
            let ans = await redis.getKey(req.session.user);
            if(ans === null){
                // delete session
                req.session.destroy();
                return res.status(401).json({ status:"401",message:"Your status is expired."})
            }else{
                let userKey = req.session.user;
                redis.setExpire(userKey,userKey,60*30);
            }
        }catch(error){
            return res.status(403).json({ status:"403",message:"Please login firstly."})
        }
    }
    if(!req.session.user){
        return res.status(403).json({ status:"403",message:"Please login firstly."})
    }
    try {

        const userInfo =await userData.getUserByEmail(req.session.user);
        // console.log(req.body.content);
        // console.log(userInfo)
        const comment = await commentData.createComment(xss(req.body.content), userInfo._id, userInfo.username,xss(req.body.videoId));
        comment.avatar = userInfo.avatar;
        res.status(200).json({status:200,data:comment});
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

