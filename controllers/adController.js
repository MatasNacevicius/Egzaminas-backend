const asyncHandler = require('express-async-handler');
const Ad = require('../models/adModel');
const Category = require('../models/categoryModel');
const Comment = require('../models/commentModel');
const User = require('../models/userModel');

// Controller function to create a new ad
// Route: POST /api/ads
const createAd = asyncHandler(async (req, res) => {
  const { name, category, price, description, images } = req.body;

  const categoryObj = await Category.findOne({ name: category });

  if (!categoryObj) {
    res.status(400);
    throw new Error('Category not found');
  }

  const ad = await Ad.create({
    name,
    category: categoryObj._id,
    price,
    description,
    user: req.user._id,
    images,
  });

  res.status(201).json(ad);
});

// Controller function to delete an ad
// Route: DELETE /api/ads/:id
const deleteAd = asyncHandler(async (req, res) => {
  const adId = req.params.id;

  const ad = await Ad.findById(adId);

  if (!ad) {
    res.status(404);
    throw new Error('Ad not found');
  }

  try {
    await Comment.deleteMany({ ad: adId });

    await Ad.findByIdAndDelete(adId);

    res.json({ message: 'Ad removed successfully' });
  } catch (error) {
    console.error('Error while deleting ad:', error);
    res
      .status(500)
      .json({ message: 'Error while deleting ad', error: error.message });
  }
});

// Controller function to update an ad
// Route: PUT /api/ads/:id
const updateAd = asyncHandler(async (req, res) => {
  const { name, category, price, description, images } = req.body;

  const ad = await Ad.findById(req.params.id);

  if (!ad) {
    res.status(404);
    throw new Error('Ad not found');
  }


  ad.name = name;
  ad.category = category;
  ad.price = price;
  ad.description = description;
  ad.images = images;

  const updatedAd = await ad.save();
  res.json(updatedAd);
});

// Controller function to get all ads
// Route: GET /api/ads
const getAllAds = asyncHandler(async (req, res) => {
  const ads = await Ad.find()
    .populate('category')
    .populate('user')
    .populate({
      path: 'comments',
      populate: {
        path: 'user',
        model: 'User',
      },
    });

  res.json(ads);
});

// Controller function to like an ad
// Route: POST /api/ads/:id/like
const likeAd = asyncHandler(async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) {
      res.status(404).send('Ad not found');
      return;
    }

    const userId = req.user._id;

    const isLiked = ad.likes.includes(userId);

    if (!isLiked) {
      ad.likes.push(userId);
      await ad.save();

      const user = await User.findById(userId);
      user.likes.push(ad._id);
      await user.save();

      res.status(200).send('Ad liked');
    } else {
      const index = ad.likes.indexOf(userId);
      ad.likes.splice(index, 1);
      await ad.save();

      const user = await User.findById(userId);
      const likeIndex = user.likes.indexOf(ad._id);
      user.likes.splice(likeIndex, 1);
      await user.save();

      res.status(200).send('Ad unliked');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Controller function to get liked ads of a user
// Route: GET /api/users/:id/likedAds
const getLikedAds = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const ads = await Ad.find({ likes: userId });
    res.json(ads);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Controller function to get ads created by the authenticated user
// Route: GET /api/ads/my
const getUserAds = asyncHandler(async (req, res) => {
  try {
    const ads = await Ad.find({ user: req.user._id }).populate('category');
    res.status(200).json(ads);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = {
  createAd,
  deleteAd,
  updateAd,
  getAllAds,
  getUserAds,
  likeAd,
  getLikedAds,
};