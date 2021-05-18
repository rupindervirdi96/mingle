const nodemailer = require("nodemailer");

const sendEmail = async () => {
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
      to: "virdi.rocking_96@outlook.com",
      subject: "Report Issue",
      text: "Hello",
    };

    await transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log(info);
      }
    });

    return true;
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = sendEmail;
