
import {
    VERIFICATION_EMAIL_TEMPLATE,
    PASSWORD_RESET_REQUEST_TEMPLATE,
    PASSWORD_RESET_SUCCESS_TEMPLATE
} from "./emailTemplate.js";

import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true nếu port 465
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const mailSender = {
    from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM}>`,
};


export const sendVerificationEmail = async (email, verification) => {
    try {
        await transporter.sendMail({
            ...mailSender,
            to: email,
            subject: "Email Verification",
            html: VERIFICATION_EMAIL_TEMPLATE.replace(
                "{verificationCode}",
                verification
            ),
        });

        console.log("Verification email sent");
    } catch (error) {
        console.error(error);
        throw new Error("Failed to send verification email");
    }
};

export const sendWelcomeEmail = async (email, displayName) => {
  try {
    await transporter.sendMail({
      ...mailSender,
      to: email,
      subject: "Welcome to our app 🎉",
      html: `
        <h2>Hello ${displayName}</h2>
        <p>Welcome to our application!</p>
      `,
    });

    console.log("Welcome email sent");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to send welcome email");
  }
};


export const sendPasswordResetEmail = async (email, resetLink) => {
  try {
    await transporter.sendMail({
      ...mailSender,
      to: email,
      subject: "Password Reset Request",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace(
        "{resetURL}",
        resetLink
      ),
    });

    console.log("Password reset email sent");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to send password reset email");
  }
};


export const sendResetPasswordSuccess = async (email) => {
  try {
    await transporter.sendMail({
      ...mailSender,
      to: email,
      subject: "Password Changed Successfully",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
    });

    console.log("Password change confirmation email sent");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to send confirmation email");
  }
};
