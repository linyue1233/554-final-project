const mongoCollections = require('../config/mongoCollections');
const videos = mongoCollections.videos;
const verify = require('./verify');
const uuid = require('uuid');




async function createVideo(name,path,tags,cover){
    verify.isString(name,'name');
    verify.checkSpace(name,'Video Name');
    //verify.checkTags(tags);
    verify.checkAvatarSuffix(cover);
    let myDate = new Date();
    const videoCollection = await videos();
    let newvideo = {
        _id: uuid.v4(),
        videoName: name,
        videoPath: path,
        isDeleted: false,
        Tags: tags,
        cover:cover,
        likeCount: 0,
        viewCount: 0,
        comments: [],
        uploadDate: {
            year: myDate.getFullYear(),
            month: myDate.getMonth()+1,//(1-12)
            day: myDate.getDate(),
            hour: myDate.getHours(),
            minute: myDate.getMinutes(),
            second: myDate.getSeconds()
        }
    }

    const insertInfo = await videoCollection.insertOne(newvideo);
    if(!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Could not creat video';

    const insertedVideo = await getVideoById(insertInfo.insertedId);
    //console.log(insertedVideo);
    return insertedVideo;
}

async function getVideoById(id){
    id = id.trim();
    
    verify.checkSpace(id,'Video Id');
    verify.isString(id,'Video Id');
    const videoCollection = await videos();

    const resultVideo = await videoCollection.findOne({_id: id});
    if(resultVideo == null) throw 'No video with that id';

    return resultVideo;
}

async function getAllVideos () {
    const videoCollection = await videos();

    const allVideos = await videoCollection.find({}).toArray();

    console.log(allVideos);

    return allVideos;
}

async function removeVideo (id) {
    id = id.trim();
    verify.checkSpace(id,'Video Id');
    verify.isString(id,'Video Id');
    const videoCollection = await videos();

    let video = await getVideoById(id);

    const deletionInfo = await videoCollection.deleteOne({ _id: id });

    if (deletionInfo.deletedCount === 0) {
        throw `Could not delete video with id of ${id}`;
    }

    let resultstr = `${video.videoName} has been successfully deleted!`;

    return resultstr;
}

async function updateVideo (id,name) {
    id = id.trim();
    verify.checkSpace(id,'Video Id');
    verify.isString(id,'Video Id');
    verify.checkSpace(name,'Video Name');
    verify.isString(name,'Video Name');
    let preVideo = await getVideoById(id);
    if(name == preVideo.name) throw 'Same Video Name Error!';
    const videoCollection = await videos();
    const updateVideo = {
        name: name
    };
    const updatedInfo = await videoCollection.updateOne(
        {_id: id},
        {$set: updateVideo}
    );
    if(updatedInfo.modifiedCount === 0){
        throw 'Could not update video successfully';
    }
    return await getVideoById(id);
}

async function searchVideosByName(searchTerm) {

    searchTerm = searchTerm.trim();

    verify.isString(searchTerm, 'searchTerm');

    const videoCollection = await videos();

    searchTerm = searchTerm.toLowerCase();
  
    let videoList = await videoCollection.find({
        videoName: { $regex: ".*" + searchTerm + ".*", $options: "i" },
      })
      .toArray();
  
    return videoList;
    
}

async function getVideosByTags (tags) {

    verify.checkTags(tags);

    const videoCollection = await videos();
  
    let videoList = await videoCollection.find({
        tags: { $all: tags },
      })
      .toArray();
  
    return videoList;
    
}

async function getVideosByYear (year) {

    year = year.trim();

    verify.isString(year);

    const videoCollection = await videos();
  
    let videoList = await videoCollection.find({
        uploadDate: {year: year},
      })
      .toArray();
  
    return videoList;
    
}

async function getRecommendVideos () {
    //sort algorithm tbd
    return true;
}

//createVideo(111,111,111);
//removeVideo('37b3872f-a11a-4265-9e04-73410e2a1b6b');

module.exports = {
    createVideo,
    getVideoById,
    getAllVideos,
    removeVideo,
    updateVideo,
    searchVideosByName,
    getVideosByTags,
    getVideosByYear,
    getRecommendVideos
};