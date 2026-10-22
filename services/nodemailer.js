const nodemailer = require("nodemailer");
const settings = require("../config/settings");

let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: settings.smtp.service,
      auth: { user: settings.smtp.user, pass: settings.smtp.pass },
    });
  }
  return transporter;
};

// Resolves once the mail server accepts the message and rejects if it doesn't,
// so the caller can tell the user the code was not sent.
const sendVerificationCode = async (email, code) => {
  await getTransporter().sendMail({
    from: `"Mingle" <${settings.smtp.user}>`,
    to: email,
    subject: `${code} is your Mingle verification code`,
    text: `Welcome to Mingle!\n\nYour verification code is ${code}. It expires in 15 minutes.\n\nIf you didn't try to sign up, you can ignore this email.`,
    html: `<div style="font-family:system-ui,sans-serif;max-width:420px;margin:auto;padding:24px">
      <h2 style="color:#5b3df5;margin:0 0 12px">Welcome to Mingle</h2>
      <p>Your verification code is:</p>
      <p style="font-size:32px;letter-spacing:8px;font-weight:700;margin:16px 0">${code}</p>
      <p style="color:#666">It expires in 15 minutes. If you didn't try to sign up, you can ignore this email.</p>
    </div>`,
  });
};

module.exports = { sendVerificationCode };
