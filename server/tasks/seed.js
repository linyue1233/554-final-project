const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const users = data.users;

const main = async () => {
    console.log('This may take a few moments');

    const db = await dbConnection.dbConnection();
    await db.dropDatabase();

    // create users
    const john = await users.createUser('john', 'johnwork@gmail.com', '123456', 'defaultAvatar.jpg');

    const alice = await users.createUser('alice', 'alicework@gmail.com', '123456', 'defaultAvatar.jpg');

    const tony = await users.createUser('tony', 'tonywork@gmail.com', '123456', 'defaultAvatar.jpg');

    const jony = await users.createUser('jony', 'jonyabcdef@gmail.com', '123456', 'defaultAvatar.jpg');

    console.log('Done seeding database');
    await dbConnection.closeConnection();
};

main().catch(console.log);
