const mongoCollections = require('../config/mongoCollections');
const chatroom = mongoCollections.chatroom;
const uuid = require('uuid');
const verifyFunction = require('./verify');

module.exports = {
    async createChatroom(userName) {
        //create a list to store chatroom list
        if (!userName) throw 'some one is missing';
        
        verifyFunction.checkUsername(userName);
        if(userName!='admin'){
            const flag = await this.getChatroomByUsername(userName)
            const chatroomCollection = await chatroom();
            if(flag) {
                const thisChatroom = await chatroomCollection.findOne({ userName: userName });
                await chatroomCollection.updateOne({ _id: thisChatroom._id }, { $set: { isDeleted: false } });
            }else{
                let date = new Date();
                let newChatroom = {
                    userName: userName,
                    isDeleted: false,
                    date: {
                        year: date.getFullYear(),
                        month: date.getMonth() + 1,
                        day: date.getDate(),
                    },
                    _id: uuid.v4(),
                };
                
                const insertInfo = await chatroomCollection.insertOne(newChatroom);
                if (insertInfo.insertedCount === 0) throw 'Could not create user';
                const newId = insertInfo.insertedId;
                const thisChatroom = await this.getChatroomByChatroomId(newId);
                return thisChatroom;
            }
        }else{
            return false;
        }
    },
    //get chatroom by chatroom id
    async getChatroomByChatroomId(chatroomId) {
        if (!chatroomId) throw 'some one is missing';
        const chatroomCollection = await chatroom();
        const thisChatroom = await chatroomCollection.findOne({ _id: chatroomId });
        if (!thisChatroom) throw 'chatroom does not exist';
        return thisChatroom;

    },
    //delete chatroom by username
    async deleteChatroomByUsername(username) {
        if (!username) throw 'some one is missing';
        verifyFunction.checkUsername(username);
        const chatroomCollection = await chatroom();
        const thisChatroom = await chatroomCollection.findOne({ userName: username });
        if (!thisChatroom) throw 'chatroom does not exist';
        await chatroomCollection.updateOne({ _id: thisChatroom._id }, { $set: { isDeleted: true } });
        return thisChatroom;
    },
    //get chatroom by username
    async getChatroomByUsername(username) {
        if (!username) throw 'some one is missing';
        verifyFunction.checkUsername(username);
        const chatroomCollection = await chatroom();
        const thisChatroom = await chatroomCollection.findOne({ userName: username });
        if (!thisChatroom) return false;
        return true;
    },
    //get all chatroom
    async getAllChatroom() {
        const chatroomCollection = await chatroom();
        const allChatroom = await chatroomCollection.find({ isDeleted: false }).toArray();
        let roomList=[]
        for (let i = 0; i < allChatroom.length; i++) {
            roomList.push(allChatroom[i].userName);
        }
        return roomList;
    }
    
};
