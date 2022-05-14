const nodemailer = require("nodemailer");
const redis = require('./redisUtil');

const transport = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port:587,
    auth: {
        user: 'benchmoon123@gmail.com',
        pass: 'benchMoon@@123'
    }
});

const createSixNum = () => {
    var code = "";
    for(var i = 0; i<6;i++) {
        code += Math.floor(Math.random() * 10);
    }
    return code;
}


const sendPasswordResetEmail = async (toEmail,username) => {
    let code = createSixNum();
    let message = {
      from: "benchmoon123@gmail.com",
      to: toEmail,
      subject: "Forgot Password Request",
      html: `<body style="font-family: menlo; color: #00004d">
      <center>
      <h1>Hey ${username}! Your password reset link is here! </h1>
      <hr>
        We received a request from your end for resetting your password.
            If you did trigger this email, you can go to this <a target="_blank" href="http://cs554.ggsddup.xyz/user/resetPassword/${toEmail}">link</a> to reset your password with the code: ${code}. 
            In case this was not done by you, you can safely ignore this email. 
            <br> We wish you a great day!
        <br>
        <br>
        <p>P.S: This is the link: http://cs554.ggsddup.xyz/user/resetPassword/${toEmail} - if you're having trouble, just copy-paste it into the URL of your browser.
        Also, this link is meant for your hands only - <strong>DO NOT</strong> share it with anyone.
    </body>`,
    };
  
    let result = await transport.sendMail(message).then(
      (success) => {
        console.log("Forgot Password mail sent successfully!");
        // store token in redis for 30m
        let userKey = toEmail + "code";
        redis.setExpire(userKey,code,60*30);
        return true;
      },
      (failure) => {
        console.log("Forgot Password mail couldn't be sent!");
        return false;
      }
    );
    return result;
  };

  module.exports = {
    sendPasswordResetEmail,
  };