const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;
const verify = require('../data/verify');
const xss = require('xss');
//get all users
router.get('/all', async (req, res) => {
    try {
        let userList = await userData.getAllUsers();
        res.status(200).json(userList);
    } catch (error) {
        res.status(500).json({ message: error });
    }
});
// signup
router.post('/signup', async (req, res) => {
    let userInfo = req.body;
    // check format
    try {
        if (!userInfo || !userInfo.username || !userInfo.password || !userInfo.email) throw `lost user information`;
        verify.isString(userInfo.username, 'username');
        verify.isString(userInfo.email, 'email');
        verify.isString(userInfo.password, 'password');
        verify.checkUsername(userInfo.username);
        verify.checkEmail(userInfo.email);
        verify.checkPassword(userInfo.password);
    } catch (error) {
        res.status(400).json({ message: error });
        return;
    }
    // create user
    try {
        const newUser = await userData.createUser(
            xss(req.body.username).trim(),
            xss(req.body.email).toLowerCase().trim(),
            xss(req.body.password).trim()
        );
        res.status(200).json(newUser);
    } catch (error) {
        res.status(500).json({ message: error });
    }
});
// login
router.post('/login', async (req, res) => {
    let userInfo = req.body;
    // check format
    try {
        if (!userInfo || !userInfo.email || !userInfo.password) throw `lost user info`;
        verify.isString(userInfo.email, 'email');
        verify.isString(userInfo.password, 'password');
        verify.checkEmail(userInfo.email);
        verify.checkPassword(userInfo.password);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error });
        return;
    }
    try {
        const checkUser = await userData.checkUser(
            xss(req.body.email.toLowerCase()).trim(),
            xss(req.body.password).trim()
        );
        if (checkUser) {
            res.status(200).json({ authenticated: true });
        }
    } catch (error) {
        res.status(500).json({ message: error });
    }
});
// get user by ID
router.get('/:userId', async (req, res) => {
    let userId = req.params.userId.trim();
    //check format
    try {
        verify.isString(userId, 'User ID');
        verify.checkSpace(userId, 'User ID');
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error });
        return;
    }
    // get user
    try {
        const user = await userData.getUserById(userId);
        res.status(200).json(user);
        return;
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

module.exports = router;
