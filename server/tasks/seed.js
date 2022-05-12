const dbConnection = require('../config/mongoConnection');
const mongoCollections = require('../config/mongoCollections');
const data = require('../data/');
const user = mongoCollections.users;
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

    const admin = await users.createUser(
        'admin',
        'thisisadmin@gmail.com',
        '123456',
        'https://benchmoon-554.s3.amazonaws.com/1649987446046-WechatIMG915.jpeg'
    );

    const userCollection = await user();
    await userCollection.updateOne( 
        { _id: admin._id },
        { $set: { isAdmin: true } }
    );

    try {
        //create videos
        const rushHour = await videos.createVideo(
            'rushHour',
            'https://benchmoon-554.s3.amazonaws.com/1649962183358-1649960458200107.mp4',
            ['action', 'comedy', 'thriller'],
            'Cultures clash and tempers flares as the two cops named Detective Inspector Lee a Hong Kong Detective and Detective James Carter FBI, a big-mouthed work-alone Los Angeles cop who are from different worlds discovers one thing in common: they cannot stand each other. With time running out, they must join forces to catch the criminals and save the eleven-year-old Chinese girl of the Chinese consul named Soo Yung.',
            'https://benchmoon-554.s3.amazonaws.com/1652064253283-WechatIMG19.jpeg'
        );

        const titanic = await videos.createVideo(
            'titanic',
            'https://benchmoon-554.s3.amazonaws.com/1649962183358-1649960458200107.mp4',
            ['thriller', 'love', 'documentary'],
            '84 years later, a 100 year-old woman named Rose DeWitt Bukater tells the story to her granddaughter Lizzy Calvert, Brock Lovett, Lewis Bodine, Bobby Buell and Anatoly Mikailavich on the Keldysh about her life set in April 10th 1912, on a ship called Titanic when young Rose boards the departing ship with the upper-class passengers and her mother, Ruth DeWitt Bukater, and her fiancé, Caledon Hockley. Meanwhile, a drifter and artist named Jack Dawson and his best friend Fabrizio De Rossi win third-class tickets to the ship in a game. And she explains the whole story from departure until the death of Titanic on its first and last voyage April 15th, 1912 at 2:20 in the morning.',
            'https://benchmoon-554.s3.amazonaws.com/1652064253283-WechatIMG19.jpeg'
        );

        const greenBook = await videos.createVideo(
            'greenBook',
            'https://benchmoon-554.s3.amazonaws.com/1649962183358-1649960458200107.mp4',
            ['comedy', 'love', 'documentary'],
            "In 1962, Tony, a tough bouncer, is looking for work when his nightclub is closed for renovations. The most promising offer turns out to be the driver for the African-American classical pianist Don Shirley for a concert tour into the Deep South states. Although hardly enthused at working for a black man, Tony accepts the job and they begin their trek armed with The Negro Motorist Green Book, a travel guide for safe travel through America's racial segregation. Together, the snobbishly erudite pianist and the crudely practical bouncer can barely get along with their clashing attitudes to life and ideals. However, as the disparate pair witness and endure America's appalling injustices on the road, they find a newfound respect for each other's talents and start to face them together. In doing so, they would nurture a friendship and understanding that would change both their lives",
            'https://benchmoon-554.s3.amazonaws.com/1652064253283-WechatIMG19.jpeg'
        );

        const batman = await videos.createVideo(
            'batman',
            'https://benchmoon-554.s3.amazonaws.com/1649962183358-1649960458200107.mp4',
            ['action', 'thriller', 'love'],
            "Gotham City. Crime boss Carl Grissom (Jack Palance) effectively runs the town but there's a new crime fighter in town - Batman (Michael Keaton). Grissom's right-hand man is Jack Napier (Jack Nicholson), a brutal man who is not entirely sane... After falling out between the two Grissom has Napier set up with the Police and Napier falls to his apparent death in a vat of chemicals. However, he soon reappears as The Joker and starts a reign of terror in Gotham City. Meanwhile, reporter Vicki Vale (Kim Basinger) is in the city to do an article on Batman. She soon starts a relationship with Batman's everyday persona, billionaire Bruce Wayne.",
            'https://benchmoon-554.s3.amazonaws.com/1652064253283-WechatIMG19.jpeg'
        );

        const CaptainAmerica = await videos.createVideo(
            "Captain America: The Winter Soldier",
            'https://benchmoon-554.s3.amazonaws.com/1649962183358-1649960458200107.mp4',
            ['action','love','comedy'],
            "As Steve Rogers struggles to embrace his role in the modern world, he teams up with a fellow Avenger and S.H.I.E.L.D agent, Black Widow, to battle a new threat from history: an assassin known as the Winter Soldier.",
            'https://benchmoon-554.s3.amazonaws.com/1652064253283-WechatIMG19.jpeg'
        );

        const Extraction = await videos.createVideo(
            'Extraction',
            'https://benchmoon-554.s3.amazonaws.com/1649962183358-1649960458200107.mp4',
            ['action','thriller'],
            "Tyler Rake, a fearless black market mercenary, embarks on the most deadly extraction of his career when he's enlisted to rescue the kidnapped son of an imprisoned international crime lord.",
            'https://benchmoon-554.s3.amazonaws.com/1652064253283-WechatIMG19.jpeg'
        );

        const Arrival = await videos.createVideo(
            'Arrival',
            'https://benchmoon-554.s3.amazonaws.com/1649962183358-1649960458200107.mp4',
            ['thriller'],
            "A linguist works with the military to communicate with alien lifeforms after twelve mysterious spacecraft appear around the world.",
            'https://benchmoon-554.s3.amazonaws.com/1652064253283-WechatIMG19.jpeg'
        );

        const Godfather = await videos.createVideo(
            'The Godfather',
            'https://benchmoon-554.s3.amazonaws.com/1649962183358-1649960458200107.mp4',
            ['love','documentary'],
            "The Godfather Don Vito Corleone is the head of the Corleone mafia family in New York. He is at the event of his daughter's wedding. Michael, Vito's youngest son and a decorated WW II Marine is also present at the wedding. Michael seems to be uninterested in being a part of the family business. Vito is a powerful man, and is kind to all those who give him respect but is ruthless against those who do not. But when a powerful and treacherous rival wants to sell drugs and needs the Don's influence for the same, Vito refuses to do it. What follows is a clash between Vito's fading old values and the new ways which may cause Michael to do the thing he was most reluctant in doing and wage a mob war against all the other mafia families which could tear the Corleone family apart.",
            'https://benchmoon-554.s3.amazonaws.com/1652064253283-WechatIMG19.jpeg'
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

        const johnComment3 = await comments.createComment(
            "I like this video, I learn a lot from it",
            userInfo[0]._id,
            userInfo[0].username,
            videoInfo[2]._id
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
