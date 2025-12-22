import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY); // match key
    req.userId = decoded.id; // ✅ must match login JWT
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

export default authenticate;
