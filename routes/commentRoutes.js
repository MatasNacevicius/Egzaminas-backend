const express = require('express');
const router = express.Router();
const {
  createComment,
  deleteComment,
  getCommentsByAdId,
} = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createComment);

router.get('/ad/', getCommentsByAdId);

router.delete('/:id', protect, deleteComment);

module.exports = router;