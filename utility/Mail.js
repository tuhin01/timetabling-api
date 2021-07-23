const nodemailer = require("nodemailer");

module.exports = async (subject, to, message) => {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
        },
    });
    console.log({to})
    try {
        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Support" <support@timetable.com>', // sender address
            to, // list of receivers
            subject, // Subject line
            html: message, // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    } catch (e) {
        return e;
    }
};
