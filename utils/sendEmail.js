const { transport } = require("../lib/nodemailer")

exports.sendMail = async (email, name, id) => {
    transport.sendMail({
        from: `${process.env.APP_NAME} <${process.env.APP_EMAIL}>`, // sender address
        to: email, // list of receivers
        subject: "Verified Account Login", // Subject line
        text: "Verified Account Login", // plain text body
        html: generateEmail(name, id)
    })
}



function generateEmail(name, id) {
    return `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Verify Account</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    text-align: center;
                    padding: 20px;
                }
                h1 {
                    color: #333;
                }
                .btn {
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #007bff;
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                }
                .btn:active {
                  background: #002fff;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Account Verify</h1>
                <h2>${name}</h2>
                <p>From Shopify</p>
                <a href="${process.env.APP_URL + '/auth/verify/' + id}" class="btn">Verify Account</a>
            </div>
        </body>
    </html>
    `
}