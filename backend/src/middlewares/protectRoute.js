import jwt from 'jsonwebtoken';

export const protectRoute = (req, res, next) => {
    try {
        // Check for token in headers
        // const token = req.headers.authorization.split(' ')[1];
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized access. No token provided.'
            });
        }
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Check if token is valid
        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized access. Invalid token.'
            });
        }
        // Token is valid, proceed to next middleware or route handler
        req.userId = decoded.userId; // Attach decoded user info to request objectc
        console.log('Decoded Token:', decoded, 'UserID:', req.userId);
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized access. ' + error.message
        });
    }
}