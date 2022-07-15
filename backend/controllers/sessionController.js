const asyncHandler = require('express-async-handler')

const Session = require('../models/sessionModel')
const User = require('../models/userModel')

// @desc    Get sessions
// @route   GET /api/sessions
// @access  Private
const getSessions = asyncHandler(async (req, res) => {
  // console.log(req.query); //{ userId: 123 }

  // const reqQuery = { ...req.query };
  
  // Reference: https://www.youtube.com/watch?v=3t_PXFa7i8Q&ab_channel=TheFullStackJunkie
  
  // Remove any field that is not required, for example, sort and pages isn't a field.
  // const removeFields = ["sort"];
  
  // This line deletes the entire key value pair, not needed for now
  // removeFields.forEach(val => delete reqQuery[val]);
  
  // Adds a $ sign in front, for example $gte
  // let queryStr = JSON.stringify(reqQuery);
  // queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);
  // console.log("🚀 ~ file: sessionController.js ~ line 24 ~ getSessions ~ queryStr", queryStr)

  // Sort by latest date first, -1 for descending, 1 for ascending.
  const sessions = await Session.find(req.query).sort({"createdAt": -1});

  res.status(200).json(sessions)
})

// @desc    Set session
// @route   POST /api/sessions
// @access  Private
const setSession = asyncHandler(async (req, res) => {
  const { sessionId, userId } = req.body

  if (!sessionId || !userId) {
    res.status(400)
    throw new Error('Empty fields.')
  }

  const session = await Session.create({
    sessionId,
    userId,
  })

  res.status(200).json(session)
})

// @desc    Update session
// @route   PUT /api/sessions/:id
// @access  Private
const updateSession = asyncHandler(async (req, res) => {
  const session = await Session.findById(req.params.id)

  if (!session) {
    res.status(400)
    throw new Error('Goal not found')
  }

  // Check for user
  if (!req.user) {
    res.status(401)
    throw new Error('User not found')
  }

  // Make sure the logged in user matches the session user
  if (session.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized')
  }

  const updatedSession = await Session.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })

  res.status(200).json(updatedSession)
})

// @desc    Delete session
// @route   DELETE /api/sessions/:id
// @access  Private
const deleteSession = asyncHandler(async (req, res) => {
  const session = await Session.findById(req.params.id)

  if (!session) {
    res.status(400)
    throw new Error('Session not found')
  }

  // Check for user
  if (!req.user) {
    res.status(401)
    throw new Error('User not found')
  }

  // Make sure the logged in user matches the goal user
  if (session.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized')
  }

  await session.remove()

  res.status(200).json({ id: req.params.id })
})

module.exports = {
  getSessions,
  setSession,
  updateSession,
  deleteSession,
}
