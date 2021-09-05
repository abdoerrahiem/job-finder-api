const asyncHandler = require('express-async-handler')
const Conversation = require('../models/Conversation')

exports.createConversation = asyncHandler(async (req, res) => {
  const conversation = await Conversation.create({
    members: [req.user._id, req.body.member],
  })

  res.json(conversation)
})

exports.getMyConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({
    members: { $in: [req.user.id] },
  })

  res.json(conversations)
})
