const verifyUser = (req, res, next) => {
  const user = req.cookies.user;

  if (!user) {
    res.locals.user = null;
    return next();
  }

  try {
    res.locals.user = user; // Lưu thông tin user vào request
  } catch (err) {
    console.log("❌ Invalid JWT:", err.message);
    res.locals.user = null;
  }

  next();
};

module.exports = verifyUser;
