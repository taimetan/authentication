import bcrypt from "bcrypt";
import crypto from "crypto";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { User } from "../models/user.model.js";
import { sendVerificationEmail, sendWelcomeEmail, sendResetPasswordSuccess, sendPasswordResetEmail } from "../mail/email.service.js";

const saltRounds = 10;
const VERIFICATION_TOKEN_EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24 hours
const PASSWORD_RESET_TOKEN_EXPIRATION_TIME = 1 * 60 * 60 * 1000; // 1 hour

export const signup = async (req, res) => {
    try {
        const { email, password, lastName, firstName } = req.body;
        // Validate required fields
        if (!email || !password || !lastName || !firstName) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        // Check password length
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long"
            });
        }
        // Check if user already exists
        const userAlreadyExist = await User.findOne({ email });
        if (userAlreadyExist) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        // Create verification token
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        // Create new user
        const newUser = new User(
            {
                email,
                password: hashedPassword,
                displayName: `${lastName} ${firstName}`,
                verificationToken,
                verificationTokenExpires: Date.now() + VERIFICATION_TOKEN_EXPIRATION_TIME, // 1 hour
            }
        );
        // Save user to database
        await newUser.save();
        // Generate token and set cookie
        generateTokenAndSetCookie(res, newUser._id);
        // Send verification email logic can be added here
        await sendVerificationEmail(newUser.email, verificationToken);
        // Respond with success
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                ...newUser._doc,
                password: undefined,
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error registering user",
            error,
        });
    }
};

export const verifyEmail = async (req, res) => {
    try {
        // Verify the email using the code provided
        const { code } = req.body;
        // Find user with the matching verification token and check if it's not expired
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpires: { $gt: Date.now() }
        });
        // If no user found, return error
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired verification code"
            });
        }
        // Mark user as verified
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        // Save the updated user
        await user.save();
        // Welcome email can be sent here
        await sendWelcomeEmail(user.email, user.displayName);
        // Respond with success
        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user: {
                ...user._doc,
                password: undefined,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error verifying email",
            error
        });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        // Check if password matches
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid password"
            });
        }
        // Generate token and set cookie
        generateTokenAndSetCookie(res, user._id);
        // Update last login time
        user.lastLogin = new Date();
        // Save the updated user
        await user.save();
        // Respond with success
        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                ...user._doc,
                password: undefined,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error logging in",
            error
        });
    }
};

export const logout = async (req, res) => {
    // Logout functionality can be implemented here if needed
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,        // bật nếu dùng https
        sameSite: "strict"   // hoặc "lax" tùy FE
    });
    res.status(200).json({
        success: true,
        message: "Logout successful"
    });
}

export const forgotPassword = async (req, res) => {
    // Forgot password functionality can be implemented here
    try {
        const { email } = req.body;
        // Find user by email
        const user = await User.findOne({ email });
        // Check if user exists
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        // Generate password reset token and send email logic can be added here
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpires = Date.now() + PASSWORD_RESET_TOKEN_EXPIRATION_TIME; // 1 hour
        // Save reset token and expiration to user
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpires;
        // Save the updated user
        await user.save();
        // Send password reset email
        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);
        // Respond with success
        res.status(200).json({
            success: true,
            message: "Password reset email sent"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error processing forgot password request",
            error
        });
    }
};

export const resetPassword = async (req, res) => {
    // Reset password functionality can be implemented here
    try {
        const { token } = req.params;
        const { newPassword, confirmPassword } = req.body;
        // Find user by reset token and check if it's not expired
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });
        // If no user found, return error
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired password reset token"
            });
        }
        // Check if new password and confirm password match
        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            });
        }
        // Hash new password
        const hashedPassword = await bcrypt.hash(confirmPassword, saltRounds);
        // Update user's password and clear reset token fields
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        // Save the updated user
        await user.save();
        // Optionally, send a confirmation email about password change
        await sendResetPasswordSuccess(user.email);
        // Respond with success
        res.status(200).json({
            success: true,
            message: "Password reset successful"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error resetting password",
            error
        });
    }
}

export const checkAuth = async (req, res) => {
    try {
        // Get user ID from the request object
        const userId = req.userId;
        const user = await User.findById(userId).select('-password');
        // If no user found, return error
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        // Respond with user data
        res.status(200).json({
            success: true,
            user: {
                ...user._doc,
                password: undefined,
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error checking authentication",
            error
        });
    }
}