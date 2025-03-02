const mongoose = require('mongoose')
const Schema = mongoose.Schema

const memberSchema = new Schema(
  {
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    isAdmin: { type: Boolean, default: false },
    name: { type: String, require: true },
    YOB: { type: Number, require: true },
    gender: { type: Boolean, require: true }
  },
  { timestamps: true, }
);

const Member = mongoose.model('Members', memberSchema)
module.exports = Member