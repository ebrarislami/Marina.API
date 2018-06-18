const nodemailer = require('nodemailer');

const mailOptions = (email, subject, html) => {
    let mailOption = {
        from: '"Marina" <support@marina.com>',
        to: email,
        subject: subject,
        html: html
    };
    return mailOption;
}

const transporter = (email) => {

    let transport = nodemailer.createTransport({
            service: 'SendGrid',
            // port: 587,
            // secure: false, // true for 465, false for other ports
            auth: {
                user: 'ebrarislami',
                pass: 'xxxxxxxxxxx'
            }
        });
    return transport;
};
  
module.exports = {
    transporter: transporter,
    mailOptions: mailOptions
}

