const Category = require('../models/categoryModel');
const Ad = require('../models/adModel'); 
const asyncHandler = require('express-async-handler');

// Create a new category
// Route: POST /api/categories
const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    res.status(400);
    throw new Error('Please provide a category name');
  }

  const categoryExists = await Category.findOne({ name });

  if (categoryExists) {
    res.status(400);
    throw new Error('Category already exists');
  }

  const category = await Category.create({ name });

  if (category) {
    res.status(201).json(category);
  } else {
    res.status(400);
    throw new Error('Invalid category data');
  }
});

// Get all categories
// Route: GET /api/categories
const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
});

// Delete category by ID
// Route: DELETE /api/categories/:id
const deleteCategory = asyncHandler(async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    await Ad.deleteMany({ category: req.params.id });

    await category.deleteOne({ _id: req.params.id });

    res.json({ message: 'Category and related ads removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = { createCategory, getAllCategories, deleteCategory };