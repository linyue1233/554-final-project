const express = require('express');
const router = express.Router();
const data = require('../data');
const uuid = require("uuid");
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const videoData = data.videos;
const userData = data.users;
const verify = require('../data/verify');
const xss = require('xss');
const multer = require('multer');
const upload = multer({ dest: 'uploads' + path.sep });
const { uploadFile } = require('../config/awsS3');
const redis = require('../util/redisUtil');

router.post('/addViewCount', async (req, res) => {
    // check user and update time
    if (req.session.user) {
        try {
            let ans = await redis.getKey(req.session.user);
            if (ans !== null) {
                // update redis session
                let userKey = req.session.user;
                redis.setExpire(userKey, userKey, 60 * 30);
            }
        } catch (error) {
            return res.status(403).json({ status: 403, message: error });
        }
    }
    let videoId = xss(req.body.videoId);
    videoId = videoId.trim();
    try {
        let videoInfo = await videoData.increaseViewCount(videoId);
        return res.status(200).json({ status: 200, data: videoInfo });
    } catch (error) {
        return res.status(400).json({ status: 500, message: error });
    }
});


// user add like for the video
router.post('/addLikeForVideo', async (req, res) => {
    // check user
    if (req.session.user) {
        try {
            let ans = await redis.getKey(req.session.user);
            if (ans === null) {
                // delete session
                req.session.destroy();
                return res
                    .status(401)
                    .json({ status: 401, message: 'Your status is expired.' });
            } else {
                let userKey = req.session.user;
                redis.setExpire(userKey, userKey, 60 * 30);
            }
        } catch (error) {
            return res
                .status(403)
                .json({ status: 403, message: 'Please login firstly.' });
        }
    }
    if (!req.session.user) {
        return res.status(403).json({ status: '403', message: 'Please login firstly.' });
    }
    let userEmail = req.session.user;
    let videoId = xss(req.body.videoId);
    try {
        let userInfo = await userData.getUserByEmail(userEmail);
        let updateUser = await userData.addLikeId(userInfo._id, videoId);
        let videoInfo = await videoData.increaseLikeCount(videoId);
        return res
            .status(200)
            .json({ status: 200, data: { user: updateUser, video: videoInfo } });
    } catch (error) {
        return res.status(400).json({ status: 400, message: error });
    }
});

// user remove like for the video
router.post('/removeLikeForVideo', async (req, res) => {
    // check user
    if (req.session.user) {
        try {
            let ans = await redis.getKey(req.session.user);
            if (ans === null) {
                // delete session
                req.session.destroy();
                return res
                    .status(401)
                    .json({ status: 401, message: 'Your status is expired.' });
            } else {
                let userKey = req.session.user;
                redis.setExpire(userKey, userKey, 60 * 30);
            }
        } catch (error) {
            return res
                .status(403)
                .json({ status: 403, message: 'Please login firstly.' });
        }
    }
    if (!req.session.user) {
        return res.status(403).json({ status: '403', message: 'Please login firstly.' });
    }
    let userEmail = req.session.user;
    let videoId = xss(req.body.videoId);
    try {
        let userInfo = await userData.getUserByEmail(userEmail);
        let updateUser = await userData.removeLikeId(userInfo._id, videoId);
        let videoInfo = await videoData.decreaseLikeCount(videoId);
        return res
            .status(200)
            .json({ status: 200, data: { user: updateUser, video: videoInfo } });
    } catch (error) {
        return res.status(400).json({ status: 400, message: error });
    }
});


