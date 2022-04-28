const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const verify = require('./verify');
let { ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const saltRounds = 8;
const uuid = require('uuid');


/**
 * Export Function
 */
module.exports = {
    // create new user
    // all user created by this way is not admin
    async createUser(username, email, password, avatar) {
        verify.isString(username, 'userName');
        verify.isString(email, 'email');
        verify.isString(password, 'password');
        verify.checkUsername(username);
        verify.checkEmail(email);
        verify.checkPassword(password);
        if (!avatar) {
            avatar = '/image/defaultAvatar.jpg';
        } else {
            verify.isString(avatar, 'avatar');
            verify.checkSpace(avatar, 'avatar');
            verify.checkAvatarSuffix(avatar);
        }
        avatar = avatar.split(' ').join('');
        const userCollection = await users();
        // Find other user with the same email
        const otherUser = await userCollection.findOne({ email: email });
        if (otherUser != null)
            throw `There is already a user with that email ${email} ${otherUser}`;
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
    async deleteUserById(userId) {
        verify.isString(userId, 'User ID');
        verify.checkSpace(userId, 'User ID');
        // remove user
        const userCollection = await users();
        let user = await this.getUserById(userId.trim());
        if (!user) throw `No user with the ID of ${userId}`;
        const deleteUser = await userCollection.deleteOne({ _id: userId.trim() });
        if (deleteUser.deletedCount === 0)
            throw `Could not delete user with the ID of ${userId}`;
        return { deleteResult: true };
        //
    },
    // update user Info
    async updateUser(userId, username, email, avatar) {
        verify.isString(userId, 'User ID');
        verify.isString(username, 'username');
        verify.isString(avatar, 'avatar');
        verify.isString(email, 'email');
        verify.checkEmail(email);
        verify.checkSpace(userId, 'User ID');
        verify.checkSpace(avatar, 'avatar');
        verify.checkAvatarSuffix(avatar);
        verify.checkUsername(username);
        // find user by ID
        let oldUser = await this.getUserById(userId.trim());
        if (!oldUser) throw `No user with the ID of ${userId}`;

        const userCollection = await users();
        // check new email is unique to the users collection
        if (email !== oldUser.email) {
            const otherUser = await userCollection.findOne({ email: email });
            if (otherUser != null)
                throw `There is already a user with the email of ${email}`;
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
        const updateInfo = await userCollection.updateOne(
            { _id: userId },
            { $set: userUpdateInfo }
        );
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
            throw `Failed to update user`;

        return await this.getUserById(userId.trim());
    },
    // update password
    async updatePassword(userId, oldPassword, newPassword) {
        if (oldPassword.trim() === newPassword.trim())
            throw `Please input different password`;
        verify.isString(userId, 'User ID');
        verify.isString(oldPassword, 'oldPassword');
        verify.isString(newPassword, 'newPassword');
        verify.checkSpace(userId, 'User ID');
        verify.checkPassword(oldPassword);
        verify.checkPassword(newPassword);
        // find user by ID
        let oldUser = await this.getUserById(userId.trim());
        if (!oldUser) throw `There is no user it the id of ${userId}`;
        // check old password
        let compare = false;
        try {
            compare = await bcrypt.compare(oldPassword.trim(), oldUser.password);
        } catch (error) {
            // no operation
        }
        if (compare !== true) throw `Please input correct old password`;
        //update password
        const newHash = await bcrypt.hash(newPassword.trim(), saltRounds);
        let userUpdatePassword = {
            password: newHash,
        };
        const userCollection = await users();
        const updateInfo = await userCollection.updateOne(
            { _id: userId },
            { $set: userUpdatePassword }
        );
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
            throw `Failed to update password`;

        return true;
    },

    // add commentId to user
    async addCommentId(userId, commentId) {
        verify.isString(userId, 'User ID');
        verify.isString(commentId, 'Comment ID');
        verify.checkSpace(userId, 'User ID');
        verify.checkSpace(commentId, 'Comment ID');
        // find user by ID
        let user = await this.getUserById(userId.trim());
        if (!user) throw `There is no user it the id of ${userId}`;
        // add commentId to user
        const userCollection = await users();
        const updateInfo = await userCollection.updateOne(
            { _id: userId },
            { $push: { commentId: commentId.trim() } }
        );
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
            throw `Failed to add commentId to user`;

        return await this.getUserById(userId.trim());
    },

    // remove commentId from user
    async removeCommentId(userId, commentId) {
        verify.isString(userId, 'User ID');
        verify.isString(commentId, 'Comment ID');
        verify.checkSpace(userId, 'User ID');
        verify.checkSpace(commentId, 'Comment ID');
        // find user by ID
        let user = await this.getUserById(userId.trim());
        if (!user) throw `There is no user it the id of ${userId}`;
        // remove commentId from user
        const userCollection = await users();
        const updateInfo = await userCollection.updateOne(
            { _id: userId },
            { $pull: { commentId: commentId.trim() } }
        );
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
            throw `Failed to remove commentId from user`;

        return await this.getUserById(userId.trim());
    },

    // add likeId to user
    async addLikeId(userId, likeId) {
        verify.isString(userId, 'User ID');
        verify.isString(likeId, 'Like ID');
        verify.checkSpace(userId, 'User ID');
        verify.checkSpace(likeId, 'Like ID');
        // find user by ID
        let oldUser = await this.getUserById(userId.trim());
        if (!oldUser) throw `There is no user it the id of ${userId}`;
        // check likeId is not in the list
        if (oldUser.likeId.includes(likeId.trim()))
            throw `The likeId is already in the list`;
        // add likeId
        const userCollection = await users();
        const updateInfo = await userCollection.updateOne(
            { _id: userId },
            { $push: { likeId: likeId.trim() } }
        );
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
            throw `Failed to add likeId`;

        return await this.getUserById(userId.trim());
    },

    // remove likeId from user
    async removeLikeId(userId, likeId) {
        verify.isString(userId, 'User ID');
        verify.isString(likeId, 'Like ID');
        verify.checkSpace(userId, 'User ID');
        verify.checkSpace(likeId, 'Like ID');
        // find user by ID
        let oldUser = await this.getUserById(userId.trim());
        if (!oldUser) throw `There is no user it the id of ${userId}`;
        // check likeId is in the list
        if (!oldUser.likeId.includes(likeId.trim()))
            throw `The likeId is not in the list`;
        // remove likeId
        const userCollection = await users();
        const updateInfo = await userCollection.updateOne(
            { _id: userId },
            { $pull: { likeId: likeId.trim() } }
        );
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
            throw `Failed to remove likeId`;

        return await this.getUserById(userId.trim());
    },
    // logout
    async logout(userId) {
        verify.isString(userId, 'User ID');
        verify.checkSpace(userId, 'User ID');
        // find user by ID
        let oldUser = await this.getUserById(userId.trim());
        if (!oldUser) throw `There is no user it the id of ${userId}`;
        // logout
        const userCollection = await users();
        const updateInfo = await userCollection.updateOne(
            { _id: userId },
            { $set: { isLogin: false } }
        );
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
            throw `Failed to logout`;

        return await this.getUserById(userId.trim());
    },
    //get user information by email
    async getUserByEmail(email) {
        try{
        verify.isString(email, 'Email');
        verify.checkSpace(email, 'Email');
        // find user by email
        const userCollection = await users();
        const user = await userCollection.findOne({ email: email.trim() });
        if (!user) throw `There is no user it the email of ${email}`;
        return user;
        }catch(error){
            throw error;
        }
    },
    

};
