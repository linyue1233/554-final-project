const express = require('express');
const app = express();
const configRoutes = require('./routes');
const bodyParser = require('body-parser');
const session = require("express-session");
const cors = require('cors');

app.use(
    session({
      name: "AuthCookie",
      secret: "sacredword",
      resave: false,
      saveUninitialized: false,
    })
  );

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// sett corross
app.use(cors({credentials:true,origin:true}));
app.use(express.json());

configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});
