const userRoutes = require('./users');
const videoRoutes = require('./videos');

const constructorMethod = (app) => {
    app.use('/users', userRoutes);
    app.use('/videos', videoRoutes);

    app.use('*', (req, res) => {
        res.status(404).json({ error: 'path not found' });
    });
};
module.exports = constructorMethod;
