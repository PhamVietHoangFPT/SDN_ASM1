const verifyUser = (req, res, next) => {
  const user = req.cookies.user // Lấy thông tin user từ cookie

  if (!user) {
    res.locals.user = null
    return next()
  }

  try {
    res.locals.user = JSON.parse(user) // Lưu thông tin user vào request
  } catch (err) {
    res.locals.user = null
  }

  next()
}

module.exports = verifyUser
