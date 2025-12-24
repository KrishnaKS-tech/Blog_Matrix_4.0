// Import jsonwebtoken library for JWT verification
import jwt from "jsonwebtoken";

/**
 * 🔐 Authentication Middleware
 * Purpose:
 *  - Verifies JWT token sent from client
 *  - Extracts user ID from token
 *  - Protects private routes
 */
const authenticate = (req, res, next) => {
  // Get Authorization header from request
  // Expected format: "Bearer <token>"
  const authHeader = req.headers.authorization;

  // Extract token from header
  const token = authHeader && authHeader.split(" ")[1];

  // If token is missing, deny access
  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    // Verify token using secret key
    // SECRET_KEY must match the key used during login
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Attach user ID to request object
    // This allows protected routes to know who is making the request
    req.userId = decoded.id; // ✅ must match login JWT payload

    // Pass control to next middleware / route handler
    next();
  } catch (err) {
    // Token is invalid or expired
    return res.status(403).json({ message: "Invalid token" });
  }
};

// Export middleware to protect routes
export default authenticate;
