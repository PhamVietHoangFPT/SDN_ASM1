const Brand = require('../models/brand.model')

const getBrandPage = (req, res) => {
  const user = req.cookies.user
  if (user) {
    Brand.find({})
      .then(brands => {
        console.log("Brands data:", brands)
        res.render("brands/brands", {
          title: "Brands",
          brands: brands,
          user: JSON.parse(user)
        });
      })
      .catch(err => {
        res.render("brands/brands", { title: "Brand", error: err });
      });
  } else {
    Brand.find({})
      .then(brands => {
        res.render("brands/brands", {
          title: "Brands",
          brands: brands,
          user: null
        });
      })
      .catch(err => {
        res.render("brands/brands", { title: "Brand", error: err });
      });
  }

}

const getAddBrandPage = async (req, res) => {
  res.render("brands/addBrand", { title: "Add Brand", error: null });
}

const addBrand = async (req, res) => {
  const { brandName } = req.body;
  try {
    let brand = await Brand.findOne({ brandName })
    if (brand) {
      return res.render("brands/addBrand", {
        title: "Add Brand",
        error: "Brand already exists",
      });
    }
    const newBrand = new Brand({ brandName });
    await newBrand.save();
    res.redirect('/brands')
  }
  catch (err) {
    res.render("brands/addBrand", { title: "Add Brand", error: "Server error" });
  }
}

module.exports = { getBrandPage, getAddBrandPage, addBrand }