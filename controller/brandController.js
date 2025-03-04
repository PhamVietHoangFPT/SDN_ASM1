const Brand = require('../models/brand.model')
const Perfume = require('../models/perfume.model')
const getBrandPage = (req, res) => {
  const user = req.cookies.user
  if (user) {
    Brand.find({})
      .then(brands => {
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

const deleteBrand = async (req, res) => {
  const brandId = req.params.brandId;

  try {
    // Kiểm tra xem brandId có đang được sử dụng trong Perfume không
    const perfumeExists = await Perfume.findOne({ brand: brandId });

    if (perfumeExists) {
      return res.status(400).json({
        success: false,
        error: `Cannot delete this brand because it is being used in perfume ${perfumeExists.perfumeName}`,
      });
    }

    // Nếu không có nước hoa nào sử dụng brand, tiến hành xóa
    const brand = await Brand.findByIdAndDelete(brandId);

    if (!brand) {
      return res.status(404).json({
        success: false,
        error: "Brand not found",
      });
    }

    res.json({ success: true, message: "Brand deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


module.exports = { getBrandPage, getAddBrandPage, addBrand, deleteBrand }