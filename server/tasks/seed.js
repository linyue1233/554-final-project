const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const users = data.users;
const videos = data.videos;
const comments = data.comments;
const main = async () => {
    console.log('This may take a few moments');
    const db = await dbConnection.dbConnection();
    await db.dropDatabase();
    
    // create users
    const john = await users.createUser(
        'john',
        'johnwork@gmail.com',
        '123456',
        'https://benchmoon-554.s3.amazonaws.com/1649987446046-WechatIMG915.jpeg'
    );

    const alice = await users.createUser(
        'alice',
        'alicework@gmail.com',
        '123456',
        'https://benchmoon-554.s3.amazonaws.com/1649987446046-WechatIMG915.jpeg'
    );

    const tony = await users.createUser(
        'tony',
        'tonywork@gmail.com',
        '123456',
        'https://benchmoon-554.s3.amazonaws.com/1649987446046-WechatIMG915.jpeg'
    );

    const jony = await users.createUser(
        'jony',
        'jonyabcdef@gmail.com',
        '123456',
        'https://benchmoon-554.s3.amazonaws.com/1649987446046-WechatIMG915.jpeg'
    );

    try {
        //create videos
        const rushHour = await videos.createVideo(
            'rushHour',
            'https://benchmoon-554.s3.amazonaws.com/1649962183358-1649960458200107.mp4',
            ['action', 'comedy', 'thirller'],
            'rushHour description',
            'https://benchmoon-554.s3.amazonaws.com/WechatIMG915.jpeg'
        );

        const titanic = await videos.createVideo(
            'titanic',
            'https://benchmoon-554.s3.amazonaws.com/1649962183358-1649960458200107.mp4',
            ['thirller', 'love', 'documentary'],
            'titanic description',
            'https://benchmoon-554.s3.amazonaws.com/WechatIMG915.jpeg'
        );

        const greenBook = await videos.createVideo(
            'greenBook',
            'https://benchmoon-554.s3.amazonaws.com/1649962183358-1649960458200107.mp4',
            ['comedy', 'love', 'documentary'],
            'greenBook description',
            'https://benchmoon-554.s3.amazonaws.com/WechatIMG915.jpeg'
        );

        const batman = await videos.createVideo(
            'batman',
            'https://benchmoon-554.s3.amazonaws.com/1649962183358-1649960458200107.mp4',
            ['action', 'thirller', 'love'],
            'batman description',
            'https://benchmoon-554.s3.amazonaws.com/WechatIMG915.jpeg'
        );
    } catch (e) {
        console.log(e);
    }
    // async createComment(content, userId, userName, videoId)
    try {
        const userInfo = await users.getAllUsers();
        const videoInfo = await videos.getAllVideos();
        const johnComment1 = await comments.createComment(
            'This is a great vedio',
            userInfo[0]._id,
            userInfo[0].username,
            videoInfo[0]._id
        );
        const johnComment2 = await comments.createComment(
            'This is a bad vedio',
            userInfo[0]._id,
            userInfo[0].username,
            videoInfo[1]._id
        );
        const aliceComment1 = await comments.createComment(
            'hahahhahaha',
            userInfo[1]._id,
            userInfo[1].username,
            videoInfo[1]._id
        );
        const aliceComment2 = await comments.createComment(
            'This is a bad vedio',
            userInfo[1]._id,
            userInfo[1].username,
            videoInfo[0]._id
        );
    } catch (e) {
        console.log(e);
    }
    
    console.log('Done seeding database');
    await dbConnection.closeConnection();
};

main().catch(console.log);