router.get('/', async (req, res) => {
    if (req.session.user) {
        try {
            let ans = await redis.getKey(req.session.user);
            if (ans !== null) {
                // update redis session
                let userKey = req.session.user;
                redis.setExpire(userKey, userKey, 60 * 30);
            }
        } catch (error) {
            return res
                .status(403)
                .json({ status: '403', message: 'Please login firstly.' });
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
    if (req.session.user) {
        try {
            let ans = await redis.getKey(req.session.user);
            if (ans !== null) {
                // update redis session
                let userKey = req.session.user;
                redis.setExpire(userKey, userKey, 60 * 30);
            }
        } catch (error) {
            return res
                .status(403)
                .json({ status: '403', message: 'Please login firstly.' });
        }
    }
    try {
        const recommendList = await videoData.get3VideosSortByLikeCount();
        res.status(200).json(recommendList);
    } catch (e) {
        res.status(500).json({ message: e });
    }
});
// get 4 videos by tag and year, ordering by likeCount
router.get('/get4VideosByTagAndYear/:tag/:year', async (req, res) => {
    if (req.session.user) {
        try {
            let ans = await redis.getKey(req.session.user);
            if (ans !== null) {
                // update redis session
                let userKey = req.session.user;
                redis.setExpire(userKey, userKey, 60 * 30);
            }
        } catch (error) {
            return res
                .status(403)
                .json({ status: '403', message: 'Please login firstly.' });
        }
    }
    const tag = xss(req.params.tag);
    const year = xss(req.params.year);
    try {
        verify.isString(tag);
        verify.isString(year);
        verify.checkTag(tag);
        verify.checkSpace(tag);
        verify.checkSpace(year);
        const videoList = await videoData.get4VideosByTagAndYear(tag, year);
        res.status(200).json(videoList);
    } catch (e) {
        res.status(500).json({ message: e });
    }
});
// get 4 videos by tag, ordering by likeCount
router.get('/get4VideosByTag/:tag', async (req, res) => {
    if (req.session.user) {
        try {
            let ans = await redis.getKey(req.session.user);
            if (ans !== null) {
                // update redis session
                let userKey = req.session.user;
                redis.setExpire(userKey, userKey, 60 * 30);
            }
        } catch (error) {
            return res
                .status(403)
                .json({ status: '403', message: 'Please login firstly.' });
        }
    }
    const tag = xss(req.params.tag);
    try {
        verify.isString(tag);
        verify.checkTag(tag);
        verify.checkSpace(tag);
        const videoList = await videoData.get4VideosByTag(tag);
        res.status(200).json(videoList);
    } catch (e) {
        res.status(500).json({ message: e });
    }
});

router.get('/:id', async (req, res) => {
    if (req.session.user) {
        try {
            let ans = await redis.getKey(req.session.user);
            if (ans !== null) {
                // update redis session
                let userKey = req.session.user;
                redis.setExpire(userKey, userKey, 60 * 30);
            }
        } catch (error) {
            return res
                .status(403)
                .json({ status: '403', message: 'Please login firstly.' });
        }
    }
    try {
        verify.isString(req.params.id, 'Video Id');
        verify.checkSpace(req.params.id, 'Video Id');
        let video = await videoData.getVideoById(xss(req.params.id));
        res.status(200).json(video);
    } catch (e) {
        res.status(500).json({ message: e });
    }
});

async function changeCover(filePath) {
    let newFilePath = path.join("uploads",uuid.v4());
    await sharp(filePath).resize(600, 450).toFile(newFilePath);
    return newFilePath;
}

router.post('/videoCover', upload.single('cover'), async (req, res) => {
    if (req.session.user) {
        try {
            let ans = await redis.getKey(req.session.user);
            if (ans === null) {
                // delete session
                req.session.destroy();
                return res
                    .status(401)
                    .json({ status: '401', message: 'Your status is expired.' });
            } else {
                let userKey = req.session.user;
                redis.setExpire(userKey, userKey, 60 * 30);
            }
        } catch (error) {
            return res
                .status(403)
                .json({ status: '403', message: 'Please login firstly.' });
        }
    }
    // try {
    //     const user = await userData.getUserByEmail(req.session.user)
    //     if (!user.isAdmin) {
    //         return res.status(500).json({ status:"500", message: "Unauthorized request"});
    //     }
    // } catch (e) {
    //     return res.status(500).json({ status:"500", message: e});
    // }

    if (req.file === null || req.file === undefined) {
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
    let oldPath = file.path;
    file.filename = `${Date.now()}-${req.file.originalname}`;
    // resize avatarImage
    file.path = await changeCover(file.path);
    try {
        const result = await uploadFile(file);
        // delete local record
        fs.unlinkSync(oldPath);
        fs.unlinkSync(file.path);
        res.send({
            imagePath: 'https://benchmoon-554.s3.amazonaws.com/' + `${result.key}`,
        });
        return;
    } catch (error) {
        res.status(500).json({ message: error });
        return;
    }
});

router.post('/uploadVideo', upload.single('video'), async (req, res) => {
    if (req.session.user) {
        try {
            let ans = await redis.getKey(req.session.user);
            if (ans === null) {
                // delete session
                req.session.destroy();
                return res
                    .status(401)
                    .json({ status: '401', message: 'Your status is expired.' });
            } else {
                let userKey = req.session.user;
                redis.setExpire(userKey, userKey, 60 * 30);
            }
        } catch (error) {
            return res
                .status(403)
                .json({ status: '403', message: 'Please login firstly.' });
        }
    }
    if (!req.session.user) {
        return res.status(403).json({ status: '403', message: 'Please login firstly.' });
    }

    try {
        const user = await userData.getUserByEmail(req.session.user)
        if (!user.isAdmin) {
            return res.status(500).json({ status:"500", message: "Unauthorized request"});
        }
    } catch (e) {
        return res.status(500).json({ status:"500", message: e});
    }

    if (req.file === null || req.file === undefined) {
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
    try {
        const result = await uploadFile(file);
        fs.unlinkSync(file.path);
        res.send({
            videoPath: 'https://benchmoon-554.s3.amazonaws.com/' + `${result.Key}`,
        });
    } catch (error) {
        res.status(500).json(error);
        return;
    }
});

router.post('/create', async (req, res) => {
    if (req.session.user) {
        try {
            let ans = await redis.getKey(req.session.user);
            if (ans === null) {
                // delete session
                req.session.destroy();
                return res
                    .status(401)
                    .json({ status: '401', message: 'Your status is expired.' });
            } else {
                let userKey = req.session.user;
                redis.setExpire(userKey, userKey, 60 * 30);
            }
        } catch (error) {
            return res
                .status(403)
                .json({ status: '403', message: 'Please login firstly.' });
        }
    }
    if (!req.session.user) {
        return res.status(403).json({ status: '403', message: 'Please login firstly.' });
    }

    try {
        const user = await userData.getUserByEmail(req.session.user)
        if (!user.isAdmin) {
            return res.status(500).json({ status:"500", message: "Unauthorized request"});
        }
    } catch (e) {
        return res.status(500).json({ status:"500", message: e});
    }

    let videoInfo = req.body;

    //upload video and cover to cloud and get cloud path

    try {
        verify.isString(videoInfo.name, 'Video Name');
        verify.isString(videoInfo.path, 'Video Path');
        verify.checkTags(videoInfo.tags);
        verify.isString(videoInfo.cover, 'Video Cover');
        verify.isString(videoInfo.description, 'Video Description');
        let video = await videoData.createVideo(
            xss(videoInfo.name),
            xss(videoInfo.path),
            xss(videoInfo.tags),
            xss(videoInfo.description),
            xss(videoInfo.cover)
        );
        res.status(200).json(video);
    } catch (e) {
        res.status(500).json({ message: e });
    }
});

router.patch('/update/:videoId', async (req, res) => {
    if (req.session.user) {
        try {
            let ans = await redis.getKey(req.session.user);
            if (ans === null) {
                // delete session
                req.session.destroy();
                return res
                    .status(401)
                    .json({ status: '401', message: 'Your status is expired.' });
            } else {
                let userKey = req.session.user;
                redis.setExpire(userKey, userKey, 60 * 30);
            }
        } catch (error) {
            return res
                .status(403)
                .json({ status: '403', message: 'Please login firstly.' });
        }
    }
    if (!req.session.user) {
        return res.status(403).json({ status: '403', message: 'Please login firstly.' });
    }

    try {
        const user = await userData.getUserByEmail(req.session.user)
        if (!user.isAdmin) {
            return res.status(500).json({ status:"500", message: "Unauthorized request"});
        }
    } catch (e) {
        return res.status(500).json({ status:"500", message: e});
    }

    let updatedInfo = req.body;

    try {
        verify.isString(req.params.videoId, 'Video Id');
        verify.checkSpace(req.params.videoId, 'Video Id');
        let video = await videoData.getVideoById(xss(req.params.videoId));
        verify.isString(updatedInfo.name, 'Video Name');
        verify.isString(updatedInfo.description, 'Video Description');
        if(updatedInfo.cover) verify.checkAvatarSuffix(updatedInfo.cover);
        if(updatedInfo.path) verify.checkVideoSuffix(updatedInfo.path);
        verify.checkTags(updatedInfo.tags);
    } catch (e) {
        res.status(500).json({ status:"500", message: e });
    }

    try {
        if(updatedInfo.path){
            let pathResult = await videoData.updateVideoPath (xss(req.params.videoId), xss(updatedInfo.path));
            console.log(pathResult);
        } 
        
        if(updatedInfo.cover) {
            let coverResult = await videoData.updateVideoCover (xss(req.params.videoId), xss(updatedInfo.cover));
            console.log(coverResult);
        }
        
        let video = await videoData.updateVideo(
            xss(req.params.videoId),
            xss(updatedInfo.name),
            xss(updatedInfo.description),
            xss(updatedInfo.tags)
        );
        res.status(200).json(video);
    } catch (e) {
        res.status(500).json({ message: e });
    }
});

router.delete('/delete/:videoId', async (req, res) => {
    if (req.session.user) {
        try {
            let ans = await redis.getKey(req.session.user);
            if (ans === null) {
                // delete session
                req.session.destroy();
                return res
                    .status(401)
                    .json({ status: '401', message: 'Your status is expired.' });
            } else {
                let userKey = req.session.user;
                redis.setExpire(userKey, userKey, 60 * 30);
            }
        } catch (error) {
            return res
                .status(403)
                .json({ status: '403', message: 'Please login firstly.' });
        }
    }
    if (!req.session.user) {
        return res.status(403).json({ status: '403', message: 'Please login firstly.' });
    }

    try {
        const user = await userData.getUserByEmail(req.session.user)
        if (!user.isAdmin) {
            return res.status(500).json({ status:"500", message: "Unauthorized request"});
        }
    } catch (e) {
        return res.status(500).json({ status:"500", message: e});
    }

    try {
        verify.isString(req.params.videoId, 'Video Id');
        verify.checkSpace(req.params.videoId, 'Video Id');
        const user = await userData.getUserByEmail(xss(req.session.user));
        const deleteResult = await videoData.removeVideo(xss(req.params.videoId), user);
        res.status(200).json(deleteResult);
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

router.post('/:searchTerm', async (req, res) => {
    let searchBody = req.body;

    try {
        let searchTerm = xss(searchBody.searchTerm);
        verify.isString(searchTerm.trim(), 'searchTerm');
        const searchResult = await videoData.searchVideosByName(searchTerm);
        res.status(200).json(searchResult);
    } catch (e) {
        res.status(500).json({ message: e });
    }
});

router.get('/getAllVideosByTag/:tag/:type', async (req, res) => {
    if (req.session.user) {
        try {
            let ans = await redis.getKey(req.session.user);
            if (ans !== null) {
                // update redis session
                let userKey = req.session.user;
                redis.setExpire(userKey, userKey, 60 * 30);
            }
        } catch (error) {
            return res
                .status(403)
                .json({ status: '403', message: 'Please login firstly.' });
        }
    }
    try {
        verify.isString(req.params.tag, 'Tag');
        // verify.isString(req.params.type, 'Type');
        verify.checkTag(req.params.tag);
        verify.checkSpace(req.params.tag);
        const videos = await videoData.getAllVideosByOneTagAndByOneFunc(
            xss(req.params.tag),
            xss(req.params.type)
        );
        res.status(200).json(videos);
    } catch (e) {
        res.status(500).json({ message: e });
    }
});




module.exports = router;
