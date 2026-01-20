import jwt from "jsonwebtoken";

const JWT_EXPIRES_IN = '7d';
const MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

export const generateTokenAndSetCookie = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: MAX_AGE,
    });

    return token;
}