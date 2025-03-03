const Member = require('../models/member.model')

const getProfilePage = (req, res) => {
  res.render("members/profile", { title: "Profile", user: JSON.parse(req.cookies.user) });
}

const getEditProfilePage = async (req, res) => {
  const user = JSON.parse(req.cookies.user)
  res.render("members/editProfile", { title: "Update Profile", user: user });
}

const editProfile = async (req, res) => {
  try {
    const data = {
      email: req.body.email,
      name: req.body.name,
      YOB: req.body.YOB,
      gender: req.body.gender === "true"
    };
    const updatedMember = await Member.findOneAndUpdate(
      { email: data.email },
      { $set: data },
      { new: true }
    );

    if (!updatedMember) {
      return res.status(404).send("Member not found!");
    }

    res.cookie("user", JSON.stringify(updatedMember), { httpOnly: true, maxAge: 3600000 })

    res.render('members/profile', { title: "Profile", user: updatedMember });
  } catch (err) {
    res.status(500).send(err);
  }
};

const getEditPasswordPage = async (req, res) => {
  res.render("members/editPassword", { title: "Update Password", error: null });
}

const editPassword = async (req, res) => {
  const email = JSON.parse(req.cookies.user).email
  try {
    const { oldPassword, newPassword } = req.body
    const member = await Member.findOne({ email: email })
    if (!member) {
      return res.render("members/editPassword", { title: "Update Password", error: "Member not found" })
    }
    if (member.password !== oldPassword) {
      return res.render("members/editPassword", { title: "Update Password", error: "Old password is incorrect" })
    }
    const updatedMember = await Member
      .findOneAndUpdate({ email: email }, { $set: { password: newPassword } }, { new: true })
    if (!updatedMember) {
      return res.render("members/editPassword", { title: "Update Password", error: "Update password failed" })
    }
    res.cookie("user", JSON.stringify(updatedMember), { httpOnly: true, maxAge: 3600000 })
    res.render('members/profile', { title: "Profile", user: updatedMember });
  } catch (err) {
    res.status(500).send(err)
  }
}

module.exports = { getProfilePage, getEditProfilePage, editProfile, getEditPasswordPage, editPassword }