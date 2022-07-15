const mongoose = require('mongoose')

const discussionSchema = mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      ref: 'Session',
    },
    name: {
      type: String,
      required: true,
    },
    msg: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Discussion', discussionSchema)
