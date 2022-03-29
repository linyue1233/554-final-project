const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const verify = require('./verify');
let { ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const saltRounds = 16;
const uuid = require('uuid');

/**
 * Type and Format Checking Function
 */
// function isString(str, varName) {
//     if (!str) throw `${varName} must be provided`;
//     if (typeof str != 'string') throw `${varName} must be a string`;
//     if (str.trim().length == 0) throw `${varName} cannot just be empty spaces`;
// }
// function checkUsername(str) {
//     if (str.toLowerCase().trim() != str.toLowerCase().trim().replace(/\s+/g, '')) throw 'Username cannot have spaces';
//     if (str.length < 4) throw 'Username at least 4 characters';
// }
// function checkEmail(str) {
//     //check space
//     if (!str) throw 'Email must be provided';
//     if (str.toLowerCase().trim() != str.toLowerCase().trim().replace(/\s+/g, '')) throw 'Email cannot have spaces';
//     //check format XX@XX.com
//     if (/([a-zA-Z0-9]+)([\_\.\-{1}])?([a-zA-Z0-9]+)\@([a-zA-Z0-9]+)([\.])com/.test(email.trim()) == false)
//         throw 'You must provide a valid email address \n - Start and end with an alphanumeric character \n - Can contain an underscores (_), dashes (-), or periods (.) \n - Domain name follows after at symbol (@) \n - Domain name is any alphanermic character(s) followed by .com';
//     email = email.trim().split('@');
//     if (email[0].length < 6 || email[1].length < 7)
//         throw 'You must provide email prefix with at least 6 digits and domain at least 3 digits';
// }
// function checkPassword(str) {
//     if (!str) throw 'Password must be provided!';
//     if (str.toLowerCase().trim() != str.toLowerCase().trim().replace(/\s+/g, '')) throw 'Password cannot have spaces';
//     if (str.length < 6) throw 'Password must be at least 6 characters';
// }

/**
 * Export Function
 */
module.exports = {
    // create new user
    async createUser(username, email, password) {
        verify.isString(username, 'userName');
        verify.isString(email, 'email');
        verify.isString(password, 'password');
        verify.checkUsername(username);
        verify.checkEmail(email);
        verify.checkPassword(password);

        const userCollection = await users();
        // Find other user with the same username
        const otherUser = await userCollection.findOne({ email: email });
        if (otherUser != null) throw `There is already a user with that email ${email} ${otherUser}`;
        // encrypt the password
        const hash = await bcrypt.hash(password, saltRounds);
        // create user
        let newUser = {
            username: username,
            email: email,
            password: hash,
            commentId: [],
            likeId: [],
            isAdmin: false,
            _id: uuid.v4(),
        };

        // insert
        const insertInfo = await userCollection.insertOne(newUser);
        if (insertInfo.insertedCount === 0) throw 'Could not create user';
        // get new user information
        const newId = insertInfo.insertedId;
        const user = await this.getUserById(newId);

        return user;
    },
    // login cheak user
    async checkUser(email, password) {
        verify.isString(email, 'Email');
        verify.isString(password, 'Password');

        verify.checkEmail(email);
        verify.checkPassword(password);

        // find user in DB
        const userCollection = await users();
        const user = await userCollection.findOne({ email: email });
        if (user === null) throw `Either the username or password is invalid`;

        // check provided password is correct
        let compare = false;
        try {
            compare = await bcrypt.compare(password, user.password);
        } catch (error) {
            // no operation
        }
        if (compare) {
            //TODO: 完成cookies后改成{ authenticated: true } 直接跳转个人主页
            return true;
        } else {
            throw `Either the username or password is invalid`;
        }
    },
    // get all users
    async getAllUsers() {
        const userCollection = await users();
        const userList = await userCollection.find({}).toArray();

        if (!userList) throw `No users in the system`;

        return userList;
    },
    // get user by ID
    async getUserById(userId) {
        verify.isString(userId, 'User ID');
    },
};
