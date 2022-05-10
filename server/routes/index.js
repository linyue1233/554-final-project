const userRoutes = require('./users');
const videoRoutes = require('./videos');
const commentRoutes = require('./comments');
const chatroomRoutes = require('./chatroom');
const constructorMethod = (app) => {
    app.use('/users', userRoutes);
    app.use('/videos', videoRoutes);
    app.use('/comments', commentRoutes);
    app.use('/chatroom',chatroomRoutes)
    app.use('*', (req, res) => {
        res.status(404).json({ error: 'path not found' });
    });
};
module.exports = constructorMethod;
