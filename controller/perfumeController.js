const Perfume = require('../models/perfume.model')
const Brand = require('../models/brand.model')
const getPerfumePage = (req, res) => {
  const user = req.cookies.user
  if (user) {
    Perfume.find({})
      .then(perfumes => {
        res.render("perfumes/perfumes", {
          title: "Perfumes",
          perfumes: perfumes,
          user: JSON.parse(user)
        });
      })
      .catch(err => {
        res.render("perfumes/perfumes", { title: "Perfume", error: err });
      });
  } else {
    Perfume.find({})
      .then(perfumes => {
        res.render("perfumes/perfumes", {
          title: "Perfumes",
          perfumes: perfumes,
          user: null
        });
      })
      .catch(err => {
        res.render("perfumes/perfumes", { title: "Perfume", error: err });
      });
  }

}

const getAddPerfumePage = async (req, res) => {
  const brandData = await Brand.find({})
  if (brandData) {
    res.render("perfumes/addPerfume", {
      title: "Add Perfume",
      error: null,
      brands: brandData
    });
  } else {
    res.render("perfumes/addPerfume", {
      title: "Add Perfume",
      error: "Brand not found"
    });
  }
}

const addPerfume = async (req, res) => {
  const data = {
    perfumeName: req.body.perfumeName,
    uri: req.body.uri,
    price: Number(req.body.price),
    concentration: req.body.concentration,
    description: req.body.description,
    ingredients: req.body.ingredients,
    volume: Number(req.body.volume),
    targetAudience: req.body.targetAudience === "true",
    brand: req.body.brand
  }
  try {
    let perfume = await Perfume.findOne({ perfumeName: data.perfumeName })
    if (perfume) {
      return res.render("perfumes/addPerfume", {
        title: "Add Perfume",
        error: "Perfume already exists",
        brands: await Brand.find({})
      });
    }
    const newPerfume = new Perfume(data)
    await newPerfume.save()
    res.redirect('/perfumes/add')
  } catch (err) {
    const brandData = await Brand.find({});

    res.render("perfumes/addPerfume", {
      title: "Add Perfume",
      error: err,
      brands: brandData,  // ✅ Truyền brands vào template
    });
  }
}

module.exports = { getPerfumePage, getAddPerfumePage, addPerfume }