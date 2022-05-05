const mongoCollections = require('../config/mongoCollections');
const comments = mongoCollections.comments;
const users = mongoCollections.users;
const videos = mongoCollections.videos;
const userFunctions = require('./users');
const videoFunctions = require('./videos');
let { ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const saltRounds = 5;
const uuid = require('uuid');
const verifyFunction = require('./verify');

module.exports = {
    async createComment(content, userId, userName, videoId) {
        if (!content || !userId || !userName || !videoId) throw 'some one is missing';
        verifyFunction.isString(content, 'content');
        verifyFunction.isString(userId, 'userId');
        verifyFunction.isString(videoId, 'videoId');
        verifyFunction.checkUsername(userName);
        const commentsCollections = await comments();   
        const userCollection = await users();
        const videoCollection = await videos();
        let date = new Date();
        let newComment = {
            content: content,
            userId: userId,
            userName: userName,
            videoId: videoId,
            isDeleted: false,
            date: {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate(),
            },
            _id: uuid.v4(),
        };
        const userInfo = await userFunctions.getUserById(userId);
        const videoInfo = await videoFunctions.getVideoById(videoId);
        if(!videoInfo) throw 'No video with that id';
        if (!userInfo) throw 'user not found';
        videoInfo.commentId.push(newComment._id);
        userInfo.commentId.push(newComment._id);
        const newUserInfo = {
            _id: userInfo._id,
            username: userInfo.username,
            password: userInfo.password,
            email: userInfo.email,
            avatar: userInfo.avatar,
            commentId: userInfo.commentId,
            likeId: userInfo.likeId,
            isAdmin: userInfo.isAdmin,
        };
        const newVideoInfo = {
            _id: videoInfo._id,
            videoName: videoInfo.videoName,
            videoPath: videoInfo.videoPath,
            description: videoInfo.description,
            isDeleted: videoInfo.isDeleted,
            Tags: videoInfo.Tags,
            cover: videoInfo.cover,
            likeCount: videoInfo.likeCount,
            viewCount: videoInfo.viewCount,
            commentId: videoInfo.commentId,
            uploadDate: videoInfo.uploadDate,
        }
        const updateUserInfo = await userCollection.updateOne({ _id: userId }, { $set: newUserInfo });
        const updateVideoInfo = await videoCollection.updateOne({ _id: videoId }, { $set: newVideoInfo });
        const insertInfo = await commentsCollections.insertOne(newComment);
        if (insertInfo.insertedCount === 0) throw 'Could not add comment';
        const newId = insertInfo.insertedId;
        const thisComment = await this.getCommentByCommentId(newId);
        return thisComment;
    },
    async getCommentByCommentId(commentId) {
        if (!commentId) throw 'please input a comment id';
        verifyFunction.isString(commentId, 'commentId');
        const commentsCollections = await comments();
        const commentInfo = await commentsCollections.findOne({ _id: commentId });
        if (commentInfo == null) throw 'error id';
        return commentInfo;
    },
    async getAllCommentsByUserId(userId) {
        if (!userId) throw 'please input an userId id';
        verifyFunction.isString(userId, 'userId');
        let usersList = await userFunctions.getAllUsers();
        let commentsListById = null;
        for (let userInfo of usersList) {
            if (userInfo._id === userId) {
                commentsListById = userInfo.commentId;
            }
        }
        if (commentsListById == null) return "don't have this user";
        let result = [];
        for (let commentId of commentsListById) {
            let temp = await this.getCommentByCommentId(commentId);
            if (!temp.isDeleted) {
                result.push(temp);
            }
        }
        if (result.length == 0) return "don't have any comments";
        return result;
    },
    async getAllCommentsByVideoId(videoId) {
        if (!videoId) throw 'please input an userId id';
        verifyFunction.isString(videoId, 'userId');
        let videosList = await videoFunctions.getAllVideos();
        let commentsListById = null;
        for (let videoInfo of videosList) {
            if (videoInfo._id === videoId) commentsListById = videoInfo.commentId;
        }
        if (commentsListById == null) return "don't have this video";
        let result = [];
        for (let commentId of commentsListById) {
            let temp = await this.getCommentByCommentId(commentId);
            if (!temp.isDeleted) {
                result.push(temp);
            }
        }
        // if (result.length == 0) return "don't have any comments";
        return result;
    },
    async deleteOneCommentByCommentId(commentId) {
        if (!commentId) throw 'please input a comment id';
        verifyFunction.isString(commentId, 'commentId');
        const deleteComment = {
            isDeleted: true,
        };
        const commentsCollections = await comments();
        const deleteInfo = await commentsCollections.updateOne({ _id: commentId }, { $set: deleteComment });

        if (deleteInfo.modifiedCount === 0) {
            throw 'Could not delete comment successfully!';
        }
        return 'successfully delete this comment';
    }
};