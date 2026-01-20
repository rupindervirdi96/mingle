const nodemailer = require("nodemailer");

const sendEmail = async (email, secretCode) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "rupzvirdi.96@gmail.com",
        pass: "rgkr mssa lmuq wrud",
      },
      tls: { rejectUnauthorized: false },
    });

    const mailOptions = {
      from: `"Mingle" rupzvirdi.96@gmail.com`,
      to: email,
      subject: "We sent you the key to complete the signup process.",
      text: secretCode,
    };


    try {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Error: ", error.message);
        } else {
          console.log(info);
        }
      });
    } catch (error) {
      console.log(error);
    }

    return true;
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = sendEmail;
