const mongoCollections = require('../config/mongoCollections');
const videos = mongoCollections.videos;
const comments = mongoCollections.comments;
const verify = require('./verify');
const uuid = require('uuid');

async function createVideo(name, path, tags, description, cover) {
    verify.isString(name, 'name');
    verify.isString(description, 'Video Description');
    verify.checkTags(tags);
    verify.checkAvatarSuffix(cover);
    let myDate = new Date();
    const videoCollection = await videos();
    let newVideo = {
        _id: uuid.v4(),
        videoName: name,
        videoPath: path,
        description: description,
        isDeleted: false,
        Tags: tags,
        cover: cover,
        likeCount: 0,
        viewCount: 0,
        commentId: [],
        uploadDate: {
            year: myDate.getFullYear(),
            month: myDate.getMonth() + 1, //(1-12)
            day: myDate.getDate(),
            hour: myDate.getHours(),
            minute: myDate.getMinutes(),
            second: myDate.getSeconds(),
        },
    };

    const insertInfo = await videoCollection.insertOne(newVideo);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Could not creat video';

    const insertedVideo = await getVideoById(insertInfo.insertedId);
    //console.log(insertedVideo);
    return insertedVideo;
}

async function getVideoById(id) {
    id = id.trim();

    verify.checkSpace(id, 'Video Id');
    verify.isString(id, 'Video Id');
    const videoCollection = await videos();

    const resultVideo = await videoCollection.findOne({
        _id: id,
    });
    if (resultVideo == null) throw 'No video with that id';

    return resultVideo;
}

async function getAllVideos() {
    const videoCollection = await videos();

    const allVideos = await videoCollection.find({ isDeleted: false }).toArray();

    //console.log(allVideos);

    return allVideos;
}

async function removeVideo(id, user) {
    if (!user) throw 'please input a user';
    if (!user.isAdmin) throw 'Unauthorized request';
    id = id.trim();
    verify.checkSpace(id, 'Video Id');
    verify.isString(id, 'Video Id');
    const videoCollection = await videos();

    let video = await getVideoById(id);

    const deletionInfo = await videoCollection.updateOne(
        { _id: id },
        { $set: { isDeleted: true } }
    );

    if (deletionInfo.modifiedCount === 0) {
        throw `Could not delete video with id of ${id}`;
    }

    for (let comment of video.commentId) {

        const commentsCollections = await comments();

        const commentInfo = await commentsCollections.findOne({ _id: comment });
        if (commentInfo == null) throw 'error id';
        
        const deleteInfo = await commentsCollections.updateOne({ _id: comment }, { $set: { isDeleted: true } });

        if (deleteInfo.modifiedCount === 0) {
            throw 'Could not delete comment successfully!';
        }
    }

    let resultstr = 'video has been successfully deleted';

    return resultstr;
}

async function updateVideo(id, name, description, tags) {
    id = id.trim();
    verify.checkSpace(id, 'Video Id');
    verify.isString(id, 'Video Id');
    verify.isString(name, 'Video Name');
    verify.isString(description, 'Videio Description');
    verify.checkTags(tags)
    let preVideo = await getVideoById(id);
    if (name == preVideo.name) throw 'Same Video Name Error!';
    const videoCollection = await videos();
    const updateVideo = {
        videoName: name,
        description: description,
        Tags: tags
    };
    const updatedInfo = await videoCollection.updateOne(
        { _id: id },
        { $set: updateVideo }
    );
    if (updatedInfo.modifiedCount === 0) {
        throw 'Could not update video successfully';
    }
    return await getVideoById(id);
}

async function searchVideosByName(searchTerm) {
    searchTerm = searchTerm.trim();

    verify.isString(searchTerm, 'searchTerm');

    const videoCollection = await videos();

    searchTerm = searchTerm.toLowerCase();

    let videoList = await videoCollection
        .find({
            videoName: {
                $regex: '.*' + searchTerm + '.*',
                $options: 'i',
            },
            isDeleted: false
        })
        .toArray();

    return videoList;
}

async function getVideosByTags(tags) {
    console.log(tags);
    // verify.checkTags(tags);
    console.log(1111);
    const videoCollection = await videos();
    console.log(1);
    let videoList = await videoCollection
        .find({
            Tags: { $all: [tags] },
            isDeleted: false
        })
        .toArray();
    console.log(videoList);

    return videoList;
}

async function getVideosByYear(year) {
    year = year.trim();

    verify.isString(year);

    const videoCollection = await videos();

    let videoList = await videoCollection
        .find({
            uploadDate: { year: year },
            isDeleted: false
        })
        .toArray();

    return videoList;
}

