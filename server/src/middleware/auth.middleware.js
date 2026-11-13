const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Please login to continue" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.managerId = decoded.managerId;
    next();
  } catch (err) {
    res.status(401).json({ message: "Session expired, please login again" });
  }
};

module.exports = requireAuth;
