const jwt = require("jsonwebtoken");
const config = require("config");

const readToken = (req) => {
  const header = req.header("authorization") || "";
  if (header.startsWith("Bearer ")) return header.slice(7);
  return req.header("x-auth-token");
};

module.exports = function auth(req, res, next) {
  const token = readToken(req);
  if (!token) {
    return res.status(401).json({ message: "Please log in to continue." });
  }
  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Your session has expired. Please log in again." });
  }
};
