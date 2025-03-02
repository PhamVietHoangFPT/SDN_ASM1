const mongoose = require('mongoose')
const Schema = mongoose.Schema

const brandSchema = new Schema(
  {
    brandName: {
      type: String,
      required: true
    },
  },
  { timestamps: true }
)

const Brand = mongoose.model('Brands', brandSchema)
module.exports = Brand
