const Member = require('../models/member.model')

// UI: Hiển thị trang đăng ký
const getRegisterPage = (req, res) => {
  res.render("auth/register", { title: "Register", error: null });
};

// Xử lý đăng ký (Lưu mật khẩu không băm)
const register = async (req, res) => {
  const { email, password, name, YOB, gender } = req.body;
  try {
    let member = await Member.findOne({ email });
    if (member) {
      return res.render("auth/register", {
        title: "Register",
        error: "User already exists",
      });
    }

    // Tạo user mới mà không băm mật khẩu
    const newMember = new Member({ email, password, name, YOB, gender });
    await newMember.save();

    res.redirect('/') // Chuyển hướng sau khi đăng ký thành công
  } catch (err) {
    res.render("auth/register", { title: "Register", error: "Server error" });
  }
};

// UI: Hiển thị trang đăng nhập
const getLoginPage = (req, res) => {
  res.render("auth/login", { title: "Login", error: null });
};

// Xử lý đăng nhập
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const member = await Member.findOne({ email });

    // Kiểm tra email và mật khẩu
    if (!member || member.password !== password) {
      return res.render("auth/login", {
        title: "Login",
        error: "Invalid credentials",
      });
    }
    // Tạo token
    const user = { id: member._id, email: member.email, isAdmin: member.isAdmin, name: member.name, YOB: member.YOB, gender: member.gender };
    res.cookie("user", JSON.stringify(user), { httpOnly: true, maxAge: 3600000 }) // Lưu token trong cookie

    // Nếu là admin, chuyển hướng đến /admin
    if (member.isAdmin) {
      return res.redirect("/admin");
    }

    // Nếu không phải admin, chuyển hướng về trang chủ
    res.redirect("/");
  } catch (err) {
    res.render("auth/login", { title: "Login", error: "Server error" });
  }
};

// Xử lý đăng xuất
const logout = (req, res) => {
  res.clearCookie("user");
  res.redirect("/auth/login");
};

module.exports = { getRegisterPage, register, getLoginPage, login, logout }