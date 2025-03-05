const Perfume = require('../models/perfume.model')
const Brand = require('../models/brand.model')
const mongoose = require('mongoose')
const { json } = require('express')
const getPerfumePage = async (req, res) => {
  const user = req.cookies.user
  const searchPerfumeName = req.query.searchPerfumeName || ""
  const searchBrand = req.query.searchBrand || ""
  const brandData = await Brand.find({})
  const conditions = [];

  if (searchPerfumeName) {
    conditions.push({ perfumeName: { $regex: searchPerfumeName, $options: "i" } });
  }

  if (searchBrand && mongoose.isValidObjectId(searchBrand)) {
    conditions.push({ brand: new mongoose.Types.ObjectId(String(searchBrand)) });
  }

  Perfume.find(conditions.length > 0 ? { $and: conditions } : {}).populate("brand")
    .then(perfumes => {
      res.render("perfumes/perfumes", {
        title: "Perfumes",
        perfumes: perfumes,
        brands: brandData ? brandData : [],
        user: user ? JSON.parse(user) : null
      });
    })
    .catch(err => {
      res.render("perfumes/perfumes", {
        title: "Perfume", error: err,
        brands: brandData ? brandData : [],
        user: user ? JSON.parse(user) : null,
        perfumes: []
      });
    });
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
    targetAudience: req.body.targetAudience,
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
    res.redirect('/perfumes')
  } catch (err) {
    const brandData = await Brand.find({});

    res.render("perfumes/addPerfume", {
      title: "Add Perfume",
      error: err,
      brands: brandData
    });
  }
}

const getPerfumeDetail = async (req, res) => {
  const perfume = await Perfume.findById(req.params.id).populate('comment.author', 'name').populate("brand")
  const user = req.cookies.user ? JSON.parse(req.cookies.user) : null
  if (!perfume) {
    return res.status(404).send("Perfume not found")
  }
  res.render("perfumes/perfumeDetail", {
    title: "Perfume Detail",
    perfume: perfume,
    user: user,
    error: null
  })
}

const updatePerfume = async (req, res) => {
  const perfumeId = req.params.id;
  const updateData = {
    perfumeName: req.body.perfumeName,
    uri: req.body.uri,
    price: Number(req.body.price),
    volume: Number(req.body.volume),
    concentration: req.body.concentration,
    description: req.body.description,
    ingredients: req.body.ingredients,
    targetAudience: req.body.targetAudience,
    brand: req.body.brand,
  };

  try {
    const updatedPerfume = await Perfume.findByIdAndUpdate(perfumeId, updateData, { new: true })

    if (!updatedPerfume) {
      return res.status(404).json({ success: false, error: "Perfume not found" })
    }

    res.json({ success: true, perfume: updatedPerfume });
  } catch (err) {
    res.status(500).json({ success: false, error: "Error updating perfume" })
  }
};


const getUpdatePerfumePage = async (req, res) => {
  const perfumeId = req.params.id;
  try {
    const perfume = await Perfume.findById(perfumeId).populate("brand")
    if (!perfume) {
      return res.status(404).render("perfumes/updatePerfume", {
        title: "Edit Perfume",
        error: "Perfume not found",
        brands: await Brand.find({}),
        perfume: null
      });
    }

    res.render("perfumes/updatePerfume", {
      title: "Edit Perfume",
      error: null,
      brands: await Brand.find({}),
      perfume: perfume
    });
  } catch (err) {
    res.status(500).render("perfumes/updatePerfume", {
      title: "Edit Perfume",
      error: "An error occurred while updating the perfume.",
      brands: await Brand.find({}),
      perfume: null
    });
  }
}

const addComment = async (req, res) => {
  const memberId = JSON.parse(req.cookies.user).id

  if (!memberId) {
    return res.status(401).send("Unauthorized")
  }
  const data = {
    content: req.body.content,
    rating: Number(req.body.rating),
    author: memberId
  }
  try {
    const perfume = await Perfume.findById(req.params.id).populate("brand")
    if (!perfume) {
      return res.status(404).send("Perfume not found")
    }
    const comment = perfume.comment
    if (comment.some(c => c.author.toString() === memberId)) {
      return res.render("perfumes/perfumeDetail", {
        title: "Perfume Detail",
        perfume: perfume,
        error: "You have already commented"
      })
    }
    perfume.comment.push(data)
    await perfume.save()
    res.redirect(`/perfumes/${req.params.id}`)
  } catch (err) {
    res.status(500).send(err)
  }
}

const deleteComment = async (req, res) => {
  const memberId = JSON.parse(req.cookies.user).id
  if (!memberId) {
    return res.status(401).send("Unauthorized")
  }
  try {
    const perfume = await Perfume.findById(req.params.id)
    if (!perfume) {
      return res.status(404).send("Perfume not found")
    }
    const comment = perfume.comment.id(req.query.commentId)
    if (!comment) {
      return res.status(404).send("Comment not found")
    }
    if (comment.author.toString() !== memberId) {
      return res.status(401).send("Unauthorized")
    }
    await Perfume.updateOne(
      { _id: req.params.id },
      { $pull: { comment: { _id: req.query.commentId } } }
    )
    res.redirect(`/perfumes/${req.params.id}`)
  } catch (err) {
    res.status(500).send(err)
  }
}

const deletePerfume = async (req, res) => {
  const perfumeId = req.params.id;
  try {
    const perfume = await Perfume.findByIdAndDelete(perfumeId)
    if (!perfume) {
      return res.render("perfumes/perfumes", {
        title: "Perfumes",
        error: "Perfume not found"
      });
    }
    res.json({ success: true })
  }
  catch (err) {
    res.send(json({ success: false, error: err }))
  }
}

module.exports = {
  getPerfumePage,
  getAddPerfumePage,
  addPerfume,
  getPerfumeDetail,
  addComment,
  deleteComment,
  deletePerfume,
  updatePerfume,
  getUpdatePerfumePage
}