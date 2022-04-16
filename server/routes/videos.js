const express = require('express');
const router = express.Router();
const data = require('../data');
const videoData = data.videos;
const verify = require('../data/verify');
const xss = require('xss');

router.get('/', async (req, res) => {
    try {
        let videoList = await videoData.getAllVideos();
        res.status(200).json(videoList);
    } catch (e) {
        res.status(500).json({ message: e });
    }
});

router.get('/get3VideosSortByLikeCount', async (req, res) => {
    try {
        const recommendList = await videoData.get3VideosSortByLikeCount();
        res.status(200).json(recommendList);
    } catch (e) {
        res.status(500).json({ message: e });
    }
});
// get 5 videos by tag and year, ordering by time
router.get('/get5VideosByTagAndYear/:tag/:year', async (req, res) => {
    const tag = req.params.tag;
    const year = req.params.year;
    try {
        verify.isString(tag);
        verify.isString(year);
        verify.checkSpace(tag);
        verify.checkSpace(year);
        const videoList = await videoData.get5VideosByTagAndYear(tag, year);
        res.status(200).json(videoList);
    } catch (e) {
        res.status(500).json({ message: e });
    }
});

router.get('/:id', async (req, res) => {
    try {
        verify.isString(req.params.id, 'Video Id');
        verify.checkSpace(req.params.id, 'Video Id');
        let video = await videoData.getVideoById(req.params.id);
        res.status(200).json(video);
    } catch (e) {
        res.status(500).json({ message: e });
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
        let video = await videoData.updateVideo(
            req.params.id,
            updatedInfo.name,
            updatedInfo.description
        );
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
    let searchBody = req.body;

    if ((searchBody.method = 'name')) {
        try {
            let searchTerm = searchBody.searchTerm;
            verify.isString(searchTerm.trim(), 'searchTerm');
            const searchResult = await videoData.searchVideosByName(searchTerm);
            res.status(200).json(searchResult);
        } catch (e) {
            res.status(500).json({ message: e });
        }
    } else if ((searchBody.method = 'tag')) {
        try {
            let tags = searchBody.tags;
            verify.checkTags(tags);
            const searchResult = await videoData.getVideosByTags(tags);
            res.status(200).json(searchResult);
        } catch (e) {
            res.status(500).json({ message: e });
        }
    } else if ((searchBody.method = 'year')) {
        try {
            let year = searchBody.year;
            verify.isString(year.trim(), 'Year');
            const searchResult = await videoData.getVideosByYear(year);
            res.status(200).json(searchResult);
        } catch (e) {
            res.status(500).json({ message: e });
        }
    }
});

module.exports = router;
