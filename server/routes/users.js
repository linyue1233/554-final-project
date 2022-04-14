const express = require('express');
const fs = require('fs');
const util = require('util');
const uuid = require("uuid");
const unlinkFile = util.promisify(fs.unlink);
const router = express.Router();
const data = require('../data');
const userData = data.users;
const verify = require('../data/verify');
const xss = require('xss');
const sharp = require('sharp');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { uploadFile, getFileStream } = require('../config/awsS3');

// router.get('/avatarImage/:keyId', async (req, res) => {
//     const keyId = req.params.keyId;
//     try {
//         const readStream = getFileStream(keyId);
//         // console.log(readStream);
//         readStream.pipe(res);
//     } catch (e) {
//         res.status(500).json({ message: e });
//     }
// });  

async function changeAvatar(filePath) {
    let newFilePath = "uploads/" + uuid.v4();
    await sharp(filePath).resize(300, 300).toFile(newFilePath);
    return newFilePath;
}

router.post('/avatarImage', upload.single('avatar'), async (req, res) => {
    const file = req.file;
    //  check form
    let originalName = file.originalname;
    try {
        verify.checkAvatarSuffix(originalName);
    } catch (e) {
        res.status(400).json({ message: e });
        return;
    }
    // reset filename
    let oldPath = file.path;
    file.filename = `${Date.now()}-${req.file.originalname}`;
    // resize avatarImage
    file.path = await changeAvatar(file.path);
    try {
        const result = await uploadFile(file);
        // delete local record
        fs.unlinkSync(oldPath);
        fs.unlinkSync(file.path);
        res.send({ imagePath: `${result.key}` });
        return;
    } catch (error) {
        res.status(500).json({ message: error });
        return;
    }
});

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
        if (!userInfo || !userInfo.username || !userInfo.password || !userInfo.email || !userInfo.avatar)
            throw `lost user information`;
        verify.isString(userInfo.username, 'username');
        verify.isString(userInfo.email, 'email');
        verify.isString(userInfo.password, 'password');
        verify.isString(userInfo.avatar, 'avatar');
        verify.checkUsername(userInfo.username);
        verify.checkEmail(userInfo.email);
        verify.checkPassword(userInfo.password);
        verify.checkSpace(userInfo.avatar, 'avatar');
    } catch (error) {
        res.status(400).json({ message: error });
        return;
    }
    // create user
    try {
        const newUser = await userData.createUser(
            xss(req.body.username).trim(),
            xss(req.body.email).toLowerCase().trim(),
            xss(req.body.password).trim(),
            xss(req.body.avatar).trim()
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
        res.status(400).json({ message: error });
        return;
    }
    // get user
    try {
        const user = await userData.getUserById(userId);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error });
    }
});
// remove user by ID
router.delete('/delete/:userId', async (req, res) => {
    let userId = req.params.userId.trim();
    // check format
    try {
        verify.isString(userId, 'User ID');
        verify.checkSpace(userId, 'User ID');
    } catch (error) {
        res.status(400).json({ message: error });
        return;
    }
    // delete user
    try {
        const deleteUser = await userData.deleteUserById(userId);
        res.status(200).json(deleteUser);
    } catch (error) {
        res.status(500).json({ message: error });
    }
});
// change password
router.post('/password/:userId', async (req, res) => {
    let userInfo = req.body;
    // check format
    try {
        verify.isString(req.params.userId, 'User ID');
        verify.isString(userInfo.oldPassword, 'Old Password');
        verify.isString(userInfo.newPassword, 'new Password');
        verify.checkSpace(req.params.userId, 'User ID');
        verify.checkPassword(userInfo.oldPassword);
        verify.checkPassword(userInfo.newPassword);
        if (userInfo.oldPassword === userInfo.newPassword) throw `Please input a different password`;
    } catch (error) {
        res.status(400).json({ message: error });
        return;
    }
    // update
    try {
        const updatePW = await userData.updatePassword(
            req.params.userId.trim(),
            xss(req.body.oldPassword).trim(),
            xss(req.body.newPassword).trim()
        );
        if (updatePW) {
            res.status(200).json({ changePassword: true });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error });
    }
});
// update user Info
router.put('/:userId', async (req, res) => {
    let userInfo = req.body;
    // check format
    try {
        verify.isString(req.params.userId, 'User ID');
        verify.isString(userInfo.username, 'username');
        verify.isString(userInfo.email, 'email');
        verify.isString(userInfo.avatar, 'avatar');
        verify.checkSpace(req.params.userId, 'User ID');
        verify.checkUsername(userInfo.username);
        verify.checkEmail(userInfo.email);
        verify.checkSpace(userInfo.avatar, 'avatar');
    } catch (error) {
        res.status(400).json({ message: error });
        return;
    }
    // update
    try {
        const updateUser = await userData.updateUser(
            req.params.userId.trim(),
            xss(req.body.username).trim(),
            xss(req.body.email).toLowerCase().trim(),
            xss(req.body.avatar).trim()
        );
        res.status(200).json(updateUser);
    } catch (error) {
        res.status(500).json({ message: error });
    }
});



module.exports = router;
