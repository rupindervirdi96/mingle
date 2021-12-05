const nodemailer = require("nodemailer");

const sendEmail = async (email, secretCode) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "singhtest57@gmail.com",
        pass: "zxhbk546",
      },
      tls: { rejectUnauthorized: false },
    });

    const mailOptions = {
      from: "singhtest57@gmail.com",
      to: email,
      subject: "We sent you the key to complete the signup process.",
      text: secretCode,
    };

    try {
      await transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          return error.message;
        } else {
          return info;
        }
      });
    } catch (error) {
      return error;
    }

    return true;
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = sendEmail;
