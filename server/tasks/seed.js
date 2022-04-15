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
            {
                action: true,
                comedy: true,
                thriller: true,
                love: true,
                documentary: true,
            },
            'rushHour description',
            'https://benchmoon-554.s3.amazonaws.com/WechatIMG915.jpeg'
        );

        const titanic = await videos.createVideo(
            'titanic',
            'https://benchmoon-554.s3.amazonaws.com/1649962183358-1649960458200107.mp4',
            {
                action: true,
                comedy: true,
                thriller: true,
                love: true,
                documentary: true,
            },
            'titanic description',
            'https://benchmoon-554.s3.amazonaws.com/WechatIMG915.jpeg'
        );

        const greenBook = await videos.createVideo(
            'greenBook',
            'https://benchmoon-554.s3.amazonaws.com/1649962183358-1649960458200107.mp4',
            {
                action: true,
                comedy: true,
                thriller: true,
                love: true,
                documentary: true,
            },
            'greenBook description',
            'https://benchmoon-554.s3.amazonaws.com/WechatIMG915.jpeg'
        );

        const batman = await videos.createVideo(
            'batman',
            'https://benchmoon-554.s3.amazonaws.com/1649962183358-1649960458200107.mp4',
            {
                action: true,
                comedy: true,
                thriller: true,
                love: true,
                documentary: true,
            },
            'batman description',
            'https://benchmoon-554.s3.amazonaws.com/WechatIMG915.jpeg'
        );
    } catch (e) {
        console.log(e);
    }
    // async createComment(content, userId, userName, videoId)
    try {
        const johnComment1 = await comments.createComment(
            'This is a great vedio',
            'e26946f2-9283-4301-a6c5-7b4e02049c3c',
            'john',
            'a70336f6-d2cc-4d1e-99ef-15022648b195'
        );
        const johnComment2 = await comments.createComment(
            'This is a bad vedio',
            'e26946f2-9283-4301-a6c5-7b4e02049c3c',
            'john',
            '51fcc4eb-e050-45ac-929c-36581c3ab7d8'
        );
        const aliceComment1 = await comments.createComment(
            'hahahhahaha',
            'bd17c6b9-c8fb-4cc5-98df-0dec9084b414',
            'alice',
            'a70336f6-d2cc-4d1e-99ef-15022648b195'
        );
        const aliceComment2 = await comments.createComment(
            'This is a bad vedio',
            'bd17c6b9-c8fb-4cc5-98df-0dec9084b414',
            'alice',
            '51fcc4eb-e050-45ac-929c-36581c3ab7d8'
        );
    } catch (e) {
        console.log(e);
    }

    console.log('Done seeding database');
    await dbConnection.closeConnection();
};

main().catch(console.log);
