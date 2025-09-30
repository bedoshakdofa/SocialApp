const nodemailer = require("nodemailer");
const pug = require("pug");
const htmlToText = require("html-to-text");

class SendEmail {
    constructor(url, user) {
        this.url = url;
        this.to = user.email;
        this.name = user.firstName;
    }

    Transporter() {
        return nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }

    Send(subject, tempalte) {
        const html = pug.renderFile(`${__dirname}/../views/${tempalte}.pug`, {
            url: this.url,
            name: this.name,
            subject,
        });

        const mailOption = {
            from: process.env.EMAIL,
            to: this.to,
            subject,
            html,
            text: htmlToText.htmlToText(html),
        };

        this.Transporter().sendMail(mailOption);
    }
}
module.exports = SendEmail;
