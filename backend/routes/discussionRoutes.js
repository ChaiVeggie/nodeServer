const express = require('express')
const router = express.Router()
const {
  getDiscussions,
  setDiscussion,
  updateDiscussion,
  deleteDiscussion,
} = require('../controllers/discussionController')

const { protect } = require('../middleware/authMiddleware')

router.route('/').get(protect, getDiscussions).post(protect, setDiscussion)
router.route('/:id').delete(protect, deleteDiscussion).put(protect, updateDiscussion)

module.exports = router
