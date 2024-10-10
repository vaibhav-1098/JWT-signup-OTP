const nodemailer = require('nodemailer');

// Create the function to send an email
const sendEmail = async (to, subject, html) => {
  try {
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER, // gmail id
        pass: process.env.GMAIL_PASS, // https://myaccount.google.com/apppasswords
      },
    });

    let mailOptions = {
      from: process.env.GMAIL_USER,
      to: to,
      subject: subject,
      html: html,
    };

    // Send the email
    let info = await transporter.sendMail(mailOptions);
    console.log('Email sent to: ', to);

  } catch (error) {
    console.error('Error sending email: ', error);
  }
};

module.exports = sendEmail;
