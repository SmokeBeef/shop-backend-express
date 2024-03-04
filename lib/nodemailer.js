const nodemailer = require('nodemailer')

exports.transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "e6609f5cd289bf",
        pass: "752bee4b582b62"
    }
});