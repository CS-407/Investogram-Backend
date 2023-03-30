const sg = require("@sendgrid/mail");
const dotenv = require('dotenv');
dotenv.config();

sg.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendForgotMail = (mail, reset_token) => {
    const msg = {
        to: mail,
        from: 'darreniyer06@gmail.com',
        subject: 'Password Reset',
        text: 'Your reset token is ' + reset_token
    }

    sg.send(msg).then(() => {
        console.log('Mail Sent');
    }).catch(err => {
        console.log(err);
    })
}