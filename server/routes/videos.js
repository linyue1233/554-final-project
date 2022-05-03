const express = require('express');
const router = express.Router();
const data = require('../data');
const path = require('path');
const fs = require('fs');
const videoData = data.videos;
const userData = data.users;
const verify = require('../data/verify');
const xss = require('xss');
const multer = require('multer');
const upload = multer({ dest: 'uploads' + path.sep});
const {uploadFile} = require('../config/awsS3');
const redis = require('../util/redisUtil')

router.get('/', async (req, res) => {
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
        let videoList = await videoData.getAllVideos();
        res.status(200).json(videoList);
    } catch (e) {
        res.status(500).json({ message: e });
    }
});

router.get('/get3VideosSortByLikeCount', async (req, res) => {
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
        const recommendList = await videoData.get3VideosSortByLikeCount();
        res.status(200).json(recommendList);
    } catch (e) {
        res.status(500).json({ message: e });
    }
});
// get 5 videos by tag and year, ordering by likeCount
router.get('/get5VideosByTagAndYear/:tag/:year', async (req, res) => {
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
    const tag = req.params.tag;
    const year = req.params.year;
    try {
        verify.isString(tag);
        verify.isString(year);
        verify.checkTag(tag);
        verify.checkSpace(tag);
        verify.checkSpace(year);
        const videoList = await videoData.get5VideosByTagAndYear(tag, year);
        res.status(200).json(videoList);
    } catch (e) {
        res.status(500).json({ message: e });
    }
});
// get 5 videos by tag, ordering by likeCount
router.get('/get5VideosByTag/:tag', async (req, res) => {
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
    const tag = req.params.tag;
    try {
        verify.isString(tag);
        verify.checkTag(tag);
        verify.checkSpace(tag);
        const videoList = await videoData.get5VideosByTag(tag);
        res.status(200).json(videoList);
    } catch (e) {
        res.status(500).json({ message: e });
    }
});

router.get('/:id', async (req, res) => {
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
        verify.isString(req.params.id, 'Video Id');
        verify.checkSpace(req.params.id, 'Video Id');
        let video = await videoData.getVideoById(req.params.id);
        res.status(200).json(video);
    } catch (e) {
        res.status(500).json({ message: e });
    }
});

router.post('/videoCover', upload.single('cover'), async (req, res) => {
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
    if( req.file===null || req.file === undefined ){
        res.status(400).json({ message: 'Please choose a file to upload.' });
        return;
    }
    const file = req.file;
    //  check form
    let originalName = file.originalname;
    try {
        verify.checkAvatarSuffix(originalName);
    } catch (e) {
        res.status(400).json({ message: e });
        return;
    }
    // reset filename
    file.filename = `${Date.now()}-${req.file.originalname}`;
    // resize avatarImage
    try {
        const result = await uploadFile(file);
        // delete local record
        fs.unlinkSync(file.path);
        res.send({ imagePath: "https://benchmoon-554.s3.amazonaws.com/" + `${result.key}`  });
        return;
    } catch (error) {
        res.status(500).json({ message: error });
        return;
    }
});

router.post('/uploadVideo', upload.single('video'),async(req,res)=>{
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
    if( req.file===null || req.file === undefined ){
        res.status(400).json({ message: 'Please choose a file to upload.' });
        return;
    }
    let file = req.file;
    let originalName = file.originalname;
    try {
        verify.checkVideoSuffix(originalName);
    } catch (e) {
        res.status(400).json({ message: e });
        return;
    }
    file.filename = `${Date.now()}-${req.file.originalname}`;
    try{
        const result = await uploadFile(file);
        fs.unlinkSync(file.path);
        res.send({ videoPath: "https://benchmoon-554.s3.amazonaws.com/" + `${result.Key}` });
    }catch (error) {
        res.status(500).json( error);
        return;
    }
});

router.post('/create', async (req, res) => {
    let videoInfo = req.body;

    //upload video and cover to cloud and get cloud path

    try {
        verify.isString(videoInfo.name, 'Video Name');
        verify.isString(videoInfo.path, 'Video Path');
        verify.checkTags(videoInfo.tags);
        verify.isString(videoInfo.cover, 'Video Cover');
        verify.isString(videoInfo.description, 'Video Description');
        let video = await videoData.createVideo(
            videoInfo.name,
            videoInfo.path,
            videoInfo.tags,
            videoInfo.description,
            videoInfo.cover
        );
        res.status(200).json(video);
    } catch (e) {
        res.status(500).json({ message: e });
    }
});

