const nodemailer = require('nodemailer');
const { host, port, secure, user, pass, from } = require('../../config/email');

const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
        user,
        pass
    }
});

const sendEmail = async ({ to, subject, html }) => {
    const mailOptions = {
        from,
        to,
        subject,
        html
    };

    return transporter.sendMail(mailOptions);
};

module.exports = {
    send: sendEmail,
    client: nodemailer
};
