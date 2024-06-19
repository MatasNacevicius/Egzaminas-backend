const express = require("express");
const router = express.Router();
const {
  createAd,
  deleteAd,
  updateAd,
  getAllAds,
  getUserAds,
  likeAd,
  getLikedAds,
} = require("../controllers/adController");
const { protect } = require("../middleware/authMiddleware");
const protectAdmin = require("../middleware/adminAuthMiddleware");



router.post("/", protect, createAd);

router.delete("/:id", protect, deleteAd);

router.put("/:id", protect, updateAd);

router.get("/", getAllAds);

router.get("/my", protect, getUserAds);

router.post("/:id/like", protect, likeAd);

router.get("/liked", protect, getLikedAds);

module.exports = router;