router.put('/update/:videoId', async (req, res) => {
    let updatedInfo = req.body;

    try {
        verify.isString(req.params.videoId, 'Video Id');
        verify.checkSpace(req.params.videoId, 'Video Id');
        let video = await videoData.getVideoById(req.params.id);
        verify.isString(updatedInfo.name, 'Video Name');
        if (video.name === updatedInfo.name) throw 'Provided name is the same as before';
        verify.isString(updatedInfo.description, 'Video Description');
    } catch (e) {
        res.status(500).json({ message: e });
    }

    try {
        let video = await videoData.updateVideo(req.params.id, updatedInfo.name, updatedInfo.description);
        res.status(200).json(video);
    } catch (e) {
        res.status(500).json({ message: e });
    }
});

router.delete('/delete/:videoId', async (req, res) => {
    try {
        verify.isString(req.params.videoId, 'Video Id');
        verify.checkSpace(req.params.videoId, 'Video Id');
        const deleteResult = await videoData.removeVideo(userId);
        res.status(200).json(deleteResult);
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

router.post('/search', async (req, res) => {
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
    let searchBody = req.body;

   
        try {
            let searchTerm = searchBody.searchTerm;
            verify.isString(searchTerm.trim(), 'searchTerm');
            const searchResult = await videoData.searchVideosByName(searchTerm);
            res.status(200).json(searchResult);
        } catch (e) {
            res.status(500).json({ message: e });
        }
   
});

router.get('/getAllVideosByTag/:tag/:type', async (req, res) => {
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
        verify.isString(req.params.tag, 'Tag');
        // verify.isString(req.params.type, 'Type'); 
        verify.checkTag(req.params.tag);
        verify.checkSpace(req.params.tag);
        const videos = await videoData.getAllVideosByOneTagAndByOneFunc(req.params.tag, req.params.type);
        res.status(200).json(videos);
    } catch (e) {
        res.status(500).json({ message: e });
    }
});

// user add like for the video
router.post('/addLikeForVideo',async(req,res)=>{
    // check user
    if(req.session.user){
        try{
            let ans = await redis.getKey(req.session.user);
            if(ans === null){
                // delete session
                req.session.destroy();
                return res.status(401).json({ status:401,message:"Your status is expired."})
            }else{
                let userKey = req.session.user;
                redis.setExpire(userKey,userKey,60*30);
            }
        }catch(error){
            return res.status(403).json({ status:403,message:"Please login firstly."})
        }
    }   
    if(!req.session.user){
        return res.status(403).json({ status:"403",message:"Please login firstly."})
    }
    let userEmail = req.session.user;
    let videoId = req.body.videoId;
    try{
        let userInfo = await userData.getUserByEmail(userEmail);
        let updateUser = await userData.addLikeId(userInfo._id,videoId);
        let videoInfo = await videoData.increaseLikeCount(videoId);
        return res.status(200).json({status:200,data:{user:updateUser,video:videoInfo}});
    }catch(error){
        return res.status(400).json({status:400, message:error});
    }
    

})

// user remove like for the video
router.post('/removeLikeForVideo',async(req,res)=>{
    // check user
    if(req.session.user){
        try{
            let ans = await redis.getKey(req.session.user);
            if(ans === null){
                // delete session
                req.session.destroy();
                return res.status(401).json({ status:401,message:"Your status is expired."})
            }else{
                let userKey = req.session.user;
                redis.setExpire(userKey,userKey,60*30);
            }
        }catch(error){
            return res.status(403).json({ status:403,message:"Please login firstly."})
        }
    }   
    if(!req.session.user){
        return res.status(403).json({ status:"403",message:"Please login firstly."})
    }
    let userEmail = req.session.user;
    let videoId = req.body.videoId;
    try{
        let userInfo = await userData.getUserByEmail(userEmail);
        let updateUser = await userData.removeLikeId(userInfo._id,videoId);
        let videoInfo = await videoData.decreaseLikeCount(videoId);
        return res.status(200).json({status:200,data:{user:updateUser,video:videoInfo}});
    }catch(error){
        return res.status(400).json({status:400, message:error});
    }
    

})

router.post('/addViewCount',async(req,res)=>{
    // check user and update time 
    if(req.session.user){
        try{
            let ans = await redis.getKey(req.session.user);
            if(ans !== null){
                // update redis session
                let userKey = req.session.user;
                redis.setExpire(userKey,userKey,60*30);
            }
        }catch(error){
            return res.status(403).json({ status:403,message:error})
        }
    }
    let videoId = req.body.videoId;
    videoId = videoId.trim();
    try{
        let videoInfo = await videoData.increaseViewCount(videoId);
        return res.status(200).json({ status:200,data:videoInfo})
    }catch(error){
        return res.status(400).json({ status:500,message:error})
    }
})

module.exports = router;
