// lib/mailer.ts
import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_FROM,       // Your email address
    pass: process.env.EMAIL_APP_PASS,   // App password (not regular Gmail password)
  },
});

export const sendResetEmail = async (to: string, token: string) => {
  const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: `"VideoUploader" <${process.env.EMAIL_FROM}>`,
    to,
    subject: 'Password Reset Request',
    html: `
      <h2>Reset Your Password</h2>
      <p>Click the button below to reset your password:</p>
      <a href="${resetLink}" style="
        background-color: #ef4444;
        color: white;
        padding: 10px 16px;
        border-radius: 6px;
        text-decoration: none;
      ">Reset Password</a>
      <p>If you didn’t request this, you can safely ignore this email.</p>
    `,
  });
};
