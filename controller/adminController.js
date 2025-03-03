const Member = require('../models/member.model')

const getAllMembers = async (req, res) => {
  try {
    const members = await Member.find({}).select("-password");
    res.render("admin/collectors", { title: "Members", members: members, error: null });
  } catch (err) {
    res.render("admin/collectors", { title: "Members", members: [], error: err });
  }
}

module.exports = { getAllMembers }