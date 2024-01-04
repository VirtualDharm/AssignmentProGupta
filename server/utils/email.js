const nodemailer = require('nodemailer');

const sendEmail = async (recipientEmail, message) => {
  // Create a nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'mdharm4air.fm@gmail.com',
      pass: 'my-password',
    },
  });

  // Define email options
  const mailOptions = {
    from: 'mdharm4air.fm@gmail.com',
    to: recipientEmail,
    subject: 'Form Submission Confirmation',
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${recipientEmail}`);
  } catch (error) {
    console.error(`Error sending email: ${error}`);
  }
};

module.exports = {
  sendEmail,
};
