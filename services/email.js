const sg = require("@sendgrid/mail");
const dotenv = require('dotenv');
dotenv.config();

sg.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendForgotMail = (mail, token) => {
    const msg = {
        to: mail,
        from: 'darreniyer06@gmail.com',
        subject: 'Password Reset',
        text: 'Follow this link to reset your password : http://localhost:3000/auth/resetpass?token=' + token
    }

    sg.send(msg).then(() => {
        console.log('Mail Sent');
    }).catch(err => {
        console.log(err);
    })
}