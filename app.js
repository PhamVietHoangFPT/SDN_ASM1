var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
const mongoose = require('mongoose')
require('dotenv').config()
const verifyUser = require('./middlewares/vertifyUser')
var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')

var app = express()
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(" MongoDB connected successfully!");
  } catch (error) {
    console.error(" MongoDB connection failed:", error);
    process.exit(1);
  }
};
connectDB();

// Cấu hình EJS
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, "public")))

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// Truyền thông tin user vào res.locals để sử dụng trong UI
// app.use((req, res, next) => {
//   res.locals.user = req.cookies.token || null;
//   next();
// });

app.use(verifyUser)

app.use('/', indexRouter)
app.use('/users', usersRouter)

const authRouter = require('./routes/authRoutes')
const memberRouter = require('./routes/memberRoutes')
const perfumeRouter = require('./routes/perfumeRoutes')
const brandRouter = require('./routes/brandRoutes')
const adminRouter = require('./routes/adminRoutes')

app.use('/auth', authRouter)
app.use('/members', memberRouter)
app.use('/perfumes', perfumeRouter)
app.use('/brands', brandRouter)
app.use('/admin', adminRouter)

app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  res
    .status(404)
    .render("error", { title: "Page Not Found", msg: "Page not found" });
});

// Status 500
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .render("error", { title: "Error", msg: "Internal Server Error" });
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
