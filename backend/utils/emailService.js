const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendEmail = async (to, subject, text) => {
  await transporter.sendMail({
    from: `"College RPM System" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });
};
