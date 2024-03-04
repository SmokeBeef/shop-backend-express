const { transport } = require("../lib/nodemailer")

exports.sendMail = async () => {
    await transport.sendMail({
        from: '"Shoppify 👻" <maddison53@ethereal.email>', // sender address
        to: "bar@example.com", // list of receivers
        subject: "Verified Account Login", // Subject line
        text: "Verified Account Login", // plain text body
        html: "<b> Verified account </b>", // html body
    })
} 