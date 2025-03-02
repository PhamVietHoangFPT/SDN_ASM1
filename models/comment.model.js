const mongoose = require('mongoose')
const Schema = mongoose.Schema
commentSchema = new Schema({
  rating: {
    type: Number,
    min: 1,
    max: 3,
    require: true
  },
  content: {
    type: String,
    require: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Members",
    require: true
  }
}, { timestamps: true }
)

const Comment = mongoose.model('Comments', commentSchema)
module.exports = Comment