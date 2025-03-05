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

    res.json({ success: true, message: "Brand deleted successfully" })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

const getUpdateBrandPage = async (req, res) => {
  const brandId = req.params.brandId
  console.log(brandId)
  const brand = await Brand.findById(brandId)
  if (!brand) {
    return res.status(404).json({ success: false, error: "Brand not found" })
  }
  res.render("brands/updateBrand", { title: "Update Brand", brand: brand, error: null })
}

const updateBrand = async (req, res) => {
  const id = req.params.brandId
  const { brandName } = req.body

  try {
    // Kiểm tra xem brand có tồn tại không
    const existingBrand = await Brand.findById(id)
    if (!existingBrand) {
      return res.status(404).json({ success: false, error: "Brand not found" })
    }

    // Cập nhật thương hiệu
    const updatedBrand = await Brand.findByIdAndUpdate(
      id,
      { brandName },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, message: "Brand updated successfully", brand: updatedBrand })
  } catch (error) {
    console.error("Update Brand Error:", error)
    res.status(500).json({ success: false, error: "Error updating brand" })
  }
};


module.exports = {
  getBrandPage,
  getAddBrandPage,
  addBrand,
  deleteBrand,
  getUpdateBrandPage,
  updateBrand
}