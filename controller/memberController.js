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

module.exports = { getProfilePage, getEditProfilePage, editProfile, getEditPasswordPage }