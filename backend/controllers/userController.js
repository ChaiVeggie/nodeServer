const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

let frontend_url = "";

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    res.status(400)
    throw new Error('Please add all fields')
  }

  // Check if user exists
  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  // Hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  })

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // Check for user email
  const user = await User.findOne({ email })

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid credentials')
  }
})

// @desc    Send magic link
// @route   POST /api/users/magiclink
// @access  Public
const sendMagicLink = asyncHandler(async (req, res) => {
  const { email } = req.body

  // Check for user email
  const user = await User.findOne({ email })

  if (!user) {
    res.status(400)
    throw new Error('User does not exists.')
  }
  let token = generateToken(user._id)

  var transporter = nodemailer.createTransport({
    service: "hotmail",
    port: 2525,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAILPASS
    }
  });

  // Set URL according to environment
  process.env.NODE_ENV === "production" ? frontend_url = "https://aitas.tk/index.html" : frontend_url = "http://localhost:5500/index.html";

  var mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Magic link login for AI-TAS',
    html: `<b>Hey there! </b> <br /><a href="${frontend_url}?token=${token}&name=${user.name}">Click here</a> to login`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    res.json({
      "success": 1
    })
    console.log('Message sent: %s', info.messageId);
  });
})

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user)
})

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}

module.exports = {
  registerUser,
  loginUser,
  sendMagicLink,
  getMe,
}
