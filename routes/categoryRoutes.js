const express = require("express");
const router = express.Router();
const { createCategory, getAllCategories, deleteCategory } = require("../controllers/categoryController");
const protectAdmin = require("../middleware/adminAuthMiddleware");


router.post("/", protectAdmin, createCategory);

router.get("/", getAllCategories);

router.delete("/:id", protectAdmin, deleteCategory);

module.exports = router;