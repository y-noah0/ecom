import jwt from 'jsonwebtoken';

const auth = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            return res.status(401).json({ error: 'Authorization header missing' });
        }

        const token = authHeader.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Set user object correctly
        req.user = {
            id: decoded.id,    // This should match the userId in Order model
            role: decoded.role
        };
        
        next();
    } catch (error) {
        res.status(401).json({ error: 'Please authenticate' });
    }
};

export default auth;