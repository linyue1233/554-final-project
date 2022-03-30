const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const verify = require('./verify');
let { ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const saltRounds = 16;
const uuid = require('uuid');

/**
 * Export Function
 */
module.exports = {
    // create new user
    async createUser(username, email, password, avatar) {
        verify.isString(username, 'userName');
        verify.isString(email, 'email');
        verify.isString(password, 'password');
        verify.checkUsername(username);
        verify.checkEmail(email);
        verify.checkPassword(password);
        if (!avatar) {
            avatar = 'defaultAvatar.jpg';
        } else {
            verify.isString(avatar, 'avatar');
            verify.checkSpace(avatar, 'avatar');
        }

        const userCollection = await users();
        // Find other user with the same email
        const otherUser = await userCollection.findOne({ email: email });
        if (otherUser != null) throw `There is already a user with that email ${email} ${otherUser}`;
        // encrypt the password
        const hash = await bcrypt.hash(password, saltRounds);
        // create user
        let newUser = {
            username: username.trim(),
            email: email.toLowerCase().trim(),
            password: hash,
            avatar: avatar.trim(),
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
    // login check user
    async checkUser(email, password) {
        verify.isString(email, 'Email');
        verify.isString(password, 'Password');

        verify.checkEmail(email);
        verify.checkPassword(password);

        // find user in DB
        const userCollection = await users();
        const user = await userCollection.findOne({ email: email.toLowerCase().trim() });
        if (user === null) throw `Either the username or password is invalid`;

        // check provided password is correct
        let compare = false;
        try {
            compare = await bcrypt.compare(password.trim(), user.password);
        } catch (error) {
            // no operation
        }
        if (compare) {
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
        verify.checkSpace(userId, 'User ID');
        // get user
        const userCollection = await users();
        const user = await userCollection.findOne({ _id: userId.trim() });

        if (!user) throw `No user with the id of ${userId}`;

        return user;
    },
    // delete user by Id
    async removeUserById(userId) {
        verify.isString(userId, 'User ID');
        verify.checkSpace(userId, 'User ID');
        // remove user
        const userCollection = await users();
        let user = await this.getUserById(userId.trim());
        if (!user) throw `No user with the ID of ${userId}`;
        const deleteUser = await userCollection.deleteOne({ _id: userId.trim() });
        if (deleteUser.deletedCount === 0) throw `Could not delete user with the ID of ${userId}`;
        return { deleteResult: true };
        //
    },
    // update user Info
    async updateUser(userId, username, email, avatar) {
        verify.isString(userId);
        verify.isString(username);
        verify.isString(avatar);
        verify.isString(email);
        verify.checkEmail(email);
        verify.checkSpace(userId);
        verify.checkSpace(username);
        verify.checkSpace(avatar);
        verify.checkUsername(username);
        // find user by ID
        let oldUser = await this.getUserById(userId.trim());
        if (!oldUser) throw `No user with the ID of ${userId}`;

        const userCollection = await users();
        // check new email is unique to the users collection
        if (email !== oldUser.email) {
            const otherUser = await userCollection.findOne({ email: email });
            if (otherUser != null) throw `There is already a user with the email of ${email}`;
        }
        // update the users
        let userUpdateInfo = {
            username: username.trim(),
            email: email.toLowerCase().trim(),
            avatar: avatar.trim(),
        };
        // check at least one input is different
        if (
            userUpdateInfo.username === oldUser.username &&
            userUpdateInfo.email === oldUser.email &&
            userUpdateInfo.avatar === oldUser.avatar
        )
            throw `At least one user data input must be different from the original data`;

        // update user
        const updateInfo = await userCollection.updateOne({ _id: userId }, { $set: userUpdateInfo });
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw `Failed to update user`;

        return await this.getUserById(userId.trim());
    },
    // update password
    async updatePassword(userId, password) {
        verify.isString(userId);
        verify.isString(password);
        verify.checkSpace(userId);
        verify.checkPassword(password);
        // find user by ID
        let oldUser = await this.getUserById(userId.trim());
        if (!oldUser) throw `There is no user it the id of ${userId}`;
        // encrypt the password
        const hash = await bcrypt.hash(password.trim(), saltRounds);
        // check the password is different
        if (oldUser.password === hash) throw `Please input the different password`;
        //update password
        let userUpdatePassword = {
            password: hash,
        };
        const updateInfo = await this.userCollection.updateOne({ _id: userId }, { $set: userUpdatePassword });
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw `Failed to update password`;

        return { updatePasswordResult: true };
    },
};
