const checkRole = (requiredRole) => {
  return (req, res, next) => {
    const user = JSON.parse(req.cookies.user);
    if (!user) {
      return res.redirect('/login');
    }
    if (user.isAdmin !== requiredRole) {
      return res.send('No permission');
    }
    next();
  };
};

module.exports = checkRole;