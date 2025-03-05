const checkRole = (requiredRole) => {
  return (req, res, next) => {
    const user = req.cookies.user ? JSON.parse(req.cookies.user) : null;

    if (!user) {
      return res.redirect('/login');
    }
    if (user.isAdmin !== requiredRole) {
      return res.status(403).render("no-permission");
    }
    next();
  };
};

module.exports = checkRole;
