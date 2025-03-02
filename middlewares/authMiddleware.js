const jwt = require("jsonwebtoken");
const Member = require("../models/member.model");

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token; // Lấy token từ cookie
  if (!token) {
    return res.status(401).render("error", {
      title: "Unauthorized",
      msg: "Please log in to access this page.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Member.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).render("error", {
        title: "Unauthorized",
        msg: "User not found.",
      });
    }

    req.user = user; // Gán user vào request
    next();
  } catch (error) {
    return res.status(401).render("error", {
      title: "Unauthorized",
      msg: "Invalid token.",
    });
  }
};

module.exports = authMiddleware
