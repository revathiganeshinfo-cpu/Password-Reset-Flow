const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


const sendResetEmail = async (toEmail, resetLink, userName) => {
  const expiryMinutes = process.env.RESET_TOKEN_EXPIRY || 15;

  const mailOptions = {
    from: `"Password Reset" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "🔐 Password Reset Request",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; 
                  padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #4A90E2;">Password Reset Request</h2>
        <p>Hello <strong>${userName}</strong>,</p>
        <p>Click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" 
             style="background-color: #4A90E2; color: white; padding: 14px 28px; 
                    text-decoration: none; border-radius: 6px; font-size: 16px;">
            Reset My Password
          </a>
        </div>
        <p style="color: #888;">⏰ This link expires in <strong>${expiryMinutes} minutes</strong>.</p>
        <p style="color: #888;">If you did not request this, please ignore this email.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendResetEmail };