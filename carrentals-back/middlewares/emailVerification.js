var nodemailer = require('nodemailer');
var jwt = require('jsonwebtoken');
const { SECRET, MAIL_HOST, MAIL_PASS, MAIL_USER,API_URL } = require('../config.json');

var transporter = nodemailer.createTransport({
    service: MAIL_HOST,
    auth: {
        user: MAIL_USER,
        pass: MAIL_PASS
    }
})


module.exports = async (req, res, next) => {
    try {
        const { email } = req.body;
        const token = jwt.sign({ email }, SECRET, { expiresIn: '1h' });
        const mailOptions = {
            from: MAIL_USER,
            to: email,
            subject: 'Email Verification for Car Rental',
            html: `<h1>Click on the link to verify your email</h1><br><a href="${API_URL}/verify/${token}">Click here</a>`
        }

        await transporter.sendMail(mailOptions);
        next();
    } catch (error) {
        next(error);
    }
}
