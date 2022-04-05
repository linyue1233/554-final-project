const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const users = data.users;
const videos = data.videos;

const main = async () => {
    console.log('This may take a few moments');

    const db = await dbConnection.dbConnection();
    await db.dropDatabase();

    // create users
    const john = await users.createUser('john', 'johnwork@gmail.com', '123456', 'defaultAvatar.jpg');

    const alice = await users.createUser('alice', 'alicework@gmail.com', '123456', 'defaultAvatar.jpg');

    const tony = await users.createUser('tony', 'tonywork@gmail.com', '123456', 'defaultAvatar.jpg');

    const jony = await users.createUser('jony', 'jonyabcdef@gmail.com', '123456', 'defaultAvatar.jpg');


    try {
        //create videos
        const rushHour = await videos.createVideo('rushHour', 'default_path', {action: true, comedy:true, thriller: true, love:true, documentary: true},'defaultAvatar.jpg');

        const titanic = await videos.createVideo('titanic', 'default_path', {action: true, comedy:true, thriller: true, love:true, documentary: true},'defaultAvatar.jpg');

        const greenBook = await videos.createVideo('greenBook', 'default_path', {action: true, comedy:true, thriller: true, love:true, documentary: true},'defaultAvatar.jpg');

        const batman = await videos.createVideo('batman', 'default_path', {action: true, comedy:true, thriller: true, love:true, documentary: true},'defaultAvatar.jpg');

    } catch (e) {
        console.log(e);
    }


    console.log('Done seeding database');
    await dbConnection.closeConnection();
};

main().catch(console.log);
