const asyncHandler = require('express-async-handler')

const Discussion = require('../models/discussionModel')

// @desc    Get discussions
// @route   GET /api/discussions
// @access  Private
const getDiscussions = asyncHandler(async (req, res) => {
  // const discussions = await Discussion.find()
  const discussions = await Discussion.find(req.query);

  res.status(200).json(discussions)
})

// @desc    Set discussion
// @route   POST /api/discussions
// @access  Private
const setDiscussion = asyncHandler(async (req, res) => {
  const { sessionId, name, msg, } = req.body

  if (!sessionId || !name) {
    res.status(400)
    throw new Error('Empty fields.')
  }

  const discussion = await Discussion.create({
    sessionId, name, msg
  })

  res.status(200).json(discussion)
})

// @desc    Update discussion
// @route   PUT /api/discussions/:id
// @access  Private
const updateDiscussion = asyncHandler(async (req, res) => {
  const discussion = await Discussion.findById(req.params.id)

  if (!discussion) {
    res.status(400)
    throw new Error('Discussion not found')
  }

  // Check for user
  if (!req.user) {
    res.status(401)
    throw new Error('User not found')
  }

  // Make sure the logged in user matches the discussion user
  if (discussion.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized')
  }

  const updatedDiscussion = await Discussion.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })

  res.status(200).json(updatedDiscussion)
})

// @desc    Delete discussion
// @route   DELETE /api/discussions/:id
// @access  Private
const deleteDiscussion = asyncHandler(async (req, res) => {
  const discussion = await Discussion.findById(req.params.id)

  if (!discussion) {
    res.status(400)
    throw new Error('Discussion not found')
  }

  // Check for user
  if (!req.user) {
    res.status(401)
    throw new Error('User not found')
  }

  // Make sure the logged in user matches the goal user
  if (discussion.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized')
  }

  await discussion.remove()

  res.status(200).json({ id: req.params.id })
})

module.exports = {
  getDiscussions,
  setDiscussion,
  updateDiscussion,
  deleteDiscussion,
}
