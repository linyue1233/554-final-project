const mongoCollections = require('../config/mongoCollections');
const videos = mongoCollections.videos;


function uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}


async function createVideo(name,path,tags){
    let myDate = new Date();
    const videoCollection = await videos();
    let newvideo = {
        videoId: uuid(),
        videoName: name,
        videoPath: path,
        isDeleted: false,
        Tags: tags,
        likeCount: 0,
        viewCount: 0,
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
    if(insertInfo.insertedCount === 0) throw 'Could not creat video';
    console.log(insertInfo);

    const insertedVideo = await getById(newvideo.videoId);
    console.log(insertedVideo);
    return insertedVideo;
}

async function getById(id){
    const videoCollection = await videos();

    const resultVideo = await videoCollection.findOne({videoId:id});
    if(resultVideo == null) throw 'No video with that id';

    return resultVideo;
}

createVideo(111,111,111);

module.exports = {
    createVideo,
    getById
};