async function get3VideosSortByLikeCount() {
    const videoCollection = await videos();
    let videoList = await videoCollection
        .find({ isDeleted: false })
        .sort({ likeCount: -1 })
        .limit(3)
        .toArray();

    return videoList;
}

// likeCount + 1
async function increaseLikeCount(id) {
    id = id.trim();
    verify.checkSpace(id, 'Video Id');
    verify.isString(id, 'Video Id');
    const videoCollection = await videos();

    let preVideo = await getVideoById(id);
    let preLikeCount = preVideo.likeCount;

    const updateVideo = {
        likeCount: preLikeCount + 1,
    };
    const updatedInfo = await videoCollection.updateOne(
        { _id: id },
        { $set: updateVideo }
    );
    if (updatedInfo.modifiedCount === 0) {
        throw 'Could not update video successfully';
    }
    return await getVideoById(id);
}

//likeCount - 1
async function decreaseLikeCount(id) {
    id = id.trim();
    verify.checkSpace(id, 'Video Id');
    verify.isString(id, 'Video Id');
    const videoCollection = await videos();

    let preVideo = await getVideoById(id);
    let preLikeCount = preVideo.likeCount;

    const updateVideo = {
        likeCount: preLikeCount - 1,
    };
    const updatedInfo = await videoCollection.updateOne(
        { _id: id },
        { $set: updateVideo }
    );
    if (updatedInfo.modifiedCount === 0) {
        throw 'Could not update video successfully';
    }
    return await getVideoById(id);
}

//viewCount + 1
async function increaseViewCount(id) {
    id = id.trim();
    verify.checkSpace(id, 'Video Id');
    verify.isString(id, 'Video Id');
    const videoCollection = await videos();

    let preVideo = await getVideoById(id);
    let preViewCount = preVideo.viewCount;

    const updateVideo = {
        viewCount: preViewCount + 1,
    };
    const updatedInfo = await videoCollection.updateOne(
        { _id: id },
        { $set: updateVideo }
    );
    if (updatedInfo.modifiedCount === 0) {
        throw 'Could not update video successfully';
    }
    return await getVideoById(id);
}

// get 4 videos by tag and year, ordering by likeCount
async function get4VideosByTagAndYear(tag, year) {
    // check format
    verify.isString(tag);
    verify.isString(year);
    verify.checkTag(tag);
    verify.checkSpace(tag, 'tag');
    verify.checkSpace(year, 'year');

    const videoCollection = await videos();

    let videoList = await videoCollection
        .find({
            Tags: { $all: [tag] },
            'uploadDate.year': parseInt(year),
            isDeleted: false
        })
        .sort({ likeCount: -1 })
        .limit(4)
        .toArray();

    return videoList;
}

// get 4 videos by tag, ordering by likeCount
async function get4VideosByTag(tag) {
    // check format
    verify.isString(tag);
    verify.checkTag(tag);
    verify.checkSpace(tag, 'tag');

    const videoCollection = await videos();

    let videoList = await videoCollection
        .find({
            Tags: { $all: [tag] },
            isDeleted: false
        })
        .sort({ likeCount: -1 })
        .limit(4)
        .toArray();

    return videoList;
}
async function getAllVideosByOneTag(tag) {
    const videoCollection = await videos();
    let videoList = await videoCollection
        .find({
            Tags: { $all: [tag] },
            isDeleted: false
        })
        .toArray();

    return videoList;
}
//get all videos by tag, ordering by likeCount, viewCount or uploadDates
async function getAllVideosByOneTagAndByOneFunc(tag, type) {
    const videoCollection = await videos();
    let videoList;
    switch (type) {
        case 'viewCount':
            videoList = await videoCollection
                .find({
                    Tags: { $all: [tag] },
                    isDeleted: false
                })
                .sort({ viewCount: -1 })
                .toArray();
            break;
        case 'uploadDate':
            videoList = await videoCollection
                .find({
                    Tags: { $all: [tag] },
                    isDeleted: false
                })
                .sort({
                    'uploadDate.year': -1,
                    'uploadDate.month': -1,
                    'uploadDate.day': -1,
                })
                .toArray();
            break;
        default:
            videoList = await videoCollection
                .find({
                    Tags: { $all: [tag] },
                    isDeleted: false
                })
                .sort({ likeCount: -1 })
                .toArray();
    }
    return videoList;
}
module.exports = {
    createVideo,
    getVideoById,
    getAllVideos,
    removeVideo,
    updateVideo,
    searchVideosByName,
    getVideosByTags,
    getVideosByYear,
    get3VideosSortByLikeCount,
    increaseLikeCount,
    decreaseLikeCount,
    increaseViewCount,
    get4VideosByTagAndYear,
    get4VideosByTag,
    getAllVideosByOneTag,
    getAllVideosByOneTagAndByOneFunc,
};
