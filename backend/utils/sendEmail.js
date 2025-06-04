const nodeMailer = require("nodemailer");

const sendEmail = async (email, subject, link) => {
    try {
        const transporter = nodeMailer.createTransport({
            service: "Gmail",
            auth:{
                user:process.env.EMAIL_USER,
                pass:process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email, subject, 
            html: `<p>Click the link to verify your email:</p><a href="${link}">${link}</a>`,
        });
    } catch (error) {
         console.error("❌ Email failed:", error.message);
    }
}

module.exports = sendEmail;