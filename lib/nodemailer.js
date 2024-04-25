const nodemailer = require('nodemailer')

exports.transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.APP_EMAIL,
        pass: process.env.APP_EMAIL_PASSWORD
    }
});