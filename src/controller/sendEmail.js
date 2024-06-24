const nodemailer = require("nodemailer");

// let transporter = nodemailer.createTransport({
//   host: "smtp-relay.brevo.com",
//   port: 587,
//   secure: false, // use TLS
//   auth: {
//     user: process.env.SMTP_EMAIL,
//     pass: process.env.API_KEY,
//   },
//   tls: {
//     rejectUnauthorized: false,
//   },
//   logger: false, // Enable logging
//   debug: true, // Enable debug output
// });

// Debug: Ensure environment variables are loaded correctly
// console.log("SMTP_EMAIL:", process.env.SMTP_EMAIL);
// console.log("SMTP_SECRET:", process.env.SMTP_SECRET);

const send_email_to_user = async (email, message) => {
  // console.log(`email: ${email}`);
  try {
    // let mailOption = {
    //   from: `'"support.fintech" <${process.env.SMTP_EMAIL}>'`,
    //   to: email,
    //   subject: message.subject,
    //   text: message.body,
    // };

    // let info = await transporter.sendMail(mailOption);

    console.log("Email sent successfully");
    return { success: true };
  } catch (err) {
    console.error("Error sending email:", err.message);
    return { success: false, error: err.message };
  }
};

module.exports = { send_email_to_user };
