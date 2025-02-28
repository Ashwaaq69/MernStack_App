// const nodemailer = require("nodemailer");

// const sendEmail = async (data) => {
//     try {
//         let transporter = nodemailer.createTransport({
//             host: "smtp.gmail.com", // Replace with your email provider's SMTP server
//             port: 587,
//             secure: false, // True for 465, false for 587
//             auth: {
//                 user: process.env.MAIL_ID, // Use environment variable
//                 pass: process.env.MAIL_PASS, // Use environment variable
//             },
//         });

//         let info = await transporter.sendMail({
//             from: `"Your App Name" <${process.env.MAIL_ID}>`, // Sender email
//             to: data.to, // Recipient email
//             subject: data.subject, // Email subject
//             text: data.text, // Plain text body
//             html: data.html, // HTML body
//         });

//         console.log("Message sent: %s", info.messageId);
//         console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

//         return info;
//     } catch (error) {
//         console.error("Error sending email:", error);
//         throw new Error("Email sending failed");
//     }
// };

// module.exports = sendEmail;


const nodemailer = require("nodemailer");
require("dotenv").config(); // Ensure environment variables are loaded

const sendEmail = async (data) => {
    try {
        console.log("Sending email to:", data.to); // Debugging line

        let transporter = nodemailer.createTransport({
            service: "gmail", // Use "service" instead of "host" for Gmail
            auth: {
                user: process.env.MAIL_ID,
                pass: process.env.MAIL_PASS,
            },
        });

        let info = await transporter.sendMail({
            from: `"Your App" <${process.env.MAIL_ID}>`,
            to: data.to,
            subject: data.subject,
            text: data.text,
            html: data.html,
        });

        console.log("Message sent: %s", info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Email sending failed");
    }
};

module.exports = sendEmail;
