// createChatroom,deleteChatroomByUsername,getAllChatroom
const express = require('express');
const router = express.Router();
const data = require('../data');
const uuid = require("uuid");
const path = require('path');
const chatroomData = data.chatroom;
const verify = require('../data/verify');
const xss = require('xss');
router.get('/', async (req, res) => {
    const allChatroom = await chatroomData.getAllChatroom();
    res.json(allChatroom);
});
router.post('/:userName', async (req, res) => {
   const userName = xss(req.params.userName);
   if (!userName) {
      res.status(400).json({ error: "You must provide a user name" });
      return;
   }
   try{
      verify.checkUsername(userName);
      const newChatroom = await chatroomData.createChatroom(userName);
      res.json(newChatroom);
   }catch(e){
      res.status(400).json({ error: e });
   }

});
router.delete('/:userName', async (req, res) => {
   try{
      const userName = xss(req.params.userName);
      if (!userName) {
         res.status(400).json({ error: "You must provide a user name" });
         return;
      }
      verify.checkUsername(userName);
      const deletedChatroom = await chatroomData.deleteChatroomByUsername(userName);
      res.json(deletedChatroom);
   }catch (e) {
      res.status(400).json({ error: e });

   }

});
module.exports = router;