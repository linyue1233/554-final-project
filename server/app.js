const express = require('express');
const app = express();
const configRoutes = require('./routes');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
// const http = require('http').createServer(app);
const server = app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});
const io = require('socket.io')(server);

app.use(
    session({
        name: 'AuthCookie',
        secret: 'sacredword',
        resave: false,
        saveUninitialized: false,
    })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// sett corross
app.use(cors({ credentials: true, origin: true }));
app.use(express.json());

// socket
io.on('connection', (socket) => {
    console.log('new client connected', socket.id);

    let oroom;

    socket.on('user_join', (name, room) => {
        oroom = room;

        socket.join(room);
        socket.to(oroom).emit('user_join', name);
    });

    socket.on('message', ({ name, message }) => {
        console.log(name, message, socket.id);
        io.to(oroom).emit('message', { name, message });
    });

    socket.on('disconnect', () => {
        console.log('Disconnect Fired');
    });
});

configRoutes(app);

// app.listen(3000, () => {
//     console.log("We've now got a server!");
//     console.log('Your routes will be running on http://localhost:3000');
// });

// http.listen(3000, () => {
//     console.log(`listening on *:${3000}`);
// });
